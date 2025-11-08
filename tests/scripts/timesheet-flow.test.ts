/**
 * Timesheet Flow Integration Test
 * 
 * This script tests the complete timesheet submission -> approval -> invoicing -> payroll flow
 * 
 * Usage:
 *   1. Set environment variables:
 *      - NEXT_PUBLIC_SUPABASE_URL
 *      - SUPABASE_SERVICE_ROLE_KEY (for admin operations)
 *      - TEST_STAFF_EMAIL (optional, for auth)
 *      - TEST_SCHOOL_EMAIL (optional, for auth)
 * 
 *   2. Run: npx tsx tests/scripts/timesheet-flow.test.ts
 * 
 * Or use curl commands (see README_PHASE9.md)
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY || SUPABASE_ANON_KEY)

interface TestResult {
  step: string
  success: boolean
  error?: string
  data?: any
}

async function testTimesheetFlow(): Promise<void> {
  const results: TestResult[] = []

  console.log('🧪 Starting Timesheet Flow Integration Test\n')

  // Step 1: Get or create test staff user
  console.log('Step 1: Setting up test staff user...')
  let staffUserId: string
  let staffProfileId: string

  try {
    // Try to find existing test staff
    const { data: existingStaff } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', 'test-staff@example.com')
      .eq('role', 'staff')
      .maybeSingle()

    if (existingStaff) {
      staffUserId = existingStaff.id
      staffProfileId = existingStaff.id
      console.log(`✓ Using existing test staff: ${staffUserId}`)
    } else {
      // Create test staff (requires auth user first - simplified for test)
      console.log('⚠ Test staff not found. Please create manually or use existing user.')
      console.log('   You can create a test user via Supabase Auth UI or API')
      process.exit(1)
    }

    results.push({ step: 'Setup Staff', success: true })
  } catch (error: any) {
    results.push({ step: 'Setup Staff', success: false, error: error.message })
    console.error('✗ Failed to setup staff:', error)
    return
  }

  // Step 2: Get or create test school user
  console.log('\nStep 2: Setting up test school user...')
  let schoolUserId: string
  let schoolId: string

  try {
    const { data: existingSchool } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', 'test-school@example.com')
      .eq('role', 'school')
      .maybeSingle()

    if (existingSchool) {
        schoolUserId = existingSchool.id
        const { data: school } = await supabaseAdmin
          .from('schools')
          .select('id')
          .eq('profile_id', schoolUserId)
          .single()
        
        if (school) {
          schoolId = school.id
          console.log(`✓ Using existing test school: ${schoolId}`)
        } else {
          console.log('⚠ School profile not found. Creating...')
          const { data: newSchool } = await supabaseAdmin
            .from('schools')
            .insert({
              profile_id: schoolUserId,
              school_name: 'Test School',
            })
            .select()
            .single()
          
          schoolId = newSchool!.id
        }
    } else {
      console.log('⚠ Test school not found. Please create manually.')
      process.exit(1)
    }

    results.push({ step: 'Setup School', success: true })
  } catch (error: any) {
    results.push({ step: 'Setup School', success: false, error: error.message })
    console.error('✗ Failed to setup school:', error)
    return
  }

  // Step 3: Submit timesheet (simulate API call)
  console.log('\nStep 3: Submitting timesheet...')
  try {
    const today = new Date().toISOString().split('T')[0]
    
    // Direct DB insert for testing (in real test, would call API with auth)
    const { data: timesheet, error: insertError } = await supabaseAdmin
      .from('timesheets')
      .insert({
        staff_id: staffUserId,
        school_id: schoolId,
        date: today,
        start_time: '09:00',
        end_time: '17:00',
        break_minutes: 60,
        hourly_rate: 25.0,
        status: 'submitted',
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    console.log(`✓ Timesheet submitted: ${timesheet.id}`)
    console.log(`  Total hours: ${timesheet.total_hours}, Amount: £${timesheet.amount}`)
    results.push({ step: 'Submit Timesheet', success: true, data: timesheet })

    // Step 4: Approve timesheet
    console.log('\nStep 4: Approving timesheet...')
    const { data: approvedTimesheet, error: approveError } = await supabaseAdmin
      .from('timesheets')
      .update({ status: 'approved_by_school' })
      .eq('id', timesheet.id)
      .select()
      .single()

    if (approveError) {
      throw approveError
    }

    console.log(`✓ Timesheet approved: ${approvedTimesheet.status}`)
    results.push({ step: 'Approve Timesheet', success: true, data: approvedTimesheet })

    // Step 5: Generate invoice
    console.log('\nStep 5: Generating invoice...')
    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from('school_invoices')
      .insert({
        school_id: schoolId,
        status: 'draft',
        amount: 0,
      })
      .select()
      .single()

    if (invoiceError) {
      throw invoiceError
    }

    // Add invoice line
    const { error: lineError } = await supabaseAdmin
      .from('invoice_lines')
      .insert({
        invoice_id: invoice.id,
        timesheet_id: timesheet.id,
        description: `Timesheet for ${today}`,
        quantity: Number(timesheet.total_hours),
        unit_price: Number(timesheet.hourly_rate),
      })

    if (lineError) {
      throw lineError
    }

    // Update invoice amount
    await supabaseAdmin
      .from('school_invoices')
      .update({ amount: Number(timesheet.amount) })
      .eq('id', invoice.id)

    console.log(`✓ Invoice created: ${invoice.id}, Amount: £${timesheet.amount}`)
    results.push({ step: 'Generate Invoice', success: true, data: invoice })

    // Step 6: Test payroll export
    console.log('\nStep 6: Testing payroll export...')
    const { data: payrollTimesheets } = await supabaseAdmin
      .from('timesheets')
      .select('*')
      .eq('status', 'approved_by_school')
      .gte('date', today)
      .lte('date', today)

    if (payrollTimesheets && payrollTimesheets.length > 0) {
      console.log(`✓ Found ${payrollTimesheets.length} timesheet(s) for payroll`)
      results.push({ step: 'Payroll Export', success: true, data: { count: payrollTimesheets.length } })
    } else {
      console.log('⚠ No timesheets found for payroll export')
      results.push({ step: 'Payroll Export', success: false, error: 'No timesheets found' })
    }

  } catch (error: any) {
    console.error('✗ Test failed:', error)
    results.push({ step: 'Test Execution', success: false, error: error.message })
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Test Results Summary')
  console.log('='.repeat(50))
  
  results.forEach((result) => {
    const icon = result.success ? '✓' : '✗'
    console.log(`${icon} ${result.step}: ${result.success ? 'PASSED' : 'FAILED'}`)
    if (result.error) {
      console.log(`   Error: ${result.error}`)
    }
  })

  const passed = results.filter((r) => r.success).length
  const total = results.length
  
  console.log(`\n${passed}/${total} tests passed`)
  
  if (passed === total) {
    console.log('✅ All tests passed!')
    process.exit(0)
  } else {
    console.log('❌ Some tests failed')
    process.exit(1)
  }
}

// Run tests
testTimesheetFlow().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

