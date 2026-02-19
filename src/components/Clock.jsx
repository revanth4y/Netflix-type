import { useClock } from '../hooks/useClock';

/**
 * Live digital clock - HH:MM:SS AM/PM. Netflix dark theme styled.
 */
export function Clock() {
  const time = useClock();

  return (
    <time
      dateTime={new Date().toLocaleTimeString('en-US', { hour12: false })}
      className="text-sm sm:text-base font-mono text-gray-400 tabular-nums transition-colors duration-200 dark:text-gray-400 light:text-gray-600"
    >
      {time}
    </time>
  );
}
