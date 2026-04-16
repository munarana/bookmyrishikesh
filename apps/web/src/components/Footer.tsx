import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 pb-6 mt-12 w-full">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-heading text-xl font-bold mb-4"><span className="text-accent">ॐ</span> YogaRishikesh</h3>
          <p className="text-sm text-primary-foreground/80">
            The world&apos;s leading platform to discover, compare, and book authentic yoga, meditation, and Ayurveda experiences directly from ashrams and schools in Rishikesh.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Discover</h4>
          <ul className="flex flex-col gap-2 text-sm text-primary-foreground/80">
            <li><Link href="/search?category=TTC" className="hover:text-white transition-colors">200 Hour TTC</Link></li>
            <li><Link href="/search?category=TTC" className="hover:text-white transition-colors">300 Hour TTC</Link></li>
            <li><Link href="/search?category=Retreat" className="hover:text-white transition-colors">Wellness Retreats</Link></li>
            <li><Link href="/search?category=DropIn" className="hover:text-white transition-colors">Drop-in Classes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Support</h4>
          <ul className="flex flex-col gap-2 text-sm text-primary-foreground/80">
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Newsletter</h4>
          <p className="text-sm text-primary-foreground/80 mb-4">Join our community to receive updates about new retreats and special offers.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Your email" className="bg-primary-foreground/10 px-3 py-2 rounded text-sm w-full outline-none focus:ring-1 ring-accent" />
            <button className="bg-accent text-primary px-4 py-2 rounded text-sm font-bold">Join</button>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-12 pt-6 text-center text-sm text-primary-foreground/60 w-full">
        © {new Date().getFullYear()} YogaRishikesh.com. Made with love in Rishikesh.
      </div>
    </footer>
  );
}
