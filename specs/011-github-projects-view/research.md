# Research & Technical Decisions: GitHub Projects View Page

## 1. GitHub API Integration & Personal Access Token Authentication

### Context
Users authenticate using a Personal Access Token (PAT) generated on GitHub (`GET https://api.github.com/user/repos`).

### Research & Decision
- **API Endpoint**: `https://api.github.com/user/repos?sort=updated&per_page=100&type=owner`
- **Headers**:
  ```text
  Authorization: Bearer <token>
  Accept: application/vnd.github.v3+json
  User-Agent: Currynator-App
  ```
- **Error Handling**:
  - `401 Unauthorized`: Token is invalid or expired. Prompt user to re-enter token.
  - `403 Forbidden` (Rate Limit): Display rate limit warning and offer cached offline data.
  - Network Error: Fallback gracefully to local storage cached repository list.

---

## 2. Secure Token Storage & Encryption

### Context
The user's GitHub access token must be saved securely per project constitution guidelines.

### Research & Decision
- **Storage Mechanism**: Save encrypted token string in Local Storage under key `currynator_github_token`.
- **Encryption Pattern**: Simple reversible obfuscation/encryption helper (`encryptToken(token: string)` / `decryptToken(cipher: string)`) using base64 + XOR salt to ensure token string is protected from plain text exposure.

---

## 3. UI Layout & Responsive 5-Column Grid

### Context
The user prompt specifies:
- 2-column setup layout when no token exists: Left column = step-by-step guide; Right column = password field (with show/hide toggle) and Save button.
- Repository Cards Grid: 5 items per row on large screens, max 10 items per page with simple pagination.
- Fixed Floating Refresh Button: Fixed top-right to trigger manual data re-fetch.

### Tailwind Layout Specs
- **Grid Container**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4`
- **Floating Refresh Button**: `fixed top-20 right-6 z-40 bg-primary text-on-primary rounded-full p-3 shadow-lg hover:scale-105 transition-transform`
- **Password Input Toggle**: Eye / EyeOff icon from `lucide-react` switching input `type="password"` vs `type="text"`.
