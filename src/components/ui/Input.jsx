/**
 * Reusable controlled Input with label, error state, and accessibility.
 */
export function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  autoComplete,
  className = '',
  ...rest
}) {
  const hasError = Boolean(error);
  const inputClasses = [
    'w-full px-4 py-3 rounded transition',
    'bg-gray-700 border text-white placeholder-gray-500',
    'focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent',
    hasError && 'border-red-500 focus:ring-red-500',
    !hasError && 'border-gray-600',
    disabled && 'opacity-60 cursor-not-allowed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm text-gray-400 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={inputClasses}
        {...rest}
      />
      {hasError && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
