import crypto from 'crypto';

export const validateStipendAmount = ({ stipendAmount, minimumAmount = 0 }) => {
  const amount = Number(stipendAmount || 0);
  return {
    valid: amount >= minimumAmount,
    amount,
    message: amount >= minimumAmount
      ? 'Stipend amount is valid.'
      : `Stipend amount must be at least ${minimumAmount}.`
  };
};

export const createPaymentReference = (prefix = 'EC-STIPEND') => (
  `${prefix}-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
);
