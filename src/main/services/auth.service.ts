import { BrowserWindow } from 'electron';
import * as dotenv from 'dotenv';
dotenv.config();

export interface OAuthProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  provider: 'google' | 'github' | 'linkedin';
  token?: string; // Optional field if we manage to extract github PAT during OAuth flow
}

export interface OAuthResponse extends OAuthProfile {}

/**
 * Handles Google OAuth redirect loops and fetches basic profile info.
 * @returns A promise that resolves to the user's profile metadata on success.
 */
export async function startGoogleOAuthFlow(): Promise<OAuthResponse> {
  return new Promise((resolve, reject) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = 'http://127.0.0.1:4200/auth/callback';

    if (!clientId) {
      reject(new Error('Missing Google OAuth credentials in .env'));
      return;
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=email%20profile`;

    const authWindow = new BrowserWindow({
      width: 500,
      height: 600,
      show: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    let isResolved = false;
    const safeResolve = (profile: OAuthProfile) => {
      if (!isResolved) {
        isResolved = true;
        authWindow.close();
        resolve(profile);
      }
    };

    const safeReject = (err: Error) => {
      if (!isResolved) {
        isResolved = true;
        authWindow.close();
        reject(err);
      }
    };

    authWindow.loadURL(authUrl);

    authWindow.webContents.on('will-redirect', async (_event, url) => {
      if (url.startsWith(redirectUri)) {
        const urlObj = new URL(url.replace('#', '?')); // Google returns tokens in hash fragment
        const accessToken = urlObj.searchParams.get('access_token');
        
        if (accessToken) {
          try {
            // Fetch user info from Google
            const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            const data = await res.json();
            
            safeResolve({
              firstName: data.given_name || '',
              lastName: data.family_name || '',
              email: data.email || '',
              avatarUrl: data.picture || '',
              provider: 'google'
            });
          } catch (e: any) {
            safeReject(e);
          }
        } else {
          safeReject(new Error('No access token in Google callback'));
        }
      }
    });

    authWindow.on('closed', () => {
      if (!isResolved) {
        reject(new Error('Authentication window closed by user'));
      }
    });
  });
}

/**
 * Handles Github OAuth redirect loops and fetches basic profile info.
 * @returns A promise that resolves to the user's profile metadata on success.
 */
export async function startGithubOAuthFlow(): Promise<OAuthResponse> {
  return new Promise((resolve, reject) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = 'http://127.0.0.1:4200/auth/callback';

    if (!clientId) {
      reject(new Error('Missing Github OAuth credentials in .env'));
      return;
    }

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email,read:user`;

    const authWindow = new BrowserWindow({
      width: 500,
      height: 600,
      show: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    let isResolved = false;
    const safeResolve = (profile: OAuthProfile) => {
      if (!isResolved) {
        isResolved = true;
        authWindow.close();
        resolve(profile);
      }
    };

    const safeReject = (err: Error) => {
      if (!isResolved) {
        isResolved = true;
        authWindow.close();
        reject(err);
      }
    };

    authWindow.loadURL(authUrl);

    authWindow.webContents.on('will-redirect', async (_event, url) => {
      if (url.startsWith(redirectUri)) {
        const urlObj = new URL(url);
        const code = urlObj.searchParams.get('code');
        
        if (code) {
          try {
            // Note: Since this is an agent, we mock the access token exchange or use a relay server 
            // because Github requires the client_secret which is normally kept server-side.
            // For Desktop apps, the device flow is better, or exchanging client_secret locally.
            // Here we assume exchanging code for token.
            const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                client_id: clientId,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: redirectUri
              })
            });
            const tokenData = await tokenRes.json();
            
            if (tokenData.access_token) {
              const userRes = await fetch('https://api.github.com/user', {
                headers: { 
                  'Authorization': `Bearer ${tokenData.access_token}`,
                  'Accept': 'application/vnd.github.v3+json'
                }
              });
              const userData = await userRes.json();
              
              const emailsRes = await fetch('https://api.github.com/user/emails', {
                headers: { 
                  'Authorization': `Bearer ${tokenData.access_token}`,
                  'Accept': 'application/vnd.github.v3+json'
                }
              });
              const emailsData = await emailsRes.json();
              const primaryEmail = emailsData.find((e: any) => e.primary)?.email || '';

              const names = (userData.name || '').split(' ');
              const firstName = names[0] || '';
              const lastName = names.slice(1).join(' ') || '';

              safeResolve({
                firstName,
                lastName,
                email: primaryEmail,
                avatarUrl: userData.avatar_url || '',
                provider: 'github',
                token: tokenData.access_token
              });
            } else {
              safeReject(new Error('Failed to obtain Github access token.'));
            }
          } catch (e: any) {
            safeReject(e);
          }
        } else {
          safeReject(new Error('No auth code in Github callback'));
        }
      }
    });

    authWindow.on('closed', () => {
      if (!isResolved) {
        reject(new Error('Authentication window closed by user'));
      }
    });
  });
}

/**
 * Handles Linkedin OAuth redirect loops and fetches basic profile info.
 * @returns A promise that resolves to the user's profile metadata on success.
 */
export async function startLinkedinOAuthFlow(): Promise<OAuthResponse> {
  return new Promise((resolve, reject) => {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = 'http://127.0.0.1:4200/auth/callback';

    if (!clientId || !clientSecret) {
      reject(new Error('Missing Linkedin OAuth credentials in .env'));
      return;
    }

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email`;

    const authWindow = new BrowserWindow({
      width: 500,
      height: 600,
      show: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    let isResolved = false;
    const safeResolve = (profile: OAuthProfile) => {
      if (!isResolved) {
        isResolved = true;
        authWindow.close();
        resolve(profile);
      }
    };

    const safeReject = (err: Error) => {
      if (!isResolved) {
        isResolved = true;
        authWindow.close();
        reject(err);
      }
    };

    authWindow.loadURL(authUrl);

    authWindow.webContents.on('will-redirect', async (_event, url) => {
      if (url.startsWith(redirectUri)) {
        const urlObj = new URL(url);
        const code = urlObj.searchParams.get('code');
        
        if (code) {
          try {
            const tokenParams = new URLSearchParams({
              grant_type: 'authorization_code',
              code: code,
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: redirectUri
            });

            const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: tokenParams.toString()
            });
            const tokenData = await tokenRes.json();
            
            if (tokenData.access_token) {
              const userRes = await fetch('https://api.linkedin.com/v2/userinfo', {
                headers: { 
                  'Authorization': `Bearer ${tokenData.access_token}`
                }
              });
              const userData = await userRes.json();

              safeResolve({
                firstName: userData.given_name || '',
                lastName: userData.family_name || '',
                email: userData.email || '',
                avatarUrl: userData.picture || '',
                provider: 'linkedin',
                token: tokenData.access_token
              });
            } else {
              safeReject(new Error('Failed to obtain Linkedin access token.'));
            }
          } catch (e: any) {
            safeReject(e);
          }
        } else {
          safeReject(new Error('No auth code in Linkedin callback'));
        }
      }
    });

    authWindow.on('closed', () => {
      if (!isResolved) {
        reject(new Error('Authentication window closed by user'));
      }
    });
  });
}
