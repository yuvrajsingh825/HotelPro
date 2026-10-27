const users = [
  {
    name: 'Alexander Sterling',
    email: 'admin@hotelpro.com',
    phone: '+1 (555) 019-2831',
    password: 'AdminPassword@123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    phone: '+1 (555) 234-5678',
    password: 'GuestPassword@123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'David Miller',
    email: 'david.miller@example.com',
    phone: '+1 (555) 345-6789',
    password: 'GuestPassword@123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Emily Clark',
    email: 'emily.clark@example.com',
    phone: '+1 (555) 456-7890',
    password: 'GuestPassword@123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Michael Ross',
    email: 'michael.ross@example.com',
    phone: '+1 (555) 567-8901',
    password: 'GuestPassword@123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Sophia Martinez',
    email: 'sophia.martinez@example.com',
    phone: '+1 (555) 678-9012',
    password: 'GuestPassword@123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    phone: '+1 (555) 789-0123',
    password: 'GuestPassword@123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
  }
];

const rooms = [
  {
    roomNumber: '101',
    roomType: 'Standard Room',
    description: 'A cozy and modern retreat equipped with high-speed WiFi, plush bedding, and an ergonomic workspace. Ideal for solo travelers and brief city getaways.',
    price: 120,
    capacity: 2,
    bedType: 'Double',
    amenities: ['WiFi', 'AC', 'TV', 'Room Service', 'Safe'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    size: 280,
    floor: 1,
    rating: 4.6
  },
  {
    roomNumber: '102',
    roomType: 'Standard Room',
    description: 'Crisp contemporary style with a queen bed, quiet courtyard view, smart TV, and complimentary organic coffee station.',
    price: 135,
    capacity: 2,
    bedType: 'Queen',
    amenities: ['WiFi', 'AC', 'TV', 'Room Service', 'Breakfast'],
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    size: 310,
    floor: 1,
    rating: 4.7
  },
  {
    roomNumber: '103',
    roomType: 'Standard Room',
    description: 'Comfortable twin room tailored for colleagues or traveling companions. Features two premium single beds and a marble bathroom.',
    price: 130,
    capacity: 2,
    bedType: 'Twin',
    amenities: ['WiFi', 'AC', 'TV', 'Parking', 'Safe'],
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    size: 300,
    floor: 1,
    rating: 4.5
  },
  {
    roomNumber: '201',
    roomType: 'Deluxe Room',
    description: 'Spacious Deluxe haven boasting panoramic city skyline views, a king-size pillow-top bed, rainfall shower, and designer toiletries.',
    price: 199,
    capacity: 3,
    bedType: 'King',
    amenities: ['WiFi', 'AC', 'TV', 'Room Service', 'Breakfast', 'Parking', 'Swimming Pool'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    size: 420,
    floor: 2,
    rating: 4.9
  },
  {
    roomNumber: '202',
    roomType: 'Deluxe Room',
    description: 'Refined comfort featuring private balcony seating, plush queen bedding, espresso machine, and floor-to-ceiling soundproof windows.',
    price: 215,
    capacity: 2,
    bedType: 'Queen',
    amenities: ['WiFi', 'AC', 'TV', 'Room Service', 'Breakfast', 'Swimming Pool', 'Safe'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    size: 440,
    floor: 2,
    rating: 4.8
  },
  {
    roomNumber: '203',
    roomType: 'Deluxe Room',
    description: 'Sun-drenched corner room with dual aspect garden views, deep soaking tub, mini-bar lounge, and personalized concierge access.',
    price: 225,
    capacity: 3,
    bedType: 'King',
    amenities: ['WiFi', 'AC', 'TV', 'Room Service', 'Breakfast', 'Swimming Pool', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Occupied',
    size: 450,
    floor: 2,
    rating: 4.9
  },
  {
    roomNumber: '301',
    roomType: 'Executive Room',
    description: 'Tailored for high-performing executives. Includes private conference desk, Herman Miller seating, complimentary lounge cocktail hour, and express laundry.',
    price: 299,
    capacity: 2,
    bedType: 'King',
    amenities: ['WiFi', 'AC', 'TV', 'Room Service', 'Breakfast', 'Parking', 'Swimming Pool', 'Safe'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    size: 520,
    floor: 3,
    rating: 4.9
  },
  {
    roomNumber: '302',
    roomType: 'Executive Room',
    description: 'Executive corner suite on the 3rd floor featuring dual workstation, soundbar audio, soaking bathtub, and evening hors d’oeuvres.',
    price: 320,
    capacity: 3,
    bedType: 'King',
    amenities: ['WiFi', 'AC', 'TV', 'Room Service', 'Breakfast', 'Parking', 'Swimming Pool', 'Safe'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    size: 540,
    floor: 3,
    rating: 4.8
  },
  {
    roomNumber: '401',
    roomType: 'Suite',
    description: 'The Royal Presidential Suite: opulent living salon, dining area for six, private butler pantry, jacuzzi bath, and breathless sunset views.',
    price: 499,
    capacity: 4,
    bedType: 'King',
    amenities: ['WiFi', 'AC', 'TV', 'Room Service', 'Breakfast', 'Parking', 'Swimming Pool', 'Safe'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    size: 780,
    floor: 4,
    rating: 5.0
  },
  {
    roomNumber: '402',
    roomType: 'Suite',
    description: 'Penthouse Panorama Suite featuring an expansive terrace, outdoor plunge pool, open-concept lounge, and 24/7 dedicated sommelier service.',
    price: 580,
    capacity: 4,
    bedType: 'King',
    amenities: ['WiFi', 'AC', 'TV', 'Room Service', 'Breakfast', 'Parking', 'Swimming Pool', 'Safe'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Maintenance',
    size: 850,
    floor: 4,
    rating: 4.9
  },
  {
    roomNumber: '501',
    roomType: 'Family Room',
    description: 'Generously proportioned family sanctuary with adjoining children’s twin bed alcove, game console, kitchenette, and baby-proofing on request.',
    price: 260,
    capacity: 5,
    bedType: 'Queen',
    amenities: ['WiFi', 'AC', 'TV', 'Room Service', 'Breakfast', 'Parking', 'Swimming Pool', 'Safe'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    size: 620,
    floor: 5,
    rating: 4.8
  },
  {
    roomNumber: '502',
    roomType: 'Family Room',
    description: 'Grand family suite with two private master bedrooms, spacious central dining table, two full bathrooms, and direct pool access.',
    price: 295,
    capacity: 6,
    bedType: 'Double',
    amenities: ['WiFi', 'AC', 'TV', 'Room Service', 'Breakfast', 'Parking', 'Swimming Pool', 'Safe'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    size: 680,
    floor: 5,
    rating: 4.9
  }
];

module.exports = { users, rooms };
