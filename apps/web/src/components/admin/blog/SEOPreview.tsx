"use client";

interface SEOPreviewProps {
  title: string;
  description: string;
  slug: string;
}

export function SEOPreview({ title, description, slug }: SEOPreviewProps) {
  const baseUrl = "yogarishikesh.com/blog";
  const seoTitle = title || "Your Blog Post Title";
  const seoDesc = description || "Your blog post description appears here...";
  const fullUrl = `${baseUrl}/${slug || "slug"}`;

  const titleLength = seoTitle.length;
  const descLength = seoDesc.length;
  const titleClass = titleLength > 60 ? "text-red-600" : titleLength > 55 ? "text-amber-600" : "";
  const descClass = descLength > 160 ? "text-red-600" : descLength > 155 ? "text-amber-600" : "";

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
      <h4 className="font-semibold text-sm text-slate-900 mb-4">SEO Preview</h4>
      
      {/* Google Search Result Preview */}
      <div className="bg-white border border-slate-200 rounded p-3 space-y-1">
        <div className="text-xs text-slate-500">
          🌐 {fullUrl}
        </div>
        <div className={`text-sm font-medium line-clamp-1 ${titleClass}`}>
          {seoTitle || "Your Blog Post Title"}
        </div>
        <div className={`text-xs text-slate-600 line-clamp-2 ${descClass}`}>
          {seoDesc || "Your blog post description appears here..."}
        </div>
      </div>

      {/* Character Counts */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-600">SEO Title:</span>
          <span className={titleClass}>
            {titleLength}/60 {titleLength > 60 && "⚠️ Too long"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Meta Description:</span>
          <span className={descClass}>
            {descLength}/160 {descLength > 160 && "⚠️ Too long"}
          </span>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-900">
        <strong>Tip:</strong> Keep titles under 60 characters and descriptions under 160 characters for best display in search results.
      </div>
    </div>
  );
}
