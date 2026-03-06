// ============================================
// LANGUAGE CONFIGURATION
// ============================================
// Based on client-provided language codes table
// Supports 32 languages for Native Language (NL) and Target Language (TL)
// ============================================

export interface Language {
  code: string;
  englishName: string;
  nativeName: string;
  flagIcon: string; // Path to flag image
}

export const LANGUAGES: Language[] = [
  { code: 'AEN', englishName: 'American English', nativeName: 'American English', flagIcon: '/flags/usa.png' },
  { code: 'LAS', englishName: 'Latin American Spanish', nativeName: 'Español Latinoamericano', flagIcon: '/flags/mexico.png' },
  { code: 'BPT', englishName: 'Brazilian Portuguese', nativeName: 'Português Brasileiro', flagIcon: '/flags/brazil.png' },
  { code: 'RUS', englishName: 'Russian', nativeName: 'Русский', flagIcon: '/flags/russia.png' },
  { code: 'CHI', englishName: 'Mandarin Chinese', nativeName: '普通话', flagIcon: '/flags/china.png' },
  { code: 'FRE', englishName: 'European French', nativeName: 'Français Européen', flagIcon: '/flags/france.png' },
  { code: 'ITA', englishName: 'Italian', nativeName: 'Italiano', flagIcon: '/flags/italy.png' },
  { code: 'GER', englishName: 'German', nativeName: 'Deutsch', flagIcon: '/flags/germany.png' },
  { code: 'DUT', englishName: 'Dutch', nativeName: 'Nederlands', flagIcon: '/flags/netherlands.png' },
  { code: 'POL', englishName: 'Polish', nativeName: 'Polski', flagIcon: '/flags/poland.png' },
  { code: 'BEN', englishName: 'British English', nativeName: 'British English', flagIcon: '/flags/uk.png' },
  { code: 'CAN', englishName: 'Cantonese', nativeName: '粵語', flagIcon: '/flags/hongkong.png' },
  { code: 'SPA', englishName: 'Spanish', nativeName: 'Español', flagIcon: '/flags/spain.png' },
  { code: 'UKR', englishName: 'Ukrainian', nativeName: 'Українська', flagIcon: '/flags/ukraine.png' },
  { code: 'CAF', englishName: 'Canadian French', nativeName: 'Français Canadien', flagIcon: '/flags/canada.png' },
  { code: 'IPT', englishName: 'Iberian Portuguese', nativeName: 'Português Europeu', flagIcon: '/flags/portugal.png' },
  { code: 'URD', englishName: 'Urdu', nativeName: 'اردو', flagIcon: '/flags/pakistan.png' },
  { code: 'HIN', englishName: 'Hindi', nativeName: 'हिन्दी', flagIcon: '/flags/india.png' },
  { code: 'ABR', englishName: 'Arabic', nativeName: 'العربية', flagIcon: '/flags/saudi.png' },
  { code: 'GRE', englishName: 'Greek', nativeName: 'Ελληνικά', flagIcon: '/flags/greece.png' },
  { code: 'TUR', englishName: 'Turkish', nativeName: 'Türkçe', flagIcon: '/flags/turkey.png' },
  { code: 'DNH', englishName: 'Danish', nativeName: 'Dansk', flagIcon: '/flags/denmark.png' },
  { code: 'FIL', englishName: 'Filipino', nativeName: 'Filipino', flagIcon: '/flags/philippines.png' },
  { code: 'CZE', englishName: 'Czech', nativeName: 'Čeština', flagIcon: '/flags/czech.png' },
  { code: 'BAN', englishName: 'Bengali', nativeName: 'বাংলা', flagIcon: '/flags/bangladesh.png' },
  { code: 'HBR', englishName: 'Hebrew', nativeName: 'עברית', flagIcon: '/flags/israel.png' },
  { code: 'JPN', englishName: 'Japanese', nativeName: '日本語', flagIcon: '/flags/japan.png' },
  { code: 'SWA', englishName: 'Swahili', nativeName: 'Kiswahili', flagIcon: '/flags/kenya.png' },
  { code: 'VIE', englishName: 'Vietnamese', nativeName: 'Tiếng Việt', flagIcon: '/flags/vietnam.png' },
  { code: 'THA', englishName: 'Thai', nativeName: 'ไทย', flagIcon: '/flags/thailand.png' },
  { code: 'IND', englishName: 'Indonesian', nativeName: 'Bahasa Indonesia', flagIcon: '/flags/indonesia.png' },
  { code: 'ZUL', englishName: 'Zulu', nativeName: 'isiZulu', flagIcon: '/flags/southafrica.png' }
];

/**
 * Get language by code
 */
export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find(lang => lang.code === code);
}

/**
 * Get language display name (English name)
 */
export function getLanguageDisplayName(code: string): string {
  const lang = getLanguageByCode(code);
  return lang ? lang.englishName : code;
}

/**
 * Get language native name
 */
export function getLanguageNativeName(code: string): string {
  const lang = getLanguageByCode(code);
  return lang ? lang.nativeName : code;
}

/**
 * Get language flag icon path
 */
export function getLanguageFlagIcon(code: string): string {
  const lang = getLanguageByCode(code);
  return lang ? lang.flagIcon : '/flags/default.png';
}

/**
 * Validate if language code exists
 */
export function isValidLanguageCode(code: string): boolean {
  return LANGUAGES.some(lang => lang.code === code);
}

