import React, { useState } from 'react';
import PublicLayout from '@components/layout/PublicLayout';
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
      // TODO: Integrate with backend email API when ready
      // const response = await fetch('/api/contact/send', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     name: data.name,
      //     email: data.email,
      //     phone: data.phone || '',
      //     subject: data.subject,
      //     message: data.message,
      //   }),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Failed to send message');
      // }

      // For now, simulate successful send (remove this when backend is ready)
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form data:', data);

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setIsSubmitted(true);
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['01887307587', '01550551235'],
      description: 'Call us for immediate assistance'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@beyondthesyllabus.org', 'beyondthesyllabus121@gmail.com'],
      description: 'We\'ll respond within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: [
        'House-19/1/1, Ground & First Floors',
        'Sheikh Shaheb Bazar Road, Azimpur',
        'Dhaka-1205, Bangladesh'
      ],
      description: 'View on Google Maps'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: [
        'Saturday - Tuesday: 9:00 AM - 8:00 PM',
        'Thursday: 9:00 AM - 8:00 PM',
        'Wednesday & Friday: Closed'
      ],
      description: ''
    }
  ];

  const socialLinks = [
    { 
      icon: FacebookIcon, 
      label: 'Facebook', 
      url: 'https://www.facebook.com/BeyondTheSyllabusedu' 
    },
  ];

  return (
    <PublicLayout>
      {/* Hero - Matching Homepage Style */}
      <section className="relative overflow-hidden text-white pt-32 pb-16" style={{ 
        background: 'linear-gradient(115deg, rgba(14,18,53,0.97) 0%, rgba(20,26,74,0.92) 44%, rgba(28,37,100,0.8) 100%)'
      }}>
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1900&q=80" 
            alt="Contact" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(241,89,42,0.08) 0%, transparent 60%)'
        }} />
        <div className="relative z-10 container-fluid text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-200 text-sm font-medium mb-4 backdrop-blur-sm border border-orange-500/10">
            <Mail className="w-4 h-4" />
            Contact Us
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">Get in Touch</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Reach out and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Cards */}
            <div className="lg:col-span-2 space-y-4">
              {contactInfo.map((info, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors duration-300">
                      <info.icon className="w-5 h-5 text-orange-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{info.title}</h4>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-sm text-gray-600">{detail}</p>
                      ))}
                      {info.description && (
                        <p className="text-xs text-gray-400 mt-1">{info.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Social Links */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                <h4 className="font-semibold text-gray-900 mb-4">Connect With Us</h4>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-100 hover:text-orange-500 transition-all duration-200 hover:scale-105"
                      aria-label={social.label}
                    >
                      <social.icon />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="h-48 bg-gray-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3652.8891788523627!2d90.384965!3d23.724806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjPCsDQzJzI5LjMiTiA5MMKwMjMnMDYuMCJF!5e0!3m2!1sen!2sbd!4v1700000000000"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Beyond the Syllabus Location - Azimpur, Dhaka"
                  />
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-900 font-display mb-2">Send a Message</h2>
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
                      className="w-full px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50"
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
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Matching Homepage Style */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(120deg, #f1592a, #df481c)' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="relative z-10 container-fluid max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            We'd love to hear from you! Reach out to us by phone, email, or through our contact form.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+8801887307587" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-bold rounded-full hover:bg-gray-100 hover:-translate-y-0.5 shadow-lg transition-all duration-300">
              <Phone className="w-4 h-4" />
              Call Now
            </a>
            <a href="mailto:info@beyondthesyllabus.org" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/60 text-white font-bold rounded-full hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300">
              <Mail className="w-4 h-4" />
              Email Us
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ContactPage;