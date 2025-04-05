/**
 * Seed data for attractions in the format of our MongoDB schema
 * This data will be used to populate the database with initial attraction data
 */

const attractionsData = [
  {
    name: "Konark Sun Temple",
    type: "temple",
    description: "A magnificent 13th-century Sun Temple known for its exquisite stone carvings and architectural marvel.",
    aiDescription: "The Konark Sun Temple is an architectural masterpiece and a jewel of Odisha's rich cultural heritage. Built in the 13th century by King Narasimhadeva I of the Eastern Ganga Dynasty, this UNESCO World Heritage Site is dedicated to the Sun God, Surya. The temple is designed in the form of a colossal chariot with elaborately carved stone wheels, pillars, and walls. Famous for its precise orientation that allows the first rays of the sun to fall on the main entrance, the temple showcases the pinnacle of Kalinga architecture. The intricate carvings depict various aspects of life, including mythological narratives, sensual sculptures, musical instruments, and scenes from royal courts, making it not just a religious monument but also a testimony to the artistic excellence of ancient Odisha.",
    location: {
      address: "Konark, Puri District, Odisha 752111",
      coordinates: {
        latitude: 19.8876,
        longitude: 86.0945
      }
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/4/47/Konarka_Temple.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/eb/Sun_Temple%2C_Konark.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/65/Wheel_konark.jpg"
    ],
    virtualTour: {
      available: true,
      tourUrl: "https://artsandculture.google.com/streetview/konark-sun-temple/iQFrP21NdTv4_A"
    },
    culturalSignificance: "The Konark Sun Temple is a UNESCO World Heritage Site and one of the most celebrated examples of Kalinga architecture. It represents the culmination of Odishan temple architecture and has strong cultural significance as one of the chariot temples in India. The temple celebrates the worship of Surya, the sun god, and its design as a massive chariot drawn by seven horses represents the seven days of the week.",
    bestTimeToVisit: "October to March, early morning or late afternoon for the best light",
    entryFee: {
      amount: 40,
      currency: "INR"
    },
    openingHours: {
      monday: { open: "06:00", close: "20:00" },
      tuesday: { open: "06:00", close: "20:00" },
      wednesday: { open: "06:00", close: "20:00" },
      thursday: { open: "06:00", close: "20:00" },
      friday: { open: "06:00", close: "20:00" },
      saturday: { open: "06:00", close: "20:00" },
      sunday: { open: "06:00", close: "20:00" }
    },
    tags: ["Heritage", "Temple", "Architecture", "UNESCO", "History"]
  },
  {
    name: "Puri Beach",
    type: "other",
    description: "A sacred beach on the Bay of Bengal with golden sands, religious significance, and stunning sunrises.",
    aiDescription: "Puri Beach, stretching along the Bay of Bengal in the holy city of Puri, is one of Odisha's most celebrated coastal destinations. Known for its golden sands, spiritual significance, and panoramic views, this beach attracts pilgrims and tourists alike. As one of the finest beaches on India's eastern coast, it offers the perfect blend of serenity and activity. The beach is particularly famous for its spectacular sunrises, annual sand art festivals featuring international artists, and its proximity to the revered Jagannath Temple. Visitors can enjoy camel and horse rides, sample fresh seafood from local vendors, or simply relax while watching traditional fishing boats dot the horizon. During religious festivals, especially Rath Yatra, the beach becomes an extension of the celebrations, with devotees taking ritual dips in the sea.",
    location: {
      address: "Puri, Odisha 752001",
      coordinates: {
        latitude: 19.8005,
        longitude: 85.8217
      }
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/3/36/Puri_sea_beach%2C_Odisha.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/77/Puri_Beach.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d5/Puri_Beach_Sunset.jpg"
    ],
    virtualTour: {
      available: false,
      tourUrl: ""
    },
    culturalSignificance: "Puri Beach holds immense religious significance as it is located near the famous Jagannath Temple. Devotees often visit the beach to take a holy dip before visiting the temple. The beach is also known for sand art festivals showcasing intricate sculptures by international artists, celebrating local culture, mythology, and social messages.",
    bestTimeToVisit: "October to February, early morning for sunrise",
    entryFee: {
      amount: 0,
      currency: "INR"
    },
    openingHours: {
      monday: { open: "00:00", close: "23:59" },
      tuesday: { open: "00:00", close: "23:59" },
      wednesday: { open: "00:00", close: "23:59" },
      thursday: { open: "00:00", close: "23:59" },
      friday: { open: "00:00", close: "23:59" },
      saturday: { open: "00:00", close: "23:59" },
      sunday: { open: "00:00", close: "23:59" }
    },
    tags: ["Beach", "Pilgrimage", "Sunrise", "Sand Art", "Seashore"]
  },
  {
    name: "Lingaraj Temple",
    type: "temple",
    description: "A magnificent 11th-century Hindu temple dedicated to Lord Shiva, showcasing stunning Kalinga architecture.",
    aiDescription: "The Lingaraj Temple, one of Odisha's most revered and ancient temples, stands as a magnificent testament to Kalinga architecture in the heart of Bhubaneswar. Built in the 11th century by the Somavanshi dynasty, this imposing structure rises to a height of 180 feet and is dedicated to Lord Shiva, known here as Lingaraj ('King of Lingas'). The temple complex spans over 250,000 square feet and contains over 150 subsidiary shrines, making it one of the largest temple complexes in India. Its intricate stonework, featuring detailed carvings of deities, celestial beings, and geometric patterns, showcases the exceptional craftsmanship of ancient Odishan artisans. As a living temple with active worship for over a thousand years, Lingaraj represents the seamless blend of Shaivism and Vaishnavism traditions, as Lord Shiva is worshipped here as Harihara, a combined form of Shiva and Vishnu.",
    location: {
      address: "Lingaraj Temple Road, Old Town, Bhubaneswar, Odisha 751002",
      coordinates: {
        latitude: 20.2359,
        longitude: 85.8346
      }
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e8/Bhubaneswar_Lingaraja_Temple.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/76/Lingraj_Temple_Bhubaneswar_Front_View.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/9f/Lingaraja_Temple_at_dusk.jpg"
    ],
    virtualTour: {
      available: false,
      tourUrl: ""
    },
    culturalSignificance: "The Lingaraj Temple represents the culmination of Odishan temple architecture and is a testament to the rich cultural and artistic heritage of ancient Odisha. It is one of the most important Shiva temples in India and has been an active place of worship for over a thousand years. The temple complex showcases the evolution of temple building traditions in eastern India and reflects the religious syncretism between Shaivism and Vaishnavism.",
    bestTimeToVisit: "October to March, early morning or evening",
    entryFee: {
      amount: 0,
      currency: "INR"
    },
    openingHours: {
      monday: { open: "05:00", close: "21:00" },
      tuesday: { open: "05:00", close: "21:00" },
      wednesday: { open: "05:00", close: "21:00" },
      thursday: { open: "05:00", close: "21:00" },
      friday: { open: "05:00", close: "21:00" },
      saturday: { open: "05:00", close: "21:00" },
      sunday: { open: "05:00", close: "21:00" }
    },
    tags: ["Temple", "Hindu", "Architecture", "Heritage", "Spiritual"]
  },
  {
    name: "Nandankanan Zoological Park",
    type: "park",
    description: "A premier zoo and botanical garden featuring a wide variety of animals, including white tigers and endangered species.",
    aiDescription: "Nandankanan Zoological Park, established in 1960, is renowned as one of India's most innovative and conservation-focused wildlife sanctuaries. Sprawling over 400 hectares on the banks of Kanjia Lake in Bhubaneswar, it's distinguished by its unique open-moat system that allows animals to live in more natural environments. The park gained international fame for its successful white tiger breeding program, which began in 1980, and currently houses one of the largest collections of these rare tigers in the world. Beyond its captivating residents—which include Asiatic lions, Indian pangolins, melanistic tigers, and over 200 other species—Nandankanan pioneered many firsts in Indian zoos: the first to join the World Association of Zoos and Aquariums, the first with a safari enclosure, and the first to practice in-situ breeding of endangered species. The botanical garden component showcases Odisha's rich flora diversity, with special sections dedicated to medicinal plants and rare species, making it a comprehensive educational experience about regional biodiversity conservation.",
    location: {
      address: "Nandankanan Road, Baranga, Bhubaneswar, Odisha 754005",
      coordinates: {
        latitude: 20.3948,
        longitude: 85.8237
      }
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/5/5d/Nandankanan_Zoological_Park_Entrance.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f4/White_Tiger_in_Nandankanan_Zoological_Park.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6e/Kanjia_lake_in_Nandankanan.jpg"
    ],
    virtualTour: {
      available: false,
      tourUrl: ""
    },
    culturalSignificance: "Nandankanan is the first zoo in India to join the World Association of Zoos and Aquariums and is famous for its white tiger breeding program. The name 'Nandankanan' translates to 'Garden of Heaven', reflecting its rich biodiversity and serene landscape. The park plays a crucial role in wildlife conservation and environmental education in the region.",
    bestTimeToVisit: "October to March, early morning or late afternoon",
    entryFee: {
      amount: 50,
      currency: "INR"
    },
    openingHours: {
      monday: { open: "closed", close: "closed" },
      tuesday: { open: "08:00", close: "17:30" },
      wednesday: { open: "08:00", close: "17:30" },
      thursday: { open: "08:00", close: "17:30" },
      friday: { open: "08:00", close: "17:30" },
      saturday: { open: "08:00", close: "17:30" },
      sunday: { open: "08:00", close: "17:30" }
    },
    tags: ["Wildlife", "Conservation", "White Tigers", "Safari", "Botanical Garden"]
  },
  {
    name: "Dhali Shanti",
    type: "other",
    description: "A serene and peaceful destination known for its natural beauty, cultural significance, and spiritual atmosphere in Bhubaneswar, Odisha.",
    aiDescription: "Dhali Shanti is a revered cultural and spiritual destination nestled in the heart of Bhubaneswar, Odisha. Known for its serene atmosphere and historical significance, it offers visitors a peaceful retreat from the hustle and bustle of city life. The area is characterized by its lush green surroundings, traditional architecture, and cultural importance to the local community. The site features beautifully maintained gardens, meditation spaces, and areas for cultural gatherings. It has become an important center for preserving and promoting Odia traditions, art forms, and spiritual practices. Visitors can experience the rich cultural heritage of Odisha through various activities, performances, and exhibitions regularly held here.",
    location: {
      address: "Dhali Shanti Complex, Chandrasekharpur, Bhubaneswar, Odisha 751016",
      coordinates: {
        latitude: 20.3012,
        longitude: 85.8202
      }
    },
    images: [
      "https://images.unsplash.com/photo-1588416499018-d8c614c1fbfb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1588416757401-fc5437568c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1588417099597-fb0b6c6e108d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    virtualTour: {
      available: false,
      tourUrl: ""
    },
    culturalSignificance: "Dhali Shanti has evolved over the years to become not just a spiritual center but also a hub for cultural exchange and community engagement. Its architecture blends traditional Odia design elements with modern amenities, creating a harmonious space that respects tradition while embracing contemporary needs.",
    bestTimeToVisit: "October to March",
    entryFee: {
      amount: 20,
      currency: "INR"
    },
    openingHours: {
      monday: { open: "06:00", close: "20:00" },
      tuesday: { open: "06:00", close: "20:00" },
      wednesday: { open: "06:00", close: "20:00" },
      thursday: { open: "06:00", close: "20:00" },
      friday: { open: "06:00", close: "20:00" },
      saturday: { open: "06:00", close: "21:00" },
      sunday: { open: "06:00", close: "21:00" }
    },
    tags: ["Cultural", "Spiritual", "Peaceful", "Garden", "Meditation"]
  }
];

module.exports = attractionsData; 