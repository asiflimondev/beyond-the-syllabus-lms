import React, { useEffect, useRef } from 'react';
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
  Check
} from 'lucide-react';
import PublicLayout from '@components/layout/PublicLayout';
import Testimonials from '@components/Testimonials';
import ScrollProgress from '@components/ScrollProgress';
// FIX: file is actually named bts-logo-t.png — the old path (/bts-logo.png)
// was a silent 404, and since both usages below have alt="", the browser
// never showed a broken-image icon, so the logo just appeared to be missing.
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
// STAIRCASE OBSERVER - FIXED
// ============================================
const useStaircaseObserver = () => {
  useEffect(() => {
    const stairs = document.getElementById('staircase');
    if (!stairs) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add the 'rise' class to trigger animation
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
// ANIMATED SECTION COMPONENT
// ============================================
const AnimatedSection: React.FC<{ 
  children: React.ReactNode; 
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale';
}> = ({ children, delay = 0, direction = 'up' }) => {
  const ref = useRef<HTMLDivElement>(null);

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

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  const getDirectionClass = () => {
    switch (direction) {
      case 'left': return 'reveal-left';
      case 'right': return 'reveal-right';
      case 'scale': return 'reveal-scale';
      default: return 'reveal-up';
    }
  };

  return (
    <div
      ref={ref}
      className={`reveal ${getDirectionClass()}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const HomePage: React.FC = () => {
  useScrollReveal();
  useStaircaseObserver();

  // Services data
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
      description: 'Cambridge Movers is the second level of the Cambridge Young Learners English Tests, designed for children with basic English skills.',
      cefr: 'A1',
      levelLabel: 'Movers',
      stairColor: '#283890',
      stairHeight: '40px',
      delay: '0.1s'
    },
    { 
      id: 2, 
      name: 'KET', 
      level: 'Elementary', 
      duration: '7 months', 
      fee: '15,000 BDT', 
      icon: '📘', 
      color: 'from-blue-400 to-cyan-500',
      description: 'The Cambridge Key English Test (KET) is an elementary level qualification that demonstrates the ability to communicate in basic English.',
      cefr: 'A2',
      levelLabel: 'KET',
      stairColor: '#3a49a8',
      stairHeight: '80px',
      delay: '0.4s'
    },
    { 
      id: 3, 
      name: 'PET', 
      level: 'Intermediate', 
      duration: '8 months', 
      fee: '18,000 BDT', 
      icon: '📗', 
      color: 'from-purple-400 to-violet-500',
      description: 'The Cambridge Preliminary English Test (PET) is an intermediate level qualification for everyday English communication.',
      cefr: 'B1',
      levelLabel: 'PET',
      stairColor: '#8a7fb0',
      stairHeight: '130px',
      delay: '0.7s'
    },
    { 
      id: 4, 
      name: 'FCE', 
      level: 'Upper-Intermediate', 
      duration: '9 months', 
      fee: '22,000 BDT', 
      icon: '📕', 
      color: 'from-orange-400 to-red-500',
      description: 'The Cambridge First Certificate in English (FCE) is an upper-intermediate qualification for living and working independently.',
      cefr: 'B2',
      levelLabel: 'FCE',
      stairColor: '#ef6a35',
      stairHeight: '180px',
      delay: '1.0s'
    },
    { 
      id: 5, 
      name: 'CAE', 
      level: 'Advanced', 
      duration: '9 months', 
      fee: '25,000 BDT', 
      icon: '🎯', 
      color: 'from-pink-400 to-rose-500',
      description: 'Cambridge Advanced English (CAE) is a high-level qualification showing language skills that employers and universities are looking for.',
      cefr: 'C1',
      levelLabel: 'CAE',
      stairColor: '#f1592a',
      stairHeight: '230px',
      delay: '1.3s'
    },
  ];

  const facilities = [
    { icon: BookOpen, title: 'Modern Classrooms', description: 'Smart classrooms with interactive technology' },
    { icon: Users, title: 'Expert Teachers', description: 'Cambridge-certified experienced instructors' },
    { icon: Award, title: 'Cambridge Affiliated', description: 'Official Cambridge preparation center' },
    { icon: Clock, title: 'Flexible Schedule', description: 'Morning, afternoon & evening batches' },
  ];

  const renderService = (service: typeof services[0]) => {
    const Icon = service.icon;

    return (
      <AnimatedSection key={service.id} delay={100}>
        <div className={`py-20 lg:py-28 ${service.bgColor}`}>
          <div className="container-fluid">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="flex justify-center">
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

              <div className="space-y-6">
                <div className={`inline-block bg-gradient-to-r ${service.accentColor} px-6 py-3 rounded-2xl shadow-lg`}>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight font-display">
                    {service.title}
                  </h3>
                </div>
                <p className="text-ink-soft text-base lg:text-lg leading-relaxed max-w-lg">
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
          FIX: btsLogo import corrected to bts-logo-t.png (below, outside
          this section) so the watermark + bottom panel logo actually render.
          Buttons and the Cambridge logo pill resized to match the reference
          template's exact CSS values (.btn padding .95rem/1.6rem, text 1rem;
          .campill img height 34px, pill padding .5rem/.85rem).
          ========================================== */}
      <section className="relative overflow-hidden text-white" style={{ 
        background: 'linear-gradient(115deg, rgba(14,18,53,0.97) 0%, rgba(20,26,74,0.92) 44%, rgba(28,37,100,0.8) 100%)'
      }}>
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1568792923760-d70635a89fdc?auto=format&fit=crop&w=1900&q=80" 
            alt="Cambridge campus" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0e1235]/95 via-[#141a4a]/90 to-[#1c2564]/80" />
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-0 z-0 opacity-50 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          maskImage: 'radial-gradient(75% 75% at 60% 25%, #000, transparent 82%)'
        }} />

        {/* Floating Orbs */}
        <div className="absolute -top-14 -right-8 w-[44vw] max-w-[580px] h-[44vw] max-h-[580px] rounded-full z-0 opacity-40 blur-xl bg-orange-500/25" />
        <div className="absolute -bottom-26 -left-12 w-[42vw] max-w-[540px] h-[42vw] max-h-[540px] rounded-full z-0 opacity-40 blur-xl bg-blue-600/35" />

        {/* Floating Shapes */}
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

        {/* Watermark Logo */}
        <div className="absolute right-[-3%] top-[12%] w-[42vw] max-w-[520px] z-0 opacity-10 pointer-events-none hidden lg:block">
          <img src={btsLogo} alt="" className="w-full brightness-0 invert" />
        </div>

        <div className="relative z-10 container-fluid py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div>
              <div className="inline-flex items-center gap-3 text-orange-200 font-bold text-sm reveal">
                <span className="w-7 h-7 rounded-lg bg-orange-500/30 text-orange-200 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </span>
                Official Cambridge preparation · Dhaka
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold font-display leading-tight tracking-tight mt-6 reveal" style={{ transitionDelay: '60ms' }}>
                English that goes{' '}
                <span className="relative inline-block text-orange-500">
                  beyond
                  <span className="absolute bottom-1 left-0 right-0 h-[0.14em] rounded-full bg-orange-500/40 -z-10" />
                </span>{' '}
                the syllabus.
              </h1>

              <p className="text-lg text-white/80 max-w-2xl mt-6 leading-relaxed reveal" style={{ transitionDelay: '140ms' }}>
                Cambridge-certified teachers, a proven level-by-level path, and real classroom energy — guiding learners from their first words to confident, exam-ready fluency and the world beyond.
              </p>

              {/* FIX: buttons now match the reference .btn class exactly —
                  padding .95rem/1.6rem, text 1rem (was px-6 py-3 text-sm),
                  icon 18px (was 16px) */}
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

              {/* FIX: Cambridge logo pill now matches the reference .campill
                  class exactly — img height 34px (was 32px), pill padding
                  .5rem/.85rem, radius 14px (was smaller px-4 py-2 rounded-xl) */}
              <div className="flex items-center gap-[0.9rem] mt-[2.6rem] pt-[1.7rem] border-t border-white/20 reveal" style={{ transitionDelay: '300ms' }}>
                <div className="flex items-center gap-[0.6rem] bg-white rounded-[14px] px-[0.85rem] py-[0.5rem] shadow-sh-2 flex-none">
                  <img src={cambridgeLogo} alt="Cambridge English" className="h-[34px] w-auto object-contain" />
                </div>
                <p className="text-sm text-white/70 max-w-xs">
                  <strong className="text-white font-bold">Official Cambridge Assessment English</strong> preparation center in Bangladesh.
                </p>
              </div>
            </div>

            {/* Right Column - Photo */}
            <div className="relative reveal" style={{ transitionDelay: '140ms' }}>
              <div className="relative rounded-3xl overflow-hidden shadow-sh-3 aspect-[4/4.7] bg-surface border-4 border-white/90 transform transition-transform duration-300 hover:scale-[1.02]">
                <img
                  src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1000&q=80"
                  alt="Students learning together"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-2xl px-4 py-2 shadow-sh-2 font-bold text-sm flex items-center gap-2 animate-float-a">
                <Star className="w-4 h-4 fill-white" />
                A1 → C1
              </div>

              {/* Bottom Panel — this is where the BTS logo renders; the
                  broken import path was the reason it appeared missing */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-sh-2 max-w-[240px] flex items-center gap-3">
                <img src={btsLogo} alt="" className="w-12 h-12 rounded-xl bg-surface p-1.5 object-contain" />
                <div>
                  <p className="font-display font-bold text-blue-900 text-sm leading-tight">Cambridge-certified faculty</p>
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
      <div className="bg-blue-800 py-4 overflow-hidden border-b border-white/10">
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
          PROGRAMS SECTION - Staircase with Animation
          ========================================== */}
      <section className="py-16 lg:py-20 bg-white" id="programs">
        <div className="container-fluid">
          <div className="section-head reveal">
            <span className="kicker">
              <span className="tick">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M4 19V5m0 14h16M8 19v-6m4 6V9m4 10V6" />
                </svg>
              </span>
              Cambridge Qualifications
            </span>
            <h2>Climb the staircase, step by step.</h2>
            <p>Every learner is placed at the right level, then rises one confident Cambridge step at a time — each stage mapped to the Common European Framework (CEFR).</p>
          </div>

          <div className="staircase-container" id="staircase">
            <div className="flex flex-col md:flex-row md:items-end gap-3 relative pt-14 md:min-h-[420px]">
              {programs.map((program) => {
                const riserStyle: React.CSSProperties & { '--riser-height'?: string } = {
                  '--riser-height': program.stairHeight,
                  background: `linear-gradient(180deg, ${program.stairColor}, ${program.stairColor}33)`,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
                };

                return (
                  <div key={program.id} className="stair-item flex flex-col md:justify-end items-stretch relative md:flex-1">
                    {/* Step Card */}
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
                    
                    {/* Riser - Grows upward when staircase is triggered */}
                    <div 
                      className="stair-riser relative z-0 -mt-1 rounded-t-lg shadow-inner"
                      style={riserStyle}
                    />
                    
                    {/* CAE Cap Badge */}
                    {program.cefr === 'C1' && (
                      <div className="absolute -top-2 -right-2 z-20 bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sh-1 flex items-center gap-1 whitespace-nowrap">
                        <Star className="w-3 h-3 fill-orange-200 text-orange-200" />
                        Study abroad ready
                      </div>
                    )}
                  </div>
                );
              })}
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
          SERVICES GRID
          ========================================== */}
      <section className="py-16 lg:py-20 bg-surface border-y border-line">
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
            <h2>A whole system — not just a classroom.</h2>
            <p>Everything a learner needs to prepare, practise and pass, under one roof in Dhaka.</p>
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
          SERVICES LIST
          ========================================== */}
      {services.map((service) => renderService(service))}

      {/* ==========================================
          TESTIMONIALS
          ========================================== */}
      <Testimonials />

      {/* ==========================================
          WHY CHOOSE US
          ========================================== */}
      <section className="py-16 lg:py-20 bg-gray-50/50">
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
          CTA SECTION
          ========================================== */}
      <section className="py-16 lg:py-20 bg-primary-600 text-white">
        <div className="container-fluid max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Ready to Start Your Journey?</h2>
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
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;