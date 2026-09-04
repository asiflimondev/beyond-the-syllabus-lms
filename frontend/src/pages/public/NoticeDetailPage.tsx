import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { noticeApi } from '@api/notice.api';
import PublicLayout from '@components/layout/PublicLayout';
import { 
  ArrowLeft, 
  Calendar, 
  FileText,
  AlertCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';

const NoticeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notice-detail', id],
    queryFn: () => noticeApi.getNoticeById(id!),
    enabled: !!id,
  });

  const notice = data?.data?.data;

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

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <span className="text-gray-600">Loading notice...</span>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (isError || !notice) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Notice Not Found</h2>
            <p className="text-gray-500 mb-6">The notice you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/notices"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Notices
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero Section - Matching Gallery/FAQ Style */}
      <section className="relative overflow-hidden text-white pt-32 pb-16" style={{ 
        background: 'linear-gradient(115deg, rgba(14,18,53,0.97) 0%, rgba(20,26,74,0.92) 44%, rgba(28,37,100,0.8) 100%)'
      }}>
        <div className="relative z-10 container-fluid text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-200 text-sm font-medium mb-4">
            <FileText className="w-4 h-4" />
            Notice
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            {notice.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-white/70 text-sm">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${getCategoryColor(notice.category)}`}>
              {notice.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(notice.publishedAt || notice.createdAt)}
            </span>
          </div>
        </div>
      </section>

      {/* Notice Content */}
      <section className="py-12 bg-gray-50 min-h-[40vh]">
        <div className="container-fluid max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            to="/notices"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Notices
          </Link>

          {/* Notice Content Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8 lg:p-10">
            {/* Content */}
            <div className="prose prose-gray max-w-none">
              {notice.content.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-4 text-base">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-gray-400">
                Last updated: {formatDate(notice.updatedAt)}
              </span>
              <Link
                to="/notices"
                className="text-sm text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1 group"
              >
                View All Notices
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Navigation - Back to Notices */}
          <div className="mt-6 text-center">
            <Link
              to="/notices"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Notices
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default NoticeDetailPage;