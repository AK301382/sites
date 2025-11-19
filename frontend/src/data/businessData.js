// Business data and content for Le Nails

export const businessInfo = {
  name: "Le Nails",
  tagline: "Where nails become art",
  phone: "+41768027979",
  email: "Nhunglee277@gmail.com",
  address: "Gerechtigkeitsgasse 45, 3011 Bern",
  facebook: "https://www.facebook.com/Nailsbyle2021",
  instagram: "https://www.instagram.com/le_nails_bern/?hl=fa",
  instagramHandle: "@le_nails_bern",
  hours: [
    { day: "sunday", hours: "Geschlossen" },
    { day: "monday", hours: "9:00 - 18:30" },
    { day: "tuesday", hours: "9:00 - 18:30" },
    { day: "wednesday", hours: "9:00 - 18:30" },
    { day: "thursday", hours: "9:00 - 18:30" },
    { day: "friday", hours: "9:00 - 18:30" },
    { day: "saturday", hours: "9:00 - 17:00" }
  ]
};

export const services = [
  {
    id: 1,
    name: "Maniküre",
    nameKey: "manicure",
    description: "Professionelle Nagelpflege und Gestaltung",
    price: "CHF 35",
    priceValue: 35,
    duration: "45 Min",
    icon: "sparkles",
    category: "hands"
  },
  {
    id: 2,
    name: "Gel-Maniküre",
    nameKey: "gelManicure",
    description: "Langanhaltende Gel-Politur",
    price: "CHF 55",
    priceValue: 55,
    duration: "60 Min",
    icon: "star",
    category: "hands"
  },
  {
    id: 3,
    name: "Pediküre",
    nameKey: "pedicure",
    description: "Verwöhnung für Ihre Füße",
    price: "CHF 45",
    priceValue: 45,
    duration: "60 Min",
    icon: "heart",
    category: "feet"
  },
  {
    id: 4,
    name: "Acrylnägel",
    nameKey: "acrylic",
    description: "Kunstnägel für perfekte Länge",
    price: "CHF 80",
    priceValue: 80,
    duration: "90 Min",
    icon: "gem",
    category: "hands"
  },
  {
    id: 5,
    name: "Fußmassage",
    nameKey: "footMassage",
    description: "Entspannende Fußmassage",
    price: "CHF 30",
    priceValue: 30,
    duration: "30 Min",
    icon: "flower",
    category: "feet"
  },
  {
    id: 6,
    name: "Wimpernbehandlung",
    nameKey: "eyelash",
    description: "Professionelle Wimpernbehandlung",
    price: "CHF 65",
    priceValue: 65,
    duration: "45 Min",
    icon: "eye",
    category: "beauty"
  },
  {
    id: 7,
    name: "Wimpernwelle",
    nameKey: "lashLift",
    description: "Wimpernwelle für natürlichen Schwung",
    price: "CHF 75",
    priceValue: 75,
    duration: "60 Min",
    icon: "sparkle",
    category: "beauty"
  }
];

export const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=60",
    alt: "Elegant nude nails",
    style: "Minimalistisch",
    category: "minimalist"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&q=60",
    alt: "French manicure",
    style: "Klassisch",
    category: "classic"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&q=60",
    alt: "Colorful nail art",
    style: "Künstlerisch",
    category: "artistic"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&q=60",
    alt: "Gel nails",
    style: "Gel",
    category: "gel"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&q=60",
    alt: "Pink nail polish",
    style: "Klassisch",
    category: "classic"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1583001529966-2c89b9d4a6f9?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1583001529966-2c89b9d4a6f9?w=400&q=60",
    alt: "Nail art design",
    style: "Modern",
    category: "modern"
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=60",
    alt: "Manicure session",
    style: "Spa",
    category: "spa"
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1609720201232-42e1dbfe46a0?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1609720201232-42e1dbfe46a0?w=400&q=60",
    alt: "Acrylic nails",
    style: "Acryl",
    category: "acrylic"
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1599206676335-193c82b13c9e?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1599206676335-193c82b13c9e?w=400&q=60",
    alt: "Red nail polish",
    style: "Elegant",
    category: "classic"
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&q=60",
    alt: "Pastel nails",
    style: "Zart",
    category: "minimalist"
  },
  {
    id: 11,
    url: "https://images.unsplash.com/photo-1604654894956-0c69e72c8ef2?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1604654894956-0c69e72c8ef2?w=400&q=60",
    alt: "Glitter nails",
    style: "Glamourös",
    category: "artistic"
  },
  {
    id: 12,
    url: "https://images.unsplash.com/photo-1610992015760-248cf627e4bb?w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1610992015760-248cf627e4bb?w=400&q=60",
    alt: "Natural nails",
    style: "Natürlich",
    category: "minimalist"
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Anna M.",
    rating: 5,
    text: "Beste Maniküre in Bern! Ich bin begeistert!",
    date: "Vor 2 Wochen"
  },
  {
    id: 2,
    name: "Sophie L.",
    rating: 5,
    text: "Wunderschöne Nägel, professioneller Service!",
    date: "Vor 1 Monat"
  },
  {
    id: 3,
    name: "Maria K.",
    rating: 5,
    text: "Immer perfekt! Komme gerne wieder.",
    date: "Vor 3 Wochen"
  },
  {
    id: 4,
    name: "Laura B.",
    rating: 5,
    text: "Super freundlich und sauber! Absolute Empfehlung.",
    date: "Vor 1 Woche"
  }
];

export const whyChooseUs = [
  {
    icon: "award",
    title: "Erfahrene Nageldesigner",
    titleKey: "experts",
    description: "Lizenziert und professionell ausgebildet",
    descKey: "expertsDesc"
  },
  {
    icon: "shield-check",
    title: "Medizinische Sterilisation",
    titleKey: "sterilization",
    description: "Höchste Hygienestandards",
    descKey: "sterilizationDesc"
  },
  {
    icon: "leaf",
    title: "Vegane Produkte",
    titleKey: "vegan",
    description: "Ungiftige und vegane Lacke verfügbar",
    descKey: "veganDesc"
  },
  {
    icon: "crown",
    title: "Luxusprodukte",
    titleKey: "luxury",
    description: "Premium Marken für beste Qualität",
    descKey: "luxuryDesc"
  },
  {
    icon: "smile",
    title: "Entspannende Atmosphäre",
    titleKey: "atmosphere",
    description: "Wohlfühlerlebnis garantiert",
    descKey: "atmosphereDesc"
  },
  {
    icon: "clock",
    title: "Flexible Termine",
    titleKey: "flexible",
    description: "Rufen Sie uns einfach an",
    descKey: "flexibleDesc"
  }
];
