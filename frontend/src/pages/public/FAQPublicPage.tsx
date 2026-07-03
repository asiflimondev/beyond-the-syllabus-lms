import React, { useState } from 'react';
import PublicLayout from '@components/layout/PublicLayout';
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  BookOpen,
  Users,
  DollarSign,
  Clock,
  FileText,
  GraduationCap,
  Award,
  Globe,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'admission' | 'programs' | 'exam' | 'fees';
}

const FAQPublicPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // FAQ Data
  const faqData: FAQItem[] = [
    // General FAQs
    {
      id: 'g1',
      question: 'What is Beyond the Syllabus?',
      answer: 'Beyond the Syllabus is a Cambridge English Language Training Center dedicated to helping students achieve their English language goals. We offer comprehensive preparation courses for Cambridge English Qualifications including Movers, KET, PET, FCE, and CAE.',
      category: 'general'
    },
    {
      id: 'g2',
      question: 'Is Beyond the Syllabus affiliated with Cambridge?',
      answer: 'Yes! Beyond the Syllabus is an official Cambridge Assessment English preparation center. Our programs follow the Cambridge curriculum and our teachers are Cambridge-certified instructors.',
      category: 'general'
    },
    {
      id: 'g3',
      question: 'Where is the center located?',
      answer: 'We are located in Dhaka, Bangladesh. Our center is easily accessible and equipped with modern facilities including smart classrooms, a library, and a student lounge.',
      category: 'general'
    },

    // Admission FAQs
    {
      id: 'a1',
      question: 'How do I enroll in a program?',
      answer: 'To enroll in a program, you can visit our center for a placement test, or you can contact us to schedule a consultation. Our team will help you choose the right program based on your English level and goals.',
      category: 'admission'
    },
    {
      id: 'a2',
      question: 'What is the admission process?',
      answer: 'The admission process includes a placement test to assess your current English level, followed by a consultation to discuss your goals and program options. Once you\'ve chosen a program, you can complete the registration and payment.',
      category: 'admission'
    },
    {
      id: 'a3',
      question: 'Do I need to take a placement test?',
      answer: 'Yes, all new students take a placement test to ensure they are placed in the appropriate level. This helps us provide the most effective learning experience tailored to your needs.',
      category: 'admission'
    },

    // Programs FAQs
    {
      id: 'p1',
      question: 'What programs do you offer?',
      answer: 'We offer preparation programs for Cambridge English Qualifications including Movers (A1), Key English Test - KET (A2), Preliminary English Test - PET (B1), First Certificate in English - FCE (B2), and Cambridge Advanced English - CAE (C1).',
      category: 'programs'
    },
    {
      id: 'p2',
      question: 'How long do the programs last?',
      answer: 'Program durations vary by level. Typically, programs run for 7-9 months. We also offer intensive courses for students who want to prepare more quickly.',
      category: 'programs'
    },
    {
      id: 'p3',
      question: 'What is the schedule like?',
      answer: 'We offer flexible schedules with morning, afternoon, and evening batches. Classes are usually held 3-4 times a week, with each session lasting 2-3 hours.',
      category: 'programs'
    },
    {
      id: 'p4',
      question: 'Do you offer online classes?',
      answer: 'Yes, we offer both in-person and online classes. Our online classes use interactive platforms that allow students to participate in real-time with their teachers and classmates.',
      category: 'programs'
    },

    // Exam FAQs
    {
      id: 'e1',
      question: 'When are the Cambridge exams conducted?',
      answer: 'Cambridge English exams are conducted multiple times throughout the year. Our center helps you register for the exams and prepares you thoroughly for the test date.',
      category: 'exam'
    },
    {
      id: 'e2',
      question: 'What is the exam format?',
      answer: 'The exam format varies by level but generally includes Reading & Use of English, Writing, Listening, and Speaking sections. Our programs cover all sections to ensure complete preparation.',
      category: 'exam'
    },
    {
      id: 'e3',
      question: 'How are the exams scored?',
      answer: 'Cambridge English exams use a standardized scoring system. Scores are reported as Cambridge English Scale scores, which align with the Common European Framework of Reference for Languages (CEFR).',
      category: 'exam'
    },

    // Fees FAQs
    {
      id: 'f1',
      question: 'How much do the programs cost?',
      answer: 'Program fees vary based on the level and duration. Our fees are competitive and we offer flexible payment plans. Contact us for detailed fee information for specific programs.',
      category: 'fees'
    },
    {
      id: 'f2',
      question: 'Are there any scholarships available?',
      answer: 'Yes, we offer merit-based scholarships for outstanding students. We also have installment payment options to make our programs accessible to all students.',
      category: 'fees'
    },
    {
      id: 'f3',
      question: 'What is included in the program fee?',
      answer: 'Program fees include tuition, course materials, access to our learning management system, practice tests, and mock exams. Exam registration fees are typically not included.',
      category: 'fees'
    }
  ];

  // Category configuration
  const categories = [
    { id: 'all', label: 'All', icon: HelpCircle },
    { id: 'general', label: 'General', icon: BookOpen },
    { id: 'admission', label: 'Admission', icon: Users },
    { id: 'programs', label: 'Programs', icon: GraduationCap },
    { id: 'exam', label: 'Exam', icon: Award },
    { id: 'fees', label: 'Fees', icon: DollarSign },
  ];

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Toggle expand/collapse
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return <BookOpen className="w-4 h-4 text-primary-600" />;
      case 'admission': return <Users className="w-4 h-4 text-primary-600" />;
      case 'programs': return <GraduationCap className="w-4 h-4 text-primary-600" />;
      case 'exam': return <Award className="w-4 h-4 text-primary-600" />;
      case 'fees': return <DollarSign className="w-4 h-4 text-primary-600" />;
      default: return <HelpCircle className="w-4 h-4 text-primary-600" />;
    }
  };

  // Get category badge color
  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      general: 'bg-blue-100 text-blue-800',
      admission: 'bg-green-100 text-green-800',
      programs: 'bg-purple-100 text-purple-800',
      exam: 'bg-orange-100 text-orange-800',
      fees: 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      general: 'General',
      admission: 'Admission',
      programs: 'Programs',
      exam: 'Exam',
      fees: 'Fees',
    };
    return labels[category] || category;
  };

  // Get count for each category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return faqData.length;
    return faqData.filter(faq => faq.category === categoryId).length;
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-primary-100 max-w-3xl mx-auto">
              Find answers to common questions about our programs, admission process, exams, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter - Desktop */}
            <div className="hidden md:flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label} ({getCategoryCount(category.id)})
                </button>
              ))}
            </div>

            {/* Category Filter - Mobile Dropdown */}
            <div className="md:hidden">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label} ({getCategoryCount(category.id)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12 bg-gray-50 min-h-[400px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="text-sm text-gray-500 mb-6">
            {filteredFAQs.length} {filteredFAQs.length === 1 ? 'question' : 'questions'} found
          </div>

          {/* FAQ Items */}
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No Questions Found</h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-4 text-primary-600 hover:text-primary-700"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md"
                >
                  {/* Question */}
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full px-6 py-4 flex items-start justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getCategoryIcon(faq.category)}
                      </div>
                      <div>
                        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryBadge(faq.category)} mb-1`}>
                          {getCategoryLabel(faq.category)}
                        </span>
                        <h3 className="text-base font-medium text-gray-900">
                          {faq.question}
                        </h3>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {expandedId === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-primary-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Answer */}
                  {expandedId === faq.id && (
                    <div className="px-6 pb-4 pt-0 border-t border-gray-100">
                      <div className="pt-3 pl-9">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions? */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-8">
            We're here to help! Contact us and we'll get back to you as soon as possible.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <Phone className="w-8 h-8 text-primary-600 mb-2" />
              <h4 className="font-medium text-gray-900">Call Us</h4>
              <p className="text-sm text-gray-600">+880 1712 345 678</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <Mail className="w-8 h-8 text-primary-600 mb-2" />
              <h4 className="font-medium text-gray-900">Email Us</h4>
              <p className="text-sm text-gray-600">info@beyondsyllabus.com</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-8 h-8 text-primary-600 mb-2" />
              <h4 className="font-medium text-gray-900">Visit Us</h4>
              <p className="text-sm text-gray-600">Dhaka, Bangladesh</p>
            </div>
          </div>
          <div className="mt-8">
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default FAQPublicPage;