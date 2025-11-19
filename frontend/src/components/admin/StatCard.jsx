import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = '#F4C2C2', trend }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">{title}</p>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate" style={{ color }}>{value}</h3>
          {trend && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 truncate">{trend}</p>
          )}
        </div>
        {Icon && (
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
