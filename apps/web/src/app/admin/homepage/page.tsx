"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save, Eye, EyeOff } from "lucide-react";

type HeroStat = {
  icon?: string;
  label: string;
  value: string;
};

type SectionButton = {
  text?: string;
  url?: string;
};

type HomepageSectionContent = {
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  buttonUrl?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  stats?: HeroStat[];
  showStats?: boolean;
  title?: string;
  subtitle?: string;
  mode?: string;
  schools?: string[];
  button1?: SectionButton;
  button2?: SectionButton;
  bgColor?: string;
};

interface HomepageSection {
  id: string;
  section: string;
  title: string;
  content: HomepageSectionContent;
  isActive: boolean;
  lastEdited?: string;
}

const HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    id: "1",
    section: "hero",
    title: "Hero Banner",
    content: {
      headline: "Find Your Perfect Yoga Journey in Rishikesh",
      subheadline: "200+ Schools · 500+ Courses · Trusted by 10,000 Students",
      buttonText: "Explore Schools",
      buttonUrl: "/schools",
      backgroundImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200",
      overlayOpacity: 40,
      stats: [
        { label: "Schools", value: "200+" },
        { label: "Courses", value: "500+" },
        { label: "Students", value: "10k+" },
      ],
      showStats: true,
    },
    isActive: true,
    lastEdited: "2 minutes ago",
  },
  {
    id: "2",
    section: "featured_schools",
    title: "Featured Schools",
    content: {
      title: "Top-Rated Schools in Rishikesh",
      subtitle: "Handpicked selection of the best yoga schools",
      mode: "auto",
      schools: [],
    },
    isActive: true,
    lastEdited: "1 hour ago",
  },
  {
    id: "3",
    section: "stats",
    title: "Platform Stats",
    content: {
      stats: [
        { icon: "Users", label: "Active Students", value: "10,000+" },
        { icon: "Building", label: "Partner Schools", value: "200+" },
        { icon: "Star", label: "Avg Rating", value: "4.8★" },
        { icon: "Globe", label: "Countries", value: "45+" },
      ],
      bgColor: "orange",
    },
    isActive: true,
    lastEdited: "3 hours ago",
  },
  {
    id: "6",
    section: "cta_banner",
    title: "CTA Banner",
    content: {
      headline: "Ready to Start Your Yoga Journey?",
      subheadline: "Join thousands of students finding their path in Rishikesh",
      button1: { text: "Browse Schools", url: "/schools" },
      button2: { text: "Contact Us", url: "/contact" },
      bgColor: "orange",
    },
    isActive: true,
    lastEdited: "4 hours ago",
  },
];

