export interface ToolField {
  id: string; label: string; type: 'text' | 'textarea' | 'select';
  placeholder?: string; required: boolean; options?: string[];
}
export interface Tool {
  id: string; name: string; emoji: string; description: string;
  agentChain: string[]; inputFields: ToolField[]; color: string; bgColor: string; borderColor: string;
}
export const TOOLS: Record<string, Tool> = {
  'privacy-policy': {
    id: 'privacy-policy', name: 'Privacy Policy Generator', emoji: '📜',
    description: 'Generate a GDPR & CCPA compliant privacy policy for your startup.',
    agentChain: ['legal', 'product'],
    color: 'from-violet-500 to-purple-600', bgColor: 'bg-violet-50', borderColor: 'border-violet-200',
    inputFields: [
      { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'TechCorp Inc.', required: true },
      { id: 'website', label: 'Website URL', type: 'text', placeholder: 'https://techcorp.io', required: true },
      { id: 'dataCollected', label: 'Data You Collect', type: 'textarea', placeholder: 'Name, email, payment info, usage analytics...', required: true },
      { id: 'country', label: 'Primary Country of Operation', type: 'text', placeholder: 'United States', required: true },
    ],
  },
  'soc2-checklist': {
    id: 'soc2-checklist', name: 'SOC2 Readiness Checklist', emoji: '✅',
    description: 'Get a prioritized SOC2 gap analysis and action plan.',
    agentChain: ['security', 'product'],
    color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200',
    inputFields: [
      { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'TechCorp Inc.', required: true },
      { id: 'infrastructure', label: 'Cloud Infrastructure', type: 'text', placeholder: 'AWS, GCP, Azure...', required: true },
      { id: 'teamSize', label: 'Engineering Team Size', type: 'text', placeholder: '10', required: true },
      { id: 'currentControls', label: 'Current Security Controls', type: 'textarea', placeholder: 'MFA enabled, VPN, access reviews...', required: false },
    ],
  },
  'gdpr-docs': {
    id: 'gdpr-docs', name: 'GDPR Documentation Suite', emoji: '🇪🇺',
    description: 'Full GDPR documentation including DPA and DPIA templates.',
    agentChain: ['legal', 'security', 'product'],
    color: 'from-blue-500 to-cyan-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200',
    inputFields: [
      { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'TechCorp Inc.', required: true },
      { id: 'euUsers', label: 'Do you have EU users?', type: 'select', options: ['Yes', 'No', 'Planning to'], required: true },
      { id: 'dataTypes', label: 'Types of Personal Data', type: 'textarea', placeholder: 'Email, location, behavioral data...', required: true },
      { id: 'dataProcessors', label: 'Third-party Data Processors', type: 'textarea', placeholder: 'Stripe, AWS, Mixpanel...', required: false },
    ],
  },
  'security-arch': {
    id: 'security-arch', name: 'Security Architecture Report', emoji: '🏗️',
    description: 'Enterprise-ready security architecture documentation.',
    agentChain: ['security', 'sales'],
    color: 'from-orange-500 to-amber-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200',
    inputFields: [
      { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'TechCorp Inc.', required: true },
      { id: 'infrastructure', label: 'Infrastructure Stack', type: 'textarea', placeholder: 'AWS ECS, RDS PostgreSQL, CloudFront...', required: true },
      { id: 'authMethod', label: 'Authentication Method', type: 'text', placeholder: 'JWT, OAuth2, SSO...', required: true },
      { id: 'sensitiveData', label: 'Sensitive Data Handled', type: 'textarea', placeholder: 'PII, payment data, health records...', required: true },
    ],
  },
  'vendor-risk': {
    id: 'vendor-risk', name: 'Vendor Risk Questionnaire', emoji: '📋',
    description: 'Complete enterprise vendor security assessments automatically.',
    agentChain: ['security', 'sales', 'legal'],
    color: 'from-rose-500 to-pink-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-200',
    inputFields: [
      { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'TechCorp Inc.', required: true },
      { id: 'productDescription', label: 'Product Description', type: 'textarea', placeholder: 'B2B SaaS platform for...', required: true },
      { id: 'certifications', label: 'Current Certifications', type: 'text', placeholder: 'SOC2 Type I, ISO 27001...', required: false },
      { id: 'incidentHistory', label: 'Security Incident History', type: 'textarea', placeholder: 'No incidents, or describe...', required: false },
    ],
  },
};
