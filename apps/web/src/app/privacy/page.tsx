import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="mb-6 text-slate-700">Your privacy is important to us. This policy is inspired by BookRetreats.com and BookYogaRetreats.com and explains how we collect, use, and protect your information.</p>
      <ul className="list-disc pl-6 space-y-4 text-slate-700">
        <li><strong>Information Collection:</strong> We collect information you provide when booking, registering, or contacting us. This may include your name, email, and booking details.</li>
        <li><strong>Use of Information:</strong> Your information is used to process bookings, provide customer support, and improve our services. We do not sell your data to third parties.</li>
        <li><strong>Cookies:</strong> We use cookies to enhance your experience and analyze site usage. You can control cookies through your browser settings.</li>
        <li><strong>Data Security:</strong> We implement industry-standard security measures to protect your data.</li>
        <li><strong>Third-Party Services:</strong> Some services (like payment processing) are provided by trusted partners. Their privacy policies apply.</li>
        <li><strong>Contact:</strong> For privacy questions, please <Link href="/contact" className="text-primary underline">contact us</Link>.</li>
      </ul>
      <p className="mt-8 text-slate-600">By using YogaRishikesh, you agree to this policy. We may update it from time to time.</p>
    </div>
  );
}
