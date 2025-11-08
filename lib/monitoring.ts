/**
 * Monitoring and Logging Utilities
 * 
 * Provides structured logging with correlation IDs and error tracking
 */

/**
 * Generate correlation ID for request tracking
 */
export function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Structured log entry
 */
export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  correlationId?: string
  userId?: string
  action?: string
  metadata?: Record<string, any>
  timestamp?: string
}

/**
 * Log structured entry
 * In production, this would send to a logging service
 */
export function log(entry: LogEntry): void {
  const logEntry = {
    ...entry,
    timestamp: entry.timestamp || new Date().toISOString(),
  }

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    const method = entry.level === 'error' ? 'error' : entry.level === 'warn' ? 'warn' : 'log'
    console[method](JSON.stringify(logEntry, null, 2))
  }

  // In production, send to logging service
  // Example: sendToLoggingService(logEntry)
}

/**
 * Log API request
 */
export function logRequest(
  method: string,
  path: string,
  correlationId: string,
  userId?: string
): void {
  log({
    level: 'info',
    message: `API Request: ${method} ${path}`,
    correlationId,
    userId,
    action: 'api_request',
    metadata: { method, path },
  })
}

/**
 * Log API response
 */
export function logResponse(
  method: string,
  path: string,
  statusCode: number,
  correlationId: string,
  duration?: number
): void {
  log({
    level: statusCode >= 400 ? 'error' : 'info',
    message: `API Response: ${method} ${path} ${statusCode}`,
    correlationId,
    action: 'api_response',
    metadata: { method, path, statusCode, duration },
  })
}

/**
 * Log error
 */
export function logError(
  error: Error,
  correlationId: string,
  context?: Record<string, any>
): void {
  log({
    level: 'error',
    message: error.message,
    correlationId,
    action: 'error',
    metadata: {
      error: error.message,
      stack: error.stack,
      ...context,
    },
  })
}

/**
 * Log slow query
 */
export function logSlowQuery(
  query: string,
  duration: number,
  correlationId: string,
  threshold: number = 100
): void {
  if (duration > threshold) {
    log({
      level: 'warn',
      message: `Slow query detected: ${duration}ms`,
      correlationId,
      action: 'slow_query',
      metadata: { query, duration, threshold },
    })
  }
}

/**
 * Track business event
 */
export function trackEvent(
  eventName: string,
  correlationId: string,
  metadata?: Record<string, any>
): void {
  log({
    level: 'info',
    message: `Event: ${eventName}`,
    correlationId,
    action: 'business_event',
    metadata: { eventName, ...metadata },
  })
}

