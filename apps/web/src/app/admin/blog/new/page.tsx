"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Save, Eye, Lock, Unlock } from "lucide-react";
import { RichTextEditor } from "@/components/admin/blog/RichTextEditor";
import { SEOPreview } from "@/components/admin/blog/SEOPreview";
import { createBlogPost } from "@/lib/actions/admin-actions";

const BLOG_CATEGORIES = [
  "YOGA_TIPS",
  "TTC_GUIDE",
  "RISHIKESH_TRAVEL",
  "WELLNESS",
  "RETREAT_GUIDE",
  "SCHOOL_SPOTLIGHT",
  "STUDENT_STORIES",
 ] as const;

type BlogCategory = (typeof BLOG_CATEGORIES)[number];

type BlogFormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  coverImage: string;
  status: "DRAFT" | "PUBLISHED";
  isFeatured: boolean;
  seoTitle: string;
  seoDesc: string;
  publishedAt: string;
};

export default function NewBlogPostPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveTime, setAutoSaveTime] = useState<string>("now");
  const [slugLocked, setSlugLocked] = useState(false);

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "YOGA_TIPS",
    tags: [] as string[],
    coverImage: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
    isFeatured: false,
    seoTitle: "",
    seoDesc: "",
    publishedAt: new Date().toISOString().split("T")[0],
  });

  const [tagInput, setTagInput] = useState("");

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugLocked && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, slugLocked]);

  // Auto-save every 60 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (formData.title || formData.content) {
        try {
          await createBlogPost({
            title: formData.title || "Untitled",
            slug: formData.slug || "untitled",
            excerpt: formData.excerpt,
            content: formData.content,
            category: formData.category,
            tags: formData.tags,
            coverImage: formData.coverImage,
            seoTitle: formData.seoTitle,
            seoDesc: formData.seoDesc,
          });
          setAutoSaveTime(new Date().toLocaleTimeString([], { 
            hour: "2-digit", 
            minute: "2-digit" 
          }));
        } catch (error) {
          console.error("Auto-save failed:", error);
        }
      }
    }, 60000); // Auto-save every 60 seconds

    return () => clearInterval(interval);
  }, [formData]);

  // Keyboard shortcut for save (Cmd+S / Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [formData]);

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await createBlogPost({
        title: formData.title || "Untitled",
        slug: formData.slug || "untitled",
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        coverImage: formData.coverImage,
        seoTitle: formData.seoTitle,
        seoDesc: formData.seoDesc,
      });

      if (result.success) {
        setAutoSaveTime(new Date().toLocaleTimeString([], { 
          hour: "2-digit", 
          minute: "2-digit" 
        }));
        setTimeout(() => {
          router.push("/admin/blog");
        }, 1000);
      }
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const excerptLength = formData.excerpt.length;
  const seoTitleLength = formData.seoTitle.length;
  const seoDescLength = formData.seoDesc.length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row mt-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col h-auto md:min-h-[calc(100vh-64px)] shrink-0">
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin/blog" className="flex items-center gap-2 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" /> Back to Blog
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">New Blog Post</h1>
            <p className="text-slate-500 text-sm mt-1">
              Last autosaved: {autoSaveTime}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSaving ? "Saving..." : "Publish Now"}
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Writing Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <Input
                type="text"
                placeholder="Post title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="text-3xl font-bold border-0 focus:outline-none focus:ring-0 p-0 placeholder:text-slate-400"
              />
            </div>

            {/* Slug */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label className="text-xs text-slate-600 mb-1 block">Slug</Label>
                <Input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="text-sm"
                  placeholder="post-slug"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSlugLocked(!slugLocked)}
                className="mb-0"
              >
                {slugLocked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Rich Text Editor */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">Content</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, content }))
                }
              />
            </div>

            {/* Excerpt */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">
                Excerpt ({excerptLength}/160)
              </Label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 160);
                  setFormData((prev) => ({ ...prev, excerpt: val }));
                }}
                placeholder="A short summary shown in blog cards and search results..."
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Right Column - Sidebar Settings */}
          <div className="lg:col-span-1 space-y-4">
            {/* Publish Settings */}
            <Card className="border-none shadow-sm rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-slate-600 mb-2 block">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => {
                      if (!value) return;
                      setFormData((prev) => ({
                        ...prev,
                        status: value as BlogFormData["status"],
                      }));
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-slate-600 mb-2 block">
                    Publish Date
                  </Label>
                  <Input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        publishedAt: e.target.value,
                      }))
                    }
                    className="h-9 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 h-9 text-sm">
                    Save Draft
                  </Button>
                  <Button className="flex-1 h-9 text-sm bg-orange-500 hover:bg-orange-600">
                    Publish
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Categorization */}
            <Card className="border-none shadow-sm rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Categorization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-slate-600 mb-2 block">
                    Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      if (!value) return;
                      setFormData((prev) => ({
                        ...prev,
                        category: value as BlogCategory,
                      }));
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOG_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-slate-600 mb-2 block">Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add tag..."
                      className="h-9 text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddTag}
                      className="h-9"
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <div
                        key={tag}
                        className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-orange-900"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-slate-600">Feature</Label>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isFeatured: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card className="border-none shadow-sm rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Cover Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  type="text"
                  placeholder="Image URL"
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      coverImage: e.target.value,
                    }))
                  }
                  className="h-9 text-sm"
                />
                {formData.coverImage && (
                  <img
                    src={formData.coverImage}
                    alt="Cover"
                    className="w-full h-32 object-cover rounded"
                  />
                )}
                {!formData.coverImage && (
                  <div className="w-full h-32 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-500 text-sm">
                    No image selected
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SEO Preview */}
            <Card className="border-none shadow-sm rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-slate-600 mb-2 block">
                    SEO Title ({seoTitleLength}/60)
                  </Label>
                  <Input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 60);
                      setFormData((prev) => ({ ...prev, seoTitle: val }));
                    }}
                    placeholder="Page title for search engines..."
                    className={`h-9 text-sm ${
                      seoTitleLength > 60 ? "border-red-500" : ""
                    }`}
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-600 mb-2 block">
                    Meta Description ({seoDescLength}/160)
                  </Label>
                  <Textarea
                    value={formData.seoDesc}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 160);
                      setFormData((prev) => ({ ...prev, seoDesc: val }));
                    }}
                    placeholder="Description shown in search results..."
                    className={`resize-none h-20 text-sm ${
                      seoDescLength > 160 ? "border-red-500" : ""
                    }`}
                  />
                </div>
                <SEOPreview
                  title={formData.seoTitle || formData.title}
                  description={formData.seoDesc || formData.excerpt}
                  slug={formData.slug}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
