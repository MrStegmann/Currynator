/**
 * Interface representing a supported target output language option for AI Resume Optimization.
 */
export interface LanguageOption {
  /** Unique ISO language code or identifier (e.g., 'en', 'es') */
  value: string;
  /** Human-readable language display label */
  label: string;
}

/**
 * List of supported target output languages for the AI Resume Optimization Wizard.
 * Easily extensible to support additional languages in future releases.
 */
export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' }
] as const;
