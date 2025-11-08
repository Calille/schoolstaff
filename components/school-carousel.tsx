'use client'

import { ScrollReveal } from './scroll-reveal'
import { MapPin, Briefcase, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

interface School {
  id: string
  name: string
  location: string
  openRoles: number
  type?: string
}

interface SchoolCarouselProps {
  schools: School[]
  totalCount: number
  isLoggedIn?: boolean
}

export function SchoolCarousel({ schools, totalCount, isLoggedIn = false }: SchoolCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollRef.current) return

    let scrollAmount = 0
    const scrollSpeed = 0.5

    const scroll = () => {
      if (scrollRef.current) {
        scrollAmount += scrollSpeed
        scrollRef.current.scrollLeft = scrollAmount

        // Reset when reaching end
        if (scrollAmount >= scrollRef.current.scrollWidth / 2) {
          scrollAmount = 0
        }
      }
    }

    const interval = setInterval(scroll, 20)
    return () => clearInterval(interval)
  }, [])

  // Duplicate schools for infinite scroll effect
  const displaySchools = [...schools, ...schools]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Institutions Currently Recruiting
            </h2>
            <p className="text-xl text-gray-600">
              <span className="text-primary-600 font-bold">{totalCount}</span> educational institutions actively hiring
            </p>
          </div>
        </ScrollReveal>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-hidden pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {displaySchools.map((school, index) => (
              <div
                key={`${school.id}-${index}`}
                className="flex-shrink-0 w-80 bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-lg bg-primary-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">
                      {school.name.charAt(0)}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                    Hiring
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {isLoggedIn ? school.name : '••••••••••'}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{isLoggedIn ? school.location : '••••••'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">{school.openRoles} open positions</span>
                  </div>
                </div>

                {!isLoggedIn && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center">
                      Register to view details
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Fade edges */}
          <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>

        {!isLoggedIn && (
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="text-center mt-12">
              <Link
                href="/signup?role=staff"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all group"
              >
                Register to View All Opportunities
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}

