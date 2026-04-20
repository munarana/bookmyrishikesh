import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <p className="mb-6 text-slate-700">Welcome to YogaRishikesh. By using our platform, you agree to the following terms, inspired by leading retreat booking sites like BookRetreats.com and BookYogaRetreats.com.</p>
      <ul className="list-disc pl-6 space-y-4 text-slate-700">
        <li><strong>Eligibility:</strong> You must be at least 18 years old to book or list a retreat.</li>
        <li><strong>Bookings:</strong> All bookings are subject to availability and confirmation by the retreat provider. Payment terms and cancellation policies are clearly stated on each retreat page.</li>
        <li><strong>Payments:</strong> Payments are processed securely. We do not store your payment information.</li>
        <li><strong>User Conduct:</strong> Users must provide accurate information and respect other members of the community. Abuse, spam, or fraudulent activity will result in account suspension.</li>
        <li><strong>Liability:</strong> YogaRishikesh acts as a marketplace. We are not responsible for the actions or omissions of retreat providers or participants.</li>
        <li><strong>Changes to Terms:</strong> We may update these terms at any time. Continued use of the platform constitutes acceptance of the new terms.</li>
      </ul>
      <p className="mt-8 text-slate-600">For questions, please <Link href="/contact" className="text-primary underline">contact us</Link>.</p>
    </div>
  );
}
