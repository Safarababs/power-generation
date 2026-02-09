export function calculateRunningHours(logs) {
  let totalMs = 0;
  let lastStart = null;

  logs
    .sort((a, b) => a.eventDateTime - b.eventDateTime)
    .forEach((log) => {
      if (log.eventType === "start") {
        lastStart = log.eventDateTime;
      }

      if (log.eventType === "stop" && lastStart) {
        totalMs += log.eventDateTime - lastStart;
        lastStart = null;
      }
    });

  // If engine still running
  if (lastStart) {
    totalMs += new Date() - lastStart;
  }

  return totalMs / (1000 * 60 * 60); // hours
}

export function calculateAvailability(runningHours, periodHours) {
  if (!periodHours) return 0;
  return ((runningHours / periodHours) * 100).toFixed(2);
}
