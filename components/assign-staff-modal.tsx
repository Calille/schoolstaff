'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface StaffProfile {
  id: string
  profiles: {
    full_name: string
    email: string
  }
}

interface AssignStaffModalProps {
  requestId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

export function AssignStaffModal({
  requestId,
  open,
  onOpenChange,
  onComplete,
}: AssignStaffModalProps) {
  const [staffList, setStaffList] = useState<StaffProfile[]>([])
  const [filteredStaff, setFilteredStaff] = useState<StaffProfile[]>([])
  const [selectedStaffId, setSelectedStaffId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterByAvailability, setFilterByAvailability] = useState(false)
  const [requestWeekdays, setRequestWeekdays] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (open) {
      loadRequestDetails()
      loadStaff()
    }
  }, [open, requestId])

  useEffect(() => {
    filterStaff()
  }, [staffList, searchQuery, filterByAvailability, requestWeekdays])

  const loadRequestDetails = async () => {
    const { data } = await supabase
      .from('staff_requests')
      .select('weekdays')
      .eq('id', requestId)
      .single()

    if (data?.weekdays) {
      setRequestWeekdays(data.weekdays)
    }
  }

  const loadStaff = async () => {
    setLoading(true)
    
    // Get compliant staff IDs
    const { data: complianceData } = await supabase
      .from('staff_compliance_status')
      .select('staff_id')
      .eq('is_compliant', true)

    const compliantStaffIds = complianceData?.map((c) => c.staff_id) || []

    if (compliantStaffIds.length === 0) {
      setStaffList([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('staff_profiles')
      .select(`
        id,
        profiles (
          full_name,
          email
        )
      `)
      .in('id', compliantStaffIds)
      .order('id')

    if (error) {
      console.error('Error loading staff:', error)
      toast.error('Failed to load staff list')
    } else {
      // Normalize the data structure - profiles can be array or single object
      const normalized = (data || []).map((item: any) => ({
        id: item.id,
        profiles: Array.isArray(item.profiles)
          ? item.profiles[0]
          : item.profiles,
      }))
      setStaffList(normalized)
    }
    setLoading(false)
  }

  const filterStaff = async () => {
    // First, filter by compliance - only show compliant staff
    const { data: complianceData } = await supabase
      .from('staff_compliance_status')
      .select('staff_id')
      .eq('is_compliant', true)

    const compliantStaffIds = new Set(
      complianceData?.map((c) => c.staff_id) || []
    )

    let filtered = staffList.filter((staff) =>
      compliantStaffIds.has(staff.id)
    )

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((staff) => {
        const profile = staff.profiles
        const name = profile?.full_name?.toLowerCase() || ''
        const email = profile?.email?.toLowerCase() || ''
        const query = searchQuery.toLowerCase()
        return name.includes(query) || email.includes(query)
      })
    }

    // Filter by availability if enabled
    if (filterByAvailability && requestWeekdays.length > 0) {
      const { data: availableStaff } = await supabase
        .from('staff_availability_weekdays')
        .select('staff_id')
        .in('weekday', requestWeekdays)
        .eq('available', true)

      if (availableStaff) {
        const availableStaffIds = new Set(
          availableStaff.map((s) => s.staff_id)
        )
        // Count occurrences - staff must be available for ALL requested days
        const staffCounts = new Map<string, number>()
        availableStaff.forEach((item) => {
          staffCounts.set(
            item.staff_id,
            (staffCounts.get(item.staff_id) || 0) + 1
          )
        })

        const fullyAvailableStaffIds = Array.from(staffCounts.entries())
          .filter(([_, count]) => count === requestWeekdays.length)
          .map(([staffId]) => staffId)

        filtered = filtered.filter((staff) =>
          fullyAvailableStaffIds.includes(staff.id)
        )
      } else {
        filtered = []
      }
    }

    setFilteredStaff(filtered)
  }

  const handleAssign = async () => {
    if (!selectedStaffId) {
      toast.error('Please select a staff member')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/admin/assign-staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_id: requestId,
          staff_id: selectedStaffId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to assign staff')
      }

      toast.success('Staff assigned successfully')
      onComplete()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign staff')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Staff</DialogTitle>
          <DialogDescription>
            Select a staff member to assign to this request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Search Staff</Label>
            <Input
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="mt-1"
            />
          </div>

          {requestWeekdays.length > 0 && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filter-availability"
                checked={filterByAvailability}
                onCheckedChange={(checked) =>
                  setFilterByAvailability(checked === true)
                }
              />
              <Label
                htmlFor="filter-availability"
                className="text-sm font-normal cursor-pointer"
              >
                Only show staff available for requested weekdays (
                {requestWeekdays.join(', ')})
              </Label>
            </div>
          )}

          <div>
            <Label htmlFor="staff-select">Select Staff Member</Label>
            {loading ? (
              <div className="mt-1 p-4 text-center text-gray-600">
                Loading staff...
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="mt-1 p-4 text-center text-gray-600">
                No staff members found
              </div>
            ) : (
              <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a staff member" />
                </SelectTrigger>
                <SelectContent>
                  {filteredStaff.map((staff) => {
                    const profile = staff.profiles

                    return (
                      <SelectItem key={staff.id} value={staff.id}>
                        {profile?.full_name || 'Unknown'} (
                        {profile?.email || 'No email'})
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={submitting || !selectedStaffId}>
            {submitting ? 'Assigning...' : 'Confirm Assignment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

