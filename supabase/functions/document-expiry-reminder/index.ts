import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Calculate date 14 days from now
    const today = new Date()
    const reminderDate = new Date(today)
    reminderDate.setDate(today.getDate() + 14)

    // Find documents expiring within 14 days
    const { data: expiringDocs, error: docsError } = await supabase
      .from('staff_documents')
      .select(`
        *,
        staff:staff_profiles (
          profiles (
            id,
            email,
            full_name
          )
        )
      `)
      .lte('expiry_date', reminderDate.toISOString().split('T')[0])
      .gte('expiry_date', today.toISOString().split('T')[0])
      .eq('verified', true)

    if (docsError) {
      console.error('Error fetching expiring documents:', docsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch documents' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!expiringDocs || expiringDocs.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No expiring documents found' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Group by staff member
    const staffReminders = new Map<string, any[]>()
    expiringDocs.forEach((doc) => {
      const staffData = Array.isArray(doc.staff) ? doc.staff[0] : doc.staff
      const staffId = doc.staff_id
      
      if (!staffReminders.has(staffId)) {
        staffReminders.set(staffId, [])
      }
      staffReminders.get(staffId)!.push({
        ...doc,
        staff: staffData,
      })
    })

    // Send email reminders
    const documentTypeLabels: Record<string, string> = {
      dbs: 'DBS Check',
      right_to_work: 'Right to Work Evidence',
      safeguarding_training: 'Safeguarding Training Certificate',
      id_passport: 'Passport/Photo ID',
    }

    const emailResults = []
    for (const [staffId, docs] of staffReminders.entries()) {
      const staffData = docs[0].staff
      const staffProfile = staffData?.profiles
        ? Array.isArray(staffData.profiles)
          ? staffData.profiles[0]
          : staffData.profiles
        : null

      if (!staffProfile?.email) {
        continue
      }

      const docTypes = docs.map((d) => documentTypeLabels[d.document_type] || d.document_type)
      const expiryDates = docs.map((d) => new Date(d.expiry_date).toLocaleDateString('en-GB'))

      // Use Supabase Auth Admin API to send email
      // Note: This requires email templates to be configured in Supabase
      // For now, we'll log the reminder (you can integrate with Resend or similar)
      const emailContent = {
        to: staffProfile.email,
        subject: 'Compliance Document Expiry Reminder',
        html: `
          <h2>Compliance Document Expiry Reminder</h2>
          <p>Dear ${staffProfile.full_name || 'Staff Member'},</p>
          <p>The following compliance documents are expiring soon:</p>
          <ul>
            ${docs.map((doc, idx) => `
              <li>
                <strong>${docTypes[idx]}</strong> - Expires: ${expiryDates[idx]}
              </li>
            `).join('')}
          </ul>
          <p>Please upload updated documents to remain eligible for school placements.</p>
          <p><a href="${Deno.env.get('APP_URL') || 'https://your-app.com'}/dashboard/staff/compliance">Upload Documents</a></p>
        `,
      }

      // Log for now (integrate with email service)
      console.log('Email reminder:', emailContent)

      emailResults.push({
        staff_id: staffId,
        email: staffProfile.email,
        documents: docTypes,
      })
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${expiringDocs.length} expiring documents`,
        reminders_sent: emailResults.length,
        results: emailResults,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in document expiry reminder:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

