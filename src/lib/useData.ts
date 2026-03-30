import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import {
  CompanyInfo,
  Sector,
  Product,
  ProductFeature,
  TeamMember,
  FinancialProjection,
  SectorContent,
} from './types';
import { fetchSectorContent } from './sectorContent';

// Static data embedded directly in the module
const staticCompanyInfo: CompanyInfo = {
  id: '1',
  name: 'CloudSoft Solutions',
  description:
    'A global software company providing enterprise-grade SaaS solutions across healthcare, education, and fitness sectors.',
  vision:
    'To revolutionize how organizations operate through innovative cloud-based solutions that enhance efficiency and user experience.',
  mission:
    'Delivering cutting-edge SaaS products that empower healthcare providers, educational institutions, and fitness centers to achieve operational excellence.',
  founded_year: 2024,
};

const staticSectors: Sector[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Comprehensive SaaS solutions for hospitals, clinics, and healthcare providers',
    icon: 'Heart',
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Digital platforms for schools, colleges, and educational institutions',
    icon: 'GraduationCap',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    description: 'Management systems for gyms, sports clubs, and fitness centers',
    icon: 'Dumbbell',
  },
];

const staticProducts: Product[] = [
  {
    id: 'medicore',
    sector_id: 'healthcare',
    name: 'MediCore Plus',
    description:
      'Complete hospital management system with patient records, appointments, billing, and inventory management',
    status: 'active' as const,
    vision: 'To become the leading healthcare management platform trusted by hospitals worldwide',
    target_market: 'Large hospitals and multi-specialty clinics',
    launch_date: '2024-03-01',
  },
  {
    id: 'clinicflow',
    sector_id: 'healthcare',
    name: 'ClinicFlow',
    description: 'Streamlined clinic management software for small to medium healthcare providers',
    status: 'development' as const,
    vision: 'Simplifying clinic operations for healthcare providers everywhere',
    target_market: 'Private clinics and small healthcare centers',
    launch_date: '2025-06-01',
  },
  {
    id: 'edumanage',
    sector_id: 'education',
    name: 'EduManage Pro',
    description:
      'Comprehensive school management system covering admissions, academics, attendance, and parent communication',
    status: 'active' as const,
    vision: 'Transforming education management through digital innovation',
    target_market: 'K-12 schools and educational institutions',
    launch_date: '2024-01-15',
  },
  {
    id: 'campus360',
    sector_id: 'education',
    name: 'Campus360',
    description: 'Advanced college and university management platform with LMS integration',
    status: 'planned' as const,
    vision: 'Creating connected campus experiences for higher education',
    target_market: 'Colleges and universities',
    launch_date: '2025-09-01',
  },
  {
    id: 'fitclub',
    sector_id: 'fitness',
    name: 'FitClub Manager',
    description:
      'Complete gym and fitness center management with member tracking, classes, and billing',
    status: 'active' as const,
    vision: 'Empowering fitness businesses to grow and succeed',
    target_market: 'Gyms, fitness centers, and sports clubs',
    launch_date: '2024-02-01',
  },
  {
    id: 'sportspro',
    sector_id: 'fitness',
    name: 'SportsPro Suite',
    description: 'Professional sports club management with team management, tournaments, and analytics',
    status: 'development' as const,
    vision: 'Revolutionizing sports club operations globally',
    target_market: 'Sports clubs and athletic organizations',
    launch_date: '2025-07-01',
  },
];

