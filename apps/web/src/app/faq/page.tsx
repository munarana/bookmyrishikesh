import Link from "next/link";

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold">Frequently Asked Questions</h1>
      <div className="space-y-8">
        <div>
          <h2 className="mb-2 text-2xl font-semibold">How do I book a yoga retreat?</h2>
          <p className="text-slate-700">
            Browse our curated selection of yoga retreats and teacher trainings. Once you find a
            program you like, click &quot;Book Now&quot; and follow the steps to reserve your spot.
            You&apos;ll receive a confirmation email with all the details.
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-2xl font-semibold">Is my payment secure?</h2>
          <p className="text-slate-700">
            Yes, all payments are processed securely via trusted payment gateways. Your
            information is encrypted and never shared with third parties.
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-2xl font-semibold">Can I cancel or change my booking?</h2>
          <p className="text-slate-700">
            Cancellation and change policies vary by retreat. Please review the policy on the
            retreat page or contact us for assistance. We&apos;re here to help!
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-2xl font-semibold">How do I contact support?</h2>
          <p className="text-slate-700">
            You can reach our support team via the{" "}
            <Link href="/contact" className="text-primary underline">
              Contact Us
            </Link>{" "}
            page or by emailing `support@yogarishikesh.com`. We aim to respond within 24 hours.
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-2xl font-semibold">What is included in the retreat price?</h2>
          <p className="text-slate-700">
            Each retreat lists what&apos;s included, such as accommodation, meals, classes, and
            excursions. Please check the details on the specific retreat page.
          </p>
        </div>
      </div>
    </div>
  );
}
