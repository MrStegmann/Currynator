import { Resume } from '../shared/schema/resumeSchema.js';

/**
 * Parses an RFC-4180 compliant CSV string into an array of key-value objects representing rows.
 */
export function parseCsvString(csvContent: string): Record<string, string>[] {
  if (!csvContent || !csvContent.trim()) {
    return [];
  }

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentToken = '';
  let insideQuotes = false;

  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    const nextChar = csvContent[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped double quote ("") inside quoted string
        currentToken += '"';
        i++; // skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentToken.trim());
      currentToken = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip \n in \r\n
      }
      currentRow.push(currentToken.trim());
      if (currentRow.some(cell => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentToken = '';
    } else {
      currentToken += char;
    }
  }

  if (currentToken.length > 0 || currentRow.length > 0) {
    currentRow.push(currentToken.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0];
  const result: Record<string, string>[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowObj: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      rowObj[headers[j]] = row[j] !== undefined ? row[j] : '';
    }
    result.push(rowObj);
  }

  return result;
}

export interface LinkedInRawCsvData {
  profileCsv?: string;
  emailCsv?: string;
  phoneCsv?: string;
  positionsCsv?: string;
  educationCsv?: string;
  skillsCsv?: string;
  languagesCsv?: string;
  projectsCsv?: string;
  certificationsCsv?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeUrl(url?: string): string {
  if (!url || !url.trim()) return '';
  const trimmed = url.trim();
  try {
    const validUrl = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;
    new URL(validUrl);
    return validUrl;
  } catch {
    return '';
  }
}

/**
 * Maps raw LinkedIn CSV file contents to the JSON Resume schema.
 */
export function mapLinkedInDataToResume(data: LinkedInRawCsvData): Resume {
  const resume: Resume = {
    basics: {
      name: 'LinkedIn User',
      label: 'Professional',
      email: 'user@example.com',
      phone: '',
      url: '',
      summary: '',
      location: {
        address: '',
        postalCode: '',
        city: '',
        countryCode: '',
        region: ''
      },
      profiles: []
    },
    work: [],
    education: [],
    certificates: [],
    skills: [],
    languages: [],
    references: [],
    projects: []
  };

  // 1. Profile.csv
  if (data.profileCsv) {
    const profileRows = parseCsvString(data.profileCsv);
    if (profileRows.length > 0) {
      const p = profileRows[0];
      const firstName = p['First Name'] || '';
      const lastName = p['Last Name'] || '';
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) {
        resume.basics.name = fullName;
      }
      if (p['Headline']) {
        resume.basics.label = p['Headline'];
      }
      resume.basics.summary = p['Summary'] || '';
      resume.basics.location = resume.basics.location || {};
      resume.basics.location.address = p['Address'] || '';
      resume.basics.location.postalCode = p['Zip Code'] || '';

      const geo = p['Geo Location'] || '';
      if (geo) {
        const parts = geo.split(',').map(s => s.trim());
        if (parts.length >= 1) resume.basics.location.city = parts[0];
        if (parts.length >= 2) resume.basics.location.region = parts[1];
        if (parts.length >= 3) resume.basics.location.countryCode = parts[2];
      }

      const websites = p['Websites'] || '';
      if (websites) {
        const match = websites.match(/https?:\/\/[^\s\]]+/);
        if (match) {
          resume.basics.url = sanitizeUrl(match[0]);
        }
      }
    }
  }

  // 2. Email Addresses.csv
  if (data.emailCsv) {
    const emailRows = parseCsvString(data.emailCsv);
    const primary = emailRows.find(r => r['Primary']?.toLowerCase() === 'yes') ||
                  emailRows.find(r => r['Confirmed']?.toLowerCase() === 'yes') ||
                  emailRows[0];
    if (primary && primary['Email Address'] && isValidEmail(primary['Email Address'])) {
      resume.basics.email = primary['Email Address'];
    }
  }

  // 3. PhoneNumbers.csv
  if (data.phoneCsv) {
    const phoneRows = parseCsvString(data.phoneCsv);
    const validPhone = phoneRows.find(r => r['Number']) || phoneRows[0];
    if (validPhone && validPhone['Number']) {
      const ext = validPhone['Extension'] ? ` ext ${validPhone['Extension']}` : '';
      resume.basics.phone = `${validPhone['Number']}${ext}`.trim();
    }
  }

  // 4. Positions.csv -> work
  if (data.positionsCsv) {
    const workRows = parseCsvString(data.positionsCsv);
    resume.work = workRows.map(w => ({
      name: w['Company Name'] || 'Company',
      position: w['Title'] || 'Position',
      url: sanitizeUrl(w['Url']),
      startDate: w['Started On'] || 'N/A',
      endDate: w['Finished On'] || 'Currently',
      summary: w['Description'] || '',
      highlights: w['Description'] ? w['Description'].split(/\r?\n/).filter(line => line.trim().length > 0) : []
    }));
  }

  // 5. Education.csv -> education
  if (data.educationCsv) {
    const eduRows = parseCsvString(data.educationCsv);
    resume.education = eduRows.map(e => ({
      institution: e['School Name'] || 'Institution',
      area: e['Degree Name'] || e['Activities'] || 'General',
      studyType: e['Degree Name'] || 'Degree',
      startDate: e['Start Date'] || 'N/A',
      endDate: e['End Date'] || 'Currently'
    }));
  }

  // 6. Skills.csv -> skills
  if (data.skillsCsv) {
    const skillRows = parseCsvString(data.skillsCsv);
    resume.skills = skillRows
      .filter(s => s['Name'] && s['Name'].trim().length > 0)
      .map(s => ({
        name: s['Name'].trim(),
        keywords: [s['Name'].trim()]
      }));
  }

  // 7. Languages.csv -> languages
  if (data.languagesCsv) {
    const langRows = parseCsvString(data.languagesCsv);
    resume.languages = langRows
      .filter(l => l['Name'] && l['Name'].trim().length > 0)
      .map(l => ({
        language: l['Name'].trim(),
        fluency: l['Proficiency'] || 'Proficient'
      }));
  }

  // 8. Projects.csv -> projects
  if (data.projectsCsv) {
    const projRows = parseCsvString(data.projectsCsv);
    resume.projects = projRows.map(p => ({
      title: p['Title'] || 'Project',
      description: p['Description'] || '',
      url: sanitizeUrl(p['Url']),
      startDate: p['Started On'] || '',
      endDate: p['Finished On'] || ''
    }));
  }

  // 9. Certifications.csv -> certificates
  if (data.certificationsCsv) {
    const certRows = parseCsvString(data.certificationsCsv);
    resume.certificates = certRows.map(c => ({
      name: c['Name'] || 'Certificate',
      issuer: c['Authority'] || 'Issuer',
      date: c['Started On'] || 'N/A',
      url: sanitizeUrl(c['Url'])
    }));
  }

  return resume;
}
