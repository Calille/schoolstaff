/**
 * Compute total hours and amount from time inputs
 * Server-side calculation to ensure accuracy
 */
export function computeHoursAndAmount(
  startTime: string,
  endTime: string,
  breakMinutes: number,
  hourlyRate: number
): { totalHours: number; amount: number } {
  // Parse times (format: "HH:MM")
  const [startHours, startMins] = startTime.split(':').map(Number)
  const [endHours, endMins] = endTime.split(':').map(Number)

  // Convert to minutes for easier calculation
  const startTotalMinutes = startHours * 60 + startMins
  const endTotalMinutes = endHours * 60 + endMins

  // Calculate difference in minutes
  let diffMinutes = endTotalMinutes - startTotalMinutes

  // Handle overnight shifts (if end < start, assume next day)
  if (diffMinutes < 0) {
    diffMinutes += 24 * 60 // Add 24 hours
  }

  // Subtract break time
  const workedMinutes = Math.max(0, diffMinutes - breakMinutes)

  // Convert to hours (round to 2 decimal places)
  const totalHours = Math.round((workedMinutes / 60) * 100) / 100

  // Calculate amount (round to 2 decimal places)
  const amount = Math.round(totalHours * hourlyRate * 100) / 100

  return { totalHours, amount }
}

