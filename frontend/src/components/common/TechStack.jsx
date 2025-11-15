import React from 'react';
import { Badge } from '../ui/badge';

const TechStack = () => {
  const technologies = [
    { name: "React", category: "Frontend", experience: "8 years", projects: 150, color: "bg-blue-500" },
    { name: "Vue.js", category: "Frontend", experience: "6 years", projects: 80, color: "bg-green-500" },
    { name: "Angular", category: "Frontend", experience: "7 years", projects: 90, color: "bg-red-500" },
    { name: "Node.js", category: "Backend", experience: "8 years", projects: 200, color: "bg-green-600" },
    { name: "Python", category: "Backend", experience: "10 years", projects: 180, color: "bg-yellow-500" },
    { name: "Go", category: "Backend", experience: "5 years", projects: 60, color: "bg-cyan-500" },
    { name: "PostgreSQL", category: "Database", experience: "9 years", projects: 140, color: "bg-blue-600" },
    { name: "MongoDB", category: "Database", experience: "7 years", projects: 120, color: "bg-green-600" },
    { name: "AWS", category: "Cloud", experience: "8 years", projects: 160, color: "bg-orange-500" },
    { name: "Kubernetes", category: "DevOps", experience: "6 years", projects: 85, color: "bg-blue-500" },
    { name: "Docker", category: "DevOps", experience: "7 years", projects: 150, color: "bg-blue-400" },
    { name: "TypeScript", category: "Language", experience: "6 years", projects: 130, color: "bg-blue-600" }
  ];

  return (
    <section id="technologies" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 dark:text-cyan-400 font-semibold text-sm uppercase tracking-wide">Tech Stack</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-4 mb-6">
            Cutting-Edge
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            We leverage modern technologies and frameworks to build robust, scalable solutions.
          </p>
        </div>

        {/* Technologies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-cyan-500"
            >
              {/* Tech Icon/Name */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`w-16 h-16 ${tech.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white font-bold text-xl">{tech.name.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{tech.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {tech.category}
                </Badge>
              </div>

              {/* Hover Details */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-95 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-6">
                <h3 className="font-bold text-lg mb-3">{tech.name}</h3>
                <div className="space-y-1 text-sm text-center">
                  <p className="font-semibold">{tech.experience} experience</p>
                  <p>{tech.projects}+ projects</p>
                  <p className="text-xs opacity-90 mt-2">{tech.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Stack Link */}
        <div className="text-center mt-12">
          <button className="text-blue-600 dark:text-cyan-400 font-semibold hover:underline inline-flex items-center group">
            View Full Technology Stack
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
