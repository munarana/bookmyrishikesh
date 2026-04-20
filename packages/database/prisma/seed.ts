import {
  BlogCategory,
  BookingStatus,
  CourseLevel,
  PaymentStatus,
  PostStatus,
  PrismaClient,
  Role,
  SchoolStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type SchoolSeed = {
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  address: string;
  tagline: string;
  description: string;
  styles: string[];
  amenities: string[];
  certifications: string[];
  coverPhoto: string;
  gallery: string[];
  website: string;
  phone: string;
  businessRegistrationNo: string;
  yogaCertificateUrl: string;
  personalIdUrl: string;
  status: SchoolStatus;
  isPublished: boolean;
  isFeatured: boolean;
  avgRating: number;
  totalReviews: number;
};

type StudentSeed = {
  name: string;
  email: string;
  nationality: string;
  phone: string;
  isActive: boolean;
};

type CourseSeed = {
  name: string;
  category: string;
  style: string;
  level: CourseLevel;
  durationDays: number;
  priceUSD: number;
  priceINR: number;
  description: string;
  highlights: string[];
  includedItems: string[];
  excludes: string[];
  roomTypes: Array<{ type: string; priceAddon: number }>;
};

const schoolSeeds: SchoolSeed[] = [
  {
    name: "Ganga Flow Yoga School",
    slug: "ganga-flow-yoga-school",
    ownerName: "Amit Rawat",
    ownerEmail: "ganga.flow@example.com",
    address: "Upper Tapovan, Badrinath Road, Rishikesh, Uttarakhand 249192",
    tagline: "Traditional TTCs with a calm Himalayan campus near the Ganga.",
    description:
      "Ganga Flow Yoga School offers immersive teacher training and retreat stays designed for students who want disciplined practice, supportive teachers, and a peaceful base in Upper Tapovan.",
    styles: ["Hatha", "Ashtanga", "Pranayama", "Meditation"],
    amenities: ["WiFi", "Airport Pickup", "Ayurvedic Meals", "Hot Water", "Rooftop Shala"],
    certifications: ["Yoga Alliance RYS 200", "Yoga Alliance RYS 300"],
    coverPhoto: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=1200&auto=format&fit=crop",
    ],
    website: "https://ganga-flow-yoga-school.example.com",
    phone: "+91-8010010001",
    businessRegistrationNo: "UKD-RYS-2026-001",
    yogaCertificateUrl: "https://placehold.co/1200x800?text=Yoga+Alliance+Certificate",
    personalIdUrl: "https://placehold.co/1200x800?text=Owner+Passport",
    status: SchoolStatus.APPROVED,
    isPublished: true,
    isFeatured: true,
    avgRating: 4.9,
    totalReviews: 186,
  },
  {
    name: "Satva Roots Academy",
    slug: "satva-roots-academy",
    ownerName: "Neha Bisht",
    ownerEmail: "satva.roots@example.com",
    address: "Laxman Jhula Road, Tapovan, Rishikesh, Uttarakhand 249192",
    tagline: "Multi-style TTCs and healing retreats for international students.",
    description:
      "Satva Roots Academy blends traditional yogic education with structured teaching practice, restorative therapies, and comfortable residential accommodation in central Tapovan.",
    styles: ["Multi-style", "Yin", "Meditation", "Ayurveda"],
    amenities: ["WiFi", "Private Rooms", "Meals Included", "Laundry", "Sound Healing"],
    certifications: ["Yoga Alliance RYS 200", "Yoga Alliance RYS 500"],
    coverPhoto: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508704019882-f9cf40e475b4?q=80&w=1200&auto=format&fit=crop",
    ],
    website: "https://satva-roots-academy.example.com",
    phone: "+91-8010010002",
    businessRegistrationNo: "UKD-RYS-2026-002",
    yogaCertificateUrl: "https://placehold.co/1200x800?text=School+Registration+Certificate",
    personalIdUrl: "https://placehold.co/1200x800?text=Owner+Passport",
    status: SchoolStatus.APPROVED,
    isPublished: true,
    isFeatured: true,
    avgRating: 4.8,
    totalReviews: 203,
  },
  {
    name: "Prana Mandala Institute",
    slug: "prana-mandala-institute",
    ownerName: "Shivani Sati",
    ownerEmail: "prana.mandala@example.com",
    address: "Near Ram Jhula Taxi Stand, Rishikesh, Uttarakhand 249201",
    tagline: "Focused TTCs with pranayama, anatomy, and strong mentoring.",
    description:
      "Prana Mandala Institute is built for committed students seeking a grounded, mentor-led journey through asana, breathwork, yogic philosophy, and practical teaching methodology.",
    styles: ["Hatha", "Vinyasa", "Pranayama", "Alignment"],
    amenities: ["Mountain View", "Sattvic Meals", "Course Manual", "WiFi", "Weekly Excursions"],
    certifications: ["Yoga Alliance RYS 200", "Yoga Alliance RYS 300"],
    coverPhoto: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524863479829-916d8e77f114?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
    ],
    website: "https://prana-mandala-institute.example.com",
    phone: "+91-8010010003",
    businessRegistrationNo: "UKD-RYS-2026-003",
    yogaCertificateUrl: "https://placehold.co/1200x800?text=Yoga+Certification",
    personalIdUrl: "https://placehold.co/1200x800?text=Owner+National+ID",
    status: SchoolStatus.APPROVED,
    isPublished: true,
    isFeatured: false,
    avgRating: 4.7,
    totalReviews: 128,
  },
  {
    name: "Ananda Valley Yogshala",
    slug: "ananda-valley-yogshala",
    ownerName: "Karan Dangwal",
    ownerEmail: "ananda.valley@example.com",
    address: "High Bank, Tapovan, Rishikesh, Uttarakhand 249137",
    tagline: "Residential yoga training with restorative retreat options.",
    description:
      "Ananda Valley Yogshala provides teacher training and retreat experiences with small groups, quiet accommodation, and a curriculum balanced between discipline and rest.",
    styles: ["Ashtanga", "Restorative", "Yin", "Meditation"],
    amenities: ["Ganga View", "Shared & Private Rooms", "WiFi", "Tea Corner", "Weekend Trips"],
    certifications: ["Yoga Alliance RYS 200"],
    coverPhoto: "https://images.unsplash.com/photo-1545389336-eaeecece96fe?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=1200&auto=format&fit=crop",
    ],
    website: "https://ananda-valley-yogshala.example.com",
    phone: "+91-8010010004",
    businessRegistrationNo: "UKD-RYS-2026-004",
    yogaCertificateUrl: "https://placehold.co/1200x800?text=Yoga+School+License",
    personalIdUrl: "https://placehold.co/1200x800?text=Passport+Copy",
    status: SchoolStatus.APPROVED,
    isPublished: true,
    isFeatured: false,
    avgRating: 4.8,
    totalReviews: 144,
  },
  {
    name: "Shunya Retreat House",
    slug: "shunya-retreat-house",
    ownerName: "Pooja Nautiyal",
    ownerEmail: "shunya.house@example.com",
    address: "Swargashram Lane, Rishikesh, Uttarakhand 249304",
    tagline: "Short retreats, detox stays, and mindful living by the river.",
    description:
      "Shunya Retreat House is a serene retreat center for students looking for shorter immersive stays centered on meditation, pranayama, sound healing, and slow restorative practice.",
    styles: ["Meditation", "Sound Healing", "Restorative", "Breathwork"],
    amenities: ["Organic Meals", "Shared Rooms", "Private Rooms", "Massage Add-ons", "WiFi"],
    certifications: ["Ayush Wellness Partner"],
    coverPhoto: "https://images.unsplash.com/photo-1524863479829-916d8e77f114?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508704019882-f9cf40e475b4?q=80&w=1200&auto=format&fit=crop",
    ],
    website: "https://shunya-retreat-house.example.com",
    phone: "+91-8010010005",
    businessRegistrationNo: "UKD-RYS-2026-005",
    yogaCertificateUrl: "https://placehold.co/1200x800?text=Retreat+License",
    personalIdUrl: "https://placehold.co/1200x800?text=Owner+Passport",
    status: SchoolStatus.APPROVED,
    isPublished: true,
    isFeatured: true,
    avgRating: 4.9,
    totalReviews: 221,
  },
  {
    name: "Himalayan Iyengar Centre",
    slug: "himalayan-iyengar-centre",
    ownerName: "Rahul Uniyal",
    ownerEmail: "himalayan.iyengar@example.com",
    address: "Ghugtyani Talli, near Ram Jhula, Rishikesh, Uttarakhand 249137",
    tagline: "Alignment-led TTCs and precision-focused retreat intensives.",
    description:
      "Himalayan Iyengar Centre hosts longer format teacher trainings and smaller therapeutic intensives with strong alignment instruction, use of props, and careful sequencing.",
    styles: ["Iyengar", "Therapeutic Yoga", "Hatha"],
    amenities: ["Prop Studio", "Library", "Sattvic Meals", "WiFi", "Quiet Hours"],
    certifications: ["Yoga Alliance Continuing Education"],
    coverPhoto: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1200&auto=format&fit=crop",
    ],
    website: "https://himalayan-iyengar-centre.example.com",
    phone: "+91-8010010006",
    businessRegistrationNo: "UKD-RYS-2026-006",
    yogaCertificateUrl: "https://placehold.co/1200x800?text=Institute+Certificate",
    personalIdUrl: "https://placehold.co/1200x800?text=Owner+ID",
    status: SchoolStatus.APPROVED,
    isPublished: true,
    isFeatured: false,
    avgRating: 4.8,
    totalReviews: 97,
  },
  {
    name: "Veda Soul Ashram",
    slug: "veda-soul-ashram",
    ownerName: "Madhuri Panwar",
    ownerEmail: "veda.soul@example.com",
    address: "Laxman Jhula Market Road, Rishikesh, Uttarakhand 249302",
    tagline: "Holistic teacher trainings with mantra, Ayurveda, and yoga nidra.",
    description:
      "Veda Soul Ashram welcomes students into a warm residential environment where TTC study is paired with mantra, Ayurveda principles, sound healing, and restorative evening practice.",
    styles: ["Multi-style", "Ayurveda", "Yin", "Yoga Nidra"],
    amenities: ["WiFi", "Airy Rooms", "Vegetarian Meals", "Kirtan Nights", "Shuttle Help"],
    certifications: ["Yoga Alliance RYS 200", "Yoga Alliance RYS 300"],
    coverPhoto: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1545389336-eaeecece96fe?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524863479829-916d8e77f114?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=1200&auto=format&fit=crop",
    ],
    website: "https://veda-soul-ashram.example.com",
    phone: "+91-8010010007",
    businessRegistrationNo: "UKD-RYS-2026-007",
    yogaCertificateUrl: "https://placehold.co/1200x800?text=Teacher+Training+Certificate",
    personalIdUrl: "https://placehold.co/1200x800?text=Owner+Passport",
    status: SchoolStatus.APPROVED,
    isPublished: true,
    isFeatured: false,
    avgRating: 4.7,
    totalReviews: 112,
  },
  {
    name: "Kriya Shakti Yogpeeth",
    slug: "kriya-shakti-yogpeeth",
    ownerName: "Deepak Semwal",
    ownerEmail: "kriya.shakti@example.com",
    address: "Near Bhootnath Temple, Rishikesh, Uttarakhand 249304",
    tagline: "Teacher trainings rooted in kriya, pranayama, and internal practice.",
    description:
      "Kriya Shakti Yogpeeth is a focused spiritual training space for students drawn to pranayama, kriya, meditation, and a disciplined residential routine.",
    styles: ["Kriya", "Pranayama", "Meditation", "Hatha"],
    amenities: ["Single Rooms", "Shared Rooms", "Daily Cleansing Practices", "WiFi", "Library"],
    certifications: ["Traditional Ashram Certification"],
    coverPhoto: "https://images.unsplash.com/photo-1508704019882-f9cf40e475b4?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?q=80&w=1200&auto=format&fit=crop",
    ],
    website: "https://kriya-shakti-yogpeeth.example.com",
    phone: "+91-8010010008",
    businessRegistrationNo: "UKD-RYS-2026-008",
    yogaCertificateUrl: "https://placehold.co/1200x800?text=Ashram+Certificate",
    personalIdUrl: "https://placehold.co/1200x800?text=Owner+ID+Card",
    status: SchoolStatus.PENDING,
    isPublished: false,
    isFeatured: false,
    avgRating: 0,
    totalReviews: 0,
  },
  {
    name: "Soma Healing Retreats",
    slug: "soma-healing-retreats",
    ownerName: "Isha Bhatt",
    ownerEmail: "soma.healing@example.com",
    address: "Muni ki Reti, Rishikesh, Uttarakhand 249137",
    tagline: "Retreat-first stays for stress recovery, yoga, and gentle detox.",
    description:
      "Soma Healing Retreats combines yoga, Ayurveda-inspired meals, coaching, and mindful rest for travelers who want a softer entry into practice and wellness travel.",
    styles: ["Restorative", "Meditation", "Breathwork", "Detox Yoga"],
    amenities: ["Private Rooms", "Tea Bar", "Massage Add-ons", "WiFi", "Airport Transfers"],
    certifications: ["Wellness Retreat Certification"],
    coverPhoto: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524863479829-916d8e77f114?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=1200&auto=format&fit=crop",
    ],
    website: "https://soma-healing-retreats.example.com",
    phone: "+91-8010010009",
    businessRegistrationNo: "UKD-RYS-2026-009",
    yogaCertificateUrl: "https://placehold.co/1200x800?text=Retreat+Operator+Certificate",
    personalIdUrl: "https://placehold.co/1200x800?text=Passport+Scan",
    status: SchoolStatus.PENDING,
    isPublished: false,
    isFeatured: false,
    avgRating: 0,
    totalReviews: 0,
  },
  {
    name: "Adi Yogi Teacher Training House",
    slug: "adi-yogi-teacher-training-house",
    ownerName: "Tarun Kothari",
    ownerEmail: "adi.yogi@example.com",
    address: "Tapovan Main Road, Rishikesh, Uttarakhand 249192",
    tagline: "Yoga Alliance-ready trainings with supportive mentoring and clear structure.",
    description:
      "Adi Yogi Teacher Training House is a new listing built around approachable teaching, small groups, and practical support for first-time international students.",
    styles: ["Hatha", "Vinyasa", "Teaching Methodology"],
    amenities: ["WiFi", "Course Manual", "Private Rooms", "Shared Rooms", "Rooftop Cafe"],
    certifications: ["Yoga Alliance RYS 200"],
    coverPhoto: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508704019882-f9cf40e475b4?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1545389336-eaeecece96fe?q=80&w=1200&auto=format&fit=crop",
    ],
    website: "https://adi-yogi-teacher-training-house.example.com",
    phone: "+91-8010010010",
    businessRegistrationNo: "UKD-RYS-2026-010",
    yogaCertificateUrl: "https://placehold.co/1200x800?text=Yoga+Teacher+License",
    personalIdUrl: "https://placehold.co/1200x800?text=Owner+Identity",
    status: SchoolStatus.PENDING,
    isPublished: false,
    isFeatured: false,
    avgRating: 0,
    totalReviews: 0,
  },
];

