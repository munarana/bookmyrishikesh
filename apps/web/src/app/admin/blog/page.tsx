import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ChevronLeft, Plus, Eye, Edit } from "lucide-react";
import { BlogPostsTable } from "@/components/admin/blog/PostsTable";
import { getBlogPostsData } from "@/lib/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function BlogCMSPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  const result = await getBlogPostsData(undefined, undefined, undefined, 100, 0);
  const blogPosts = result.success ? result.data.posts : [];

  const publishedPosts = blogPosts.filter((post) => post.status === "PUBLISHED");
  const draftPosts = blogPosts.filter((post) => post.status === "DRAFT");
  const totalViews = blogPosts.reduce((acc, post) => acc + (post.views || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row mt-16 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col h-auto md:min-h-[calc(100vh-64px)] shrink-0">
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-2">
            <ChevronLeft className="w-5 h-5" /> Back to Dashboard
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Content Management
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-md bg-slate-800 text-white font-medium">
            <FileText className="w-4 h-4" /> Blog CMS
            <span className="ml-auto bg-orange-500 text-slate-900 text-[10px] px-1.5 rounded-full font-bold">
              {blogPosts.length}
            </span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Blog Content Management</h1>
            <p className="text-slate-500 text-sm">Create and manage blog posts for the platform.</p>
          </div>
          <Link href="/admin/blog/new">
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              New Blog Post
            </Button>
          </Link>
        </div>

        {/* Blog Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Posts</p>
                  <h3 className="text-3xl font-bold text-slate-900">{blogPosts.length}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg"><FileText className="w-5 h-5 text-blue-600" /></div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Published</p>
                  <h3 className="text-3xl font-bold text-slate-900">{publishedPosts.length}</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-lg"><Eye className="w-5 h-5 text-green-600" /></div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Drafts</p>
                  <h3 className="text-3xl font-bold text-slate-900">{draftPosts.length}</h3>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg"><Edit className="w-5 h-5 text-yellow-600" /></div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-none rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Views</p>
                  <h3 className="text-3xl font-bold text-slate-900">{totalViews.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg"><Eye className="w-5 h-5 text-purple-600" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blog Posts Table */}
        <BlogPostsTable posts={blogPosts} />
      </main>
    </div>
  );
}
