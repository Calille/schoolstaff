/**
 * End-to-End Timesheet Workflow Test
 * 
 * Tests the complete flow:
 * 1. Staff submits timesheet
 * 2. School approves timesheet
 * 3. Admin generates invoice
 * 4. Admin exports payroll
 * 
 * Run with: npx tsx tests/e2e/timesheet-workflow.test.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY || SUPABASE_ANON_KEY)

interface TestResult {
  step: string
  success: boolean
  error?: string
  data?: any
}

async function testTimesheetWorkflow(): Promise<void> {
  const results: TestResult[] = []

  console.log('🧪 Starting End-to-End Timesheet Workflow Test\n')

  // Step 1: Setup test data
  console.log('Step 1: Setting up test data...')
  let staffUserId: string
  let schoolUserId: string
  let schoolId: string

  try {
    // Find or create test staff
    const { data: staffProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', 'test-staff@example.com')
      .eq('role', 'staff')
      .maybeSingle()

    if (!staffProfile) {
      console.log('⚠ Test staff not found. Please create test user.')
      process.exit(1)
    }
    staffUserId = staffProfile.id

    // Find or create test school
    const { data: schoolProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', 'test-school@example.com')
      .eq('role', 'school')
      .maybeSingle()

    if (!schoolProfile) {
      console.log('⚠ Test school not found. Please create test user.')
      process.exit(1)
    }
    schoolUserId = schoolProfile.id

    const { data: school } = await supabaseAdmin
      .from('schools')
      .select('id')
      .eq('profile_id', schoolUserId)
      .maybeSingle()

    if (!school) {
      const { data: newSchool } = await supabaseAdmin
        .from('schools')
        .insert({
          profile_id: schoolUserId,
          school_name: 'Test School',
        })
        .select()
        .single()
      schoolId = newSchool!.id
    } else {
      schoolId = school.id
    }

    results.push({ step: 'Setup Test Data', success: true })
    console.log(`✓ Test data ready: Staff=${staffUserId}, School=${schoolId}\n`)
  } catch (error: any) {
    results.push({ step: 'Setup Test Data', success: false, error: error.message })
    console.error('✗ Setup failed:', error)
    return
  }

  // Step 2: Staff submits timesheet
  console.log('Step 2: Staff submits timesheet...')
  try {
    const today = new Date().toISOString().split('T')[0]

    const { data: timesheet, error } = await supabaseAdmin
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

    if (error) throw error

    console.log(`✓ Timesheet submitted: ${timesheet.id}`)
    console.log(`  Hours: ${timesheet.total_hours}, Amount: £${timesheet.amount}`)
    results.push({ step: 'Submit Timesheet', success: true, data: timesheet })

    // Step 3: School approves timesheet
    console.log('\nStep 3: School approves timesheet...')
    const { data: approvedTimesheet, error: approveError } = await supabaseAdmin
      .from('timesheets')
      .update({ status: 'approved_by_school' })
      .eq('id', timesheet.id)
      .select()
      .single()

    if (approveError) throw approveError

    console.log(`✓ Timesheet approved: ${approvedTimesheet.status}`)
    results.push({ step: 'Approve Timesheet', success: true, data: approvedTimesheet })

    // Step 4: Admin generates invoice
    console.log('\nStep 4: Admin generates invoice...')
    const { data: invoiceResult, error: invoiceError } = await supabaseAdmin.rpc(
      'lock_and_create_invoice',
      {
        p_school_id: schoolId,
        p_timesheet_ids: [timesheet.id],
        p_issued_by: staffUserId, // Using staff ID as placeholder
      }
    )

    if (invoiceError) throw invoiceError

    if (!invoiceResult || invoiceResult.length === 0) {
      throw new Error('Invoice creation returned no result')
    }

    const invoiceId = invoiceResult[0].invoice_id
    console.log(`✓ Invoice created: ${invoiceId}`)
    results.push({ step: 'Generate Invoice', success: true, data: { invoiceId } })

    // Step 5: Admin exports payroll
    console.log('\nStep 5: Admin exports payroll...')
    const { data: payrollData, error: payrollError } = await supabaseAdmin.rpc(
      'select_and_mark_payroll',
      {
        p_date_from: today,
        p_date_to: today,
      }
    )

    if (payrollError) throw payrollError

    if (!payrollData || payrollData.length === 0) {
      console.log('⚠ No timesheets found for payroll (may already be processed)')
      results.push({ step: 'Export Payroll', success: false, error: 'No timesheets found' })
    } else {
      console.log(`✓ Payroll export: ${payrollData.length} timesheet(s)`)
      results.push({ step: 'Export Payroll', success: true, data: { count: payrollData.length } })
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

testTimesheetWorkflow().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

