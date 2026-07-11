import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Ahmed',
    score: 'Overall Band 8.0',
    university: 'University of Cambridge, UK',
    testimonial: 'Beyond the Syllabus helped me achieve my dream of studying at Cambridge. The teachers are exceptional and the teaching methodology is world-class!',
    image: 'https://ui-avatars.com/api/?name=Sarah+Ahmed&size=80&background=0ea5e9&color=fff&font-size=0.5',
    rating: 5,
  },
  {
    id: 2,
    name: 'Rafi Hasan',
    score: 'Overall Band 7.5',
    university: 'University of Melbourne, Australia',
    testimonial: 'The preparation I received was outstanding. I felt confident and prepared for the exam. Beyond the Syllabus truly goes beyond!',
    image: 'https://ui-avatars.com/api/?name=Rafi+Hasan&size=80&background=0ea5e9&color=fff&font-size=0.5',
    rating: 5,
  },
  {
    id: 3,
    name: 'Nadia Khan',
    score: 'Overall Band 8.5',
    university: 'University of Toronto, Canada',
    testimonial: 'I never thought I could achieve such a high score. The personalized attention and rigorous practice sessions made all the difference.',
    image: 'https://ui-avatars.com/api/?name=Nadia+Khan&size=80&background=0ea5e9&color=fff&font-size=0.5',
    rating: 5,
  },
  {
    id: 4,
    name: 'Tahmid Hossain',
    score: 'Overall Band 7.0',
    university: 'University of Sydney, Australia',
    testimonial: 'The mock tests and daily practice sessions were incredibly helpful. I felt fully prepared for the actual exam day.',
    image: 'https://ui-avatars.com/api/?name=Tahmid+Hossain&size=80&background=0ea5e9&color=fff&font-size=0.5',
    rating: 4,
  },
  {
    id: 5,
    name: 'Ayesha Rahman',
    score: 'Overall Band 8.0',
    university: 'National University of Singapore',
    testimonial: 'Beyond the Syllabus gave me the confidence I needed. The teachers really care about their students\' success.',
    image: 'https://ui-avatars.com/api/?name=Ayesha+Rahman&size=80&background=0ea5e9&color=fff&font-size=0.5',
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-primary-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-4">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            What Our Students Say
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Real stories from students who achieved their dreams with us
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="relative">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 hover:shadow-2xl transition-shadow duration-500">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Student Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-primary-100 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-2 border-white">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex justify-center md:justify-start gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < currentTestimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed italic">
                  "{currentTestimonial.testimonial}"
                </blockquote>

                <div className="mt-4">
                  <p className="font-semibold text-gray-900 text-lg">
                    {currentTestimonial.name}
                  </p>
                  <p className="text-primary-600 font-medium">
                    {currentTestimonial.score}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentTestimonial.university}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-center gap-3 mt-8">
              <button
                onClick={() => {
                  setIsAutoPlaying(false);
                  prevSlide();
                  setTimeout(() => setIsAutoPlaying(true), 5000);
                }}
                className="p-2 rounded-full border border-gray-200 hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
              </button>
              <button
                onClick={() => {
                  setIsAutoPlaying(false);
                  nextSlide();
                  setTimeout(() => setIsAutoPlaying(true), 5000);
                }}
                className="p-2 rounded-full border border-gray-200 hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 group"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAutoPlaying(true), 5000);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? 'w-8 h-2 bg-primary-600'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;