const studentSeeds: StudentSeed[] = [
  { name: "Aarav Malhotra", email: "aarav.malhotra@example.com", nationality: "India", phone: "+91-9000000001", isActive: true },
  { name: "Emily Carter", email: "emily.carter@example.com", nationality: "United Kingdom", phone: "+44-7700-000001", isActive: true },
  { name: "Luca Bianchi", email: "luca.bianchi@example.com", nationality: "Italy", phone: "+39-320-000001", isActive: true },
  { name: "Maya Thompson", email: "maya.thompson@example.com", nationality: "Australia", phone: "+61-400-000001", isActive: true },
  { name: "Jonas Meyer", email: "jonas.meyer@example.com", nationality: "Germany", phone: "+49-151-000001", isActive: true },
  { name: "Sofia Alvarez", email: "sofia.alvarez@example.com", nationality: "Spain", phone: "+34-600-000001", isActive: true },
  { name: "Yuki Tanaka", email: "yuki.tanaka@example.com", nationality: "Japan", phone: "+81-90-0000-0001", isActive: true },
  { name: "Noah Brooks", email: "noah.brooks@example.com", nationality: "United States", phone: "+1-415-000-0001", isActive: false },
  { name: "Chloe Martin", email: "chloe.martin@example.com", nationality: "France", phone: "+33-6-00-00-00-01", isActive: false },
  { name: "Rhea Kapoor", email: "rhea.kapoor@example.com", nationality: "India", phone: "+91-9000000010", isActive: false },
];

