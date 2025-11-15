import React from 'react';
import SEO from '../../../components/common/SEO';
import Hero from '../../../components/common/Hero';
import Services from '../../services/components/Services';
import TechStack from '../../../components/common/TechStack';
import CaseStudies from '../components/CaseStudies';
import Process from '../../../components/common/Process';
import Testimonials from '../../../components/common/Testimonials';
import Blog from '../../blog/components/Blog';
import ContactCTA from '../../contact/components/ContactCTA';

const HomePage = () => {
  return (
    <>
      <SEO
        title="Kawesh - Building Tomorrow's Software Today"
        description="Professional software development agency specializing in custom development, cloud architecture, and digital transformation. Build scalable solutions with our expert team."
        keywords="software development, web development, mobile apps, cloud architecture, digital transformation, custom software, agency"
      />
      <Hero />
      <Services />
      <TechStack />
      <CaseStudies />
      <Process />
      <Testimonials />
      <Blog />
      <ContactCTA />
    </>
  );
};

export default HomePage;