export default function HomepageContentManager() {
  const [sections, setSections] = useState<HomepageSection[]>(HOMEPAGE_SECTIONS);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>("1");

  const updateSection = (id: string, updates: Partial<HomepageSection>) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    setUnsavedChanges(true);
  };

  const toggleSectionActive = (id: string) => {
    updateSection(id, {
      isActive: !sections.find((s) => s.id === id)?.isActive,
    });
  };

  const handleSaveAll = async () => {
    try {
      // Save all sections
      for (const section of sections) {
        // Call API to save
        console.log("Saving section:", section.section);
      }
      setUnsavedChanges(false);
      alert("All sections saved successfully!");
    } catch (error) {
      console.error("Error saving sections:", error);
      alert("Failed to save sections");
    }
  };

  const currentSection = sections.find((s) => s.id === selectedSection);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row mt-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col h-auto md:min-h-[calc(100vh-64px)] shrink-0">
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-2 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" /> Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row max-h-[calc(100vh-64px)]">
        {/* Left Panel - Editors */}
        <div className="w-full md:w-2/5 p-6 border-r border-slate-200 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">Homepage Content</h1>
            <p className="text-slate-500 text-sm mt-1">Edit homepage sections in real-time</p>
          </div>

          {unsavedChanges && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              You have unsaved changes
            </div>
          )}

          {/* Sections List */}
          <div className="space-y-2 mb-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedSection === section.id
                    ? "bg-orange-100 border-2 border-orange-500"
                    : "bg-slate-50 border-2 border-transparent hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionActive(section.id);
                    }}
                    className="p-1"
                  >
                    {section.isActive ? (
                      <Eye className="w-4 h-4 text-slate-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <div>
                    <div className="font-semibold text-slate-900">{section.title}</div>
                    <div className="text-xs text-slate-500">{section.lastEdited}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Section Editor */}
          {currentSection && (
            <Card className="border-none shadow-sm rounded-lg sticky top-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{currentSection.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentSection.section === "hero" && (
                  <>
                    <div>
                      <Label className="text-xs font-semibold">Headline</Label>
                      <Input
                        value={currentSection.content.headline}
                        onChange={(e) =>
                          updateSection(currentSection.id, {
                            content: {
                              ...currentSection.content,
                              headline: e.target.value,
                            },
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Subheadline</Label>
                      <Input
                        value={currentSection.content.subheadline}
                        onChange={(e) =>
                          updateSection(currentSection.id, {
                            content: {
                              ...currentSection.content,
                              subheadline: e.target.value,
                            },
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Button Text</Label>
                      <Input
                        value={currentSection.content.buttonText}
                        onChange={(e) =>
                          updateSection(currentSection.id, {
                            content: {
                              ...currentSection.content,
                              buttonText: e.target.value,
                            },
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Background Image URL</Label>
                      <Input
                        value={currentSection.content.backgroundImage}
                        onChange={(e) =>
                          updateSection(currentSection.id, {
                            content: {
                              ...currentSection.content,
                              backgroundImage: e.target.value,
                            },
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Overlay Opacity: {currentSection.content.overlayOpacity}%</Label>
                      <input
                        type="range"
                        min="0"
                        max="80"
                        value={currentSection.content.overlayOpacity}
                        onChange={(e) =>
                          updateSection(currentSection.id, {
                            content: {
                              ...currentSection.content,
                              overlayOpacity: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </>
                )}

                {currentSection.section === "cta_banner" && (
                  <>
                    {(() => {
                      const button1 = currentSection.content.button1 ?? { text: "", url: "" };
                      return (
                        <>
                    <div>
                      <Label className="text-xs font-semibold">Headline</Label>
                      <Input
                        value={currentSection.content.headline}
                        onChange={(e) =>
                          updateSection(currentSection.id, {
                            content: {
                              ...currentSection.content,
                              headline: e.target.value,
                            },
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Button 1 Text</Label>
                      <Input
                        value={button1.text}
                        onChange={(e) =>
                          updateSection(currentSection.id, {
                            content: {
                              ...currentSection.content,
                              button1: {
                                ...button1,
                                text: e.target.value,
                              },
                            },
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Button 1 URL</Label>
                      <Input
                        value={button1.url}
                        onChange={(e) =>
                          updateSection(currentSection.id, {
                            content: {
                              ...currentSection.content,
                              button1: {
                                ...button1,
                                url: e.target.value,
                              },
                            },
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                        </>
                      );
                    })()}
                  </>
                )}

                <Button
                  onClick={handleSaveAll}
                  disabled={!unsavedChanges}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-full md:w-3/5 p-6 bg-slate-100 overflow-auto">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">Live Preview</h2>
          <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="min-h-screen">
              {/* Hero Section */}
              {sections[0]?.isActive && (
                <div
                  style={{
                    backgroundImage: `url(${sections[0].content.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="relative h-96 flex items-center justify-center"
                >
                  <div
                    style={{
                      backgroundColor: `rgba(0, 0, 0, ${(sections[0].content.overlayOpacity ?? 0) / 100})`,
                    }}
                    className="absolute inset-0"
                  />
                  <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-4xl font-bold mb-4">
                      {sections[0].content.headline}
                    </h1>
                    <p className="text-xl mb-6">{sections[0].content.subheadline}</p>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      {sections[0].content.buttonText}
                    </Button>
                  </div>
                </div>
              )}

              {/* Stats Section */}
              {sections[2]?.isActive && sections[0].content.showStats && (
                <div className="bg-orange-50 px-6 py-8">
                  <div className="grid grid-cols-3 gap-4">
                    {(sections[0].content.stats ?? []).map((stat, idx: number) => (
                      <div key={idx} className="text-center">
                        <div className="text-2xl font-bold text-slate-900">
                          {stat.value}
                        </div>
                        <div className="text-sm text-slate-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Schools Section */}
              {sections[1]?.isActive && (
                <div className="px-6 py-12 bg-white">
                  <h2 className="text-3xl font-bold text-center mb-2">
                    {sections[1].content.title}
                  </h2>
                  <p className="text-center text-slate-600 mb-8">
                    {sections[1].content.subtitle}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-slate-200 h-40" />
                        <div className="p-4">
                          <h3 className="font-semibold">School {i}</h3>
                          <p className="text-sm text-slate-600">★★★★★ (234 reviews)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Banner */}
              {sections[3]?.isActive && (
                <div className="bg-orange-500 px-6 py-12 text-white text-center">
                  <h2 className="text-3xl font-bold mb-2">
                    {sections[3].content.headline}
                  </h2>
                  <p className="mb-6">{sections[3].content.subheadline}</p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <Button className="bg-white text-orange-600 hover:bg-slate-100">
                      {sections[3].content.button1?.text ?? "Primary CTA"}
                    </Button>
                    <Button variant="outline" className="border-white text-white hover:bg-orange-600">
                      {sections[3].content.button2?.text ?? "Secondary CTA"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
