import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';
import { NOTIFICATION_SUBJECTS, TEMPLATE_MAPPING } from './notification.constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesDir = path.join(__dirname, 'templates');
const layoutPath = path.join(templatesDir, 'layouts', 'main.hbs');

// Cache compiled handlebars functions in memory
const compiledTemplates = {};
let compiledLayout = null;

export const compileTemplate = (type, data = {}) => {
  const relativePath = TEMPLATE_MAPPING[type];
  if (!relativePath) {
    throw new Error(`Unknown notification type or unmapped template: ${type}`);
  }

  // Load and compile main layout dynamically
  if (!fs.existsSync(layoutPath)) {
    throw new Error(`Main layout file not found at ${layoutPath}`);
  }
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  const compiledLayout = handlebars.compile(layoutContent);

  // Load and compile template content dynamically
  const templateFilePath = path.join(templatesDir, `${relativePath}.hbs`);
  if (!fs.existsSync(templateFilePath)) {
    throw new Error(`Template file not found at ${templateFilePath}`);
  }
  const templateContent = fs.readFileSync(templateFilePath, 'utf-8');
  const compiledTemplate = handlebars.compile(templateContent);

  // Render body content first
  const bodyHtml = compiledTemplate(data);

  // Render subject line with handlebar tokens if any
  const rawSubject = NOTIFICATION_SUBJECTS[type] || 'Even Cargo Notification';
  const subjectTemplate = handlebars.compile(rawSubject);
  const subject = subjectTemplate(data);

  // Render final HTML within layout
  const year = new Date().getFullYear();
  const isDark = data.theme === 'dark';
  const logoUrl = data.logo_url || 'http://localhost:5173/logo.png';

  const fullHtml = compiledLayout({
    subject,
    body: bodyHtml,
    year,
    isDark,
    logo_url: logoUrl,
    ...data
  });

  return {
    subject,
    html: fullHtml
  };
};

export default { compileTemplate };
