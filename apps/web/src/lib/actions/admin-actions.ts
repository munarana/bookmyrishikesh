"use server";

import {
  BlogCategory,
  PaymentStatus,
  PostStatus,
  Role,
  prisma,
} from "@repo/database";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  getMonthlyRevenue,
  getPlatformKPIs,
  getRecentActivity,
  getTopSchools,
} from "@/lib/queries/admin-analytics";

function unauthorized() {
  return { success: false as const, error: "Unauthorized" };
}

async function requireSuperAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return null;
  }

  return session;
}

export async function getAnalyticsData() {
  const session = await requireSuperAdmin();
  if (!session) {
    return unauthorized();
  }

  try {
    const [kpis, monthlyRevenue, recentActivity, topSchools] = await Promise.all([
      getPlatformKPIs(),
      getMonthlyRevenue(),
      getRecentActivity(),
      getTopSchools(),
    ]);

    const activities = recentActivity.map((item) => ({
      type: item.entity === "school" ? "school" : item.entity === "review" ? "review" : "booking",
      message: `${item.action}: ${item.entity}${item.user ? ` by ${item.user}` : ""}`,
      timestamp: item.createdAt,
    })) as Array<{
      type: "booking" | "school" | "review";
      message: string;
      timestamp: Date;
    }>;

    return {
      success: true as const,
      data: {
        kpis,
        monthlyRevenue,
        activities,
        topSchools,
      },
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return { success: false as const, error: "Failed to fetch analytics" };
  }
}

export async function getUsersData(
  role?: string,
  search?: string,
  limit: number = 50,
  offset: number = 0
) {
  const session = await requireSuperAdmin();
  if (!session) {
    return unauthorized();
  }

  try {
    const normalizedRole =
      role && role !== "all" && role !== "ALL" ? (role as Role) : undefined;

    const where = {
      ...(normalizedRole ? { role: normalizedRole } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
          lastLoginAt: true,
          isActive: true,
        },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      success: true as const,
      data: {
        users: users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          createdAt: user.createdAt,
          lastLogin: user.lastLoginAt ?? user.createdAt,
          active: user.isActive,
        })),
        total,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false as const, error: "Failed to fetch users" };
  }
}

export async function getBlogPostsData(
  status?: string,
  category?: string,
  search?: string,
  limit: number = 50,
  offset: number = 0
) {
  const session = await requireSuperAdmin();
  if (!session) {
    return unauthorized();
  }

  try {
    const normalizedStatus =
      status && status !== "all" ? (status as PostStatus) : undefined;
    const normalizedCategory =
      category && category !== "all" ? (category as BlogCategory) : undefined;

    const where = {
      ...(normalizedStatus ? { status: normalizedStatus } : {}),
      ...(normalizedCategory ? { category: normalizedCategory } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { excerpt: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: { author: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return {
      success: true as const,
      data: {
        posts,
        total,
      },
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return { success: false as const, error: "Failed to fetch blog posts" };
  }
}

export async function createBlogPost(data: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: BlogCategory;
  tags?: string[];
  coverImage?: string;
  seoTitle?: string;
  seoDesc?: string;
  status?: PostStatus;
  isFeatured?: boolean;
  publishedAt?: Date;
}) {
  const session = await requireSuperAdmin();
  if (!session) {
    return unauthorized();
  }

  try {
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        tags: data.tags ?? [],
        coverImage: data.coverImage,
        seoTitle: data.seoTitle,
        seoDesc: data.seoDesc,
        status: data.status ?? PostStatus.DRAFT,
        isFeatured: data.isFeatured ?? false,
        publishedAt:
          data.status === PostStatus.PUBLISHED ? data.publishedAt ?? new Date() : data.publishedAt,
        authorId: session.user.id,
      },
    });

    return { success: true as const, data: post };
  } catch (error) {
    console.error("Error creating blog post:", error);
    return { success: false as const, error: "Failed to create blog post" };
  }
}

export async function updateBlogPost(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: BlogCategory;
    tags: string[];
    coverImage: string;
    status: PostStatus;
    isFeatured: boolean;
    seoTitle: string;
    seoDesc: string;
    publishedAt: Date;
  }>
) {
  const session = await requireSuperAdmin();
  if (!session) {
    return unauthorized();
  }

  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        publishedAt:
          data.status === PostStatus.PUBLISHED && !data.publishedAt
            ? new Date()
            : data.publishedAt,
      },
    });

    return { success: true as const, data: post };
  } catch (error) {
    console.error("Error updating blog post:", error);
    return { success: false as const, error: "Failed to update blog post" };
  }
}

export async function deleteBlogPost(id: string) {
  const session = await requireSuperAdmin();
  if (!session) {
    return unauthorized();
  }

  try {
    await prisma.blogPost.update({
      where: { id },
      data: { status: PostStatus.ARCHIVED },
    });
    return { success: true as const };
  } catch (error) {
    console.error("Error archiving blog post:", error);
    return { success: false as const, error: "Failed to archive blog post" };
  }
}

export async function getHomepageContent(section?: string) {
  const session = await requireSuperAdmin();
  if (!session) {
    return unauthorized();
  }

  try {
    if (section) {
      const content = await prisma.homepageContent.findUnique({
        where: { section },
      });

      return { success: true as const, data: content };
    }

    const sections = await prisma.homepageContent.findMany({
      orderBy: { section: "asc" },
    });
    return { success: true as const, data: sections };
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    return { success: false as const, error: "Failed to fetch homepage content" };
  }
}

export async function updateHomepageContent(
  section: string,
  content: unknown,
  updatedBy?: string
) {
  const session = await requireSuperAdmin();
  if (!session) {
    return unauthorized();
  }

  try {
    const result = await prisma.homepageContent.upsert({
      where: { section },
      update: {
        content: content as object,
        updatedBy: updatedBy ?? session.user.id,
      },
      create: {
        section,
        content: content as object,
        updatedBy: updatedBy ?? session.user.id,
      },
    });

    return { success: true as const, data: result };
  } catch (error) {
    console.error("Error updating homepage content:", error);
    return { success: false as const, error: "Failed to update homepage content" };
  }
}

export async function getCompletedPaymentsTotal() {
  const session = await requireSuperAdmin();
  if (!session) {
    return unauthorized();
  }

  try {
    const payments = await prisma.payment.findMany({
      where: { status: PaymentStatus.COMPLETED },
      select: { amount: true },
    });

    return {
      success: true as const,
      data: payments.reduce((sum, payment) => sum + payment.amount, 0),
    };
  } catch (error) {
    console.error("Error fetching payments total:", error);
    return { success: false as const, error: "Failed to fetch payments total" };
  }
}
