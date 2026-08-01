import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@components/layout/PublicLayout';
import {
  Clock,
  DollarSign,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Target,
  Users,
  Award
} from 'lucide-react';

// Hardcoded program data - NOT fetching from database anymore
interface HardcodedProgram {
  id: string;
  name: string;
  displayName: { en: string };
  duration: string;
  fee: number | null;
  level: string;
  cefr: string;
  description: string;
  image: string;
  link: string;
  color: string;
  gradient: string;
}

const HARDCODED_PROGRAMS: HardcodedProgram[] = [
  {
    id: 'movers',
    name: 'Movers',
    displayName: { en: 'Movers' },
    duration: '7-9',
    fee: null,
    level: 'Elementary',
    cefr: 'A1',
    description: 'Build confidence in English with fun, activity-based learning designed for young learners. Focus on basic communication skills and vocabulary development through interactive activities and games.',
    image: 'a1.png',
    link: 'https://www.cambridgeenglish.org/exams-and-tests/qualifications/young-learners/',
    color: '#10b981',
    gradient: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 'ket',
    name: 'KET',
    displayName: { en: 'KET' },
    duration: '7-9',
    fee: null,
    level: 'Elementary',
    cefr: 'A2',
    description: 'Develop practical English skills for everyday situations. KET certification demonstrates the ability to communicate in basic English in real-life contexts, preparing you for further study.',
    image: 'a2.png',
    link: 'https://www.cambridgeenglish.org/exams-and-tests/qualifications/key/format/',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'pet',
    name: 'PET',
    displayName: { en: 'PET' },
    duration: '7-9',
    fee: null,
    level: 'Intermediate',
    cefr: 'B1',
    description: 'Master intermediate English skills for work, study, and travel. PET certification shows you can handle everyday situations with confidence and communicate effectively in English.',
    image: 'b1.png',
    link: 'https://www.cambridgeenglish.org/exams-and-tests/qualifications/preliminary/format/',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-amber-600'
  },
  {
    id: 'fce',
    name: 'FCE',
    displayName: { en: 'FCE' },
    duration: '7-9',
    fee: null,
    level: 'Upper-Intermediate',
    cefr: 'B2',
    description: 'Achieve the most popular Cambridge qualification. FCE certification proves you have the language skills needed to live and work independently in an English-speaking country.',
    image: 'b2.png',
    link: 'https://www.cambridgeenglish.org/exams-and-tests/qualifications/first/format/',
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'cae',
    name: 'CAE',
    displayName: { en: 'CAE' },
    duration: '7-9',
    fee: null,
    level: 'Advanced',
    cefr: 'C1',
    description: 'Reach the highest level of Cambridge English. CAE certification is recognized by universities and employers worldwide as proof of advanced English proficiency.',
    image: 'c1.png',
    link: 'https://www.cambridgeenglish.org/exams-and-tests/qualifications/advanced/format/',
    color: '#ef4444',
    gradient: 'from-red-500 to-red-600'
  }
];

const ProgramsPublicPage: React.FC = () => {
  // Using hardcoded data - no API fetching
  const programs = HARDCODED_PROGRAMS;

  // Helper function to format fee
  const formatFee = (fee: number | null): string => {
    if (fee === null || fee === undefined) return 'Contact for pricing';
    return `৳${fee.toLocaleString()}`;
  };

  return (
    <PublicLayout>
      {/* Hero - No Image, Just Gradient */}
      <section className="relative overflow-hidden text-white pt-32 pb-16" style={{ 
        background: 'linear-gradient(115deg, rgba(14,18,53,0.97) 0%, rgba(20,26,74,0.92) 44%, rgba(28,37,100,0.8) 100%)'
      }}>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0f2a]/40 via-transparent to-[#0a0f2a]/60"></div>
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(241,89,42,0.08) 0%, transparent 60%)'
        }} />
        <div className="relative z-10 container-fluid text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-200 text-sm font-medium mb-4 backdrop-blur-sm border border-orange-500/10">
            <Sparkles className="w-4 h-4" />
            Cambridge English Programs
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-4">Our Programs</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Choose from our comprehensive range of Cambridge English preparation courses designed to take you from beginner to advanced.
          </p>
        </div>
      </section>

      {/* Programs List - One Below Another */}
      <section className="py-16 bg-gray-50">
        <div className="container-fluid">
          <div className="max-w-5xl mx-auto">
            {/* Program Cards - Hardcoded */}
            {programs.map((program) => {
              return (
                <div
                  key={program.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-200 overflow-hidden transition-all duration-500 mb-6 hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image Section - 1/3 width */}
                    <div className="md:w-1/3 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 min-h-[200px] md:min-h-[280px]">
                      <img 
                        src={program.image} 
                        alt={program.displayName?.en || program.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-black/40 md:via-transparent md:to-transparent"></div>
                      
                      {/* CEFR Badge on image */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900 shadow-lg border border-white/20">
                          <Target className="w-3.5 h-3.5" />
                          {program.cefr}
                        </span>
                      </div>
                      
                      {/* Level badge on image */}
                      <div className="absolute bottom-4 left-4 right-4 md:bottom-auto md:top-4 md:right-4 md:left-auto">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg bg-gradient-to-r ${program.gradient}`}>
                          <GraduationCap className="w-3.5 h-3.5" />
                          {program.level}
                        </span>
                      </div>

                      {/* Program Name Overlay on Image (Mobile) */}
                      <div className="absolute bottom-4 left-4 md:hidden">
                        <h3 className="text-xl font-bold text-white drop-shadow-lg">
                          {program.displayName?.en || program.name}
                        </h3>
                      </div>
                    </div>

                    {/* Content Section - 2/3 width */}
                    <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        {/* Desktop Title */}
                        <div className="hidden md:flex items-start justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 font-display">
                              {program.displayName?.en || program.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">Program Code: {program.name}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${program.gradient}`}>
                            <Award className="w-3.5 h-3.5" />
                            {program.cefr} Level
                          </span>
                        </div>

                        <p className="text-gray-600 mt-3 leading-relaxed">
                          {program.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 mt-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2 text-orange-500" />
                            <span>{program.duration} months</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2 text-orange-500" />
                            <span>{formatFee(program.fee)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2 text-orange-500" />
                            <span>Class size: 12-15</span>
                          </div>
                        </div>
                      </div>

                      {/* Learn More Button */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <a
                          href={program.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 group"
                        >
                          Learn More
                          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container-fluid">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full text-orange-600 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Why Choose Us
            </div>
            <h2 className="text-3xl font-bold text-gray-900 font-display">Why Choose Beyond the Syllabus?</h2>
            <p className="text-gray-500 mt-2">Join thousands of successful students who achieved their Cambridge goals with us</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                <GraduationCap className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-semibold text-gray-900">Expert Teachers</h3>
              <p className="text-sm text-gray-500 mt-1">Cambridge-certified instructors with years of experience</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                <BookOpen className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-semibold text-gray-900">Proven Curriculum</h3>
              <p className="text-sm text-gray-500 mt-1">Follow the official Cambridge English curriculum</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                <Users className="w-7 h-7 text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-semibold text-gray-900">Small Batches</h3>
              <p className="text-sm text-gray-500 mt-1">Personalized attention with class sizes of 12-15 students</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Matching Homepage Style */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(120deg, #f1592a, #df481c)' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[420px] h-[420px] rounded-full bg-white/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative z-10 container-fluid max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            Contact us today to learn more about our programs and find the right course for you.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-bold rounded-full hover:bg-gray-100 hover:-translate-y-0.5 shadow-lg transition-all duration-300">
            Contact Us Now
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ProgramsPublicPage;