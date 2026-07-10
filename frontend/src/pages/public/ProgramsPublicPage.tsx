import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi, PublicProgram } from '@api/public.api';
import PublicLayout from '@components/layout/PublicLayout';
import AnimatedSection from '@components/AnimatedSection';
import {
  Clock,
  DollarSign,
  BookOpen,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

const ProgramsPublicPage: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-programs'],
    queryFn: () => publicApi.getPrograms({ limit: 100 }),
  });

  const extractPrograms = (): PublicProgram[] => {
    if (!data) return [];
    const responseData = data.data;
    if (!responseData) return [];
    if (responseData.data?.programs) return responseData.data.programs;
    if (responseData.programs) return responseData.programs;
    return [];
  };

  const programs = extractPrograms();

  const getLevelColor = (name: string) => {
    const levels: Record<string, string> = {
      'Movers': 'bg-green-100 text-green-800',
      'KET': 'bg-blue-100 text-blue-800',
      'PET': 'bg-yellow-100 text-yellow-800',
      'FCE': 'bg-purple-100 text-purple-800',
      'CAE': 'bg-red-100 text-red-800',
    };
    return levels[name] || 'bg-gray-100 text-gray-800';
  };

  const getLevelLabel = (name: string) => {
    const labels: Record<string, string> = {
      'Movers': 'Elementary',
      'KET': 'Elementary',
      'PET': 'Intermediate',
      'FCE': 'Upper-Intermediate',
      'CAE': 'Advanced',
    };
    return labels[name] || 'N/A';
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading programs...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (isError) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Failed to load programs. Please try again later.</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <AnimatedSection>
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Programs</h1>
            <p className="text-lg text-primary-100 max-w-3xl mx-auto">
              Choose from our comprehensive range of Cambridge English preparation courses.
            </p>
          </div>
        </section>
      </AnimatedSection>

      {/* Programs Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program: PublicProgram, index: number) => {
              const isExpanded = selectedProgram === program.id;
              return (
                <AnimatedSection key={program.id} delay={index * 100}>
                  <div
                    className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'ring-2 ring-primary-500' : 'hover:shadow-md'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {program.displayName?.en || program.name}
                          </h3>
                          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(program.name)}`}>
                            {getLevelLabel(program.name)}
                          </span>
                        </div>
                        <div className="flex-shrink-0">
                          <GraduationCap className="w-10 h-10 text-primary-600" />
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 mt-2">Code: {program.name}</p>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-primary-600" />
                          <span>{program.duration} months</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2 text-primary-600" />
                          <span>৳{program.fee?.toLocaleString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedProgram(isExpanded ? null : program.id)}
                        className="mt-4 text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium"
                      >
                        {isExpanded ? 'Show Less' : 'Learn More'}
                        <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
                          <p className="text-sm text-gray-600">
                            {program.description?.en || 'Comprehensive Cambridge preparation course.'}
                          </p>
                        </div>
                        <Link
                          to="/contact"
                          className="inline-block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
                        >
                          Enroll Now
                        </Link>
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          {programs.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No Programs Available</h3>
              <p className="text-gray-500 mt-2">Please check back later for our program offerings.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Contact us today to learn more about our programs and find the right course for you.
            </p>
            <Link to="/contact" className="px-8 py-3 bg-white text-primary-700 rounded-xl font-medium hover:bg-gray-100 transition-colors">
              Contact Us Now
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ProgramsPublicPage;