const staticProductFeatures: ProductFeature[] = [
  { id: '1', product_id: 'medicore', feature: 'Patient Management System', status: 'completed' as const },
  { id: '2', product_id: 'medicore', feature: 'Electronic Medical Records', status: 'completed' as const },
  { id: '3', product_id: 'medicore', feature: 'Appointment Scheduling', status: 'completed' as const },
  { id: '4', product_id: 'medicore', feature: 'Billing & Insurance Claims', status: 'in_progress' as const },
  { id: '5', product_id: 'medicore', feature: 'Pharmacy Management', status: 'in_progress' as const },
  { id: '6', product_id: 'medicore', feature: 'Laboratory Integration', status: 'planned' as const },
  { id: '7', product_id: 'medicore', feature: 'Telemedicine Module', status: 'planned' as const },

  { id: '8', product_id: 'clinicflow', feature: 'Quick Appointment Booking', status: 'in_progress' as const },
  { id: '9', product_id: 'clinicflow', feature: 'Patient Records', status: 'in_progress' as const },
  { id: '10', product_id: 'clinicflow', feature: 'Prescription Management', status: 'in_progress' as const },
  { id: '11', product_id: 'clinicflow', feature: 'SMS Reminders', status: 'planned' as const },
  { id: '12', product_id: 'clinicflow', feature: 'Digital Payment Integration', status: 'planned' as const },

  { id: '13', product_id: 'edumanage', feature: 'Student Information System', status: 'completed' as const },
  { id: '14', product_id: 'edumanage', feature: 'Attendance Tracking', status: 'completed' as const },
  { id: '15', product_id: 'edumanage', feature: 'Grade Management', status: 'completed' as const },
  { id: '16', product_id: 'edumanage', feature: 'Parent Portal', status: 'completed' as const },
  { id: '17', product_id: 'edumanage', feature: 'Fee Management', status: 'in_progress' as const },
  { id: '18', product_id: 'edumanage', feature: 'Timetable Management', status: 'in_progress' as const },
  { id: '19', product_id: 'edumanage', feature: 'Library Management', status: 'planned' as const },
  { id: '20', product_id: 'edumanage', feature: 'Transport Management', status: 'planned' as const },

  { id: '21', product_id: 'campus360', feature: 'Course Management System', status: 'planned' as const },
  { id: '22', product_id: 'campus360', feature: 'LMS Integration', status: 'planned' as const },
  { id: '23', product_id: 'campus360', feature: 'Student Admissions', status: 'planned' as const },
  { id: '24', product_id: 'campus360', feature: 'Faculty Management', status: 'planned' as const },
  { id: '25', product_id: 'campus360', feature: 'Research & Publications', status: 'planned' as const },
  { id: '26', product_id: 'campus360', feature: 'Alumni Network', status: 'planned' as const },

  { id: '27', product_id: 'fitclub', feature: 'Member Management', status: 'completed' as const },
  { id: '28', product_id: 'fitclub', feature: 'Class Scheduling', status: 'completed' as const },
  { id: '29', product_id: 'fitclub', feature: 'Membership Billing', status: 'completed' as const },
  { id: '30', product_id: 'fitclub', feature: 'Access Control', status: 'completed' as const },
  { id: '31', product_id: 'fitclub', feature: 'Trainer Management', status: 'in_progress' as const },
  { id: '32', product_id: 'fitclub', feature: 'Nutrition Tracking', status: 'planned' as const },
  { id: '33', product_id: 'fitclub', feature: 'Mobile App', status: 'planned' as const },

  { id: '34', product_id: 'sportspro', feature: 'Team Management', status: 'in_progress' as const },
  { id: '35', product_id: 'sportspro', feature: 'Tournament Organization', status: 'in_progress' as const },
  { id: '36', product_id: 'sportspro', feature: 'Player Statistics', status: 'in_progress' as const },
  { id: '37', product_id: 'sportspro', feature: 'Training Programs', status: 'planned' as const },
  { id: '38', product_id: 'sportspro', feature: 'Equipment Management', status: 'planned' as const },
  { id: '39', product_id: 'sportspro', feature: 'Performance Analytics', status: 'planned' as const },
];

const staticTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Jennifer Adams',
    role: 'CEO & Founder',
    sector_id: null,
    email: 'jennifer.adams@cloudsoft.com',
    joined_date: '2023-06-01',
    bio: 'Serial entrepreneur with 20 years in enterprise software',
  },
  {
    id: '2',
    name: 'Robert Kim',
    role: 'CTO',
    sector_id: null,
    email: 'robert.kim@cloudsoft.com',
    joined_date: '2023-06-01',
    bio: 'Former VP of Engineering at major SaaS company',
  },
  {
    id: '3',
    name: 'Amanda White',
    role: 'CFO',
    sector_id: null,
    email: 'amanda.white@cloudsoft.com',
    joined_date: '2023-07-15',
    bio: 'Financial strategist with experience scaling SaaS companies',
  },
  {
    id: '4',
    name: 'Thomas Brown',
    role: 'VP of Sales',
    sector_id: null,
    email: 'thomas.brown@cloudsoft.com',
    joined_date: '2023-08-01',
    bio: 'Enterprise sales leader with global SaaS experience',
  },
  {
    id: '5',
    name: 'Dr. Sarah Johnson',
    role: 'Healthcare Product Lead',
    sector_id: 'healthcare',
    email: 'sarah.johnson@cloudsoft.com',
    joined_date: '2023-08-15',
    bio: 'Former hospital administrator with 15 years in healthcare technology',
  },
  {
    id: '6',
    name: 'Michael Chen',
    role: 'Senior Healthcare Developer',
    sector_id: 'healthcare',
    email: 'michael.chen@cloudsoft.com',
    joined_date: '2023-09-01',
    bio: 'Specialized in HIPAA-compliant systems and medical data integration',
  },
  {
    id: '7',
    name: 'Emily Roberts',
    role: 'Healthcare UX Designer',
    sector_id: 'healthcare',
    email: 'emily.roberts@cloudsoft.com',
    joined_date: '2024-01-10',
    bio: 'Expert in creating intuitive healthcare interfaces',
  },
  {
    id: '8',
    name: 'Prof. David Martinez',
    role: 'Education Product Lead',
    sector_id: 'education',
    email: 'david.martinez@cloudsoft.com',
    joined_date: '2023-07-01',
    bio: 'Former university dean with deep understanding of educational needs',
  },
  {
    id: '9',
    name: 'Lisa Wong',
    role: 'Education Solutions Architect',
    sector_id: 'education',
    email: 'lisa.wong@cloudsoft.com',
    joined_date: '2023-10-15',
    bio: 'Specialized in learning management systems and student engagement',
  },
  {
    id: '10',
    name: 'James Taylor',
    role: 'Education Platform Developer',
    sector_id: 'education',
    email: 'james.taylor@cloudsoft.com',
    joined_date: '2024-02-01',
    bio: 'Expert in scalable education technology platforms',
  },
  {
    id: '11',
    name: 'Alex Thompson',
    role: 'Fitness Product Lead',
    sector_id: 'fitness',
    email: 'alex.thompson@cloudsoft.com',
    joined_date: '2023-09-15',
    bio: 'Former gym owner and fitness technology entrepreneur',
  },
  {
    id: '12',
    name: 'Maria Garcia',
    role: 'Fitness Platform Developer',
    sector_id: 'fitness',
    email: 'maria.garcia@cloudsoft.com',
    joined_date: '2023-11-01',
    bio: 'Specialized in membership management and billing systems',
  },
  {
    id: '13',
    name: 'Ryan Cooper',
    role: 'Sports Analytics Engineer',
    sector_id: 'fitness',
    email: 'ryan.cooper@cloudsoft.com',
    joined_date: '2024-03-01',
    bio: 'Expert in sports data analytics and performance tracking',
  },
];

const staticFinancialProjections: FinancialProjection[] = [
  // MediCore Plus
  { id: '1', product_id: 'medicore', year: 2024, quarter: 1, revenue_projection: 125000, user_projection: 15 },
  { id: '2', product_id: 'medicore', year: 2024, quarter: 2, revenue_projection: 185000, user_projection: 28 },
  { id: '3', product_id: 'medicore', year: 2024, quarter: 3, revenue_projection: 265000, user_projection: 42 },
  { id: '4', product_id: 'medicore', year: 2024, quarter: 4, revenue_projection: 350000, user_projection: 58 },
  { id: '5', product_id: 'medicore', year: 2025, quarter: 1, revenue_projection: 480000, user_projection: 75 },
  { id: '6', product_id: 'medicore', year: 2025, quarter: 2, revenue_projection: 620000, user_projection: 95 },
  { id: '7', product_id: 'medicore', year: 2025, quarter: 3, revenue_projection: 780000, user_projection: 118 },
  { id: '8', product_id: 'medicore', year: 2025, quarter: 4, revenue_projection: 950000, user_projection: 145 },

  // ClinicFlow
  { id: '9', product_id: 'clinicflow', year: 2025, quarter: 3, revenue_projection: 45000, user_projection: 25 },
  { id: '10', product_id: 'clinicflow', year: 2025, quarter: 4, revenue_projection: 95000, user_projection: 58 },
  { id: '11', product_id: 'clinicflow', year: 2026, quarter: 1, revenue_projection: 165000, user_projection: 98 },
  { id: '12', product_id: 'clinicflow', year: 2026, quarter: 2, revenue_projection: 245000, user_projection: 145 },
  { id: '13', product_id: 'clinicflow', year: 2026, quarter: 3, revenue_projection: 335000, user_projection: 198 },
  { id: '14', product_id: 'clinicflow', year: 2026, quarter: 4, revenue_projection: 425000, user_projection: 256 },

  // EduManage Pro
  { id: '15', product_id: 'edumanage', year: 2024, quarter: 1, revenue_projection: 95000, user_projection: 12 },
  { id: '16', product_id: 'edumanage', year: 2024, quarter: 2, revenue_projection: 145000, user_projection: 22 },
  { id: '17', product_id: 'edumanage', year: 2024, quarter: 3, revenue_projection: 215000, user_projection: 35 },
  { id: '18', product_id: 'edumanage', year: 2024, quarter: 4, revenue_projection: 295000, user_projection: 48 },
  { id: '19', product_id: 'edumanage', year: 2025, quarter: 1, revenue_projection: 385000, user_projection: 64 },
  { id: '20', product_id: 'edumanage', year: 2025, quarter: 2, revenue_projection: 485000, user_projection: 82 },
  { id: '21', product_id: 'edumanage', year: 2025, quarter: 3, revenue_projection: 595000, user_projection: 102 },
  { id: '22', product_id: 'edumanage', year: 2025, quarter: 4, revenue_projection: 715000, user_projection: 125 },

  // FitClub Manager
  { id: '23', product_id: 'fitclub', year: 2024, quarter: 1, revenue_projection: 75000, user_projection: 18 },
  { id: '24', product_id: 'fitclub', year: 2024, quarter: 2, revenue_projection: 125000, user_projection: 32 },
  { id: '25', product_id: 'fitclub', year: 2024, quarter: 3, revenue_projection: 185000, user_projection: 48 },
  { id: '26', product_id: 'fitclub', year: 2024, quarter: 4, revenue_projection: 255000, user_projection: 67 },
  { id: '27', product_id: 'fitclub', year: 2025, quarter: 1, revenue_projection: 335000, user_projection: 88 },
  { id: '28', product_id: 'fitclub', year: 2025, quarter: 2, revenue_projection: 425000, user_projection: 112 },
  { id: '29', product_id: 'fitclub', year: 2025, quarter: 3, revenue_projection: 525000, user_projection: 138 },
  { id: '30', product_id: 'fitclub', year: 2025, quarter: 4, revenue_projection: 635000, user_projection: 167 },

  // SportsPro Suite
  { id: '31', product_id: 'sportspro', year: 2025, quarter: 3, revenue_projection: 35000, user_projection: 15 },
  { id: '32', product_id: 'sportspro', year: 2025, quarter: 4, revenue_projection: 75000, user_projection: 32 },
  { id: '33', product_id: 'sportspro', year: 2026, quarter: 1, revenue_projection: 125000, user_projection: 54 },
  { id: '34', product_id: 'sportspro', year: 2026, quarter: 2, revenue_projection: 185000, user_projection: 78 },
  { id: '35', product_id: 'sportspro', year: 2026, quarter: 3, revenue_projection: 255000, user_projection: 105 },
  { id: '36', product_id: 'sportspro', year: 2026, quarter: 4, revenue_projection: 335000, user_projection: 136 },
];

