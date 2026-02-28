const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now\s+a/i,
  /jailbreak/i,
  /\[INST\].*\[\/INST\]/i,
  /system\s*prompt/i,
  /override\s+system/i,
  /forget\s+your\s+instructions/i,
];

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/\//g, '&#x2F;');
}

export function detectPromptInjection(input: string): RegExp | null {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) return pattern;
  }
  return null;
}

const FIELD_MAX_LENGTHS: Record<string, number> = {
  companyName: 100, website: 254, dataCollected: 2000, country: 100,
  infrastructure: 500, teamSize: 10, currentControls: 2000, euUsers: 20,
  dataTypes: 2000, dataProcessors: 1000, authMethod: 200, sensitiveData: 2000,
  productDescription: 2000, certifications: 500, incidentHistory: 2000,
};

export function sanitizeField(value: unknown, fieldId: string): { clean: string; injectionDetected: boolean } {
  if (typeof value !== 'string') return { clean: '', injectionDetected: false };
  const clean = value.replace(/\0/g, '').trim().slice(0, FIELD_MAX_LENGTHS[fieldId] ?? 1000);
  const injection = detectPromptInjection(clean);
  if (injection) return { clean: '', injectionDetected: true };
  return { clean, injectionDetected: false };
}

export function sanitizeToolInputs(inputs: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  for (const [key, value] of Object.entries(inputs)) {
    const { clean, injectionDetected } = sanitizeField(value, key);
    if (injectionDetected) throw new Error(`Invalid input detected in field: ${key}`);
    sanitized[key] = clean;
  }
  return sanitized;
}

export function sanitizeInput(value: string, maxLength = 1000): string {
  return value.replace(/\0/g, '').trim().slice(0, maxLength);
}

export function sanitizeUrl(url: string): { valid: boolean; sanitized: string } {
  let normalized = url.trim();
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) normalized = 'https://' + normalized;
  try {
    const parsed = new URL(normalized);
    if (!['https:', 'http:'].includes(parsed.protocol)) return { valid: false, sanitized: '' };
    const hostname = parsed.hostname;
    const BLOCKED = [/^localhost$/i, /^127\./, /^10\./, /^192\.168\./, /^172\.(1[6-9]|2\d|3[01])\./];
    for (const pattern of BLOCKED) {
      if (pattern.test(hostname)) return { valid: false, sanitized: '' };
    }
    return { valid: true, sanitized: parsed.toString() };
  } catch { return { valid: false, sanitized: '' }; }
}

export function sanitizeMarkdownOutput(markdown: string): string {
  return markdown
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '').replace(/on\w+\s*=/gi, '');
}