const courseTemplates: CourseSeed[] = [
  {
    name: "100 Hour Foundation Yoga TTC",
    category: "TTC_100HR",
    style: "Hatha & Pranayama",
    level: CourseLevel.BEGINNER,
    durationDays: 13,
    priceUSD: 590,
    priceINR: 49000,
    description:
      "A shorter foundation teacher training designed for students who want a clear introduction to asana alignment, pranayama, meditation, anatomy, and teaching basics.",
    highlights: ["Daily pranayama", "Asana alignment clinics", "Foundational philosophy", "Rooftop sunset meditation"],
    includedItems: ["Accommodation", "Vegetarian meals", "Course manual", "Airport pickup support"],
    excludes: ["Flights", "Visa", "Travel insurance"],
    roomTypes: [
      { type: "Twin Shared Room", priceAddon: 0 },
      { type: "Private Room", priceAddon: 140 },
    ],
  },
  {
    name: "200 Hour Multi-Style Yoga TTC",
    category: "TTC_200HR",
    style: "Hatha, Ashtanga & Vinyasa",
    level: CourseLevel.ALL_LEVELS,
    durationDays: 24,
    priceUSD: 1090,
    priceINR: 91000,
    description:
      "A comprehensive 200-hour Yoga Alliance-aligned course covering Hatha, Ashtanga, sequencing, meditation, philosophy, anatomy, and practical teaching methodology in a residential setting.",
    highlights: ["Yoga Alliance aligned", "Practice teaching labs", "Weekend excursions", "Mantra and meditation"],
    includedItems: ["Accommodation", "3 vegetarian meals daily", "Course manual", "Excursion day", "Certificate"],
    excludes: ["Flights", "Visa", "Personal shopping"],
    roomTypes: [
      { type: "Shared Room", priceAddon: 0 },
      { type: "Private Room", priceAddon: 220 },
      { type: "Deluxe Private Room", priceAddon: 360 },
    ],
  },
  {
    name: "300 Hour Advanced Yoga TTC",
    category: "TTC_300HR",
    style: "Advanced Hatha & Vinyasa",
    level: CourseLevel.INTERMEDIATE,
    durationDays: 28,
    priceUSD: 1490,
    priceINR: 124000,
    description:
      "A deeper advanced-level training focused on intelligent sequencing, adjustments, teaching confidence, pranayama development, and yoga philosophy for students continuing after 200 hours.",
    highlights: ["Advanced sequencing", "Adjustment methodology", "Applied anatomy", "Mock teaching assessments"],
    includedItems: ["Accommodation", "Meals", "Manuals", "Assessment support", "Certificate"],
    excludes: ["Flights", "Travel insurance", "Massage add-ons"],
    roomTypes: [
      { type: "Shared Room", priceAddon: 0 },
      { type: "Private Room", priceAddon: 260 },
    ],
  },
  {
    name: "500 Hour Professional Yoga TTC",
    category: "TTC_500HR",
    style: "Comprehensive Professional Track",
    level: CourseLevel.ADVANCED,
    durationDays: 42,
    priceUSD: 2290,
    priceINR: 189000,
    description:
      "An immersive long-format professional teacher training for students ready to deepen their education across asana, teaching, philosophy, anatomy, practicum, and self-study.",
    highlights: ["Long-format immersion", "Mentor feedback", "Teaching practicum", "Capstone assessment"],
    includedItems: ["Accommodation", "Meals", "Printed manuals", "Certification", "Weekend excursions"],
    excludes: ["Flights", "Visa costs", "Optional therapies"],
    roomTypes: [
      { type: "Twin Shared Room", priceAddon: 0 },
      { type: "Private Room", priceAddon: 340 },
    ],
  },
  {
    name: "7 Day Reset & Renew Yoga Retreat",
    category: "RETREAT",
    style: "Restorative, Breathwork & Meditation",
    level: CourseLevel.BEGINNER,
    durationDays: 7,
    priceUSD: 420,
    priceINR: 35000,
    description:
      "A short retreat for travelers seeking gentle yoga, guided meditation, breathwork, wholesome meals, and a restorative reset in Rishikesh.",
    highlights: ["Twice-daily yoga", "Meditation sessions", "Breathwork workshops", "Nature walk"],
    includedItems: ["Accommodation", "All meals", "Group transfer coordination", "Welcome kit"],
    excludes: ["Flights", "Spa therapies", "Private excursions"],
    roomTypes: [
      { type: "Shared Retreat Room", priceAddon: 0 },
      { type: "Private Retreat Room", priceAddon: 120 },
    ],
  },
  {
    name: "14 Day Ayurveda & River Retreat",
    category: "RETREAT",
    style: "Ayurveda, Hatha & Slow Living",
    level: CourseLevel.ALL_LEVELS,
    durationDays: 14,
    priceUSD: 790,
    priceINR: 66000,
    description:
      "A longer restorative stay with daily yoga, mindful routines, Ayurveda-inspired meals, consultations, and a calm rhythm designed for nervous-system recovery and deeper rest.",
    highlights: ["Ayurveda-inspired menu", "Daily yoga and meditation", "Consultation session", "Sound healing evening"],
    includedItems: ["Accommodation", "Meals", "Consultation", "Retreat schedule", "Tea and snacks"],
    excludes: ["Flights", "Visa", "Personal purchases"],
    roomTypes: [
      { type: "Shared Room", priceAddon: 0 },
      { type: "Private Room", priceAddon: 180 },
    ],
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function createUser(
  email: string,
  password: string,
  name: string,
  role: Role,
  extra: Partial<{
    phone: string;
    nationality: string;
    isActive: boolean;
    passportNo: string;
  }> = {}
) {
  const hashedPassword = await bcrypt.hash(password, 12);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
      isActive: extra.isActive ?? true,
      phone: extra.phone,
      nationality: extra.nationality,
      passportNo: extra.passportNo,
      lastLoginAt: extra.isActive === false ? null : new Date("2026-04-18T10:00:00Z"),
    },
  });
}

