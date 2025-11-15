// Mock data for Kawesh Software Development Company

export const caseStudies = [
  {
    id: 1,
    title: "FinTech Payment Platform",
    client: "TechBank Solutions",
    industry: "FinTech",
    duration: "8 months",
    teamSize: 6,
    challenge: "Legacy payment system causing transaction delays and security vulnerabilities",
    solution: "Built modern microservices architecture with real-time processing",
    results: {
      performance: 85,
      users: "2M+",
      cost: 40
    },
    technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Kubernetes"],
    image: "https://images.unsplash.com/photo-1509017174183-0b7e0278f1ec?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxmaW50ZWNoJTIwcGF5bWVudHxlbnwwfHx8fDE3NjMyMDAzMzd8MA&ixlib=rb-4.1.0&q=85"
  },
  {
    id: 2,
    title: "Healthcare Patient Portal",
    client: "MediCare Group",
    industry: "HealthTech",
    duration: "6 months",
    teamSize: 5,
    challenge: "Fragmented patient data across multiple systems",
    solution: "Unified portal with HIPAA-compliant data integration",
    results: {
      performance: 70,
      users: "500K+",
      satisfaction: 92
    },
    technologies: ["Vue.js", "Python", "MongoDB", "Azure", "Docker"],
    image: "https://images.pexels.com/photos/6010861/pexels-photo-6010861.jpeg"
  },
  {
    id: 3,
    title: "E-Learning Platform",
    client: "EduTech Innovations",
    industry: "EdTech",
    duration: "10 months",
    teamSize: 8,
    challenge: "Scaling video streaming for 100K+ concurrent users",
    solution: "CDN optimization with adaptive streaming and microlearning modules",
    results: {
      performance: 95,
      users: "1.5M+",
      engagement: 78
    },
    technologies: ["Next.js", "Go", "Redis", "GCP", "Elasticsearch"],
    image: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBlZHVjYXRpb258ZW58MHx8fHwxNzYzMjAwMzU1fDA&ixlib=rb-4.1.0&q=85"
  }
];

export const testimonials = [
  {
    id: 1,
    quote: "Kawesh transformed our legacy system into a modern, scalable platform. Their technical expertise and transparent communication made the entire process smooth.",
    author: "Sarah Johnson",
    role: "CTO",
    company: "TechBank Solutions",
    rating: 5,
    projectType: "Custom Software Development",
    image: "https://images.unsplash.com/photo-1680459575585-390ed5cfcae0"
  },
  {
    id: 2,
    quote: "Working with Kawesh felt like having an in-house team. They understood our healthcare compliance requirements and delivered a secure, user-friendly solution.",
    author: "Dr. Michael Chen",
    role: "VP of Technology",
    company: "MediCare Group",
    rating: 5,
    projectType: "Healthcare Portal",
    image: "https://images.unsplash.com/photo-1622675363311-3e1904dc1885"
  },
  {
    id: 3,
    quote: "The dedicated team from Kawesh scaled our platform to handle millions of users. Their DevOps expertise was exactly what we needed.",
    author: "Alex Rodriguez",
    role: "Head of Engineering",
    company: "EduTech Innovations",
    rating: 5,
    projectType: "Cloud Infrastructure",
    image: "https://images.unsplash.com/photo-1646579886741-12b59840c63f"
  }
];

export const blogPosts = [
  {
    id: 1,
    title: "Microservices vs Monolithic Architecture: Making the Right Choice in 2025",
    excerpt: "Explore the trade-offs between microservices and monolithic architectures, and learn which approach suits your project best.",
    category: "Architecture",
    author: "David Park",
    date: "2025-01-15",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
  },
  {
    id: 2,
    title: "Scaling Node.js Applications: Best Practices from Production",
    excerpt: "Real-world strategies for scaling Node.js applications to handle millions of requests with optimal performance.",
    category: "Backend Development",
    author: "Emily Thompson",
    date: "2025-01-10",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
  },
  {
    id: 3,
    title: "The Future of Web Development: What's Coming in 2025",
    excerpt: "From WebAssembly to AI-powered development tools, discover the trends shaping the future of web development.",
    category: "Industry Insights",
    author: "Marcus Lee",
    date: "2025-01-05",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713"
  }
];

export const technologies = [
  { name: "React", category: "Frontend", experience: "8 years", projects: 150 },
  { name: "Vue.js", category: "Frontend", experience: "6 years", projects: 80 },
  { name: "Angular", category: "Frontend", experience: "7 years", projects: 90 },
  { name: "Node.js", category: "Backend", experience: "8 years", projects: 200 },
  { name: "Python", category: "Backend", experience: "10 years", projects: 180 },
  { name: "Go", category: "Backend", experience: "5 years", projects: 60 },
  { name: "PostgreSQL", category: "Database", experience: "9 years", projects: 140 },
  { name: "MongoDB", category: "Database", experience: "7 years", projects: 120 },
  { name: "AWS", category: "Cloud", experience: "8 years", projects: 160 },
  { name: "Kubernetes", category: "DevOps", experience: "6 years", projects: 85 }
];

export const services = [
  {
    id: 1,
    title: "Custom Software Development",
    description: "Web applications, mobile apps, desktop software, and Progressive Web Apps built with cutting-edge technologies.",
    features: ["Web Applications", "Mobile Apps (iOS, Android)", "Desktop Software", "Progressive Web Apps"]
  },
  {
    id: 2,
    title: "Product Design & UX",
    description: "User research, UI/UX design, prototyping, and design systems that create intuitive experiences.",
    features: ["User Research", "UI/UX Design", "Prototyping", "Design Systems"]
  },
  {
    id: 3,
    title: "Cloud & DevOps",
    description: "AWS, Azure, GCP infrastructure, CI/CD pipelines, and monitoring solutions for scalable applications.",
    features: ["Cloud Migration", "CI/CD Pipelines", "Infrastructure as Code", "Monitoring"]
  },
  {
    id: 4,
    title: "Legacy Modernization",
    description: "Transform outdated systems with code refactoring, modern stack migration, and performance optimization.",
    features: ["Code Refactoring", "Stack Migration", "Performance Optimization", "Security Updates"]
  },
  {
    id: 5,
    title: "Dedicated Teams",
    description: "Staff augmentation and long-term partnerships with dedicated agile teams that scale with your needs.",
    features: ["Staff Augmentation", "Long-term Partnerships", "Agile Teams", "Scalable Resources"]
  },
  {
    id: 6,
    title: "Consulting & Strategy",
    description: "Technical architecture planning, technology selection, and digital transformation guidance.",
    features: ["Technical Architecture", "Technology Selection", "Digital Transformation", "Best Practices"]
  }
];

export const processSteps = [
  {
    id: 1,
    title: "Discovery & Planning",
    duration: "1-2 weeks",
    activities: ["Requirements gathering", "Technical feasibility", "Project roadmap"]
  },
  {
    id: 2,
    title: "Design & Prototyping",
    duration: "2-4 weeks",
    activities: ["Wireframes", "Design mockups", "Interactive prototype"]
  },
  {
    id: 3,
    title: "Development Sprints",
    duration: "Agile",
    activities: ["2-week sprints", "Regular demos", "Continuous testing"]
  },
  {
    id: 4,
    title: "Testing & QA",
    duration: "Ongoing",
    activities: ["Automated testing", "Manual QA", "Performance testing"]
  },
  {
    id: 5,
    title: "Deployment & Support",
    duration: "Continuous",
    activities: ["Staged rollout", "Monitoring", "Ongoing maintenance"]
  }
];
