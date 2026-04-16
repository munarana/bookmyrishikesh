import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function BlogListingPage() {
  const posts = [
    {
      title: "Best Yoga Schools in Rishikesh 2025",
      slug: "best-yoga-schools-rishikesh-2025",
      date: "Jan 15, 2024",
      category: "Guides",
      img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80"
    },
    {
      title: "Complete Guide to 200hr TTC in Rishikesh",
      slug: "complete-guide-to-200hr-ttc-rishikesh",
      date: "Feb 02, 2024",
      category: "TTC",
      img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80"
    },
    {
      title: "What to Pack for a Yoga Retreat in India",
      slug: "what-to-pack-for-yoga-retreat-india",
      date: "Mar 10, 2024",
      category: "Preparation",
      img: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 text-primary">Yoga Insights & Stories</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Explore our editorial guides to find your spiritual path, prepare for your journey, and discover the magic of Rishikesh.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.slug} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow group border-none">
              <Link href={`/blog/${post.slug}`}>
                <div className="relative h-64 overflow-hidden">
                  <Image src={post.img} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-xs text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4 mr-1" /> {post.date}
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 leading-tight group-hover:text-accent transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    A comprehensive overview of what to expect, how to prepare, and why Rishikesh is the ultimate destination for your upcoming yoga journey. Read more...
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
