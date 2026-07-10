import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@components/layout/PublicLayout';
import AnimatedSection from '@components/AnimatedSection';
import {
  Users,
  BookOpen,
  Target,
  Eye,
  Heart,
  Trophy,
  UserCheck
} from 'lucide-react';

const AboutPage: React.FC = () => {
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

  const stats = [
    { number: '5+', label: 'Programs Offered', icon: BookOpen },
    { number: '100+', label: 'Students Enrolled', icon: Users },
    { number: '10+', label: 'Expert Teachers', icon: UserCheck },
    { number: '95%', label: 'Success Rate', icon: Trophy },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <AnimatedSection>
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Beyond the Syllabus</h1>
            <p className="text-lg text-primary-100 max-w-3xl mx-auto">
              Dedicated to excellence in English language education, we help students achieve their Cambridge English qualifications and realize their dreams.
            </p>
          </div>
        </section>
      </AnimatedSection>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <stat.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stat.number}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Our Mission, Vision & Values</h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                Everything we do is guided by our commitment to excellence and student success.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {missionVision.map((item, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center mb-4">
                    <item.icon className="w-12 h-12 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-4">Start Your English Journey Today</h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Join Beyond the Syllabus and discover the path to achieving your Cambridge English qualification.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/programs" className="px-8 py-3 bg-white text-primary-700 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                Explore Programs
              </Link>
              <Link to="/contact" className="px-8 py-3 border border-white text-white rounded-xl font-medium hover:bg-white/10 transition-colors">
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PublicLayout>
  );
};

export default AboutPage;