export const PROGRAMME_PRESETS = [
  'BSc (Hons) Computer Science',
  'BSc (Hons) Software Engineering',
  'Higher National Diploma in Computing',
  'BSc (Hons) Cyber Security',
  'BSc (Hons) Business Information Systems',
  'BSc (Hons) Biomedical Science',
  'Higher National Diploma in Biomedical Science',
  'Higher National Diploma in Business Management',
  'BSc (Hons) Nursing & Healthcare',
  'Foundation in Higher Education'
];

export const INTAKE_MONTHS = [
  'January Intake',
  'February Intake',
  'March Intake',
  'April Intake',
  'May Intake',
  'June Intake',
  'July Intake',
  'August Intake',
  'September Intake',
  'October Intake',
  'November Intake',
  'December Intake',
  'Custom Intake...'
];

export const ACADEMIC_YEARS = [
  '2023/2024',
  '2024/2025',
  '2025/2026',
  '2026/2027',
  '2027/2028',
  '2028/2029',
  '2026',
  '2027'
];

export interface PartnerLogoPreset {
  name: string;
  label: string;
  // SVG or data URL
  svgDataUri?: string;
  url?: string;
}

// Crisp inline SVGs for partner universities so they work offline with zero external dependencies!
export const PARTNER_PRESETS: PartnerLogoPreset[] = [
  {
    name: 'none',
    label: 'None (BCAS Only - Centered)',
  },
  {
    name: 'brookes',
    label: 'Oxford Brookes University',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80"><rect width="240" height="80" fill="transparent"/><text x="10" y="32" font-family="Arial,sans-serif" font-weight="900" font-size="20" fill="%23002f6c">OXFORD</text><text x="10" y="52" font-family="Arial,sans-serif" font-weight="900" font-size="20" fill="%23c8102e">BROOKES</text><text x="10" y="68" font-family="Arial,sans-serif" font-weight="600" font-size="11" fill="%23555555" letter-spacing="1.5">UNIVERSITY</text><path d="M200,20 L225,45 L200,70 L212,45 Z" fill="%23002f6c"/></svg>`
  },
  {
    name: 'solent',
    label: 'Solent University Southampton',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80"><rect width="240" height="80" fill="transparent"/><circle cx="35" cy="40" r="24" fill="%23d6001c"/><text x="27" y="48" font-family="Arial,sans-serif" font-weight="900" font-size="24" fill="white">S</text><text x="70" y="38" font-family="Arial,sans-serif" font-weight="800" font-size="20" fill="%23111827">SOLENT</text><text x="70" y="56" font-family="Arial,sans-serif" font-weight="500" font-size="11" fill="%23d6001c" letter-spacing="1.5">UNIVERSITY SOUTHAMPTON</text></svg>`
  },
  {
    name: 'pearson',
    label: 'Pearson BTEC',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80"><rect width="240" height="80" fill="transparent"/><text x="10" y="44" font-family="Georgia,serif" font-weight="normal" font-size="28" fill="%23005a70">Pearson</text><rect x="135" y="18" width="85" height="36" rx="4" fill="%23005a70"/><text x="145" y="43" font-family="Arial,sans-serif" font-weight="900" font-size="20" fill="white" letter-spacing="1">BTEC</text><text x="12" y="66" font-family="Arial,sans-serif" font-weight="600" font-size="10" fill="%23666666" letter-spacing="1">APPROVED CENTRE</text></svg>`
  },
  {
    name: 'wolverhampton',
    label: 'University of Wolverhampton',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80"><rect width="240" height="80" fill="transparent"/><text x="10" y="32" font-family="Arial,sans-serif" font-weight="600" font-size="13" fill="%23666666" letter-spacing="1">UNIVERSITY OF</text><text x="10" y="55" font-family="Arial,sans-serif" font-weight="900" font-size="18" fill="%23002b49">WOLVERHAMPTON</text></svg>`
  }
];
