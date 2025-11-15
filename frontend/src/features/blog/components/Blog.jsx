import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '../../../lib/config/mock';

const Blog = () => {
  return (
    <section id="blog" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 dark:text-cyan-400 font-semibold text-sm uppercase tracking-wide">& Insights</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-4 mb-6">
            Latest from Our Team
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Technical articles, industry insights, and best practices from our engineering team.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-pointer">
              {/* Featured Image */}
              <div className="relative h-48 overflow-hidden bg-gray-900">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                  {post.category}
                </Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="text-gray-600 dark:text-gray-400 line-clamp-3">
                  {post.excerpt}
                </CardDescription>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{post.author}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Engineering Team</p>
                  </div>
                </div>

                {/* Read More */}
                <Button variant="ghost" className="w-full group/btn hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-600 dark:text-cyan-400">
                  Read Article
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20">
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
