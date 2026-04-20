import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@repo/database";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import GalleryManager from "@/components/school-admin/GalleryManager";

export default async function SchoolAdminGalleryPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SCHOOL_ADMIN") {
    redirect("/login");
  }

  const school = await prisma.school.findFirst({
    where: { ownerId: (session.user as any).id },
  });

  if (!school) {
    redirect("/school-admin");
  }

  const galleryItems = school.gallery || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary">Photos & Videos</h1>
        <p className="text-sm text-muted-foreground mt-2">Manage your school gallery and tour media.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Cover Photo</CardTitle>
          </CardHeader>
          <CardContent>
            {school.coverPhoto ? (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <img src={school.coverPhoto} alt="Cover" className="w-full h-48 object-cover" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No cover photo uploaded yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Gallery Images</CardTitle>
          </CardHeader>
          <CardContent>
          <GalleryManager initialGallery={galleryItems} />
        </CardContent>
      </Card>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Virtual Tour / Video</CardTitle>
        </CardHeader>
        <CardContent>
          {school.virtualTourUrl ? (
            <a href={school.virtualTourUrl} target="_blank" rel="noreferrer" className="text-primary font-medium hover:underline">
              View Virtual Tour / Video
            </a>
          ) : (
            <CardDescription>No tour video URL has been added yet.</CardDescription>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
