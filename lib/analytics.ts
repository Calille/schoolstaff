/**
 * Google Analytics Integration
 * 
 * Tracks page views and events for the School Staff platform
 * Ensures no sensitive data is sent to analytics
 */

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
  }
}

/**
 * Initialize Google Analytics
 * Call this in _app.tsx or layout.tsx
 */
export function initAnalytics(gaId: string) {
  if (typeof window === 'undefined' || !gaId) return

  // Load Google Analytics script
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(script1)

  const script2 = document.createElement('script')
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}', {
      page_path: window.location.pathname,
    });
  `
  document.head.appendChild(script2)
}

/**
 * Track page view
 * Call this on route changes
 */
export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
    page_path: path,
    page_title: title,
  })
}

/**
 * Track custom event
 * Use for user actions: timesheet submission, invoice generation, etc.
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

/**
 * Track timesheet submission
 * No sensitive data (no IDs, amounts, or personal info)
 */
export function trackTimesheetSubmission(success: boolean) {
  trackEvent('timesheet_submit', 'timesheets', success ? 'success' : 'failure')
}

/**
 * Track invoice generation
 * No sensitive data
 */
export function trackInvoiceGeneration(success: boolean, timesheetCount?: number) {
  trackEvent(
    'invoice_generate',
    'invoicing',
    success ? 'success' : 'failure',
    timesheetCount
  )
}

/**
 * Track payroll export
 * No sensitive data
 */
export function trackPayrollExport(success: boolean, timesheetCount?: number) {
  trackEvent(
    'payroll_export',
    'payroll',
    success ? 'success' : 'failure',
    timesheetCount
  )
}

/**
 * Track staff request
 * No sensitive data
 */
export function trackStaffRequest(success: boolean) {
  trackEvent('staff_request', 'requests', success ? 'success' : 'failure')
}

/**
 * Track dashboard view
 * No sensitive data
 */
export function trackDashboardView(role: 'staff' | 'school' | 'admin') {
  trackEvent('dashboard_view', 'navigation', role)
}

