import React from 'react';
import SEO from '../../../components/common/SEO';
import ContactCTA from '../components/ContactCTA';

const ContactPage = () => {
  return (
    <>
      <SEO
        title="Contact Us - Get Your Free Consultation"
        description="Have a project in mind? Contact Kawesh for a free consultation. Let's discuss how we can help bring your vision to life with expert software development."
        keywords="contact kawesh, free consultation, software development inquiry, get quote, project consultation"
      />
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-cyan-950/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-cyan-400 rounded-full text-sm font-semibold">
                Get In Touch
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mt-6 mb-6">
                <span className="text-gray-900 dark:text-white">Let's Build Something</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                  Amazing Together
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Have a project in mind? We'd love to hear about it. Get in touch and let's make it happen.
              </p>
            </div>
          </div>
        </section>

        <ContactCTA />
      </div>
    </>
  );
};

export default ContactPage;
