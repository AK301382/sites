// Portfolio Work Samples - Organized by Service Category

export const portfolioWorks = [
  // Web Design & Development Projects
  {
    id: 'web-1',
    title: 'E-Commerce Fashion Platform',
    category: 'Web Design & Development',
    client: 'Fashion Forward Boutique',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    shortDescription: 'A luxurious e-commerce platform featuring advanced product filtering, AR try-on, and seamless checkout experience.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    results: {
      metric1: '300% Sales Increase',
      metric2: '50K+ Monthly Visitors',
      metric3: '4.8★ User Rating'
    },
    duration: '3 months',
    year: '2024'
  },
  {
    id: 'web-2',
    title: 'Corporate SaaS Dashboard',
    category: 'Web Design & Development',
    client: 'CloudSync Technologies',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
    shortDescription: 'Enterprise-grade analytics dashboard with real-time data visualization and advanced reporting capabilities.',
    technologies: ['React', 'TypeScript', 'D3.js', 'AWS'],
    results: {
      metric1: '99.9% Uptime',
      metric2: '2x User Engagement',
      metric3: 'SOC 2 Compliant'
    },
    duration: '6 months',
    year: '2024'
  },
  {
    id: 'web-3',
    title: 'Modern Portfolio Website',
    category: 'Web Design & Development',
    client: 'Creative Studio X',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
    shortDescription: 'Award-winning portfolio website with smooth animations, interactive galleries, and motion design.',
    technologies: ['Next.js', 'Tailwind', 'GSAP', 'Vercel'],
    results: {
      metric1: '95+ PageSpeed',
      metric2: '400% Lead Gen',
      metric3: 'Award Winner'
    },
    duration: '2 months',
    year: '2024'
  },

  // Mobile App Development Projects
  {
    id: 'mobile-1',
    title: 'Fitness Tracking App',
    category: 'Mobile App Development',
    client: 'FitTrack Pro',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
    shortDescription: 'iOS and Android fitness app with AI-powered workout plans, nutrition tracking, and social features.',
    technologies: ['React Native', 'Firebase', 'TensorFlow', 'Stripe'],
    results: {
      metric1: '500K+ Downloads',
      metric2: '4.7★ App Rating',
      metric3: 'Top 10 Health Apps'
    },
    duration: '5 months',
    year: '2024'
  },
  {
    id: 'mobile-2',
    title: 'E-Commerce Shopping App',
    category: 'Mobile App Development',
    client: 'ShopEasy Mobile',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
    shortDescription: 'Cross-platform shopping app with AR product preview, one-tap checkout, and personalized recommendations.',
    technologies: ['Flutter', 'Node.js', 'MongoDB', 'AWS'],
    results: {
      metric1: '250K Active Users',
      metric2: '$5M Revenue',
      metric3: '65% Retention'
    },
    duration: '4 months',
    year: '2023'
  },
  {
    id: 'mobile-3',
    title: 'Healthcare Patient Portal',
    category: 'Mobile App Development',
    client: 'HealthSync Solutions',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    shortDescription: 'HIPAA-compliant patient app for appointment scheduling, telemedicine, and health record management.',
    technologies: ['Swift', 'Kotlin', 'PostgreSQL', 'Azure'],
    results: {
      metric1: '100K Patients',
      metric2: 'HIPAA Certified',
      metric3: '90% Satisfaction'
    },
    duration: '6 months',
    year: '2023'
  },

  // Digital Marketing Projects
  {
    id: 'marketing-1',
    title: 'SEO Growth Campaign',
    category: 'Digital Marketing',
    client: 'GreenTech Solutions',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800',
    shortDescription: 'Comprehensive SEO strategy that dominated page 1 rankings for competitive keywords in the green energy sector.',
    technologies: ['SEMrush', 'Google Analytics', 'Ahrefs', 'Schema.org'],
    results: {
      metric1: '400% Traffic Growth',
      metric2: 'Page 1 Rankings',
      metric3: '10K+ Leads'
    },
    duration: '6 months',
    year: '2024'
  },
  {
    id: 'marketing-2',
    title: 'Social Media Campaign',
    category: 'Digital Marketing',
    client: 'Nexus Financial Services',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    shortDescription: 'Multi-platform social media campaign generating thousands of qualified B2B leads through strategic content.',
    technologies: ['Meta Ads', 'LinkedIn Ads', 'Hootsuite', 'Canva'],
    results: {
      metric1: '10K Qualified Leads',
      metric2: '300% ROI',
      metric3: '2M+ Impressions'
    },
    duration: '3 months',
    year: '2024'
  },
  {
    id: 'marketing-3',
    title: 'Content Marketing Strategy',
    category: 'Digital Marketing',
    client: 'Artisan Coffee Co',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
    shortDescription: 'Data-driven content marketing increasing brand awareness and driving e-commerce conversions.',
    technologies: ['HubSpot', 'WordPress', 'Mailchimp', 'Google Ads'],
    results: {
      metric1: '250% Lead Increase',
      metric2: '5M+ Reach',
      metric3: '180% Sales Growth'
    },
    duration: '12 months',
    year: '2023'
  },

  // Graphic Design & Branding Projects
  {
    id: 'design-1',
    title: 'Luxury Spa Brand Identity',
    category: 'Graphic Design & Branding',
    client: 'Luxury Spa Retreats',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    shortDescription: 'Complete brand identity including logo, color palette, typography, and brand guidelines for luxury spa chain.',
    technologies: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Figma'],
    results: {
      metric1: 'Award-Winning',
      metric2: '5 Locations',
      metric3: '200% Recognition'
    },
    duration: '2 months',
    year: '2024'
  },
  {
    id: 'design-2',
    title: 'Magazine Rebrand',
    category: 'Graphic Design & Branding',
    client: 'Urban Lifestyle Magazine',
    image: 'https://images.unsplash.com/photo-1524668951403-d44b28200ce0?w=800',
    shortDescription: 'Modern rebrand with fresh visual identity that resonates with millennial and Gen-Z audiences.',
    technologies: ['Adobe Creative Suite', 'Figma', 'Sketch'],
    results: {
      metric1: '150% Readership',
      metric2: 'Design Awards',
      metric3: '80% Brand Recall'
    },
    duration: '3 months',
    year: '2024'
  },
  {
    id: 'design-3',
    title: 'Product Packaging Design',
    category: 'Graphic Design & Branding',
    client: 'Organic Beauty Products',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
    shortDescription: 'Eco-friendly packaging design that increased shelf appeal and product sales significantly.',
    technologies: ['Illustrator', 'Photoshop', '3D Mockups'],
    results: {
      metric1: '180% Sales Increase',
      metric2: 'Retail Expansion',
      metric3: 'Sustainability Award'
    },
    duration: '2 months',
    year: '2023'
  },

  // Video Production Projects
  {
    id: 'video-1',
    title: 'Tech Startup Promo',
    category: 'Video Production',
    client: 'TechStart Innovations',
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800',
    shortDescription: 'Cinematic promotional video that helped secure Series A funding and went viral on social media.',
    technologies: ['Cinema Camera', 'Premiere Pro', 'After Effects', 'DaVinci'],
    results: {
      metric1: '1M+ Views',
      metric2: '$2M Funding',
      metric3: 'Film Festival'
    },
    duration: '1 month',
    year: '2024'
  },
  {
    id: 'video-2',
    title: 'SaaS Explainer Video',
    category: 'Video Production',
    client: 'SaaS Solutions Group',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800',
    shortDescription: 'Animated explainer video simplifying complex software features and driving conversion rates.',
    technologies: ['After Effects', 'Premiere', 'Illustrator', 'Cinema 4D'],
    results: {
      metric1: '85% Conversion',
      metric2: '500K Views',
      metric3: 'Industry Award'
    },
    duration: '6 weeks',
    year: '2024'
  },
  {
    id: 'video-3',
    title: 'Corporate Documentary',
    category: 'Video Production',
    client: 'Global Tech Corp',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
    shortDescription: 'Documentary-style corporate video showcasing company culture and becoming a powerful recruitment tool.',
    technologies: ['4K Cinema', 'Drone', 'Premiere Pro', 'Color Grading'],
    results: {
      metric1: '300% Applications',
      metric2: 'Best Employer',
      metric3: 'Media Featured'
    },
    duration: '2 months',
    year: '2023'
  },

  // Hosting & Technical Support Projects
  {
    id: 'hosting-1',
    title: 'E-Commerce Infrastructure',
    category: 'Hosting & Technical Support',
    client: 'RetailMax E-commerce',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    shortDescription: 'Enterprise hosting migration with zero downtime, 99.9% uptime guarantee, and 24/7 monitoring.',
    technologies: ['AWS', 'CloudFlare', 'Kubernetes', 'Docker'],
    results: {
      metric1: 'Zero Downtime',
      metric2: '99.9% Uptime',
      metric3: '60% Faster'
    },
    duration: 'Ongoing',
    year: '2023-2024'
  },
  {
    id: 'hosting-2',
    title: 'Financial Platform Security',
    category: 'Hosting & Technical Support',
    client: 'FinanceHub Platform',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
    shortDescription: 'Bank-level security implementation with DDoS protection, SSL, and continuous monitoring.',
    technologies: ['Google Cloud', 'Cloudflare', 'Nginx', 'MySQL'],
    results: {
      metric1: '60% Speed Boost',
      metric2: 'Zero Breaches',
      metric3: 'SOC 2 Type II'
    },
    duration: 'Ongoing',
    year: '2023-2024'
  },
  {
    id: 'hosting-3',
    title: 'Healthcare Infrastructure',
    category: 'Hosting & Technical Support',
    client: 'MediPortal Health Services',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    shortDescription: 'HIPAA-compliant hosting infrastructure with encrypted backups and disaster recovery.',
    technologies: ['AWS', 'RDS', 'S3', 'CloudWatch'],
    results: {
      metric1: 'HIPAA Compliant',
      metric2: '99.99% Uptime',
      metric3: 'Auto-Scaling'
    },
    duration: 'Ongoing',
    year: '2022-2024'
  }
];

// Service categories for filtering
export const portfolioCategories = [
  'All',
  'Web Design & Development',
  'Mobile App Development',
  'Digital Marketing',
  'Graphic Design & Branding',
  'Video Production',
  'Hosting & Technical Support'
];
