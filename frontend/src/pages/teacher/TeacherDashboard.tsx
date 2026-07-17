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
  Sparkles
} from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
      color: 'from-blue-500 to-blue-600',
      description: 'Assigned to you'
    },
    { 
      title: 'My Students', 
      value: totalStudents, 
      icon: Users, 
      color: 'from-emerald-500 to-emerald-600',
      description: 'In your programs'
    },
    { 
      title: 'Mock Tests', 
      value: totalMockTests, 
      icon: FileText, 
      color: 'from-purple-500 to-purple-600',
      description: 'Created by you'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-primary-500/5 p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/5 to-cyan-500/5 rounded-full blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-primary-500" />
              <span className="text-sm font-medium text-primary-600">Teacher Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-display">
              Welcome back, {profile?.fullName || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Employee ID: <span className="font-medium">{profile?.employeeId || 'N/A'}</span>
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
          <span className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-semibold rounded-full shadow-lg shadow-primary-500/20">
            Teacher
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.description}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'My Programs', icon: BookOpen, path: '/teacher/programs', color: 'from-blue-500 to-blue-600' },
          { label: 'My Students', icon: Users, path: '/teacher/students', color: 'from-emerald-500 to-emerald-600' },
          { label: 'Mock Tests', icon: FileText, path: '/teacher/mock-tests', color: 'from-purple-500 to-purple-600' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="group flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg shadow-primary-500/20`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-900">{action.label}</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        ))}
      </div>

      {/* Recent Programs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/50 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            My Assigned Programs
          </h3>
          <Link to="/teacher/programs" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
            View All
          </Link>
        </div>
        {programs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No programs assigned yet</p>
            <p className="text-sm text-gray-400 mt-1">Contact admin for program assignments</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100/50">
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