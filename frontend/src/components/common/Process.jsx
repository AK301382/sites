import React from 'react';
import { Search, Pencil, Code2, TestTube, Rocket } from 'lucide-react';

const Process = () => {
  const steps = [
    {
      icon: Search,
      title: "Discovery & Planning",
      duration: "1-2 weeks",
      activities: ["Requirements gathering", "Technical feasibility", "Project roadmap"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Pencil,
      title: "Design & Prototyping",
      duration: "2-4 weeks",
      activities: ["Wireframes", "Design mockups", "Interactive prototype"],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Code2,
      title: "Development Sprints",
      duration: "Agile",
      activities: ["2-week sprints", "Regular demos", "Continuous testing"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: TestTube,
      title: "Testing & QA",
      duration: "Ongoing",
      activities: ["Automated testing", "Manual QA", "Performance testing"],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Rocket,
      title: "Deployment & Support",
      duration: "Continuous",
      activities: ["Staged rollout", "Monitoring", "Ongoing maintenance"],
      color: "from-indigo-500 to-blue-500"
    }
  ];

  return (
    <section id="process" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 dark:text-cyan-400 font-semibold text-sm uppercase tracking-wide">Our</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-4 mb-6">
            How We Work
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            A transparent, agile methodology that keeps you informed every step of the way.
          </p>
        </div>

        {/* Process Timeline - Desktop */}
        <div className="hidden lg:block relative">
          {/* Timeline Line */}
          <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 via-orange-500 to-indigo-500"></div>

          <div className="grid grid-cols-5 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Icon Circle */}
                  <div className="flex justify-center mb-8">
                    <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow">
                    <div className="text-center">
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{step.duration}</span>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2 mb-4">{step.title}</h3>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        {step.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                            <span className="text-left">{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Process Timeline - Mobile */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{step.duration}</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-4">{step.title}</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {step.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Agile Methodology */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Agile Development Approach</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We follow agile principles with 2-week sprints, ensuring flexibility, transparency, and continuous improvement throughout the project lifecycle.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Daily standups for team alignment
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Bi-weekly sprint demos and reviews
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Continuous integration and deployment
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Retrospectives for continuous improvement
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl p-8 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 dark:text-cyan-400 mb-2">2</div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">Week Sprints</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Regular delivery cycles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
