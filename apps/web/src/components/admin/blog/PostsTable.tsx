"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, Trash2, Star } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  category: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  views: number;
  publishedAt?: Date | null;
  author: { name?: string | null; email: string };
  createdAt: Date;
}

interface BlogPostsTableProps {
  posts: BlogPost[];
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onToggleFeatured?: (postId: string) => void;
}

export function BlogPostsTable({ posts, onEdit, onDelete, onToggleFeatured }: BlogPostsTableProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = posts.filter((post) => {
    if (categoryFilter !== "all" && post.category !== categoryFilter) return false;
    if (statusFilter !== "all" && post.status !== statusFilter) return false;
    return (
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.excerpt ?? "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const categories = Array.from(new Set(posts.map((post) => post.category)));

  const formatDate = (date?: Date | null) =>
    date
      ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "-";

  return (
    <Card className="border-none shadow-sm rounded-xl bg-white">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">All Blog Posts</CardTitle>
            <CardDescription>{filtered.length} posts</CardDescription>
          </div>
          <Link href="/admin/blog/new">
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by title or excerpt..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value ?? "all")}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "all")}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Post</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Author</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-600">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-600">Views</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-600">Published</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No blog posts found
                  </td>
                </tr>
              ) : (
                filtered.map((post) => (
                  <tr key={post.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-3">
                        {post.coverImage ? (
                          <img src={post.coverImage} alt={post.title} className="w-10 h-10 rounded object-cover" />
                        ) : null}
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 line-clamp-1">{post.title}</div>
                          <div className="text-xs text-slate-500 line-clamp-1 mt-1">{post.excerpt ?? ""}</div>
                        </div>
                        {post.isFeatured ? (
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400 flex-shrink-0" />
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="text-xs">
                        {post.category.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-600">{post.author.name || post.author.email}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className="text-xs">{post.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-slate-600">{formatDate(post.publishedAt)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                          title="Preview"
                        >
                          <Eye className="w-4 h-4 text-slate-600" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit?.(post.id)} title="Edit">
                          <Edit className="w-4 h-4 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => onToggleFeatured?.(post.id)}
                          title={post.isFeatured ? "Remove from featured" : "Feature"}
                        >
                          <Star className={`w-4 h-4 ${post.isFeatured ? "fill-amber-400 text-amber-400" : "text-slate-400"}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          onClick={() => onDelete?.(post.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
