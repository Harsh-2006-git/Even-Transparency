const axios = require('axios');
const logger = require('../utils/logger');

/**
 * WhatsApp Business API wrapper.
 *
 * NOTE FOR DEVELOPER:
 * Before this service works, the developer must:
 *   1. Create a Meta Business account at business.facebook.com
 *   2. Register and verify the business phone number
 *   3. Get all message templates below approved by Meta
 *   4. Set env vars: WHATSAPP_API_URL, WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID
 *
 * Template names below must match the approved names in Meta's template library.
 */

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

const isConfigured = () => WHATSAPP_API_URL && ACCESS_TOKEN && PHONE_NUMBER_ID;

/**
 * Send a template message via WhatsApp Business API
 * @param {string} to - recipient mobile number with country code e.g. "919876543210"
 * @param {string} templateName - Meta-approved template name
 * @param {Array} components - template variable substitutions
 * @param {string} languageCode - default 'en'
 */
const sendTemplateMessage = async (to, templateName, components = [], languageCode = 'en') => {
  if (!isConfigured()) {
    logger.warn(`WhatsApp not configured — skipped message to ${to} (${templateName})`);
    return { success: false, skipped: true };
  }

  try {
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components: components.length > 0 ? components : undefined,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    logger.info(`WhatsApp sent to ${to}: ${templateName}`);
    return { success: true, messageId: response.data.messages?.[0]?.id };

  } catch (error) {
    const msg = error.response?.data?.error?.message || error.message;
    logger.error(`WhatsApp send error (${templateName}): ${msg}`);
    return { success: false, error: msg };
  }
};

// ─── Pre-built message senders for each event ─────────────

/**
 * Registration welcome message
 * Template: "even_cargo_welcome"
 * Variables: {{1}} = candidate first name
 */
const sendWelcomeMessage = (phone, firstName) =>
  sendTemplateMessage(`91${phone}`, 'even_cargo_welcome', [
    { type: 'body', parameters: [{ type: 'text', text: firstName }] },
  ]);

/**
 * Interview scheduled notification
 * Template: "even_cargo_interview_scheduled"
 * Variables: {{1}} = company name, {{2}} = date, {{3}} = time, {{4}} = mode (Virtual/In-person)
 */
const sendInterviewScheduledMessage = (phone, { companyName, date, time, mode }) =>
  sendTemplateMessage(`91${phone}`, 'even_cargo_interview_scheduled', [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: companyName },
        { type: 'text', text: date },
        { type: 'text', text: time },
        { type: 'text', text: mode },
      ],
    },
  ]);

/**
 * Stipend credited notification
 * Template: "even_cargo_stipend_credited"
 * Variables: {{1}} = amount, {{2}} = month name
 */
const sendStipendCreditedMessage = (phone, { amount, month }) =>
  sendTemplateMessage(`91${phone}`, 'even_cargo_stipend_credited', [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: `₹${amount}` },
        { type: 'text', text: month },
      ],
    },
  ]);

/**
 * Contract ready to sign
 * Template: "even_cargo_contract_ready"
 * Variables: {{1}} = company name, {{2}} = role title
 */
const sendContractReadyMessage = (phone, { companyName, roleTitle }) =>
  sendTemplateMessage(`91${phone}`, 'even_cargo_contract_ready', [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: companyName },
        { type: 'text', text: roleTitle },
      ],
    },
  ]);

/**
 * Application shortlisted
 * Template: "even_cargo_shortlisted"
 * Variables: {{1}} = company name, {{2}} = role title
 */
const sendShortlistedMessage = (phone, { companyName, roleTitle }) =>
  sendTemplateMessage(`91${phone}`, 'even_cargo_shortlisted', [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: companyName },
        { type: 'text', text: roleTitle },
      ],
    },
  ]);

/**
 * Grievance resolved
 * Template: "even_cargo_grievance_resolved"
 * Variables: {{1}} = grievance code
 */
const sendGrievanceResolvedMessage = (phone, grievanceCode) =>
  sendTemplateMessage(`91${phone}`, 'even_cargo_grievance_resolved', [
    { type: 'body', parameters: [{ type: 'text', text: grievanceCode }] },
  ]);

module.exports = {
  sendTemplateMessage,
  sendWelcomeMessage,
  sendInterviewScheduledMessage,
  sendStipendCreditedMessage,
  sendContractReadyMessage,
  sendShortlistedMessage,
  sendGrievanceResolvedMessage,
};
