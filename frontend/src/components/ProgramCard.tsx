import React from 'react';
import { Clock, DollarSign, ArrowRight, BookOpen } from 'lucide-react';

interface ProgramCardProps {
  name: string;
  level: string;
  duration: string;
  fee: string;
  icon: string;
  color: string;
  description: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  name,
  level,
  duration,
  fee,
  icon,
  color,
  description,
}) => {
  return (
    <div className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <div className="flex flex-col md:flex-row">
        {/* Left: Banner/Image */}
        <div className="md:w-[35%] relative overflow-hidden">
          <div className={`h-48 md:h-full bg-gradient-to-br ${color} flex items-center justify-center p-8 relative`}>
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl" />
            </div>
            
            {/* Program Icon */}
            <div className="text-6xl md:text-7xl relative z-10 group-hover:scale-110 transition-transform duration-500">
              {icon}
            </div>
            
            {/* Level Badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm z-10">
              {level}
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="md:w-[65%] p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                {name}
              </h3>
              <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                Cambridge
              </span>
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
              {description || `Comprehensive ${name} preparation course for Cambridge English certification.`}
            </p>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-primary-500" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4 text-primary-500" />
                <span>{fee}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="w-4 h-4 text-primary-500" />
                <span>{level} Level</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            <button className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium text-primary-600 border-2 border-primary-200 rounded-xl hover:bg-primary-50 hover:border-primary-400 transition-all duration-200 group/btn">
              <span className="flex items-center justify-center gap-2">
                Details
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;