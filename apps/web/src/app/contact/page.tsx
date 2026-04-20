"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1000));
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
        <p className="text-slate-700 mb-8">Your message has been sent. Our team will get back to you soon.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-2 text-sm">{error}</div>}
        <div>
          <Input name="name" placeholder="Your Name" required value={form.name} onChange={handleChange} />
        </div>
        <div>
          <Input name="email" type="email" placeholder="Your Email" required value={form.email} onChange={handleChange} />
        </div>
        <div>
          <Textarea name="message" placeholder="Your Message" required value={form.message} onChange={handleChange} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending..." : "Send Message"}</Button>
      </form>
    </div>
  );
}
