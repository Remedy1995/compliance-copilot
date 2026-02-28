const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now\s+a/i,
  /jailbreak/i,
  /system\s*prompt/i,
  /override\s+system/i,
  /forget\s+your\s+instructions/i,
];
const FIELD_MAX_LENGTHS: Record<string, number> = {
  companyName:100, website:254, dataCollected:2000, country:100,
  infrastructure:500, teamSize:10, currentControls:2000, euUsers:20,
  dataTypes:2000, dataProcessors:1000, authMethod:200, sensitiveData:2000,
  productDescription:2000, certifications:500, incidentHistory:2000,
};
export function sanitizeInput(value: string, maxLength = 1000): string {
  return value.replace(/\0/g, '').trim().slice(0, maxLength);
}
export function sanitizeToolInputs(inputs: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  for (const [key, value] of Object.entries(inputs)) {
    if (typeof value !== 'string') continue;
    const clean = value.replace(/\0/g, '').trim().slice(0, FIELD_MAX_LENGTHS[key] ?? 1000);
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(clean)) throw new Error(`Invalid input detected in field: ${key}`);
    }
    sanitized[key] = clean;
  }
  return sanitized;
}
export function sanitizeMarkdownOutput(markdown: string): string {
  return markdown
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}
