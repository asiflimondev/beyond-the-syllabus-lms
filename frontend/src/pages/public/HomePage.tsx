import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Users, 
  BookOpen, 
  ArrowRight,
  Clock,
  PenTool,
  Mic,
  ClipboardList,
  Users as UsersIcon,
  Building,
  Star,
  Check,
  Globe,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Heart,
  Shield
} from 'lucide-react';
import PublicLayout from '@components/layout/PublicLayout';
import ScrollProgress from '@components/ScrollProgress';
import btsLogo from '/bts-logo-t.png';
import cambridgeLogo from '/cambridge-logo.png';

// ============================================
// SCROLL REVEAL HOOK
// ============================================
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

// ============================================
// STAIRCASE OBSERVER
// ============================================
const useStaircaseObserver = () => {
  useEffect(() => {
    const stairs = document.getElementById('staircase');
    if (!stairs) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stairs.classList.add('rise');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30% 0px' }
    );

    observer.observe(stairs);

    return () => observer.disconnect();
  }, []);
};

// ============================================
// TESTIMONIALS CAROUSEL - WITH IMAGES
// ============================================
const TestimonialsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'Afnan Osman',
      score: 'Overall Band 8.5',
      testimonial: 'Beyond the Syllabus helped me achieve my dream of studying at Cambridge. The teachers are exceptional and the teaching methodology is world-class!',
      image: 'https://ui-avatars.com/api/?name=Afnan+Osman&size=150&background=f1592a&color=fff&font-size=0.5',
    },
    {
      id: 2,
      name: 'Rifat Hossain',
      score: 'Overall Band 8.5',
      testimonial: 'The preparation I received was outstanding. I felt confident and prepared for the exam. Beyond the Syllabus truly goes beyond!',
      image: 'https://ui-avatars.com/api/?name=Rifat+Hossain&size=150&background=283890&color=fff&font-size=0.5',
    },
    {
      id: 3,
      name: 'Asif Limon',
      score: 'Overall Band 8.0',
      testimonial: 'I never thought I could achieve such a high score. The personalized attention and rigorous practice sessions made all the difference.',
      image: 'https://ui-avatars.com/api/?name=Asif+Limon&size=150&background=3648ad&color=fff&font-size=0.5',
    },
    {
      id: 4,
      name: 'Atiya Suhaila Simin',
      score: 'Overall Band 8.0',
      testimonial: 'I used to think English was all rules and structure, a subject you had to pass exams for. Cambridge English made me truly see that it is actually a language — a tool to communicate with. It was really about confidence in how I think, how I express myself, and how I show up. It\'s the reason I walked into a job feeling ready.',
      image: 'simin.jpeg',
    },
    {
      id: 5,
      name: 'Fatin Hamama',
      score: 'Overall Band 8.5',
      testimonial: 'We often grow up thinking language learning is just rigid structures and rules. Beyond the Syllabus makes language learning feel like what it really is—communication, creative expression, and critical thinking. It was the most lively learning experience that actually stayed with me.',
      image: 'fatin.jpeg',
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  React.useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 5200);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const current = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="bg-white/5 border border-white/20 rounded-3xl px-8 py-10 md:px-12 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center md:items-center">
          {/* Left - Student Image */}
          <div className="flex-shrink-0">
            <img 
              src={current.image}
              alt={current.name}
              className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover shadow-lg border-2 border-white/20"
            />
          </div>

          {/* Right - Content */}
          <div className="flex-1 text-center md:text-left">
            {/* Name */}
            <p className="font-bold text-white font-display text-2xl md:text-3xl">
              {current.name}
            </p>

            {/* Score */}
            <p className="text-orange-300 text-base md:text-lg font-semibold mt-1">
              {current.score}
            </p>

            {/* Testimonial */}
            <blockquote className="text-lg md:text-xl text-white/90 leading-relaxed mt-4">
              "{current.testimonial}"
            </blockquote>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => { setIsAutoPlaying(false); prevSlide(); setTimeout(() => setIsAutoPlaying(true), 5000); }}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white hover:bg-orange-500 hover:border-transparent transition-all duration-300 flex items-center justify-center"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => { setIsAutoPlaying(false); nextSlide(); setTimeout(() => setIsAutoPlaying(true), 5000); }}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white hover:bg-orange-500 hover:border-transparent transition-all duration-300 flex items-center justify-center"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => { setIsAutoPlaying(false); setCurrentIndex(index); setTimeout(() => setIsAutoPlaying(true), 5000); }}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-2 bg-orange-500'
                : 'w-2 h-2 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  useScrollReveal();
  useStaircaseObserver();

  // Quick Services - 8 items
  const quickServices = [
    { icon: Award, label: 'Cambridge Assessment', color: 'bg-blue-100 text-blue-600' },
    { icon: Mic, label: 'Speaking Sessions', color: 'bg-purple-100 text-purple-600' },
    { icon: PenTool, label: 'Writing Development', color: 'bg-green-100 text-green-600' },
    { icon: ClipboardList, label: 'Mock Tests', color: 'bg-orange-100 text-orange-600' },
    { icon: Users, label: 'Expert Trainers', color: 'bg-cyan-100 text-cyan-600' },
    { icon: UsersIcon, label: 'Small Groups', color: 'bg-pink-100 text-pink-600' },
    { icon: Building, label: 'University Support', color: 'bg-indigo-100 text-indigo-600' },
    { icon: BookOpen, label: 'Study Materials', color: 'bg-emerald-100 text-emerald-600' },
  ];

  const programs = [
    { 
      id: 1, 
      name: 'Movers', 
      level: 'Class 4–6',
      duration: '7–9 months',
      cefr: 'A1',
      levelLabel: 'Movers',
      stairColor: '#283890',
      stairHeight: '40px',
      delay: '0.1s'
    },
    { 
      id: 2, 
      name: 'KET', 
      level: 'Class 6–8',
      duration: '7–9 months',
      cefr: 'A2',
      levelLabel: 'KET',
      stairColor: '#3a49a8',
      stairHeight: '80px',
      delay: '0.4s'
    },
    { 
      id: 3, 
      name: 'PET', 
      level: 'Class 7–10',
      duration: '7–9 months',
      cefr: 'B1',
      levelLabel: 'PET',
      stairColor: '#8a7fb0',
      stairHeight: '130px',
      delay: '0.7s'
    },
    { 
      id: 4, 
      name: 'FCE', 
      level: 'Class 8–12',
      duration: '7–9 months',
      cefr: 'B2',
      levelLabel: 'FCE',
      stairColor: '#ef6a35',
      stairHeight: '180px',
      delay: '1.0s'
    },
    { 
      id: 5, 
      name: 'CAE', 
      level: 'College level',
      duration: '7–9 months',
      cefr: 'C1',
      levelLabel: 'CAE',
      stairColor: '#f1592a',
      stairHeight: '230px',
      delay: '1.3s'
    },
  ];

  const ethosData = [
    {
      tag: 'Our mission',
      title: 'Empower every learner',
      description: 'To help students of every level achieve their English goals through world-class Cambridge preparation and genuine mentorship.'
    },
    {
      tag: 'Our vision',
      title: 'Fluency beyond exams',
      description: 'To be Bangladesh\'s most trusted Cambridge English centre — known for taking learners beyond the syllabus to lasting fluency.'
    },
    {
      tag: 'Our values',
      title: 'Rigour & care',
      description: 'Academic excellence, integrity and individual attention — every student supported as a person, not a number.'
    }
  ];

  const facilities = [
    { icon: BookOpen, title: 'Modern Classrooms', description: 'Smart classrooms with interactive technology' },
    { icon: Users, title: 'Expert Teachers', description: 'Expert experienced instructors' },
    { icon: Award, title: 'Cambridge Affiliated', description: 'Official Cambridge preparation centre' },
    { icon: Clock, title: 'Flexible Schedule', description: 'Morning, afternoon & evening batches' },
  ];

  const familyReasons = [
    { 
      icon: Shield, 
      title: 'Official Cambridge partner', 
      description: 'An accredited preparation centre following the Cambridge curriculum end to end.' 
    },
    { 
      icon: Users, 
      title: 'Cambridge-certified courses', 
      description: 'Comprehensive preparation for Cambridge-certified courses, building students\' core skills step-by-step from foundational English to test readiness.' 
    },
    { 
      icon: Clock, 
      title: 'Flexible schedules', 
      description: 'Morning, afternoon and evening batches, timed to fit school, work and family.' 
    },
    { 
      icon: Heart, 
      title: 'Scholarships & installments', 
      description: 'Merit scholarships and flexible plans keep quality preparation accessible.' 
    },
  ];

  // Helper for riser style
  const getRiserStyle = (color: string, height: string) => {
    return {
      '--riser-height': height,
      background: `linear-gradient(180deg, ${color}, ${color}33)`,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
      height: '0px',
      transition: `height 1.5s cubic-bezier(0.16, 1, 0.3, 1)`,
    } as React.CSSProperties;
  };

  return (
    <PublicLayout>
      <ScrollProgress />

      {/* ==========================================
          HERO SECTION
          ========================================== */}
      <section className="relative overflow-hidden text-white" style={{ 
        background: 'linear-gradient(115deg, rgba(14,18,53,0.97) 0%, rgba(20,26,74,0.92) 44%, rgba(28,37,100,0.8) 100%)'
      }}>
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1568792923760-d70635a89fdc?auto=format&fit=crop&w=1900&q=80" 
            alt="Cambridge campus" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0e1235]/95 via-[#141a4a]/90 to-[#1c2564]/80" />
        </div>

        <div className="absolute inset-0 z-0 opacity-50 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          maskImage: 'radial-gradient(75% 75% at 60% 25%, #000, transparent 82%)'
        }} />

        <div className="absolute -top-14 -right-8 w-[44vw] max-w-[580px] h-[44vw] max-h-[580px] rounded-full z-0 opacity-20 blur-xl bg-orange-500/15" />
        <div className="absolute -bottom-26 -left-12 w-[42vw] max-w-[540px] h-[42vw] max-h-[540px] rounded-full z-0 opacity-20 blur-xl bg-blue-600/15" />

        <div className="absolute top-[12%] left-[34%] z-0 text-white/10 float-a hidden lg:block">
          <svg width="66" height="66" viewBox="0 0 122 122" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="61" cy="61" r="53"/>
            <circle cx="61" cy="61" r="33"/>
          </svg>
        </div>
        <div className="absolute top-[67%] left-[46%] z-0 text-white/10 float-b hidden lg:block">
          <svg width="86" height="26" viewBox="0 0 150 46" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M5 23c16-26 32 26 48 0s32-26 48 0 24 18 44 6"/>
          </svg>
        </div>
        <div className="absolute top-[26%] right-[3%] z-0 text-white/10 float-c hidden lg:block">
          <svg width="58" height="54" viewBox="0 0 104 98" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M52 8L96 86H8z"/>
          </svg>
        </div>

        <div className="absolute right-[-3%] top-[12%] w-[42vw] max-w-[520px] z-0 opacity-10 pointer-events-none hidden lg:block">
          <img src={btsLogo} alt="" className="w-full brightness-0 invert" />
        </div>

        <div className="relative z-10 container-fluid py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-3 text-orange-200 font-bold text-sm reveal mt-4">
                <span className="w-7 h-7 rounded-lg bg-orange-500/30 text-orange-200 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </span>
                Official Cambridge preparation centre · Dhaka
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold font-display leading-tight tracking-tight mt-6 reveal" style={{ transitionDelay: '60ms' }}>
                English that goes{' '}
                <span className="relative inline-block text-orange-500">
                  Beyond
                  <span className="absolute bottom-1 left-0 right-0 h-[0.14em] rounded-full bg-orange-500/40 -z-10" />
                </span>{' '}
                the Syllabus.
              </h1>

              <p className="text-lg text-white/80 max-w-2xl mt-6 leading-relaxed reveal" style={{ transitionDelay: '140ms' }}>
                Cambridge-certified courses, a proven level-by-level path, and real classroom energy — guiding learners from their first words to confident, exam-ready fluency and the world beyond.
              </p>

              <div className="flex flex-wrap gap-4 mt-8 reveal" style={{ transitionDelay: '220ms' }}>
                <Link
                  to="/programs"
                  className="inline-flex items-center gap-[0.55rem] px-[1.6rem] py-[0.95rem] text-base font-bold text-white bg-orange-500 rounded-full shadow-sh-orange hover:bg-orange-600 hover:-translate-y-1 hover:shadow-sh-orange-lg transition-all duration-300"
                >
                  Find your level
                  <ArrowRight className="w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-[1.6rem] py-[0.95rem] text-base font-bold text-white bg-transparent border border-white/40 rounded-full hover:bg-white/10 hover:border-white hover:-translate-y-1 transition-all duration-300"
                >
                  Book a placement test
                </Link>
              </div>

              <div className="flex items-center gap-[0.9rem] mt-[2.6rem] pt-[1.7rem] border-t border-white/20 reveal" style={{ transitionDelay: '300ms' }}>
                <div className="flex items-center gap-[0.6rem] bg-white rounded-[14px] px-[0.85rem] py-[0.5rem] shadow-sh-2 flex-none">
                  <img src={cambridgeLogo} alt="Cambridge English" className="h-[34px] w-auto object-contain" />
                </div>
                <p className="text-sm text-white/70 max-w-xs">
                  <strong className="text-white font-bold">Official Cambridge Assessment English</strong> preparation centre in Bangladesh.
                </p>
              </div>
            </div>

            <div className="relative reveal" style={{ transitionDelay: '140ms' }}>
              <div className="relative rounded-3xl overflow-hidden shadow-sh-3 aspect-[4/4.7] bg-surface border-4 border-white/90 transform transition-transform duration-300 hover:scale-[1.02]">
                <img
                  src="hero.jpeg"
                  alt="Students learning together"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent" />
              </div>

              <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-2xl px-4 py-2 shadow-sh-2 font-bold text-sm flex items-center gap-2">
                <Star className="w-4 h-4 fill-white" />
                A1 → C1
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-sh-2 max-w-[240px] flex items-center gap-3">
                <img src={btsLogo} alt="" className="w-12 h-12 rounded-xl bg-surface p-1.5 object-contain" />
                <div>
                  <p className="font-display font-bold text-blue-900 text-sm leading-tight">Cambridge-certified courses</p>
                  <p className="text-xs text-ink-soft">Smart classrooms in Dhaka</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          MARQUEE
          ========================================== */}
      <div className="bg-blue-900 py-4 overflow-hidden border-b border-white/10">
        <div className="relative overflow-hidden">
          <div className="flex gap-0 w-max animate-marquee hover:animation-pause whitespace-nowrap">
            <div className="flex items-center gap-8 px-6">
              {['Movers · A1', 'KET · A2', 'PET · B1', 'FCE · B2', 'CAE · C1', 'Reading & Use of English', 'Writing · Listening · Speaking', 'Study Abroad Ready'].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-2 text-white font-display font-semibold text-sm">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  {item}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-8 px-6">
              {['Movers · A1', 'KET · A2', 'PET · B1', 'FCE · B2', 'CAE · C1', 'Reading & Use of English', 'Writing · Listening · Speaking', 'Study Abroad Ready'].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-2 text-white font-display font-semibold text-sm">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          CAMBRIDGE QUALIFICATIONS - STAIRCASE
          ========================================== */}
      <section className="py-16 lg:py-20 bg-white" id="programs">
        <div className="container-fluid">
          <div className="section-head reveal">
            <span className="kicker">
              <span className="tick">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M4 19V5m0 14h16M8 19v-6m4 19V9m4 10V6" />
                </svg>
              </span>
              Cambridge Qualifications
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight font-display">Climb the staircase, <br></br>step by step.</h2>
            <p className="text-gray-500 text-lg">Every learner is placed at the right level, then rises one confident Cambridge step at a time — each stage mapped to the Common European Framework (CEFR).</p>
          </div>

          <div className="staircase-container" id="staircase">
            <div className="flex flex-col md:flex-row md:items-end gap-3 relative pt-14 md:min-h-[420px]">
              {programs.map((program) => (
                <div key={program.id} className="stair-item flex flex-col md:justify-end items-stretch relative md:flex-1">
                  <div className="bg-white border border-line rounded-r-lg p-4 shadow-sh-1 hover:shadow-sh-2 hover:-translate-y-2 transition-all duration-300 relative z-10">
                    <div 
                      className="w-11 h-11 rounded-xl text-white font-display font-extrabold text-lg flex items-center justify-center shadow-md"
                      style={{ backgroundColor: program.stairColor }}
                    >
                      {program.cefr}
                    </div>
                    <h3 className="font-display font-extrabold text-blue-900 text-lg mt-3 tracking-tight">
                      {program.levelLabel}
                    </h3>
                    <p className="text-xs font-bold text-muted uppercase tracking-wide mt-0.5">
                      {program.level}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Clock className="w-3.5 h-3.5" style={{ color: program.stairColor }} />
                      <span className="text-sm font-bold" style={{ color: program.stairColor }}>
                        {program.duration}
                      </span>
                    </div>
                  </div>
                  
                  <div 
                    className="stair-riser relative z-0 -mt-1 rounded-t-lg shadow-inner"
                    style={getRiserStyle(program.stairColor, program.stairHeight)}
                  />
                  
                  {program.cefr === 'C1' && (
                    <div className="absolute -top-2 -right-2 z-20 bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sh-1 flex items-center gap-1 whitespace-nowrap">
                      <Star className="w-3 h-3 fill-orange-200 text-orange-200" />
                      Study abroad ready
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8 text-muted text-sm reveal">
            <span className="flex-1 h-px bg-line" />
            <span>Not sure where you stand? A free placement test finds your starting step.</span>
            <span className="flex-1 h-px bg-line" />
          </div>
        </div>
      </section>

      {/* ==========================================
          STUDY ABROAD & SCHOLARSHIPS
          ========================================== */}
      <section className="py-16 lg:py-20 bg-surface border-y border-line overflow-hidden">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="section-head reveal" style={{ marginBottom: '28px' }}>
                <span className="kicker">
                  <span className="tick">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/>
                    </svg>
                  </span>
                  Study Abroad &amp; Scholarships
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight font-display">Your English, a passport to the world.</h2>
                <p className="text-gray-500 text-lg">A Cambridge Qualification is recognised by universities and employers across the globe — the first step from a classroom in Dhaka to a campus abroad.</p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 items-start reveal">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-blue-900 text-lg">Globally recognised certificates</h4>
                    <p className="text-ink-soft text-sm">Cambridge English Qualifications trusted by thousands of institutions worldwide.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start reveal" style={{ transitionDelay: '80ms' }}>
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Star className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-blue-900 text-lg">Mock Tests and Practice</h4>
                    <p className="text-ink-soft text-sm">Build exam confidence with Cambridge preparation materials, full-length practice tests, and detailed score feedback.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start reveal" style={{ transitionDelay: '160ms' }}>
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-blue-900 text-lg">Guidance every step</h4>
                    <p className="text-ink-soft text-sm">Personal consultation to map levels, exams and your route to studying abroad.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative reveal" style={{ transitionDelay: '140ms' }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 rounded-2xl overflow-hidden shadow-sh-2 aspect-[16/9]">
                  <img 
                    src="sA1.jpeg" 
                    alt="University campus" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-sh-1 aspect-square">
                  <img 
                    src="sA2.jpg" 
                    alt="Graduation" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-sh-1 aspect-square">
                  <img 
                    src="sA3.jpg" 
                    alt="International students" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-5 py-3 shadow-sh-2 font-display font-bold text-blue-900 text-sm flex items-center gap-2 whitespace-nowrap">
                <Globe className="w-5 h-5 text-orange-500" />
                Worldwide recognition
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          HOW WE TEACH
          ========================================== */}
      <section className="py-16 lg:py-20 bg-white border-y border-line">
        <div className="container-fluid">
          <div className="section-head centered reveal">
            <span className="kicker">
              <span className="tick">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M12 2l3 7h7l-6 4 2 8-6-4-6 4 2-8-6-4h7z" />
                </svg>
              </span>
              How we teach
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight font-display">A whole system — not just a classroom.</h2>
            <p className="text-gray-500 text-lg">Everything a learner needs to prepare, practise and pass, under one roof in Dhaka.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 reveal">
            {quickServices.map((service, index) => (
              <div 
                key={index} 
                className="bg-white rounded-r-lg p-6 border border-line hover:shadow-sh-2 hover:-translate-y-1 transition-all duration-300 text-center"
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mx-auto mb-3`}>
                  <service.icon className="w-7 h-7" />
                </div>
                <span className="text-sm font-semibold text-ink">{service.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          WHY FAMILIES CHOOSE US
          ========================================== */}
      <section className="py-16 lg:py-20 bg-surface">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="section-head reveal" style={{ marginBottom: '34px' }}>
                <span className="kicker">
                  <span className="tick">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M12 2l2.4 5 5.6.6-4.2 3.8 1.2 5.6L12 20l-5 2.6 1.2-5.6L4 13.2l5.6-.6z"/>
                    </svg>
                  </span>
                  Why families choose us
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight font-display">Built to get real results.</h2>
                <p className="text-gray-500 text-lg">Cambridge rigour with genuine care — the reason students trust us with their goals.</p>
              </div>

              <div className="space-y-6">
                {familyReasons.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start reveal" style={{ transitionDelay: `${index * 80}ms` }}>
                    <div className="w-12 h-12 rounded-xl bg-white border border-line flex items-center justify-center text-orange-500 shadow-sh-1 flex-shrink-0">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-blue-900 text-lg">{item.title}</h4>
                      <p className="text-ink-soft text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 relative reveal" style={{ transitionDelay: '140ms' }}>
              <div className="rounded-3xl overflow-hidden shadow-sh-2 aspect-[5/5.4]">
                <img 
                  src="BuildtoGetRR.jpg" 
                  alt="Teacher with students" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-5 py-3 shadow-sh-2 text-center">
                <p className="font-display font-extrabold text-3xl text-orange-500">A1–C1</p>
                <p className="text-xs font-semibold text-ink-soft">Full Cambridge range</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          LIFE AT BEYOND THE SYLLABUS - GALLERY
          ========================================== */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-fluid">
          <div className="section-head centered reveal">
            <span className="kicker">
              <span className="tick">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
              </span>
              Life at Beyond the Syllabus
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight font-display">A community that learns together.</h2>
            <p className="text-gray-500 text-lg">Bright classrooms, real conversation and the friendships that make English stick.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                src: 'CTLT1.jpeg', 
                label: '',
                tall: true,
              },
              { 
                src: 'CTLT2.jpg', 
                label: '',
                tall: false,
              },
              { 
                src: 'CTLT3.jpeg', 
                label: '',
                tall: false,
              },
              { 
                src: 'CTLT4m.jpeg', 
                label: '',
                tall: false,
              },
              { 
                src: 'CTLT5.jpeg', 
                label: '',
                tall: false,
              },
            ].map((item, index) => (
              <div 
                key={index}
                className={`relative rounded-2xl overflow-hidden shadow-sh-1 hover:shadow-sh-2 transition-all duration-300 group ${
                  item.tall ? 'col-span-2 row-span-2' : ''
                } reveal`}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <img 
                  src={item.src} 
                  alt={item.label} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <span className="text-white font-semibold text-sm p-4">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          SUCCESS STORIES - WITH IMAGES
          ========================================== */}
      <section className="py-20 lg:py-28 text-white relative overflow-hidden" style={{ 
        background: 'linear-gradient(115deg, #0e1235 0%, #141a4a 44%, #1c2564 100%)'
      }}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-1/2 h-full bg-blue-600/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 container-fluid">
          <div className="section-head centered reveal" style={{ marginBottom: '48px' }}>
            <span className="kicker" style={{ color: '#ffd6c4' }}>
              <span className="tick" style={{ background: 'rgba(241,89,42,0.22)', color: '#ffd6c4' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.4 6.7L12 17.8 5.9 21.2 7.3 14.5l-5-4.6 6.8-.8z"/>
                </svg>
              </span>
              Success stories
            </span>
            <h2 style={{ color: '#fff' }}>What Our Students Say</h2>
            <p style={{ color: '#b7bde0' }}>Hear from learners who climbed the Cambridge staircase with us.</p>
          </div>

          <TestimonialsCarousel />
        </div>
      </section>

      {/* ==========================================
          WHAT DRIVES US - ETHOS
          ========================================== */}
      <section className="py-16 lg:py-20 bg-surface border-y border-line">
        <div className="container-fluid">
          <div className="section-head centered reveal">
            <span className="kicker">
              <span className="tick">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M12 3l8 4v5c0 5-3.4 8-8 9-4.6-1-8-4-8-9V7z"/>
                </svg>
              </span>
              What drives us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight font-display">Beyond the Syllabus, on purpose.</h2>
            <p className="text-gray-500 text-lg">We believe language learning should reach past textbooks — into confidence, character and real communication.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ethosData.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 border border-line hover:shadow-sh-2 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden reveal"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <span className="font-display font-bold text-sm text-orange-600 relative z-10">{item.tag}</span>
                <h3 className="font-display font-bold text-2xl text-blue-900 mt-3 mb-2 relative z-10">{item.title}</h3>
                <p className="text-ink-soft text-sm relative z-10">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          WHY CHOOSE US - OLDER UI, NO IMAGE
          ========================================== */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-fluid">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-4">
              Why Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight font-display">
              Why Choose Us
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              We provide the highest quality Cambridge English preparation with proven results
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility, index) => (
              <div key={index} className="group p-6 bg-white rounded-2xl hover:bg-primary-50 transition-all duration-300 hover:shadow-md text-center hover:-translate-y-1">
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
          READY TO START YOUR JOURNEY? - CTA
          ========================================== */}
      <section className="py-16 lg:py-20 relative overflow-hidden" style={{ background: 'linear-gradient(120deg, #f1592a, #df481c)' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="relative z-10 container-fluid max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            Join Beyond the Syllabus today and discover the path to achieving your Cambridge English Qualification.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/programs"
              className="px-8 py-4 bg-white text-orange-600 font-bold rounded-full hover:bg-gray-100 hover:-translate-y-0.5 shadow-lg transition-all duration-300"
            >
              Explore Programmes
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border-2 border-white/60 text-white font-bold rounded-full hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
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