import React, { useState } from 'react';
import PublicLayout from '@components/layout/PublicLayout';
import AnimatedSection from '@components/AnimatedSection';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  MessageSquare
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';

// SVG Social Media Icons
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const contactSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  phone: yup.string().optional(),
  subject: yup.string().required('Subject is required').min(5, 'Subject must be at least 5 characters'),
  message: yup.string().required('Message is required').min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = yup.InferType<typeof contactSchema>;

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Contact form data:', data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setIsSubmitted(true);
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+880 1712 345 678', '+880 1812 345 678'],
      description: 'Mon-Fri: 9:00 AM - 8:00 PM'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@beyondsyllabus.com', 'admissions@beyondsyllabus.com'],
      description: 'We\'ll respond within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: ['House #123, Road #4', 'Dhanmondi, Dhaka - 1205', 'Bangladesh'],
      description: 'View on Google Maps'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Saturday - Thursday: 9:00 AM - 8:00 PM', 'Friday: Closed'],
      description: 'Closed on public holidays'
    }
  ];

  const socialLinks = [
    { icon: FacebookIcon, label: 'Facebook', url: 'https://facebook.com' },
    { icon: YoutubeIcon, label: 'YouTube', url: 'https://youtube.com' },
    { icon: LinkedinIcon, label: 'LinkedIn', url: 'https://linkedin.com' },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <AnimatedSection>
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Reach out and we'll respond as soon as possible.
            </p>
          </div>
        </section>
      </AnimatedSection>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Cards */}
            <div className="lg:col-span-2 space-y-4">
              {contactInfo.map((info, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 transition-colors duration-200">
                        <info.icon className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors duration-200" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{info.title}</h4>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-sm text-gray-600">{detail}</p>
                        ))}
                        <p className="text-xs text-gray-400 mt-1">{info.description}</p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}

              {/* Social Links */}
              <AnimatedSection delay={400}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Connect With Us</h4>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-all duration-200 hover:scale-105"
                        aria-label={social.label}
                      >
                        <social.icon />
                      </a>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* Map */}
              <AnimatedSection delay={500}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-48 bg-gray-200">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.3482577192387!2d90.38028807498936!3d23.736629889790923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9ac9b8f9b8d%3A0x8f9b8d9b8f9b8d9!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Beyond the Syllabus Location"
                    />
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <AnimatedSection>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Send a Message</h2>
                  <p className="text-gray-500 text-sm mb-6">Fill in the form below and we'll get back to you shortly.</p>

                  {isSubmitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-green-800">Message Sent!</h3>
                      <p className="text-green-700 mt-2">Thank you for reaching out. We'll get back to you soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="label flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            Full Name *
                          </label>
                          <input
                            type="text"
                            placeholder="Enter your full name"
                            className={`input ${errors.name ? 'input-error' : ''}`}
                            {...register('name')}
                          />
                          {errors.name && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="label flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            Email Address *
                          </label>
                          <input
                            type="email"
                            placeholder="Enter your email"
                            className={`input ${errors.email ? 'input-error' : ''}`}
                            {...register('email')}
                          />
                          {errors.email && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="label flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="Enter your phone number"
                          className="input"
                          {...register('phone')}
                        />
                      </div>

                      <div>
                        <label className="label flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          Subject *
                        </label>
                        <input
                          type="text"
                          placeholder="What is this about?"
                          className={`input ${errors.subject ? 'input-error' : ''}`}
                          {...register('subject')}
                        />
                        {errors.subject && (
                          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.subject.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="label flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          Message *
                        </label>
                        <textarea
                          rows={5}
                          placeholder="Write your message here..."
                          className={`input resize-none ${errors.message ? 'input-error' : ''}`}
                          {...register('message')}
                        />
                        {errors.message && (
                          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.message.message}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="btn-primary w-full py-3 text-base font-semibold rounded-xl flex items-center justify-center gap-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner spinner-md border-white/30 border-t-white" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </button>

                      <p className="text-xs text-gray-400 text-center">
                        We'll never share your information with third parties.
                      </p>
                    </form>
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              We'd love to hear from you! Reach out to us by phone, email, or through our contact form.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+8801712345678" className="px-8 py-3 bg-white text-primary-700 rounded-xl font-medium hover:bg-gray-100 transition-all flex items-center gap-2 hover:scale-105">
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <a href="mailto:info@beyondsyllabus.com" className="px-8 py-3 border border-white text-white rounded-xl font-medium hover:bg-white/10 transition-all flex items-center gap-2 hover:scale-105">
                <Mail className="w-4 h-4" />
                Email Us
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ContactPage;