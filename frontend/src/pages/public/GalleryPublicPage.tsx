import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@components/layout/PublicLayout';
import AnimatedSection from '@components/AnimatedSection';
import {
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Image as ImageIcon,
  Users,
  Calendar,
  BookOpen,
  Sparkles
} from 'lucide-react';

type GalleryCategory = 'all' | 'classroom' | 'events' | 'programs' | 'facility';

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: GalleryCategory;
  date: string;
}

const GalleryPublicPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const galleryImages: GalleryImage[] = [
    // Classroom Images
    {
      id: '1',
      title: 'Modern Classroom',
      description: 'Our state-of-the-art classroom with smart board technology',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop',
      category: 'classroom',
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'Interactive Learning',
      description: 'Students engaged in interactive group activities',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop',
      category: 'classroom',
      date: '2024-02-20'
    },
    {
      id: '3',
      title: 'Smart Classroom',
      description: 'Technology-enabled classroom for enhanced learning',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
      category: 'classroom',
      date: '2024-03-10'
    },
    {
      id: '4',
      title: 'Student Collaboration',
      description: 'Students working together on group projects',
      imageUrl: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=600&h=400&fit=crop',
      category: 'classroom',
      date: '2024-04-05'
    },
    // Events Images
    {
      id: '5',
      title: 'Graduation Ceremony',
      description: 'Celebrating our students\' success and achievements',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=600&h=400&fit=crop',
      category: 'events',
      date: '2024-05-15'
    },
    {
      id: '6',
      title: 'Award Ceremony',
      description: 'Recognizing outstanding student performance',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop',
      category: 'events',
      date: '2024-06-20'
    },
    {
      id: '7',
      title: 'Annual Day Celebration',
      description: 'Students performing at our annual day event',
      imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600&h=400&fit=crop',
      category: 'events',
      date: '2024-07-10'
    },
    // Programs Images
    {
      id: '8',
      title: 'Cambridge Exam Preparation',
      description: 'Students preparing for Cambridge English exams',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
      category: 'programs',
      date: '2024-08-15'
    },
    {
      id: '9',
      title: 'Speaking Practice Session',
      description: 'Students practicing their speaking skills',
      imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=400&fit=crop',
      category: 'programs',
      date: '2024-09-05'
    },
    {
      id: '10',
      title: 'Writing Workshop',
      description: 'Developing academic writing skills',
      imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop',
      category: 'programs',
      date: '2024-10-20'
    },
    // Facility Images
    {
      id: '11',
      title: 'Library & Study Area',
      description: 'Quiet study space with extensive resources',
      imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop',
      category: 'facility',
      date: '2024-11-01'
    },
    {
      id: '12',
      title: 'Student Lounge',
      description: 'Comfortable lounge area for students to relax',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
      category: 'facility',
      date: '2024-12-10'
    }
  ];

  const categories: { value: GalleryCategory; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All Photos', icon: <ImageIcon className="w-4 h-4" /> },
    { value: 'classroom', label: 'Classroom', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { value: 'programs', label: 'Programs', icon: <Sparkles className="w-4 h-4" /> },
    { value: 'facility', label: 'Facility', icon: <Users className="w-4 h-4" /> },
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const getCategoryCount = (category: GalleryCategory) => {
    if (category === 'all') return galleryImages.length;
    return galleryImages.filter(img => img.category === category).length;
  };

  const handlePrevImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    setSelectedImage(filteredImages[prevIndex]);
  };

  const handleNextImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(filteredImages[nextIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, filteredImages]);

  return (
    <PublicLayout>
      {/* Hero */}
      <AnimatedSection>
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
              <p className="text-lg text-primary-100 max-w-3xl mx-auto">
                Explore photos from our classrooms, events, and student activities at Beyond the Syllabus.
              </p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Gallery Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.icon}
                  <span>{category.label}</span>
                  <span className={`text-xs ${selectedCategory === category.value ? 'text-primary-200' : 'text-gray-400'}`}>
                    ({getCategoryCount(category.value)})
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 bg-white rounded-xl border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No photos found in this category.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
                <AnimatedSection key={image.id} delay={index * 50}>
                  <div
                    onClick={() => setSelectedImage(image)}
                    className="group relative overflow-hidden rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h4 className="text-sm font-semibold">{image.title}</h4>
                        <p className="text-xs text-gray-200">{image.date}</p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.category}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredImages.map((image, index) => (
                <AnimatedSection key={image.id} delay={index * 50}>
                  <div
                    onClick={() => setSelectedImage(image)}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row gap-4"
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full sm:w-48 h-32 object-cover rounded-xl"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{image.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{image.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{image.date}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {image.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          <div className="text-center text-sm text-gray-500 mt-6">
            Showing {filteredImages.length} of {galleryImages.length} photos
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={handlePrevImage}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[90vh] mx-4">
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-2xl">
              <h3 className="text-xl font-semibold text-white">{selectedImage.title}</h3>
              <p className="text-gray-200 text-sm">{selectedImage.description}</p>
              <p className="text-gray-300 text-xs mt-1">{selectedImage.date}</p>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
            {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} of {filteredImages.length}
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-4">Visit Our Center</h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              See our facilities and meet our team in person. Contact us to schedule a visit.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="px-8 py-3 bg-white text-primary-700 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                Contact Us
              </Link>
              <Link to="/programs" className="px-8 py-3 border border-white text-white rounded-xl font-medium hover:bg-white/10 transition-colors">
                Our Programs
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PublicLayout>
  );
};

export default GalleryPublicPage;