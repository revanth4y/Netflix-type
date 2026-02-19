/**
 * Validation utilities - no inline logic in components
 */

const MOBILE_LENGTH = 10;
const MOBILE_NUMBERS_ONLY = /^\d+$/;

/**
 * Validate mobile number: exactly 10 digits, numbers only.
 * @param {string} value - Raw input
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateMobile(value) {
  if (value == null || typeof value !== 'string') {
    return { valid: false, message: 'Mobile number must be exactly 10 digits' };
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: 'Mobile number is required' };
  }
  if (!MOBILE_NUMBERS_ONLY.test(trimmed)) {
    return { valid: false, message: 'Mobile number must contain only numbers' };
  }
  if (trimmed.length !== MOBILE_LENGTH) {
    return { valid: false, message: 'Mobile number must be exactly 10 digits' };
  }
  return { valid: true };
}

/**
 * Validate non-empty string (e.g. name).
 * @param {string} value
 * @param {string} fieldName
 */
export function validateRequired(value, fieldName = 'Field') {
  if (value == null || typeof value !== 'string') {
    return { valid: false, message: `${fieldName} is required` };
  }
  if (!value.trim()) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true };
}

/**
 * Validate password minimum length.
 * @param {string} value
 * @param {number} minLength
 */
export function validatePassword(value, minLength) {
  if (value == null || typeof value !== 'string') {
    return { valid: false, message: `Password must be at least ${minLength} characters` };
  }
  if (value.length < minLength) {
    return { valid: false, message: `Password must be at least ${minLength} characters` };
  }
  return { valid: true };
}
