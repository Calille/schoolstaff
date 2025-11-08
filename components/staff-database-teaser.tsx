'use client'

import { ScrollReveal } from './scroll-reveal'
import { Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface StaffDatabaseTeaserProps {
  totalCount: number
  previewCount?: number
  isLoggedIn?: boolean
}

export function StaffDatabaseTeaser({ 
  totalCount, 
  previewCount = 6,
  isLoggedIn = false 
}: StaffDatabaseTeaserProps) {
  // Mock preview data - replace with real data
  const previewStaff = Array(previewCount).fill(null).map((_, i) => ({
    id: i,
    name: isLoggedIn ? `Teacher ${i + 1}` : '••••••',
    role: isLoggedIn ? 'Primary Teacher' : '••••••',
    experience: isLoggedIn ? `${5 + i} years` : '•••',
    location: isLoggedIn ? 'London' : '••••••',
  }))

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Professional Network
            </h2>
            <p className="text-xl text-gray-600">
              Access our network of <span className="text-primary-600 font-bold">{totalCount}+</span> verified education professionals
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${!isLoggedIn ? 'blur-sm' : ''}`}>
            {previewStaff.map((staff, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-primary-600">
                        {staff.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
                        {staff.name}
                      </h3>
                      <p className="text-primary-600 font-semibold mb-2">{staff.role}</p>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        <span>{staff.experience}</span>
                        <span>•</span>
                        <span>{staff.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Overlay for non-logged-in users */}
          {!isLoggedIn && (
            <div className="absolute inset-0 flex items-center justify-center">
              <ScrollReveal animation="zoom-in" delay={400}>
                <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md text-center border-2 border-primary-200">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
                    <Lock className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Unlock Full Access
                  </h3>
                  <p className="text-lg text-gray-600 mb-8">
                    Register your school to view detailed profiles of all {totalCount}+ verified professionals
                  </p>
                  <Link
                    href="/signup?role=school"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all group"
                  >
                    Register to View All
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

