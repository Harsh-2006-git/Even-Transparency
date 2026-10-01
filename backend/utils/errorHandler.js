/**
 * Helper to parse and format database & validation errors into user-friendly messages
 */
export const formatDbError = (error) => {
  // 1. Unique constraint violation (duplicate email, phone, code, etc.)
  if (error.name === 'SequelizeUniqueConstraintError' || error.code === '23505') {
    const errorItem = error.errors?.[0];
    const field = errorItem?.path || Object.keys(error.fields || {})[0] || 'field';
    const value = errorItem?.value || (error.fields ? error.fields[field] : '') || '';

    let friendlyField = field;
    if (field === 'email') friendlyField = 'Email address';
    else if (field === 'mobile_number' || field === 'phone') friendlyField = 'Phone number';
    else if (field === 'employee_id') friendlyField = 'Employee ID';
    else if (field === 'code') friendlyField = 'Code';

    const message = value 
      ? `The ${friendlyField} "${value}" is already registered. Please use a different ${friendlyField.toLowerCase()}.`
      : `An account with this ${friendlyField.toLowerCase()} already exists in the system.`;

    return {
      status: 409,
      field,
      message,
    };
  }

  // 2. Sequelize validation errors (e.g. invalid format, notEmpty)
  if (error.name === 'SequelizeValidationError') {
    const items = error.errors || [];
    const field = items[0]?.path || 'validation';
    const messages = items.map(e => {
      if (e.validatorKey === 'isEmail') return 'Please enter a valid email address';
      if (e.validatorKey === 'notEmpty' || e.validatorKey === 'is_null') return `${e.path} cannot be empty`;
      return e.message;
    }).join('. ');

    return {
      status: 400,
      field,
      message: messages || 'Validation error: Please check your input fields.',
    };
  }

  // 3. PostgreSQL UUID syntax error (22P02)
  if (error.parent?.code === '22P02' || error.code === '22P02') {
    return {
      status: 400,
      message: 'Invalid ID format provided for linked organization, partner, or city.',
    };
  }

  // 4. Foreign key constraint error (23503)
  if (error.parent?.code === '23503' || error.code === '23503') {
    return {
      status: 400,
      message: 'The linked organization, partner, or training center does not exist in the database.',
    };
  }

  // 5. Fallback general error
  return {
    status: 400,
    message: error.message || 'An unexpected error occurred while saving to the database.',
  };
};

/**
 * Common pre-validation for email and phone
 */
export const validateContactFields = ({ email, mobile_number, phone, first_name, name, company_name, employer_name }) => {
  const effectiveName = name || company_name || employer_name || first_name;
  if (!effectiveName || !String(effectiveName).trim()) {
    return { field: 'name', message: 'Name is required.' };
  }

  if (email !== undefined && email !== null && String(email).trim() !== '') {
    const cleanEmail = String(email).trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { field: 'email', message: `"${cleanEmail}" is not a valid email address format (e.g. name@domain.com).` };
    }
  }

  const effectivePhone = mobile_number || phone;
  if (effectivePhone !== undefined && effectivePhone !== null && String(effectivePhone).trim() !== '') {
    const cleanPhone = String(effectivePhone).replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return { field: 'mobile_number', message: 'Phone/Mobile number must contain at least 10 digits.' };
    }
  }

  return null;
};
