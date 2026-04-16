import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-2xl text-primary flex items-center gap-2">
          {/* Using a simple icon/text approach for logo */}
          <span className="text-accent">ॐ</span> YogaRishikesh
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/search" className="hover:text-primary transition-colors">Retreats</Link>
          <Link href="/search?category=TTC" className="hover:text-primary transition-colors">Teacher Training</Link>
          <Link href="/schools" className="hover:text-primary transition-colors">Schools</Link>
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/school-admin" className="text-sm font-medium hidden md:block">List your School</Link>
          <Button variant="default" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
