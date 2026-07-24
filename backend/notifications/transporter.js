import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

export const getTransporter = async () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    console.log('📧  Nodemailer transport initialized using custom SMTP.');
  } else {
    // Fallback: Generate an Ethereal test account if no SMTP configured
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`📧  Nodemailer initialized with Ethereal test account (${testAccount.user}).`);
    } catch (err) {
      console.warn('⚠️  Could not create Ethereal test account, falling back to JSON transport.', err.message);
      transporter = nodemailer.createTransport({
        jsonTransport: true
      });
    }
  }

  return transporter;
};

export default getTransporter;
