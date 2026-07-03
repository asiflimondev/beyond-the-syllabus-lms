import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { teacherApi } from '@api/teacher.api';
import { Link } from 'react-router-dom';
import { BookOpen, Users, FileText, Clock } from 'lucide-react';

interface Program {
  _id: string;
  name: string;
  displayName: {
    en: string;
    bn: string;
  };
  duration: number;
  studentCount?: number;
  mockTestCount?: number;
}

const TeacherPrograms: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['teacher-programs'],
    queryFn: () => teacherApi.getPrograms(),
  });

  const programs = data?.data?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading programs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Programs</h2>
        <p className="text-sm text-gray-500">All programs assigned to you</p>
      </div>

      {programs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No programs assigned yet</p>
          <p className="text-sm text-gray-400">Contact admin for program assignments</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program: Program) => (
            <div key={program._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {program.displayName?.en || program.name}
                  </h3>
                  <p className="text-sm text-gray-500">{program.name}</p>
                </div>
                <div className="flex-shrink-0">
                  <BookOpen className="w-8 h-8 text-primary-600" />
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-primary-600" />
                  <span>{program.duration} months</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-primary-600" />
                  <span>{program.studentCount || 0} students</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-primary-600" />
                  <span>{program.mockTestCount || 0} mock tests</span>
                </div>
              </div>

              <div className="mt-4 flex space-x-3">
                <Link
                  to={`/teacher/students?program=${program._id}`}
                  className="flex-1 text-center px-3 py-2 text-sm text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  View Students
                </Link>
                <Link
                  to={`/teacher/mock-tests?program=${program._id}`}
                  className="flex-1 text-center px-3 py-2 text-sm text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Mock Tests
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherPrograms;