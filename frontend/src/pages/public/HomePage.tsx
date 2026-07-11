import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Users, 
  BookOpen, 
  ArrowRight,
  Clock,
  PlayCircle,
  Sparkles,
  PenTool,
  Mic,
  ClipboardList,
  Users as UsersIcon,
  Building
} from 'lucide-react';
import PublicLayout from '@components/layout/PublicLayout';
import { useScrollAnimation } from '@hooks/useScrollAnimation';
import Testimonials from '@components/Testimonials';
import ScrollProgress from '@components/ScrollProgress';
import ProgramCard from '@components/ProgramCard';

const AnimatedSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const HomePage: React.FC = () => {
  // ✅ REAL SERVICES - Updated with illustrations and accent colors
  const services = [
    {
      id: 1,
      title: 'Cambridge Assessment Standard Level Teaching',
      description: 'We follow the official Cambridge Assessment English curriculum with standardized teaching methods that ensure consistent, high-quality learning outcomes for every student.',
      icon: Award,
      bgColor: 'bg-white',
      accentColor: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-100 text-blue-600',
      illustration: '📚',
    },
    {
      id: 2,
      title: 'Interactive Speaking & Presentation Sessions',
      description: 'Build confidence through regular speaking practice and presentation opportunities. Our interactive sessions help you develop fluency, pronunciation, and presentation skills for real-world communication.',
      icon: Mic,
      bgColor: 'bg-gray-50/80',
      accentColor: 'from-purple-500 to-violet-500',
      iconBg: 'bg-purple-100 text-purple-600',
      illustration: '🎤',
    },
    {
      id: 3,
      title: 'Academic & Creative Writing Development',
      description: 'Master the art of writing with our comprehensive program covering academic essays, creative writing, and exam-focused composition. Develop your unique voice while meeting Cambridge standards.',
      icon: PenTool,
      bgColor: 'bg-white',
      accentColor: 'from-emerald-500 to-teal-500',
      iconBg: 'bg-green-100 text-green-600',
      illustration: '✍️',
    },
    {
      id: 4,
      title: 'Regular Mock Tests and Progress Reports',
      description: 'Track your improvement with regular mock tests that simulate the actual Cambridge exam experience. Receive detailed progress reports with personalized feedback and improvement strategies.',
      icon: ClipboardList,
      bgColor: 'bg-gray-50/80',
      accentColor: 'from-orange-500 to-amber-500',
      iconBg: 'bg-orange-100 text-orange-600',
      illustration: '📊',
    },
    {
      id: 5,
      title: 'Experienced Cambridge English Trainers',
      description: 'Learn from certified Cambridge English trainers with years of experience. Our expert instructors bring real exam knowledge and proven teaching methodologies to every session.',
      icon: Users,
      bgColor: 'bg-white',
      accentColor: 'from-cyan-500 to-sky-500',
      iconBg: 'bg-cyan-100 text-cyan-600',
      illustration: '👨‍🏫',
    },
    {
      id: 6,
      title: 'Small Batch for Individual Attention',
      description: 'Enjoy the benefits of small class sizes with a maximum of 8-10 students per batch. This ensures personalized attention, active participation, and focused learning for every student.',
      icon: UsersIcon,
      bgColor: 'bg-gray-50/80',
      accentColor: 'from-pink-500 to-rose-500',
      iconBg: 'bg-pink-100 text-pink-600',
      illustration: '👥',
    },
    {
      id: 7,
      title: 'International University Admission & Foundation Support',
      description: 'Get expert guidance for international university applications. From university selection to application preparation and visa assistance, we support your journey to global education.',
      icon: Building,
      bgColor: 'bg-white',
      accentColor: 'from-indigo-500 to-purple-500',
      iconBg: 'bg-indigo-100 text-indigo-600',
      illustration: '🌍',
    },
  ];

  const quickServices = [
    { icon: Award, label: 'Cambridge Assessment', color: 'bg-blue-100 text-blue-600' },
    { icon: Mic, label: 'Speaking Sessions', color: 'bg-purple-100 text-purple-600' },
    { icon: PenTool, label: 'Writing Development', color: 'bg-green-100 text-green-600' },
    { icon: ClipboardList, label: 'Mock Tests', color: 'bg-orange-100 text-orange-600' },
    { icon: Users, label: 'Expert Trainers', color: 'bg-cyan-100 text-cyan-600' },
    { icon: UsersIcon, label: 'Small Batches', color: 'bg-pink-100 text-pink-600' },
    { icon: Building, label: 'University Support', color: 'bg-indigo-100 text-indigo-600' },
  ];

  const programs = [
    { 
      id: 1, 
      name: 'Movers', 
      level: 'Elementary', 
      duration: '7 months', 
      fee: '12,000 BDT', 
      icon: '🌟', 
      color: 'from-green-400 to-emerald-500',
      description: 'Cambridge Movers is the second level of the Cambridge Young Learners English Tests, designed for children with basic English skills.'
    },
    { 
      id: 2, 
      name: 'KET', 
      level: 'Elementary', 
      duration: '7 months', 
      fee: '15,000 BDT', 
      icon: '📘', 
      color: 'from-blue-400 to-cyan-500',
      description: 'The Cambridge Key English Test (KET) is an elementary level qualification that demonstrates the ability to communicate in basic English.'
    },
    { 
      id: 3, 
      name: 'PET', 
      level: 'Intermediate', 
      duration: '8 months', 
      fee: '18,000 BDT', 
      icon: '📗', 
      color: 'from-purple-400 to-violet-500',
      description: 'The Cambridge Preliminary English Test (PET) is an intermediate level qualification for everyday English communication.'
    },
    { 
      id: 4, 
      name: 'FCE', 
      level: 'Upper-Intermediate', 
      duration: '9 months', 
      fee: '22,000 BDT', 
      icon: '📕', 
      color: 'from-orange-400 to-red-500',
      description: 'The Cambridge First Certificate in English (FCE) is an upper-intermediate qualification for living and working independently.'
    },
    { 
      id: 5, 
      name: 'CAE', 
      level: 'Advanced', 
      duration: '9 months', 
      fee: '25,000 BDT', 
      icon: '🎯', 
      color: 'from-pink-400 to-rose-500',
      description: 'Cambridge Advanced English (CAE) is a high-level qualification showing language skills that employers and universities are looking for.'
    },
  ];

  const facilities = [
    { icon: BookOpen, title: 'Modern Classrooms', description: 'Smart classrooms with interactive technology' },
    { icon: Users, title: 'Expert Teachers', description: 'Cambridge-certified experienced instructors' },
    { icon: Award, title: 'Cambridge Affiliated', description: 'Official Cambridge preparation center' },
    { icon: Clock, title: 'Flexible Schedule', description: 'Morning, afternoon & evening batches' },
  ];

  // ✅ UPDATED: Image always on LEFT, content on RIGHT, no buttons
  const renderService = (service: typeof services[0]) => {
    const Icon = service.icon;

    return (
      <AnimatedSection key={service.id} delay={100}>
        <div className={`py-20 lg:py-28 ${service.bgColor}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Illustration/Image Side - Always LEFT */}
              <div className="flex justify-center lg:justify-center">
                <div className="w-full max-w-sm">
                  <div className={`bg-gradient-to-br ${service.accentColor} bg-opacity-10 rounded-3xl p-8 border-2 shadow-xl`}>
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-6xl lg:text-7xl mb-4">
                        {service.illustration}
                      </div>
                      <div className={`w-16 h-16 rounded-full ${service.iconBg} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Side - Always RIGHT */}
              <div className="space-y-6">
                {/* Colorful Rounded Heading Bar */}
                <div className={`inline-block bg-gradient-to-r ${service.accentColor} px-6 py-3 rounded-2xl shadow-lg`}>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    {service.title}
                  </h3>
                </div>

                <p className="text-gray-600 text-base lg:text-lg leading-relaxed max-w-lg">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    );
  };

  return (
    <PublicLayout>
      <ScrollProgress />

      {/* ==========================================
          HERO SECTION
          ========================================== */}
      <AnimatedSection>
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
                Cambridge English Preparation Center
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Your Path to{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  English Excellence
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-primary-100 leading-relaxed max-w-2xl mx-auto mt-6">
                Join Bangladesh's premier Cambridge English training center and achieve your dream scores with expert guidance.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-10">
                <Link
                  to="/programs"
                  className="inline-flex items-center px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                >
                  Explore Programs
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ==========================================
          PROGRAMS SECTION
          ========================================== */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-4">
                Programs
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Our Programs
              </h2>
              <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                Choose from our comprehensive range of Cambridge English preparation courses
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-6">
            {programs.map((program, index) => (
              <AnimatedSection key={program.id} delay={index * 100}>
                <ProgramCard {...program} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          UNIQUE SERVICES SECTION - WITH BIGGER CARDS
          ========================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Our Exclusive Services
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Comprehensive Learning Experience
              </h2>
              <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                Everything you need to succeed in your Cambridge English journey, all in one place
              </p>
            </div>
          </AnimatedSection>

          {/* BIGGER Quick Services Cards */}
          <AnimatedSection delay={100}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
              {quickServices.map((service, index) => (
                <div key={index} className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:border-primary-200 hover:-translate-y-1">
                  <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-8 h-8" />
                  </div>
                  <span className="text-sm text-center text-gray-700 font-semibold leading-tight">{service.label}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ==========================================
          SERVICES LIST - IMAGE LEFT, CONTENT RIGHT
          ========================================== */}
      {services.map((service) => renderService(service))}

      {/* ==========================================
          TESTIMONIALS SECTION
          ========================================== */}
      <Testimonials />

      {/* ==========================================
          WHY CHOOSE US
          ========================================== */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-4">
                Why Choose Us
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Why Choose Us
              </h2>
              <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                We provide the highest quality Cambridge English preparation with proven results
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="group p-6 bg-white rounded-2xl hover:bg-primary-50 transition-all duration-300 hover:shadow-md text-center hover:-translate-y-1">
                  <div className="w-12 h-12 mx-auto bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                    <facility.icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{facility.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{facility.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          CTA SECTION
          ========================================== */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Join Beyond the Syllabus today and discover the path to achieving your Cambridge English qualification.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/programs"
                className="px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Explore Programs
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm hover:-translate-y-0.5"
              >
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;