'use client'

import { ScrollReveal } from './scroll-reveal'
import { 
  GraduationCap, 
  Briefcase, 
  MapPin, 
  Star,
  FileText,
  Award,
  ArrowRight 
} from 'lucide-react'
import Link from 'next/link'

export function ProfilePreviewShowcase() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Professional Profile
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create a comprehensive profile that showcases your expertise and attracts hiring schools
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Preview Card */}
          <ScrollReveal animation="fade-right" duration={600}>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-primary-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl font-bold text-primary-600">SP</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold mb-2">Sarah Peterson</h3>
                    <p className="text-xl text-primary-100 mb-3">Primary School Teacher</p>
                    <div className="flex items-center gap-2 text-primary-100">
                      <MapPin className="w-4 h-4" />
                      <span>London, UK</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Bio */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">About</h4>
                  <p className="text-gray-600">
                    Experienced primary teacher with 8 years specializing in Key Stage 2. Passionate about creating engaging learning environments...
                  </p>
                </div>

                {/* Experience */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-5 h-5 text-primary-600" />
                    <h4 className="text-lg font-bold text-gray-900">Experience</h4>
                  </div>
                  <p className="text-gray-600">8 years in primary education</p>
                </div>

                {/* Qualifications */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                    <h4 className="text-lg font-bold text-gray-900">Qualifications</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                      BA Education
                    </span>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                      PGCE
                    </span>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                      QTS
                    </span>
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-primary-600" />
                    <h4 className="text-lg font-bold text-gray-900">Specializations</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      Literacy
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      Numeracy
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      SEN Support
                    </span>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-primary-600" />
                    <h4 className="text-lg font-bold text-gray-900">Compliance</h4>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-semibold">All documents verified ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Benefits List */}
          <ScrollReveal animation="fade-left" delay={200} duration={600}>
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">
                Stand Out to Schools
              </h3>

              {[
                {
                  title: 'Comprehensive Profile',
                  description: 'Showcase your qualifications, experience, and teaching philosophy in detail',
                },
                {
                  title: 'Highlight Your Expertise',
                  description: 'Add specializations, subject strengths, and unique skills that make you valuable',
                },
                {
                  title: 'Upload Documentation',
                  description: 'Store your CV, certificates, and compliance documents securely in one place',
                },
                {
                  title: 'Be Discoverable',
                  description: 'Schools searching for your specific skills will find you automatically',
                },
                {
                  title: 'Control Your Information',
                  description: 'Update your profile anytime and choose what schools can see',
                },
              ].map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h4>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}

              <Link
                href="/signup?role=staff"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all group mt-8"
              >
                Build Your Profile Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

