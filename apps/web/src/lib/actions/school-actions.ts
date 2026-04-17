'use server';

import { prisma, SchoolStatus } from '@repo/database';
import { revalidatePath } from 'next/cache';

/**
 * Helper to check if database state can be accessed
 * In a real app, we check process.env.DATABASE_URL
 */
const isDbAvailable = !!process.env.DATABASE_URL;

/**
 * Mock data for when DB is not available (Local UI testing)
 */
const MOCK_DATA = {
  pendingSchools: [
    {
      id: 'mock-1',
      name: 'Sushumna Yoga School',
      address: 'Laxman Jhula, Rishikesh',
      businessRegistrationNo: 'REG-2024-001',
      yogaCertificateUrl: 'https://placehold.co/600x400?text=Yoga+Certificate',
      personalIdUrl: 'https://placehold.co/600x400?text=Personal+ID',
      createdAt: new Date().toISOString(),
      owner: { name: 'Ravi Shankar', email: 'ravi@example.com' }
    },
    {
      id: 'mock-2',
      name: 'Prana Retreats',
      address: 'Tapovan, Rishikesh',
      businessRegistrationNo: 'REG-2024-002',
      yogaCertificateUrl: 'https://placehold.co/600x400?text=Yoga+Certificate',
      personalIdUrl: 'https://placehold.co/600x400?text=Personal+ID',
      createdAt: new Date().toISOString(),
      owner: { name: 'Amanda Lin', email: 'amanda@example.com' }
    }
  ],
  stats: {
    pendingApprovals: 2,
    activeSchools: 54,
    totalUsers: 1248,
    totalRevenue: 245600,
    commission: 24560,
  }
};

/**
 * Fetches all school applications with a PENDING status.
 */
export async function getPendingSchools() {
  if (!isDbAvailable) {
    console.warn('DATABASE_URL missing, returning mock pending schools');
    return {
      success: true,
      data: MOCK_DATA.pendingSchools as any[]
    };
  }

  try {
    const schools = await prisma.school.findMany({
      where: {
        status: SchoolStatus.PENDING,
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { success: true, data: schools };
  } catch (error) {
    console.error('Error fetching pending schools:', error);
    return { success: false, error: 'Failed to fetch pending schools' };
  }
}

/**
 * Updates the status of a school application.
 */
export async function updateSchoolStatus(
  schoolId: string,
  status: SchoolStatus,
  notes?: string
) {
  if (!isDbAvailable) {
    console.log(`Mock: Updating school ${schoolId} to ${status}`);
    return { success: true, message: 'Mock update successful' };
  }

  try {
    await prisma.school.update({
      where: { id: schoolId },
      data: {
        status,
        applicationNotes: notes,
      },
    });

    revalidatePath('/admin/approvals');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating school status:', error);
    return { success: false, error: 'Failed to update school status' };
  }
}

/**
 * Fetches platform-wide stats for the Super Admin dashboard.
 */
export async function getAdminStats() {
  if (!isDbAvailable) {
    return {
      success: true,
      data: MOCK_DATA.stats
    };
  }

  try {
    const [pendingCount, totalSchools, totalUsers] = await Promise.all([
      prisma.school.count({ where: { status: SchoolStatus.PENDING } }),
      prisma.school.count({ where: { status: SchoolStatus.APPROVED } }),
      prisma.user.count(),
    ]);

    return {
      success: true,
      data: {
        pendingApprovals: pendingCount,
        activeSchools: totalSchools,
        totalUsers: totalUsers,
        totalRevenue: 245600, 
        commission: 24560,
      },
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return { success: false, error: 'Failed to fetch admin stats' };
  }
}
