import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Users, 
  BookOpen, 
  ArrowRight,
  Clock,
  DollarSign,
  PlayCircle,
  Sparkles,
  Video,
  FileText,
  Repeat,
  Book,
  Calendar,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import PublicLayout from '@components/layout/PublicLayout';

const HomePage: React.FC = () => {

  const services = [
    {
      id: 1,
      title: 'Live Interactive Classes',
      illustrationText: 'Join our expert Cambridge-certified instructors in live, interactive sessions. Ask questions in real-time and get immediate feedback.',
      writingText: 'Experience the energy of a real classroom from anywhere in the world. Participate in dynamic discussions, collaborate with peers, and get personalized attention from your instructors.',
      features: [
        'Cambridge-certified instructors with years of experience',
        'Real-time Q&A with dedicated teaching assistants',
        'Interactive whiteboard, screen sharing, and polls',
        'Full session recordings available for review'
      ],
      icon: Video,
      imagePosition: 'left',
      bgColor: 'bg-white',
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      id: 2,
      title: 'Premium PDF Study Materials',
      illustrationText: 'Access comprehensive, structured PDF notes for every module. Download and study offline at your convenience.',
      writingText: 'Master every topic with our meticulously crafted study guides. Each module is designed to simplify complex concepts and reinforce your understanding through practical examples.',
      features: [
        'Comprehensive module-wise notes and summaries',
        'Past exam papers with detailed answer explanations',
        'Model test booklets for final preparation',
        'Exclusive practice materials not available elsewhere'
      ],
      icon: FileText,
      imagePosition: 'right',
      bgColor: 'bg-gray-50/80',
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      id: 3,
      title: 'Unlimited Video Replays',
      illustrationText: 'Never miss a class! All live sessions are recorded and stored in your personal dashboard. Watch anytime, anywhere.',
      writingText: 'Take control of your learning with on-demand access to every lesson. Review challenging topics as many times as you need, and study at your own pace.',
      features: [
        'Unlimited access to all recorded sessions',
        'Watch on any device — mobile, tablet, or desktop',
        'Pause, rewind, and replay at your own pace',
        'Ideal for revision and exam preparation'
      ],
      icon: Repeat,
      imagePosition: 'left',
      bgColor: 'bg-white',
      iconBg: 'bg-purple-100 text-purple-600',
    },
    {
      id: 4,
      title: 'Premium Printed Books',
      illustrationText: 'Get professionally crafted printed books designed for Cambridge exam preparation. Comprehensive, structured, and exam-focused.',
      writingText: 'Transform your learning experience with high-quality printed resources that complement your digital studies. Our books are designed to be your ultimate exam companion.',
      features: [
        'Subject-wise preparation books with clear explanations',
        'Past question banks with step-by-step solutions',
        'Model test books for final exam simulation',
        'Detailed map books with essential facts and figures'
      ],
      icon: Book,
      imagePosition: 'right',
      bgColor: 'bg-gray-50/80',
      iconBg: 'bg-orange-100 text-orange-600',
    },
    {
      id: 5,
      title: 'Daily Online Exams',
      illustrationText: 'Practice daily with timed mock exams. Get instant results, detailed analysis, and track your progress over time.',
      writingText: 'Build exam confidence through consistent practice. Our daily assessments help you identify your strengths, work on your weaknesses, and develop effective time management skills.',
      features: [
        'Daily MCQ practice exams with instant feedback',
        'Written exam practice — a unique feature in Bangladesh',
        'Time-based challenges to build exam stamina',
        'Detailed score breakdown and performance trends'
      ],
      icon: Calendar,
      imagePosition: 'left',
      bgColor: 'bg-white',
      iconBg: 'bg-pink-100 text-pink-600',
    },
    {
      id: 6,
      title: '24/7 Q&A Support',
      illustrationText: 'Get your questions answered anytime. Our dedicated support team and expert teachers are always ready to help you.',
      writingText: 'Never get stuck on a problem again. Our responsive support system ensures you always have access to expert guidance, keeping your learning journey smooth and uninterrupted.',
      features: [
        'Dedicated teacher support for every subject',
        '24/7 Q&A platform with quick response times',
        'Community discussion forums for peer learning',
        'One-on-one doubt-clearing sessions available'
      ],
      icon: MessageSquare,
      imagePosition: 'right',
      bgColor: 'bg-gray-50/80',
      iconBg: 'bg-cyan-100 text-cyan-600',
    },
  ];

  const quickServices = [
    { icon: Video, label: 'Live Classes', color: 'bg-blue-100 text-blue-600' },
    { icon: FileText, label: 'PDF Notes', color: 'bg-green-100 text-green-600' },
    { icon: Repeat, label: 'Video Replays', color: 'bg-purple-100 text-purple-600' },
    { icon: Book, label: 'Printed Books', color: 'bg-orange-100 text-orange-600' },
    { icon: Calendar, label: 'Daily Exams', color: 'bg-pink-100 text-pink-600' },
    { icon: MessageSquare, label: 'Q&A Support', color: 'bg-cyan-100 text-cyan-600' },
  ];

  const programs = [
    { id: 1, name: 'Movers', level: 'Elementary', duration: '7 months', fee: '12,000 BDT', icon: '🌟', color: 'from-green-400 to-emerald-500' },
    { id: 2, name: 'KET', level: 'Elementary', duration: '7 months', fee: '15,000 BDT', icon: '📘', color: 'from-blue-400 to-cyan-500' },
    { id: 3, name: 'PET', level: 'Intermediate', duration: '8 months', fee: '18,000 BDT', icon: '📗', color: 'from-purple-400 to-violet-500' },
    { id: 4, name: 'FCE', level: 'Upper-Intermediate', duration: '9 months', fee: '22,000 BDT', icon: '📕', color: 'from-orange-400 to-red-500' },
    { id: 5, name: 'CAE', level: 'Advanced', duration: '9 months', fee: '25,000 BDT', icon: '🎯', color: 'from-pink-400 to-rose-500' },
  ];

  const facilities = [
    { icon: BookOpen, title: 'Modern Classrooms', description: 'Smart classrooms with interactive technology' },
    { icon: Users, title: 'Expert Teachers', description: 'Cambridge-certified experienced instructors' },
    { icon: Award, title: 'Cambridge Affiliated', description: 'Official Cambridge preparation center' },
    { icon: Clock, title: 'Flexible Schedule', description: 'Morning, afternoon & evening batches' },
  ];

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  const renderService = (service: typeof services[0]) => {
    const isLeft = service.imagePosition === 'left';
    const Icon = service.icon;

    return (
      <div key={service.id} className={`py-16 lg:py-20 ${service.bgColor} animate-fade-in`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className={`${isLeft ? 'order-1' : 'order-2'} flex justify-center`}>
              <div className="w-full max-w-md transform transition-all duration-500 hover:scale-105">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className={`w-16 h-16 rounded-2xl ${service.iconBg} flex items-center justify-center mb-5`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {service.illustrationText}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-700 border border-gray-100 transition-all duration-300 hover:bg-primary-50 hover:border-primary-200">
                        <CheckCircle className="w-3.5 h-3.5 text-primary-500" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`${isLeft ? 'order-2' : 'order-1'} space-y-5 animate-slide-up`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${service.iconBg} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-primary-600">Service</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-base">
                {service.writingText}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PublicLayout>
      {/* ==========================================
          HERO SECTION - CLEAN, NO STATS
          ========================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
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

      {/* ==========================================
          STATISTICS SECTION - REMOVED, KEPT CLEAN
          ========================================== */}
      {/* Removed the statistics section */}

      {/* ==========================================
          PROGRAMS SECTION
          ========================================== */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Programs</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Choose from our comprehensive range of Cambridge English preparation courses
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${program.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {program.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                <p className="text-sm text-gray-500">{program.level}</p>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-600" />
                    <span>Duration: {program.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary-600" />
                    <span>Fee: {program.fee}</span>
                  </div>
                </div>
                <Link
                  to="/programs"
                  className="mt-4 inline-flex items-center text-primary-600 font-medium hover:text-primary-700 group"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          UNIQUE SERVICES SECTION
          ========================================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-14 animate-fade-in">
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

          {/* Quick Service Icons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10"> {/* ✅ Reduced margin from mb-16 to mb-10 */}
            {quickServices.map((service, index) => (
              <div key={index} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 group hover:border-primary-200 hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <span className="text-xs text-center text-gray-600 font-medium leading-tight">{service.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services List */}
      {services.map((service) => renderService(service))}

      {/* ==========================================
          WHY CHOOSE US
          ========================================== */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              We provide the highest quality Cambridge English preparation with proven results
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility, index) => (
              <div
                key={index}
                className="group p-6 bg-white rounded-2xl hover:bg-primary-50 transition-all duration-300 hover:shadow-md text-center hover:-translate-y-1"
              >
                <div className="w-12 h-12 mx-auto bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                  <facility.icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-gray-900">{facility.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{facility.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          CTA SECTION
          ========================================== */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ready to Start Your Journey?</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Join Beyond the Syllabus today and discover the path to achieving your Cambridge English qualification.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/programs"
              className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Explore Programs
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;