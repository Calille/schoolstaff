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
    const fourteenDaysFromNow = new Date(today)
    fourteenDaysFromNow.setDate(today.getDate() + 14)

    // Find documents expiring within 14 days
    const { data: expiringDocs, error: fetchError } = await supabase
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
      .not('expiry_date', 'is', null)
      .lte('expiry_date', fourteenDaysFromNow.toISOString().split('T')[0])
      .eq('verified', true)

    if (fetchError) {
      console.error('Error fetching expiring documents:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch documents' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!expiringDocs || expiringDocs.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No documents expiring soon', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Group by staff member
    const staffNotifications = new Map<string, { staff: any; documents: any[] }>()

    expiringDocs.forEach((doc) => {
      const staffData = Array.isArray(doc.staff) ? doc.staff[0] : doc.staff
      const staffProfile = staffData?.profiles
        ? Array.isArray(staffData.profiles)
          ? staffData.profiles[0]
          : staffData.profiles
        : null

      if (!staffProfile?.id) return

      if (!staffNotifications.has(staffProfile.id)) {
        staffNotifications.set(staffProfile.id, {
          staff: staffProfile,
          documents: [],
        })
      }

      staffNotifications.get(staffProfile.id)!.documents.push(doc)
    })

    // Send notifications (for now, create in-app notifications)
    // In production, you would also send emails here
    const notificationPromises: Promise<any>[] = []

    staffNotifications.forEach(({ staff, documents }) => {
      const documentTypes = documents.map((d) => {
        const labels: Record<string, string> = {
          dbs: 'DBS Check',
          right_to_work: 'Right to Work',
          safeguarding_training: 'Safeguarding Training',
          id_passport: 'Passport/Photo ID',
        }
        return labels[d.document_type] || d.document_type
      })

      const message = `Your ${documentTypes.join(', ')} ${
        documentTypes.length === 1 ? 'expires' : 'expire'
      } soon. Please upload updated documents to remain eligible for work.`

      // Create in-app notification
      notificationPromises.push(
        supabase.from('notifications').insert({
          user_id: staff.id,
          type: 'document_expiry',
          payload: {
            documents: documents.map((d) => ({
              type: d.document_type,
              expiry_date: d.expiry_date,
            })),
          },
        })
      )
    })

    await Promise.all(notificationPromises)

    return new Response(
      JSON.stringify({
        message: 'Expiry reminders sent',
        staff_notified: staffNotifications.size,
        documents_expiring: expiringDocs.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

