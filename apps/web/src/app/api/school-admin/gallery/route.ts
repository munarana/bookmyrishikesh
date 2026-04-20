import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@repo/database';
import { NextResponse } from 'next/server';

function isValidUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== 'SCHOOL_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { photoUrl } = body || {};

  if (!isValidUrl(photoUrl)) {
    return NextResponse.json({ error: 'A valid photoUrl is required.' }, { status: 400 });
  }

  const school = await prisma.school.findFirst({
    where: { ownerId: (session.user as any).id },
  });

  if (!school) {
    return NextResponse.json({ error: 'School not found.' }, { status: 404 });
  }

  const updated = await prisma.school.update({
    where: { id: school.id },
    data: {
      gallery: [...(school.gallery || []), photoUrl],
    },
  });

  return NextResponse.json({ gallery: updated.gallery });
}
