"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type InquiryFormProps = {
  schoolId: string;
  courseOptions: Array<{
    id: string;
    name: string;
    firstDate?: string;
  }>;
};

export function InquiryForm({ schoolId, courseOptions }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    courseId: courseOptions[0]?.id ?? "",
    desiredDate: courseOptions[0]?.firstDate ?? "",
    guests: "1",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleCourseChange = (courseId: string) => {
    const selected = courseOptions.find((item) => item.id === courseId);
    setFormData((current) => ({
      ...current,
      courseId,
      desiredDate: selected?.firstDate ?? "",
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId,
          ...formData,
          guests: Number(formData.guests),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send enquiry.");
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        country: "",
        courseId: courseOptions[0]?.id ?? "",
        desiredDate: courseOptions[0]?.firstDate ?? "",
        guests: "1",
        message: "",
      });
    } catch (submissionError: any) {
      setStatus("error");
      setError(submissionError.message || "Failed to send enquiry.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="enquiry-name">Full Name</Label>
          <Input
            id="enquiry-name"
            value={formData.name}
            onChange={(event) => handleChange("name", event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="enquiry-email">Email</Label>
          <Input
            id="enquiry-email"
            type="email"
            value={formData.email}
            onChange={(event) => handleChange("email", event.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="enquiry-phone">Phone / WhatsApp</Label>
          <Input
            id="enquiry-phone"
            value={formData.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="enquiry-country">Country</Label>
          <Input
            id="enquiry-country"
            value={formData.country}
            onChange={(event) => handleChange("country", event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="enquiry-course">Course</Label>
          <select
            id="enquiry-course"
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            value={formData.courseId}
            onChange={(event) => handleCourseChange(event.target.value)}
          >
            {courseOptions.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="enquiry-guests">Guests</Label>
          <Input
            id="enquiry-guests"
            type="number"
            min="1"
            value={formData.guests}
            onChange={(event) => handleChange("guests", event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="enquiry-date">Preferred Start Date</Label>
        <Input
          id="enquiry-date"
          type="date"
          value={formData.desiredDate}
          onChange={(event) => handleChange("desiredDate", event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="enquiry-message">Message</Label>
        <Textarea
          id="enquiry-message"
          rows={5}
          value={formData.message}
          onChange={(event) => handleChange("message", event.target.value)}
          placeholder="Ask about room types, date availability, food options, airport pickup, or teaching style."
          required
        />
      </div>

      {status === "success" ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Enquiry sent successfully. The school admin can now see it in the live enquiries inbox.
        </div>
      ) : null}

      {status === "error" ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={status === "saving"}>
        {status === "saving" ? "Sending..." : "Send Enquiry"}
      </Button>
    </form>
  );
}
