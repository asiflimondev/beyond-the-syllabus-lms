import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@components/layout/PublicLayout';
import {
  Users,
  BookOpen,
  Target,
  Eye,
  Heart,
  Trophy,
  Sparkles,
  ChevronRight,
  Award,
  Calendar,
  GraduationCap,
  Star,
  Clock,
  Shield
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const missionVision = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To provide high-quality Cambridge English preparation and empower students to achieve their language goals through appropriate teaching methods and personalized support.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To be the leading Cambridge English preparation centre in Bangladesh, recognized for excellence in teaching and student success.',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'We believe in excellence, integrity, innovation, and student-centred learning. We are committed to helping every student reach their full potential.',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const stats = [
    { number: '5+', label: 'Cambridge Programmes', icon: BookOpen, bg: 'bg-blue-50', text: 'text-blue-600' },
    { number: '3000+', label: 'Students Completed Courses', icon: GraduationCap, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { number: 'Since 2009', label: 'Years of Excellence', icon: Calendar, bg: 'bg-orange-50', text: 'text-orange-600' },
    { number: '95%', label: 'Success Rate', icon: Trophy, bg: 'bg-purple-50', text: 'text-purple-600' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Official Cambridge Partner',
      description: 'An accredited preparation centre following the Cambridge curriculum end to end.'
    },
    {
      icon: Users,
      title: 'Expert Cambridge-Certified Faculty',
      description: 'Experienced teachers who go beyond exam tricks toward genuine fluency.'
    },
    {
      icon: Clock,
      title: 'Flexible Schedules',
      description: 'Morning, afternoon and evening batches, timed to fit school, work and family.'
    },
    {
      icon: Star,
      title: 'Proven Track Record',
      description: '95% success rate with students achieving their target Cambridge scores.'
    }
  ];

  return (
    <PublicLayout>
      {/* Hero - Matching Homepage Style */}
      <section className="relative overflow-hidden text-white pt-32 pb-16" style={{ 
        background: 'linear-gradient(115deg, rgba(14,18,53,0.97) 0%, rgba(20,26,74,0.92) 44%, rgba(28,37,100,0.8) 100%)'
      }}>
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1900&q=80" 
            alt="About us" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(241,89,42,0.08) 0%, transparent 60%)'
        }} />
        <div className="relative z-10 container-fluid text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-200 text-sm font-medium mb-4 backdrop-blur-sm border border-orange-500/10">
            <Sparkles className="w-4 h-4" />
            About Us
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">About Beyond the Syllabus</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Dedicated to excellence in English language education, we help students achieve their Cambridge English Qualifications and materialize their dreams.
          </p>
        </div>
      </section>

      {/* Stats - Enhanced UI */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container-fluid">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group p-6 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-7 h-7 ${stat.text}`} />
                </div>
                <p className="text-3xl font-bold text-gray-900 font-display">{stat.number}</p>
                <p className="text-sm text-gray-600 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Vision Values - Enhanced UI */}
      <section className="py-16 bg-gray-50">
        <div className="container-fluid">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-600 text-sm font-medium mb-4">
              Our Core
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">Our Mission, Vision & Values</h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
              Everything we do is guided by our commitment to student's excellence success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {missionVision.map((item, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl border border-gray-200 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-display">{item.title}</h3>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced with more boxes */}
      <section className="py-16 bg-white">
        <div className="container-fluid">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full text-orange-600 text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              Why Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">Why Choose Beyond the Syllabus?</h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
              Here's what sets us apart as a leading Cambridge English preparation centre.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-orange-200"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Matching Homepage Style */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(120deg, #f1592a, #df481c)' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[420px] h-[420px] rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="relative z-10 container-fluid max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">Start Your English Journey Today</h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            Join Beyond the Syllabus and discover the path to achieving your Cambridge English Qualifications.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/programs" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-bold rounded-full hover:bg-gray-100 hover:-translate-y-0.5 shadow-lg transition-all duration-300">
              Explore Programmes
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/60 text-white font-bold rounded-full hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default AboutPage;