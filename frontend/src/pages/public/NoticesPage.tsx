import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { noticeApi, Notice } from '@api/notice.api';
import PublicLayout from '@components/layout/PublicLayout';
import { 
  FileText, 
  Calendar, 
  ChevronRight, 
  Search, 
  Filter,
  AlertCircle
} from 'lucide-react';

const NoticesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['published-notices', page, selectedCategory],
    queryFn: () => noticeApi.getPublishedNotices(page, limit),
  });

  const notices = data?.data?.data?.notices || [];
  const pagination = data?.data?.data?.pagination;

  const categories = ['General', 'Admission', 'Exam', 'Class', 'Holiday', 'Event', 'Important'];

  const filteredNotices = selectedCategory === 'all'
    ? notices
    : notices.filter((n: Notice) => n.category === selectedCategory);

  const searchedNotices = searchTerm
    ? filteredNotices.filter((n: Notice) =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredNotices;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      General: 'bg-blue-100 text-blue-700',
      Admission: 'bg-green-100 text-green-700',
      Exam: 'bg-orange-100 text-orange-700',
      Class: 'bg-purple-100 text-purple-700',
      Holiday: 'bg-red-100 text-red-700',
      Event: 'bg-pink-100 text-pink-700',
      Important: 'bg-amber-100 text-amber-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white pt-32 pb-16" style={{ 
        background: 'linear-gradient(115deg, rgba(14,18,53,0.97) 0%, rgba(20,26,74,0.92) 44%, rgba(28,37,100,0.8) 100%)'
      }}>
        <div className="relative z-10 container-fluid text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-200 text-sm font-medium mb-4">
            <FileText className="w-4 h-4" />
            Notices
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">Notices</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Stay updated with the latest announcements, schedules, and important information from Beyond the Syllabus.
          </p>
        </div>
      </section>

      {/* Notices Content */}
      <section className="py-12 bg-gray-50 min-h-[400px]">
        <div className="container-fluid max-w-6xl mx-auto">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-500 mb-4">
            {searchedNotices.length} {searchedNotices.length === 1 ? 'notice' : 'notices'} found
          </div>

          {/* Notices List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
              <span className="ml-3 text-gray-600">Loading notices...</span>
            </div>
          ) : isError ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Failed to load notices. Please try again later.</p>
            </div>
          ) : searchedNotices.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">No notices found</h3>
              <p className="text-gray-500 mt-1">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Check back later for updates'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchedNotices.map((notice: Notice) => (
                <Link
                  key={notice._id}
                  to={`/notices/${notice._id}`}
                  className="block bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notice.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${getCategoryColor(notice.category)}`}>
                        {notice.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(notice.publishedAt || notice.createdAt)}</span>
                    </div>
                    <span className="text-sm text-orange-600 font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read More
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default NoticesPage;