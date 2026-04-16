'use server';

import { prisma, SchoolStatus } from '@repo/database';
import { revalidatePath } from 'next/cache';

/**
 * Fetches all school applications with a PENDING status.
 */
export async function getPendingSchools() {
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
        // Mock revenue data for now as we don't have a payments table fully integrated with live data in this mockup
        totalRevenue: 245600, 
        commission: 24560,
      },
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return { success: false, error: 'Failed to fetch admin stats' };
  }
}
