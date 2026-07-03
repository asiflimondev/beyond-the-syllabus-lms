import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@context/AuthContext';
import { teacherApi } from '@api/teacher.api';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  FileText,
  Calendar,
  Clock,
  ChevronRight,
  User,
  TrendingUp,
  Award,
} from 'lucide-react';

interface Program {
  _id: string;
  name: string;
  displayName: {
    en: string;
    bn: string;
  };
  duration: number;
  fee: number;
  studentCount?: number;
  mockTestCount?: number;
}

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch teacher profile
  const profileQuery: any = useQuery({
    queryKey: ['teacher-profile'],
    queryFn: () => teacherApi.getProfile(),
  });

  // Fetch teacher's programs
  const programsQuery: any = useQuery({
    queryKey: ['teacher-programs'],
    queryFn: () => teacherApi.getPrograms(),
  });

  // Fetch all students for all programs
  const studentsQuery: any = useQuery({
    queryKey: ['teacher-all-students'],
    queryFn: async () => {
      // Get all programs first
      const programsRes = await teacherApi.getPrograms();
      const programs = programsRes?.data?.data || [];
      
      // Fetch students for each program
      let allStudents: any[] = [];
      for (const program of programs) {
        const studentsRes = await teacherApi.getStudentsByProgram(program._id, { limit: 100 });
        const students = studentsRes?.data?.data?.students || [];
        allStudents = [...allStudents, ...students.map((s: any) => ({ ...s, programName: program.displayName?.en || program.name }))];
      }
      
      return { data: { data: { students: allStudents, total: allStudents.length } } };
    },
  });

  // Fetch all mock tests
  const mockTestsQuery: any = useQuery({
    queryKey: ['teacher-all-mocktests'],
    queryFn: async () => {
      const programsRes = await teacherApi.getPrograms();
      const programs = programsRes?.data?.data || [];
      
      let allMockTests: any[] = [];
      for (const program of programs) {
        const mockTestsRes = await teacherApi.getMockTestsByProgram(program._id);
        const mockTests = mockTestsRes?.data?.data || [];
        allMockTests = [...allMockTests, ...mockTests.map((m: any) => ({ ...m, programName: program.displayName?.en || program.name }))];
      }
      
      return { data: { data: allMockTests } };
    },
  });

  const profile = profileQuery?.data?.data?.data || null;
  const programs = programsQuery?.data?.data?.data || [];
  const students = studentsQuery?.data?.data?.data?.students || [];
  const mockTests = mockTestsQuery?.data?.data?.data || [];

  const isLoading = profileQuery.isLoading || programsQuery.isLoading;

  // Stats
  const totalStudents = students.length;
  const totalMockTests = mockTests.length;

  const stats = [
    { 
      title: 'My Programs', 
      value: programs.length, 
      icon: BookOpen, 
      color: 'bg-blue-500',
      description: 'Programs assigned to you'
    },
    { 
      title: 'My Students', 
      value: totalStudents, 
      icon: Users, 
      color: 'bg-green-500',
      description: 'Total students in your programs'
    },
    { 
      title: 'Mock Tests', 
      value: totalMockTests, 
      icon: FileText, 
      color: 'bg-purple-500',
      description: 'Tests created by you'
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome, {profile?.fullName || user?.email}!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Employee ID: {profile?.employeeId || 'N/A'}
            </p>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {user?.email}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
              Teacher
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards - Now with Real Data */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/teacher/programs')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow hover:border-primary-300 text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">My Programs</h4>
              <p className="text-sm text-gray-500">View all your assigned programs</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </button>

        <button
          onClick={() => navigate('/teacher/students')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow hover:border-primary-300 text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">My Students</h4>
              <p className="text-sm text-gray-500">View all students in your programs</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </button>

        <button
          onClick={() => navigate('/teacher/mock-tests')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow hover:border-primary-300 text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Mock Tests</h4>
              <p className="text-sm text-gray-500">View all your mock tests</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </button>
      </div>

      {/* Recent Mock Tests Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Mock Tests</h3>
          <Link
            to="/teacher/mock-tests"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            View All
          </Link>
        </div>
        {mockTests.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No mock tests created yet</p>
            <p className="text-sm text-gray-400">Create your first mock test</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {mockTests.slice(0, 3).map((test: any) => (
              <div key={test._id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/teacher/mark-entry/${test._id}`)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {test.title || `Mock Test ${test.testNumber}`}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {test.programName || 'Unknown Program'} • Test #{test.testNumber}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">
                      {new Date(test.testDate).toLocaleDateString()}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
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