async function resetLiveData() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "Inquiry",
      "Payment",
      "Review",
      "Booking",
      "CourseDate",
      "Teacher",
      "Course",
      "SavedSchool",
      "AuditLog",
      "School",
      "Session",
      "Account",
      "VerificationToken",
      "BlogPost",
      "HomepageContent",
      "ContactMessage",
      "User"
    RESTART IDENTITY CASCADE
  `);
}

async function seedSchools(owners: Map<string, string>) {
  const schools = new Map<string, Awaited<ReturnType<typeof prisma.school.create>>>();

  for (const seed of schoolSeeds) {
    const ownerId = owners.get(seed.ownerEmail);
    if (!ownerId) continue;

    const school = await prisma.school.create({
      data: {
        ownerId,
        slug: seed.slug,
        name: seed.name,
        tagline: seed.tagline,
        description: seed.description,
        address: seed.address,
        city: "Rishikesh",
        state: "Uttarakhand",
        country: "India",
        phone: seed.phone,
        whatsapp: seed.phone,
        email: seed.ownerEmail,
        website: seed.website,
        coverPhoto: seed.coverPhoto,
        gallery: seed.gallery,
        status: seed.status,
        isFeatured: seed.isFeatured,
        isPublished: seed.isPublished,
        avgRating: seed.avgRating,
        totalReviews: seed.totalReviews,
        amenities: seed.amenities,
        styles: seed.styles,
        certifications: seed.certifications,
        yogaCertificateUrl: seed.yogaCertificateUrl,
        personalIdUrl: seed.personalIdUrl,
        businessRegistrationNo: seed.businessRegistrationNo,
        approvedAt: seed.status === SchoolStatus.APPROVED ? new Date("2026-04-17T09:00:00Z") : null,
        applicationNotes:
          seed.status === SchoolStatus.PENDING
            ? "Awaiting super admin document review before going live."
            : "Profile reviewed and approved for publication.",
      },
    });

    schools.set(seed.slug, school);
  }

  return schools;
}

function buildCourseTemplates(schoolName: string): CourseSeed[] {
  return courseTemplates.map((template) => ({
    ...template,
    description: `${template.description} Hosted at ${schoolName}, this residential program includes supportive faculty, structured practice, and a schedule that mirrors what international yoga travelers expect from established Rishikesh programs.`,
  }));
}

async function seedCourses(schools: Map<string, Awaited<ReturnType<typeof prisma.school.create>>>) {
  const courses = new Map<string, Awaited<ReturnType<typeof prisma.course.create>>>();
  const courseDates = new Map<string, string[]>();

  for (const seed of schoolSeeds) {
    if (seed.status !== SchoolStatus.APPROVED) continue;
    const school = schools.get(seed.slug);
    if (!school) continue;

    const templates = buildCourseTemplates(seed.name);

    for (const template of templates) {
      const slug = `${seed.slug}-${slugify(template.category)}-${slugify(template.name)}`;
      const course = await prisma.course.create({
        data: {
          schoolId: school.id,
          name: template.name,
          slug,
          category: template.category,
          type:
            template.category === "TTC_200HR"
              ? "TTC_200HR"
              : template.category === "TTC_300HR"
                ? "TTC_300HR"
                : template.category === "TTC_500HR"
                  ? "TTC_500HR"
                  : template.category === "RETREAT"
                    ? "RETREAT"
                    : null,
          style: template.style,
          description: template.description,
          level: template.level,
          durationDays: template.durationDays,
          priceUSD: template.priceUSD,
          priceINR: template.priceINR,
          roomTypes: template.roomTypes,
          includedItems: template.includedItems,
          highlights: template.highlights,
          excludes: template.excludes,
          isPublished: true,
          isFeatured: template.category === "RETREAT" || template.category === "TTC_200HR",
        },
      });

      courses.set(slug, course);

      const monthOffsets =
        template.category === "RETREAT" ? [1, 2, 3, 4] : [1, 2, 3];
      const dateIds: string[] = [];

      for (const offset of monthOffsets) {
        const startDate = new Date(Date.UTC(2026, 3 + offset, template.category === "RETREAT" ? 5 : 1, 0, 0, 0));
        const endDate = new Date(startDate);
        endDate.setUTCDate(endDate.getUTCDate() + template.durationDays - 1);

        const courseDate = await prisma.courseDate.create({
          data: {
            courseId: course.id,
            startDate,
            endDate,
            capacity: template.category === "RETREAT" ? 16 : 24,
            spotsLeft: template.category === "RETREAT" ? 10 : 15,
            priceModifier: offset === 1 ? 0.95 : 1,
            isActive: true,
          },
        });

        dateIds.push(courseDate.id);
      }

      courseDates.set(course.id, dateIds);
    }
  }

  return { courses, courseDates };
}

async function seedBookingsAndInquiries(
  studentMap: Map<string, Awaited<ReturnType<typeof prisma.user.create>>>,
  schools: Map<string, Awaited<ReturnType<typeof prisma.school.create>>>,
  courses: Map<string, Awaited<ReturnType<typeof prisma.course.create>>>,
  courseDates: Map<string, string[]>
) {
  const bookingPairs = [
    ["aarav.malhotra@example.com", "ganga-flow-yoga-school-ttc-200hr-200-hour-multi-style-yoga-ttc", "Private Room", BookingStatus.CONFIRMED],
    ["emily.carter@example.com", "satva-roots-academy-ttc-300hr-300-hour-advanced-yoga-ttc", "Private Room", BookingStatus.DEPOSIT_PAID],
    ["luca.bianchi@example.com", "shunya-retreat-house-retreat-7-day-reset-renew-yoga-retreat", "Shared Retreat Room", BookingStatus.CONFIRMED],
    ["maya.thompson@example.com", "ananda-valley-yogshala-retreat-14-day-ayurveda-river-retreat", "Private Room", BookingStatus.PENDING],
    ["jonas.meyer@example.com", "prana-mandala-institute-ttc-100hr-100-hour-foundation-yoga-ttc", "Twin Shared Room", BookingStatus.CONFIRMED],
    ["sofia.alvarez@example.com", "veda-soul-ashram-ttc-500hr-500-hour-professional-yoga-ttc", "Private Room", BookingStatus.PENDING],
    ["yuki.tanaka@example.com", "himalayan-iyengar-centre-retreat-7-day-reset-renew-yoga-retreat", "Private Retreat Room", BookingStatus.CONFIRMED],
  ] as const;

  for (const [studentEmail, courseSlug, roomType, status] of bookingPairs) {
    const user = studentMap.get(studentEmail);
    const course = courses.get(courseSlug);
    if (!user || !course) continue;

    const dateId = courseDates.get(course.id)?.[0];
    if (!dateId) continue;

    const room = (course.roomTypes as Array<{ type: string; priceAddon: number }>).find(
      (item) => item.type === roomType
    );
    const totalPrice = course.priceUSD + (room?.priceAddon ?? 0);
    const depositAmount = Math.round(totalPrice * 0.2);

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        courseId: course.id,
        courseDateId: dateId,
        roomType,
        totalPrice,
        depositAmount,
        balanceDue: totalPrice - depositAmount,
        status,
        notes: "Seeded live booking for dashboard and public validation.",
      },
    });

    if (status === BookingStatus.CONFIRMED || status === BookingStatus.DEPOSIT_PAID) {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: depositAmount,
          currency: "USD",
          provider: "razorpay",
          transactionId: `txn-${booking.id.slice(0, 12)}`,
          status: PaymentStatus.COMPLETED,
        },
      });
    }
  }

  const inquiries = [
    {
      schoolSlug: "ganga-flow-yoga-school",
      courseSlug: "ganga-flow-yoga-school-ttc-200hr-200-hour-multi-style-yoga-ttc",
      studentEmail: "noah.brooks@example.com",
      message:
        "I am interested in the October 200 hour TTC and want to know if beginner-level students are supported with alignment modifications.",
      desiredDateIndex: 1,
      guests: 1,
    },
    {
      schoolSlug: "soma-healing-retreats",
      courseSlug: undefined,
      studentEmail: "chloe.martin@example.com",
      message:
        "I am planning a 2-week wellness stay in Rishikesh and would like to compare private room availability, food options, and airport pickup support.",
      desiredDateIndex: undefined,
      guests: 1,
    },
    {
      schoolSlug: "shunya-retreat-house",
      courseSlug: "shunya-retreat-house-retreat-14-day-ayurveda-river-retreat",
      studentEmail: "rhea.kapoor@example.com",
      message:
        "Can I join the 14 day Ayurveda retreat with my sister, and do you offer twin-sharing rooms with a quiet workspace?",
      desiredDateIndex: 0,
      guests: 2,
    },
  ];

  for (const inquiry of inquiries) {
    const school = schools.get(inquiry.schoolSlug);
    const student = studentMap.get(inquiry.studentEmail);
    const course = inquiry.courseSlug ? courses.get(inquiry.courseSlug) : undefined;
    if (!school || !student) continue;

    const desiredDateId =
      course && inquiry.desiredDateIndex !== undefined
        ? courseDates.get(course.id)?.[inquiry.desiredDateIndex]
        : undefined;

    const desiredDate = desiredDateId
      ? (await prisma.courseDate.findUnique({ where: { id: desiredDateId }, select: { startDate: true } }))?.startDate
      : undefined;

    await prisma.inquiry.create({
      data: {
        schoolId: school.id,
        courseId: course?.id,
        userId: student.id,
        name: student.name ?? "Prospective Student",
        email: student.email,
        phone: student.phone,
        country: student.nationality,
        message: inquiry.message,
        desiredDate,
        guests: inquiry.guests,
      },
    });
  }
}

async function seedHomepage(adminId: string, schools: Map<string, Awaited<ReturnType<typeof prisma.school.create>>>) {
  const featuredSchoolSlugs = schoolSeeds
    .filter((school) => school.status === SchoolStatus.APPROVED && school.isFeatured)
    .slice(0, 3)
    .map((school) => school.slug);

  const homepageSections: Record<string, unknown> = {
    hero: {
      eyebrow: "Real Yoga Stays in Rishikesh",
      title: "Find teacher trainings and retreats you can actually trust.",
      subtitle:
        "Compare verified schools, explore live course dates, send direct enquiries, and book residential yoga programs in Rishikesh with confidence.",
      ctaPrimary: { label: "Explore Courses", href: "/search" },
      ctaSecondary: { label: "Apply Your School", href: "/register/school" },
    },
    featured_schools: {
      title: "Featured Schools",
      subtitle: "Approved schools with strong reviews, complete profiles, and live programs.",
      slugs: featuredSchoolSlugs,
    },
    stats: {
      students: studentSeeds.length,
      schools: schoolSeeds.length,
      satisfactionRate: 96,
      countries: 9,
    },
    why_us: {
      title: "Why students book here",
      items: [
        "Verified school profiles with approval workflow",
        "Live course calendars and room options",
        "Student enquiries that go straight to school admins",
        "Visible program inclusions, pricing, and highlights",
        "Approval queues for both schools and new students",
        "Search and detail pages powered by the same live database",
      ],
    },
    testimonials: {
      title: "Student stories",
      items: [
        {
          name: "Emily Carter",
          quote:
            "I could compare real dates, room types, and retreat styles without jumping between multiple WhatsApp chats.",
        },
        {
          name: "Luca Bianchi",
          quote:
            "The retreat page felt clear and transparent, and the enquiry reached the school directly.",
        },
        {
          name: "Aarav Malhotra",
          quote:
            "The booking flow helped me understand deposits, room upgrades, and what was included before I committed.",
        },
      ],
    },
    cta_banner: {
      title: "Run a yoga school in Rishikesh?",
      subtitle: "Register your school, add your TTCs and retreats, and move through a real admin approval workflow.",
      primary: { label: "Register School", href: "/register/school" },
      secondary: { label: "View Schools", href: "/schools" },
    },
  };

  for (const [section, content] of Object.entries(homepageSections)) {
      await prisma.homepageContent.create({
        data: {
          section,
          content: content as object,
          isActive: true,
          updatedBy: adminId,
        },
      });
  }

  const firstFeaturedSchool = schools.get(featuredSchoolSlugs[0]);
  const firstStudent = await prisma.user.findFirst({
    where: { role: Role.STUDENT, isActive: true },
    select: { id: true },
  });

  if (firstFeaturedSchool && firstStudent) {
    await prisma.savedSchool.create({
      data: {
        userId: firstStudent.id,
        schoolId: firstFeaturedSchool.id,
      },
    });
  }
}

async function seedBlogs(adminId: string) {
  const posts = [
    {
      slug: "how-to-choose-a-yoga-teacher-training-in-rishikesh",
      title: "How to Choose a Yoga Teacher Training in Rishikesh",
      excerpt: "Compare TTC formats, faculty styles, accommodation options, and approval signals before you book.",
      content:
        "<p>Choosing a teacher training in Rishikesh is easier when you compare live dates, faculty style, room choices, and the depth of the daily schedule.</p><p>Students should look for a clear curriculum, realistic accommodation details, and a school that communicates openly before arrival.</p>",
      category: BlogCategory.TTC_GUIDE,
    },
    {
      slug: "best-retreat-types-for-first-time-rishikesh-travelers",
      title: "Best Retreat Types for First-Time Rishikesh Travelers",
      excerpt: "A practical guide to restorative, detox, meditation, and teacher-training-adjacent retreat formats.",
      content:
        "<p>Short yoga retreats are ideal for students who want a supported first trip to Rishikesh without the commitment of a full TTC.</p><p>Look for retreats with clear inclusions, meal details, airport guidance, and room choices that fit your budget.</p>",
      category: BlogCategory.RETREAT_GUIDE,
    },
    {
      slug: "what-super-admin-approval-should-check-for-on-yoga-listings",
      title: "What Super Admin Approval Should Check for on Yoga Listings",
      excerpt: "A behind-the-scenes look at profile completeness, documents, and public listing quality.",
      content:
        "<p>Approval workflows are strongest when admins review owner identity, school registration, and the clarity of each public course page before publishing.</p><p>A high-quality listing should help students understand the teaching style, accommodation, pricing, and what happens after they enquire.</p>",
      category: BlogCategory.SCHOOL_SPOTLIGHT,
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop",
        category: post.category,
        tags: ["rishikesh", "yoga", "retreats"],
        status: PostStatus.PUBLISHED,
        authorId: adminId,
        publishedAt: new Date("2026-04-18T08:00:00Z"),
      },
    });
  }
}

async function seedAuditLogs(allUsers: Array<{ id: string; email: string; role: Role }>) {
  for (const user of allUsers) {
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "SEEDED_ACCOUNT",
        entity: user.role,
        entityId: user.id,
        metadata: { email: user.email },
      },
    });
  }
}

async function main() {
  await resetLiveData();

  const admin = await createUser(
    "admin@yogarishikesh.com",
    "Admin@123456",
    "YogaRishikesh Super Admin",
    Role.SUPER_ADMIN,
    { isActive: true, phone: "+91-9000009999", nationality: "India" }
  );

  const ownerIdByEmail = new Map<string, string>();
  const allUsers: Array<{ id: string; email: string; role: Role }> = [{ id: admin.id, email: admin.email, role: admin.role }];

  for (const school of schoolSeeds) {
    const user = await createUser(
      school.ownerEmail,
      "School@123",
      school.ownerName,
      Role.SCHOOL_ADMIN,
      {
        isActive: school.status === SchoolStatus.APPROVED,
        phone: school.phone,
        nationality: "India",
      }
    );

    ownerIdByEmail.set(school.ownerEmail, user.id);
    allUsers.push({ id: user.id, email: user.email, role: user.role });
  }

  const studentMap = new Map<string, Awaited<ReturnType<typeof prisma.user.create>>>();
  for (const student of studentSeeds) {
    const user = await createUser(
      student.email,
      "Student@123",
      student.name,
      Role.STUDENT,
      {
        isActive: student.isActive,
        phone: student.phone,
        nationality: student.nationality,
      }
    );

    studentMap.set(student.email, user);
    allUsers.push({ id: user.id, email: user.email, role: user.role });
  }

  const schools = await seedSchools(ownerIdByEmail);
  const { courses, courseDates } = await seedCourses(schools);

  await seedBookingsAndInquiries(studentMap, schools, courses, courseDates);
  await seedBlogs(admin.id);
  await seedHomepage(admin.id, schools);
  await seedAuditLogs(allUsers);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
