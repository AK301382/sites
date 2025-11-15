import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  const [codeText, setCodeText] = useState('');
  const fullCode = `function buildAmazing() {
  const vision = getUserIdea();
  const solution = design(vision);
  const product = develop(solution);
  return deploy(product);
}`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullCode.length) {
        setCodeText(fullCode.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-cyan-950/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-cyan-400 rounded-full text-sm font-semibold">
                Kawesh - Building Tomorrow's Software
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-gray-900 dark:text-white">We Build</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                Software That Scales
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
              Transform your vision into powerful, scalable software solutions. We specialize in custom development, cloud architecture, and digital transformation for forward-thinking companies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white group">
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 group">
                <Play className="mr-2 w-5 h-5" />
                View Our Work
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">200+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Projects Delivered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Enterprise Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Client Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right: Animated Code Editor */}
          <div className="relative">
            <div className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
              {/* Window Controls */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-sm text-gray-400">build-amazing.js</span>
              </div>

              {/* Code Content */}
              <div className="p-6 font-mono text-sm">
                <pre className="text-gray-300">
                  <code>
                    {codeText.split('\n').map((line, i) => (
                      <div key={i} className="hover:bg-gray-800/50 transition-colors">
                        <span className="text-gray-500 select-none mr-4">{i + 1}</span>
                        <span className="text-purple-400">function</span>
                        <span className="text-yellow-400"> buildAmazing</span>
                        <span className="text-gray-300">() {'{'}</span>
                        {i === 0 && line.includes('buildAmazing') && ''}
                        {i === 1 && (
                          <>
                            <br />
                            <span className="text-gray-500 select-none mr-4">2</span>
                            <span className="text-purple-400">  const</span>
                            <span className="text-cyan-400"> vision</span>
                            <span className="text-gray-300"> = </span>
                            <span className="text-yellow-400">getUserIdea</span>
                            <span className="text-gray-300">();</span>
                          </>
                        )}
                        {i === 2 && (
                          <>
                            <br />
                            <span className="text-gray-500 select-none mr-4">3</span>
                            <span className="text-purple-400">  const</span>
                            <span className="text-cyan-400"> solution</span>
                            <span className="text-gray-300"> = </span>
                            <span className="text-yellow-400">design</span>
                            <span className="text-gray-300">(vision);</span>
                          </>
                        )}
                        {i === 3 && (
                          <>
                            <br />
                            <span className="text-gray-500 select-none mr-4">4</span>
                            <span className="text-purple-400">  const</span>
                            <span className="text-cyan-400"> product</span>
                            <span className="text-gray-300"> = </span>
                            <span className="text-yellow-400">develop</span>
                            <span className="text-gray-300">(solution);</span>
                          </>
                        )}
                        {i === 4 && (
                          <>
                            <br />
                            <span className="text-gray-500 select-none mr-4">5</span>
                            <span className="text-purple-400">  return</span>
                            <span className="text-yellow-400"> deploy</span>
                            <span className="text-gray-300">(product);</span>
                          </>
                        )}
                        {i === 5 && (
                          <>
                            <br />
                            <span className="text-gray-500 select-none mr-4">6</span>
                            <span className="text-gray-300">{'}'}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </code>
                </pre>
              </div>

              {/* Transformation Arrow */}
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 hidden xl:block">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                  <ArrowRight className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Product Mockup Overlay */}
            <div className="absolute -bottom-10 -right-10 hidden xl:block">
              <div className="w-64 h-48 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 transform rotate-3 hover:rotate-0 transition-transform">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded"></div>
                    <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="flex gap-2 pt-2">
                    <div className="flex-1 h-8 bg-blue-500 rounded"></div>
                    <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