interface DataState {
  companyInfo: CompanyInfo | null;
  sectors: Sector[];
  products: Product[];
  productFeatures: ProductFeature[];
  teamMembers: TeamMember[];
  financialProjections: FinancialProjection[];
  sectorContent: SectorContent[];
  loading: boolean;
  error: string | null;
}

export function useData(refreshKey?: number): DataState {
  const [data, setData] = useState<DataState>({
    companyInfo: null,
    sectors: [],
    products: [],
    productFeatures: [],
    teamMembers: [],
    financialProjections: [],
    sectorContent: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: companyData, error: companyError },
          { data: sectorsData, error: sectorsError },
          { data: productsData, error: productsError },
          { data: featuresData, error: featuresError },
          { data: teamData, error: teamError },
          { data: projectionsData, error: projectionsError },
        ] = await Promise.all([
          supabase.from('company_info').select('*').single(),
          supabase.from('sectors').select('*'),
          supabase.from('products').select('*'),
          supabase.from('product_features').select('*'),
          supabase.from('team_members').select('*'),
          supabase.from('financial_projections').select('*'),
        ]);

        if (companyError || sectorsError || productsError || featuresError || teamError || projectionsError) {
          throw new Error('Failed to fetch data from Supabase');
        }

        // Fetch sector content from all tables
        const sectorContentPromises = staticSectors.map(sector => fetchSectorContent(sector.id));
        const sectorContentResults = await Promise.all(sectorContentPromises);
        const allSectorContent = sectorContentResults.flat();

        setData({
          companyInfo: companyData as CompanyInfo,
          sectors: sectorsData as Sector[],
          products: productsData as Product[],
          productFeatures: featuresData as ProductFeature[],
          teamMembers: teamData as TeamMember[],
          financialProjections: projectionsData as FinancialProjection[],
          sectorContent: allSectorContent,
          loading: false,
          error: null,
        });
      } catch (err) {
        // Fallback to static data if Supabase fails
        setData({
          companyInfo: staticCompanyInfo,
          sectors: staticSectors,
          products: staticProducts,
          productFeatures: staticProductFeatures,
          teamMembers: staticTeamMembers,
          financialProjections: staticFinancialProjections,
          sectorContent: [], // No static content
          loading: false,
          error: null, // No error since we're using fallback
        });
      }
    };

    fetchData();
  }, [refreshKey]);

  return data;
}
