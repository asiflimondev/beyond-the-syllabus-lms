import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@context/AuthContext';
import { teacherApi } from '@api/teacher.api';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  FileText,
  Calendar,
  ChevronRight,
  User,
  ArrowUpRight,
} from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch data
  const profileQuery: any = useQuery({
    queryKey: ['teacher-profile'],
    queryFn: () => teacherApi.getProfile(),
  });

  const programsQuery: any = useQuery({
    queryKey: ['teacher-programs'],
    queryFn: () => teacherApi.getPrograms(),
  });

  const profile = profileQuery?.data?.data?.data || null;
  const programs = programsQuery?.data?.data?.data || [];

  if (profileQuery.isLoading || programsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner spinner-lg text-primary-600" />
      </div>
    );
  }

  const totalStudents = programs.reduce((acc: number, p: any) => acc + (p.studentCount || 0), 0);
  const totalMockTests = programs.reduce((acc: number, p: any) => acc + (p.mockTestCount || 0), 0);

  const stats = [
    { 
      title: 'My Programs', 
      value: programs.length, 
      icon: BookOpen, 
      color: 'bg-blue-500',
      description: 'Assigned to you'
    },
    { 
      title: 'My Students', 
      value: totalStudents, 
      icon: Users, 
      color: 'bg-green-500',
      description: 'In your programs'
    },
    { 
      title: 'Mock Tests', 
      value: totalMockTests, 
      icon: FileText, 
      color: 'bg-purple-500',
      description: 'Created by you'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-2xl border border-gray-200/50 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Welcome back, {profile?.fullName || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Employee ID: {profile?.employeeId || 'N/A'}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-gray-400" />
                {user?.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
          <span className="badge badge-primary">Teacher</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.description}</p>
              </div>
              <div className={`stat-card-icon ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'My Programs', icon: BookOpen, path: '/teacher/programs', color: 'bg-blue-100 text-blue-600' },
          { label: 'My Students', icon: Users, path: '/teacher/students', color: 'bg-green-100 text-green-600' },
          { label: 'Mock Tests', icon: FileText, path: '/teacher/mock-tests', color: 'bg-purple-100 text-purple-600' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="font-medium text-gray-900">{action.label}</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        ))}
      </div>

      {/* Recent Programs */}
      <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200/50 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">My Assigned Programs</h3>
          <Link to="/teacher/programs" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
            View All
          </Link>
        </div>
        {programs.length === 0 ? (
          <div className="empty-state py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500">No programs assigned yet</p>
            <p className="text-sm text-gray-400 mt-1">Contact admin for program assignments</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {programs.slice(0, 3).map((program: any) => (
              <div key={program._id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => navigate(`/teacher/students?program=${program._id}`)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{program.displayName?.en || program.name}</h4>
                    <p className="text-sm text-gray-500">{program.name} • {program.duration} months</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{program.studentCount || 0} students</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;