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
  UserCheck,
  Sparkles,
  ChevronRight
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
        <div className="relative z-10 container-fluid text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-200 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            About Us
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">About Beyond the Syllabus</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Dedicated to excellence in English language education, we help students achieve their Cambridge English qualifications and realize their dreams.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container-fluid">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex items-center justify-center mb-3">
                  <stat.icon className="w-8 h-8 text-primary-600 group-hover:text-orange-500 transition-colors" />
                </div>
                <p className="text-3xl font-bold text-gray-900 font-display">{stat.number}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="py-16 bg-gray-50">
        <div className="container-fluid">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-600 text-sm font-medium mb-4">
              Our Core
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">Our Mission, Vision & Values</h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
              Everything we do is guided by our commitment to excellence and student success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {missionVision.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                    <item.icon className="w-7 h-7" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-display">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Matching Homepage Style */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(120deg, #f1592a, #df481c)' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="relative z-10 container-fluid max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">Start Your English Journey Today</h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            Join Beyond the Syllabus and discover the path to achieving your Cambridge English qualification.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/programs" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-bold rounded-full hover:bg-gray-100 hover:-translate-y-0.5 shadow-lg transition-all duration-300">
              Explore Programs
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