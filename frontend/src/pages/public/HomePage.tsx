import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Users, 
  BookOpen, 
  Star, 
  ArrowRight,
  GraduationCap,
  Clock,
  DollarSign
} from 'lucide-react';
import PublicLayout from '@components/layout/PublicLayout';

const HomePage: React.FC = () => {
  // Mock data - will be replaced with API calls later
  const programs = [
    { id: 1, name: 'Movers', duration: '7 months', fee: '12,000 BDT' },
    { id: 2, name: 'KET', duration: '7 months', fee: '15,000 BDT' },
    { id: 3, name: 'PET', duration: '8 months', fee: '18,000 BDT' },
    { id: 4, name: 'FCE', duration: '9 months', fee: '22,000 BDT' },
    { id: 5, name: 'CAE', duration: '9 months', fee: '25,000 BDT' },
  ];

  const successStories = [
    {
      id: 1,
      name: 'Sarah Ahmed',
      score: 'Overall Band 8.0',
      university: 'University of Cambridge, UK',
      testimonial: 'Beyond the Syllabus helped me achieve my dream of studying at Cambridge. The teachers are exceptional!',
    },
    {
      id: 2,
      name: 'Rafi Hasan',
      score: 'Overall Band 7.5',
      university: 'University of Melbourne, Australia',
      testimonial: 'The preparation I received was outstanding. I felt confident and prepared for the exam.',
    },
  ];

  const facilities = [
    { icon: BookOpen, title: 'Modern Classrooms', description: 'Spacious, air-conditioned classrooms with smart boards' },
    { icon: Users, title: 'Experienced Teachers', description: 'Qualified Cambridge-certified instructors' },
    { icon: Award, title: 'Cambridge Affiliated', description: 'Official Cambridge preparation center' },
    { icon: Clock, title: 'Flexible Schedule', description: 'Morning, afternoon, and evening batches' },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Your Path to English Excellence
              </h1>
              <p className="text-lg text-primary-100 mb-8">
                Cambridge English Language Training Center dedicated to helping students achieve their English language goals and prepare for Cambridge examinations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/programs"
                  className="px-6 py-3 bg-white text-primary-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Explore Programs
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 rounded-lg p-8 backdrop-blur-sm">
                <GraduationCap className="w-20 h-20 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-center mb-2">Cambridge Preparation Center</h3>
                <p className="text-center text-primary-100">Affiliated with Cambridge Assessment English</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">About Beyond the Syllabus</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              We are a premier English language training center with a focus on Cambridge exam preparation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 leading-relaxed">
                Beyond the Syllabus is a dedicated English language training center affiliated with Cambridge Assessment English. 
                We offer comprehensive preparation courses for Cambridge English Qualifications, including Movers, KET, PET, FCE, and CAE.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary-600">5+</p>
                  <p className="text-sm text-gray-600">Programs</p>
                </div>
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary-600">100+</p>
                  <p className="text-sm text-gray-600">Students</p>
                </div>
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary-600">10+</p>
                  <p className="text-sm text-gray-600">Teachers</p>
                </div>
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary-600">95%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {facilities.map((facility, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                  <facility.icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 text-sm">{facility.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{facility.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Programs</h2>
            <p className="text-gray-600 mt-4">Choose from our range of Cambridge English preparation courses</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div key={program.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-primary-600" />
                    <span>Duration: {program.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-primary-600" />
                    <span>Fee: {program.fee}</span>
                  </div>
                </div>
                <Link
                  to={`/programs/${program.id}`}
                  className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/programs"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              View All Programs <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Success Stories</h2>
            <p className="text-gray-600 mt-4">Hear from our students who achieved their goals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {successStories.map((story) => (
              <div key={story.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-lg">
                        {story.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600 italic">"{story.testimonial}"</p>
                    <div className="mt-2">
                      <p className="font-semibold text-gray-900">{story.name}</p>
                      <p className="text-sm text-primary-600">{story.score}</p>
                      <p className="text-sm text-gray-500">{story.university}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-4">Find answers to common questions about our programs</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">What Cambridge exams do you prepare for?</h4>
              <p className="text-gray-600 text-sm mt-1">We prepare students for Movers, KET, PET, FCE, and CAE exams.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">How long are the programs?</h4>
              <p className="text-gray-600 text-sm mt-1">Most programs run for 7-9 months, depending on the level.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">When do classes start?</h4>
              <p className="text-gray-600 text-sm mt-1">New batches start throughout the year. Contact us for upcoming dates.</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              to="/faq"
              className="text-primary-600 hover:text-primary-700"
            >
              View All FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Contact us today to learn more about our programs and enroll in the right course for you.
          </p>
          <Link
            to="/contact"
            className="px-8 py-3 bg-white text-primary-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;