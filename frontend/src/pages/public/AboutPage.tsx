import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@components/layout/PublicLayout';
import {
  Award,
  Users,
  BookOpen,
  Target,
  Eye,
  Heart,
  Lightbulb,
  GraduationCap,
  Globe,
  CheckCircle,
  ArrowRight,
  Clock,
  Calendar,
  Star,
  Trophy,
  UserCheck
} from 'lucide-react';

const AboutPage: React.FC = () => {
  // Mission, Vision, Values data
  const missionVision = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To provide high-quality Cambridge English preparation and empower students to achieve their language goals through innovative teaching methods and personalized support.'
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To be the leading Cambridge English preparation center in Bangladesh, recognized for excellence in teaching and student success.'
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'We believe in excellence, integrity, innovation, and student-centered learning. We are committed to helping every student reach their full potential.'
    }
  ];

  // Why Choose Us data
  const whyChooseUs = [
    {
      icon: Award,
      title: 'Cambridge Affiliated',
      description: 'Official Cambridge Assessment English preparation center with certified instructors.'
    },
    {
      icon: Users,
      title: 'Expert Teachers',
      description: 'Highly qualified, experienced, and passionate teachers dedicated to student success.'
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Curriculum',
      description: 'Structured programs covering all aspects of the Cambridge English exams.'
    },
    {
      icon: Target,
      title: 'Proven Results',
      description: 'Consistently high success rates with students achieving their target scores.'
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Morning, afternoon, and evening batches to accommodate your schedule.'
    },
    {
      icon: Globe,
      title: 'Global Recognition',
      description: 'Cambridge qualifications are recognized by employers and universities worldwide.'
    }
  ];

  // Stats data
  const stats = [
    { number: '5+', label: 'Programs Offered', icon: BookOpen },
    { number: '100+', label: 'Students Enrolled', icon: Users },
    { number: '10+', label: 'Expert Teachers', icon: UserCheck },
    { number: '95%', label: 'Success Rate', icon: Trophy },
  ];

  // Team members data
  const teamMembers = [
    {
      name: 'Dr. Sarah Rahman',
      role: 'Academic Director',
      qualification: 'PhD in Applied Linguistics, Cambridge Certified Trainer',
      experience: '15+ years of teaching experience',
      image: 'https://ui-avatars.com/api/?name=Sarah+Rahman&size=150&background=0ea5e9&color=fff&font-size=0.5'
    },
    {
      name: 'James Anderson',
      role: 'Senior IELTS/Cambridge Instructor',
      qualification: 'CELTA Certified, MA in TESOL',
      experience: '10+ years of teaching experience',
      image: 'https://ui-avatars.com/api/?name=James+Anderson&size=150&background=0ea5e9&color=fff&font-size=0.5'
    },
    {
      name: 'Nadia Hossain',
      role: 'Cambridge Program Coordinator',
      qualification: 'Cambridge Certified Trainer, BA in English Literature',
      experience: '8+ years of teaching experience',
      image: 'https://ui-avatars.com/api/?name=Nadia+Hossain&size=150&background=0ea5e9&color=fff&font-size=0.5'
    },
    {
      name: 'Michael Chowdhury',
      role: 'Senior English Instructor',
      qualification: 'MA in English, Cambridge Certified Trainer',
      experience: '12+ years of teaching experience',
      image: 'https://ui-avatars.com/api/?name=Michael+Chowdhury&size=150&background=0ea5e9&color=fff&font-size=0.5'
    }
  ];

  // Timeline data
  const timeline = [
    {
      year: '2018',
      title: 'Founded',
      description: 'Beyond the Syllabus was founded with a vision to provide world-class English language training.'
    },
    {
      year: '2019',
      title: 'Cambridge Affiliation',
      description: 'Became an official Cambridge Assessment English preparation center.'
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Launched online learning platform and expanded our reach.'
    },
    {
      year: '2021',
      title: 'Growth & Expansion',
      description: 'Expanded our program offerings and welcomed over 100 students.'
    },
    {
      year: '2022',
      title: 'Excellence Recognition',
      description: 'Recognized for our exceptional success rates and student satisfaction.'
    },
    {
      year: '2023',
      title: 'New Heights',
      description: 'Continued to grow and innovate, helping more students achieve their dreams.'
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Beyond the Syllabus</h1>
            <p className="text-lg text-primary-100 max-w-3xl mx-auto">
              Dedicated to excellence in English language education, we help students achieve their Cambridge English qualifications and realize their dreams.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.number}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Beyond the Syllabus was founded with a simple yet powerful mission: to provide exceptional English language education that goes beyond traditional teaching methods. We recognized that students needed more than just textbooks and memorization – they needed comprehensive preparation that builds confidence and real communication skills.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                As an official Cambridge Assessment English preparation center, we offer structured programs that follow the internationally recognized Cambridge curriculum. Our approach combines proven teaching methodologies with innovative techniques to ensure every student reaches their full potential.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From Movers to Cambridge Advanced English (CAE), we guide students through every level of their English language journey, preparing them not just for exams, but for success in their academic and professional lives.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to="/programs"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700"
                >
                  Explore Our Programs <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Why We Stand Out</h3>
              <div className="space-y-4">
                {whyChooseUs.slice(0, 4).map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Mission, Vision & Values</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Everything we do is guided by our commitment to excellence and student success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {missionVision.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center mb-4">
                  <item.icon className="w-12 h-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Full Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Discover what makes Beyond the Syllabus the preferred choice for Cambridge English preparation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center mb-4">
                  <item.icon className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center">{item.title}</h3>
                <p className="text-sm text-gray-600 text-center mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our experienced and passionate teachers are here to guide you on your English language journey.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                <p className="text-sm text-primary-600 font-medium">{member.role}</p>
                <p className="text-xs text-gray-500 mt-1">{member.qualification}</p>
                <p className="text-xs text-gray-500">{member.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              A timeline of our growth and achievements since our founding.
            </p>
          </div>
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary-200"></div>

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 text-right' : 'md:pl-8 text-left'}`}>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <span className="text-primary-600 font-bold">{item.year}</span>
                      <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:w-12">
                    <div className="w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-sm"></div>
                  </div>
                  <div className="md:w-1/2 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your English Journey Today</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join Beyond the Syllabus and discover the path to achieving your Cambridge English qualification.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/programs"
              className="px-8 py-3 bg-white text-primary-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Explore Programs
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default AboutPage;