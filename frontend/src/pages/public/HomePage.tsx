import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Users, 
  BookOpen, 
  ArrowRight,
  GraduationCap,
  Clock,
  DollarSign,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  PlayCircle,
  TrendingUp,
  Globe,
  Calendar,
  UserCheck,
  Sparkles
} from 'lucide-react';
import PublicLayout from '@components/layout/PublicLayout';

const HomePage: React.FC = () => {
  // Testimonial carousel state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [counts, setCounts] = useState({ students: 0, teachers: 0, programs: 0, successRate: 0 });

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Ahmed',
      score: 'Overall Band 8.0',
      university: 'University of Cambridge, UK',
      testimonial: 'Beyond the Syllabus helped me achieve my dream of studying at Cambridge. The teachers are exceptional and the teaching methodology is world-class!',
      image: 'https://ui-avatars.com/api/?name=Sarah+Ahmed&size=80&background=0ea5e9&color=fff&font-size=0.5'
    },
    {
      id: 2,
      name: 'Rafi Hasan',
      score: 'Overall Band 7.5',
      university: 'University of Melbourne, Australia',
      testimonial: 'The preparation I received was outstanding. I felt confident and prepared for the exam. Beyond the Syllabus truly goes beyond!',
      image: 'https://ui-avatars.com/api/?name=Rafi+Hasan&size=80&background=0ea5e9&color=fff&font-size=0.5'
    },
    {
      id: 3,
      name: 'Nadia Khan',
      score: 'Overall Band 8.5',
      university: 'University of Toronto, Canada',
      testimonial: 'I never thought I could achieve such a high score. The personalized attention and rigorous practice sessions made all the difference.',
      image: 'https://ui-avatars.com/api/?name=Nadia+Khan&size=80&background=0ea5e9&color=fff&font-size=0.5'
    }
  ];

  // Programs data (will be replaced with API data later)
  const programs = [
    { id: 1, name: 'Movers', level: 'Elementary', duration: '7 months', fee: '12,000 BDT', icon: '🌟', color: 'from-green-400 to-emerald-500' },
    { id: 2, name: 'KET', level: 'Elementary', duration: '7 months', fee: '15,000 BDT', icon: '📘', color: 'from-blue-400 to-cyan-500' },
    { id: 3, name: 'PET', level: 'Intermediate', duration: '8 months', fee: '18,000 BDT', icon: '📗', color: 'from-purple-400 to-violet-500' },
    { id: 4, name: 'FCE', level: 'Upper-Intermediate', duration: '9 months', fee: '22,000 BDT', icon: '📕', color: 'from-orange-400 to-red-500' },
    { id: 5, name: 'CAE', level: 'Advanced', duration: '9 months', fee: '25,000 BDT', icon: '🎯', color: 'from-pink-400 to-rose-500' },
  ];

  // Facilities data
  const facilities = [
    { icon: BookOpen, title: 'Modern Classrooms', description: 'Smart classrooms with interactive technology' },
    { icon: Users, title: 'Expert Teachers', description: 'Cambridge-certified experienced instructors' },
    { icon: Award, title: 'Cambridge Affiliated', description: 'Official Cambridge preparation center' },
    { icon: Clock, title: 'Flexible Schedule', description: 'Morning, afternoon & evening batches' },
  ];

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Animated counter effect
  useEffect(() => {
    const targetCounts = { students: 200, teachers: 15, programs: 5, successRate: 95 };
    const duration = 2000;
    const steps = 60;
    const increment = { 
      students: targetCounts.students / steps, 
      teachers: targetCounts.teachers / steps, 
      programs: targetCounts.programs / steps, 
      successRate: targetCounts.successRate / steps 
    };
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setCounts({
        students: Math.min(Math.round(increment.students * currentStep), targetCounts.students),
        teachers: Math.min(Math.round(increment.teachers * currentStep), targetCounts.teachers),
        programs: Math.min(Math.round(increment.programs * currentStep), targetCounts.programs),
        successRate: Math.min(Math.round(increment.successRate * currentStep), targetCounts.successRate),
      });
      if (currentStep >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <PublicLayout>
      {/* ==========================================
          HERO SECTION - MODERN & DYNAMIC
          ========================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 text-white">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
                Cambridge English Preparation Center
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Your Path to{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  English Excellence
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-primary-100 leading-relaxed max-w-lg">
                Join Bangladesh's premier Cambridge English training center. 
                We've helped 200+ students achieve their dream scores.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
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

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-8 pt-4">
                {[
                  { icon: Star, label: '4.9/5 Rating', value: '4.9' },
                  { icon: Users, label: 'Happy Students', value: '200+' },
                  { icon: Award, label: 'Success Rate', value: '95%' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <item.icon className="w-5 h-5 text-yellow-300" />
                    <div>
                      <p className="font-semibold">{item.value}</p>
                      <p className="text-xs text-primary-200">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Hero Image/Stats */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <p className="text-3xl font-bold text-yellow-300">{counts.students}+</p>
                    <p className="text-sm text-primary-200 mt-1">Students Enrolled</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <p className="text-3xl font-bold text-yellow-300">{counts.teachers}+</p>
                    <p className="text-sm text-primary-200 mt-1">Expert Teachers</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <p className="text-3xl font-bold text-yellow-300">{counts.programs}</p>
                    <p className="text-sm text-primary-200 mt-1">Programs</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <p className="text-3xl font-bold text-yellow-300">{counts.successRate}%</p>
                    <p className="text-sm text-primary-200 mt-1">Success Rate</p>
                  </div>
                </div>
              </div>
              {/* Floating decorative element */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-2xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          STATISTICS SECTION
          ========================================== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-gray-100">
              <div className="flex justify-center mb-3">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{counts.students}+</p>
              <p className="text-sm text-gray-500">Students Enrolled</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-gray-100">
              <div className="flex justify-center mb-3">
                <UserCheck className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{counts.teachers}+</p>
              <p className="text-sm text-gray-500">Expert Teachers</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-gray-100">
              <div className="flex justify-center mb-3">
                <BookOpen className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{counts.programs}</p>
              <p className="text-sm text-gray-500">Programs Offered</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-gray-100">
              <div className="flex justify-center mb-3">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{counts.successRate}%</p>
              <p className="text-sm text-gray-500">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          PROGRAMS SECTION - MODERN CARDS
          ========================================== */}
      <section className="py-16 bg-gray-50">
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
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${program.color} flex items-center justify-center text-2xl mb-4`}>
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
          FACILITIES SECTION
          ========================================== */}
      <section className="py-16 bg-white">
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
                className="group p-6 bg-gray-50 rounded-2xl hover:bg-primary-50 transition-all duration-300 hover:shadow-md text-center"
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
          TESTIMONIAL SECTION - CAROUSEL
          ========================================== */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">What Our Students Say</h2>
            <p className="text-primary-100 mt-2">Real stories from real students</p>
          </div>

          <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex flex-col items-center text-center">
              <img
                src={testimonials[currentTestimonial].image}
                alt={testimonials[currentTestimonial].name}
                className="w-20 h-20 rounded-full border-4 border-white/30 mb-4"
              />
              <p className="text-lg italic leading-relaxed">
                "{testimonials[currentTestimonial].testimonial}"
              </p>
              <div className="mt-4">
                <p className="font-semibold">{testimonials[currentTestimonial].name}</p>
                <p className="text-sm text-primary-200">{testimonials[currentTestimonial].score}</p>
                <p className="text-sm text-primary-200">{testimonials[currentTestimonial].university}</p>
              </div>
            </div>

            {/* Carousel Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between">
              <button
                onClick={prevTestimonial}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-white w-6' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          CTA SECTION - FINAL
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
              className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all hover:shadow-lg"
            >
              Explore Programs
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
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