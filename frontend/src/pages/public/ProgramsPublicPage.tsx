import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { programsApi, Program } from '@api/programs.api';
import PublicLayout from '@components/layout/PublicLayout';
import { 
  Clock, 
  DollarSign, 
  BookOpen, 
  Award, 
  Users,
  ChevronRight,
  Calendar,
  Star,
  GraduationCap
} from 'lucide-react';

const ProgramsPublicPage: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  // Fetch all active programs
  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-programs'],
    queryFn: () => programsApi.getAll({ isActive: true, limit: 100 }),
  });

  // Extract programs from response
  const extractPrograms = (): Program[] => {
    if (!data) return [];
    const responseData = data.data;
    if (!responseData) return [];
    if (responseData.data?.programs) return responseData.data.programs;
    if (responseData.programs) return responseData.programs;
    return [];
  };

  const programs = extractPrograms();

  // Program details for the modal/expanded view
  const programDetails: Record<string, any> = {
    'Movers': {
      description: 'Cambridge Movers is the second level of the Cambridge Young Learners English Tests. It is designed for children who have completed the Starters level and are ready to progress to a more advanced level of English.',
      targetAudience: 'Children aged 7-11 who have basic English skills',
      examFormat: 'Listening, Reading & Writing, Speaking',
      skillsCovered: ['Listening', 'Reading', 'Writing', 'Speaking'],
      benefits: [
        'Builds confidence in using English',
        'Develops practical communication skills',
        'Recognized internationally',
        'Fun and engaging learning experience'
      ]
    },
    'KET': {
      description: 'The Cambridge Key English Test (KET) is an elementary level qualification that demonstrates the ability to communicate in basic English in everyday situations.',
      targetAudience: 'Beginners who can understand and use basic English phrases',
      examFormat: 'Reading & Writing, Listening, Speaking',
      skillsCovered: ['Reading', 'Writing', 'Listening', 'Speaking'],
      benefits: [
        'Recognized by employers and universities',
        'Practical everyday English skills',
        'Foundation for higher level exams',
        'Internationally recognized certification'
      ]
    },
    'PET': {
      description: 'The Cambridge Preliminary English Test (PET) is an intermediate level qualification that shows you can use English for everyday purposes.',
      targetAudience: 'Intermediate learners who can handle everyday situations',
      examFormat: 'Reading & Writing, Listening, Speaking',
      skillsCovered: ['Reading', 'Writing', 'Listening', 'Speaking'],
      benefits: [
        'Real-world English skills',
        'Accepted by many employers',
        'Gateway to FCE',
        'Boosts career opportunities'
      ]
    },
    'FCE': {
      description: 'The Cambridge First Certificate in English (FCE) is an upper-intermediate level qualification that proves you have the language skills to live and work independently in an English-speaking country.',
      targetAudience: 'Upper-intermediate learners seeking university or professional opportunities',
      examFormat: 'Reading & Use of English, Writing, Listening, Speaking',
      skillsCovered: ['Reading', 'Writing', 'Listening', 'Speaking', 'Use of English'],
      benefits: [
        'Accepted by thousands of employers and universities',
        'Demonstrates advanced language skills',
        'Globally recognized',
        'Opens doors to international opportunities'
      ]
    },
    'CAE': {
      description: 'The Cambridge Advanced English (CAE) is a high-level qualification that shows you have the language skills that employers and universities are looking for.',
      targetAudience: 'Advanced learners aiming for professional or academic success',
      examFormat: 'Reading & Use of English, Writing, Listening, Speaking',
      skillsCovered: ['Reading', 'Writing', 'Listening', 'Speaking', 'Use of English'],
      benefits: [
        'Highly respected by employers worldwide',
        'Accepted by universities globally',
        'Demonstrates fluency and confidence',
        'Opens doors to international careers'
      ]
    }
  };

  // Get level badge color
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

  // Get level badge label
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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Programs</h1>
            <p className="text-lg text-primary-100 max-w-3xl mx-auto">
              Choose from our comprehensive range of Cambridge English preparation courses. 
              Each program is designed to help you achieve your English language goals.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Program Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program: Program) => {
              const details = programDetails[program.name] || {};
              const isExpanded = selectedProgram === program.id;
              
              return (
                <div
                  key={program.id}
                  className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'ring-2 ring-primary-500' : 'hover:shadow-md'
                  }`}
                >
                  {/* Program Card Header */}
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

                    {/* Program Code */}
                    <p className="text-sm text-gray-500 mt-2">Code: {program.name}</p>

                    {/* Program Details */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-primary-600" />
                        <span>{program.duration} months</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 text-primary-600" />
                        <span>৳{program.fee?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 mr-2 text-primary-600" />
                        <span>{details.examFormat || 'Cambridge Exam'}</span>
                      </div>
                    </div>

                    {/* Toggle Details Button */}
                    <button
                      onClick={() => setSelectedProgram(isExpanded ? null : program.id)}
                      className="mt-4 text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium"
                    >
                      {isExpanded ? 'Show Less' : 'Learn More'}
                      <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                      {/* Description */}
                      {details.description && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
                          <p className="text-sm text-gray-600">{details.description}</p>
                        </div>
                      )}

                      {/* Target Audience */}
                      {details.targetAudience && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Who is this for?</h4>
                          <p className="text-sm text-gray-600">{details.targetAudience}</p>
                        </div>
                      )}

                      {/* Skills Covered */}
                      {details.skillsCovered && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Skills Covered</h4>
                          <div className="flex flex-wrap gap-2">
                            {details.skillsCovered.map((skill: string) => (
                              <span key={skill} className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Benefits */}
                      {details.benefits && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Benefits</h4>
                          <ul className="space-y-1">
                            {details.benefits.map((benefit: string, index: number) => (
                              <li key={index} className="flex items-start text-sm text-gray-600">
                                <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* CTA Button */}
                      <Link
                        to="/contact"
                        className="inline-block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* No Programs Message */}
          {programs.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No Programs Available</h3>
              <p className="text-gray-500 mt-2">Please check back later for our program offerings.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Beyond the Syllabus?</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              We provide the highest quality Cambridge English preparation with proven results.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Cambridge Affiliated</h4>
              <p className="text-sm text-gray-600 mt-2">Official Cambridge preparation center with certified instructors.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Expert Teachers</h4>
              <p className="text-sm text-gray-600 mt-2">Experienced, Cambridge-certified teachers who care about your success.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Flexible Schedule</h4>
              <p className="text-sm text-gray-600 mt-2">Morning, afternoon, and evening batches to fit your schedule.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Contact us today to learn more about our programs and find the right course for you.
          </p>
          <Link
            to="/contact"
            className="px-8 py-3 bg-white text-primary-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Contact Us Now
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ProgramsPublicPage;