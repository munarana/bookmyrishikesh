'use client';
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import Image from "next/image";

const STEPS = ["Dates & Guests", "Room Type", "Add-ons", "Your Details", "Payment"];

export default function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-background pt-20 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <Link href={`/schools/satvic-yoga-academy`} className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
            <ChevronLeft className="w-4 h-4"/> Back to details
          </Link>
          <h1 className="font-heading text-3xl font-bold">Secure Your Spot</h1>
          <p className="text-muted-foreground">200-Hour Hatha Yoga Teacher Training • Satvic Yoga Academy</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Wizard Area */}
          <div className="flex-1 w-full space-y-8">
            {/* Progress Bar */}
            <div className="flex items-center justify-between relative mb-8">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border -z-10"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-300" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
              
              {STEPS.map((step, idx) => (
                <div key={step} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${idx <= currentStep ? 'bg-primary text-white' : 'bg-white border-2 border-border text-muted-foreground'}`}>
                    {idx < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-xs font-bold hidden md:block ${idx <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>{step}</span>
                </div>
              ))}
            </div>

            {/* Step Content */}
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-6 md:p-8 min-h-[400px]">
                {currentStep === 0 && (
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <h2 className="font-heading text-2xl font-bold mb-6">Select Dates</h2>
                    <div className="grid gap-4">
                      {[ 
                        { dates: "June 1 - June 25, 2024", seats: 5, price: 800 },
                        { dates: "July 1 - July 25, 2024", seats: 2, price: 800 },
                        { dates: "August 1 - August 25, 2024", seats: 12, price: 850 }
                      ].map((slot, i) => (
                        <div key={i} className={`p-4 border rounded-xl flex justify-between items-center cursor-pointer transition-all ${i === 0 ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}>
                          <div>
                            <div className="font-bold text-lg">{slot.dates}</div>
                            <div className="text-sm font-medium text-accent mt-1">Only {slot.seats} seats left</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-xl">${slot.price}</div>
                            <div className="text-xs text-muted-foreground">per person</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <h2 className="font-heading text-2xl font-bold mb-6">Choose Accommodation</h2>
                    <div className="grid gap-4">
                      {[ 
                        { type: "Shared Dormitory", add: 0, desc: "Bunk beds, shared bathroom, AC" },
                        { type: "Twin Shared Room", add: 150, desc: "2 beds, private attached bathroom, AC" },
                        { type: "Private Room", add: 400, desc: "1 queen bed, private attached bathroom, AC, river view" }
                      ].map((room, i) => (
                        <div key={i} className={`p-4 border rounded-xl cursor-pointer transition-all ${i === 2 ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-bold text-lg">{room.type}</div>
                            <div className="font-bold text-primary">{room.add === 0 ? 'Included' : `+$${room.add}`}</div>
                          </div>
                          <p className="text-sm text-muted-foreground">{room.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <h2 className="font-heading text-2xl font-bold mb-6">Enhance Your Experience (Optional)</h2>
                    <div className="grid gap-4">
                      <div className="p-4 border border-border rounded-xl flex items-center justify-between">
                        <div>
                          <div className="font-bold">Dehradun Airport (DED) Pickup</div>
                          <div className="text-sm text-muted-foreground">Private AC taxi directly to the ashram</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="font-bold">+$25</div>
                          <input type="checkbox" className="w-5 h-5 accent-accent" />
                        </div>
                      </div>
                      <div className="p-4 border border-border rounded-xl flex items-center justify-between">
                        <div>
                          <div className="font-bold">Ayurvedic Consultation & Massage</div>
                          <div className="text-sm text-muted-foreground">1 hour full body massage with an expert doctor</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="font-bold">+$40</div>
                          <input type="checkbox" className="w-5 h-5 accent-accent" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <h2 className="font-heading text-2xl font-bold mb-6">Guest Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input placeholder="Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input type="email" placeholder="john@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label>WhatsApp Number</Label>
                        <Input placeholder="+1 234 567 8900" />
                      </div>
                      <div className="space-y-2">
                        <Label>Nationality</Label>
                        <Input placeholder="United Kingdom" />
                      </div>
                      <div className="space-y-2">
                        <Label>Yoga Experience Level</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-2 mt-4">
                        <Label>Dietary Restrictions / Health Conditions</Label>
                        <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Please let us know..."></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <h2 className="font-heading text-2xl font-bold mb-6">Payment Options</h2>
                    <p className="text-muted-foreground text-sm mb-4">You can reserve your spot by paying a deposit today. The remaining balance is due upon arrival.</p>
                    
                    <div className="space-y-4">
                      <div className="p-4 border border-primary bg-primary/5 ring-1 ring-primary rounded-xl cursor-pointer">
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-bold flex items-center gap-2"><div className="w-4 h-4 rounded-full border-4 border-primary flex-shrink-0"></div> Pay Deposit Only</div>
                          <div className="font-bold text-xl">$240.00</div>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">Pay 20% now to confirm. Owe $960 at school.</p>
                      </div>
                      
                      <div className="p-4 border border-border rounded-xl cursor-pointer">
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-bold flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-border flex-shrink-0"></div> Pay Full Amount</div>
                          <div className="font-bold text-xl">$1200.00</div>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">Pay everything upfront.</p>
                      </div>
                    </div>

                    {/* Placeholder for Stripe/Razorpay UI */}
                    <div className="mt-8 p-6 bg-secondary/50 rounded-xl text-center border border-border border-dashed">
                      <Image src="/stripe-razorpay-placeholder.png" alt="Payment processor" width={200} height={40} className="mx-auto opacity-50 mb-2" />
                      <p className="text-sm text-muted-foreground font-medium">Secure credit card checkout will appear here.</p>
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
              <Button onClick={prevStep} disabled={currentStep === 0} variant="outline" className="px-8">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              {currentStep < STEPS.length - 1 ? (
                <Button onClick={nextStep} className="px-8 bg-accent hover:bg-accent/90 text-primary font-bold">
                  Next Step <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button className="px-8 bg-primary hover:bg-primary/90 text-white font-bold h-12 shadow-md">
                  Confirm & Pay Securely
                </Button>
              )}
            </div>
          </div>

          {/* Sticky Order Summary */}
          <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24">
            <Card className="border-border/50 shadow-md">
              <div className="relative h-32 w-full">
                <Image src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop" alt="course" fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <div className="text-xs text-accent font-bold uppercase tracking-wider mb-1">24 Days</div>
                <h3 className="font-bold text-base mb-4 font-heading leading-tight">200-Hour Hatha Yoga Teacher Training</h3>
                
                <div className="space-y-3 text-sm border-b border-border pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dates</span>
                    <span className="font-medium text-right">June 1 - 25, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests</span>
                    <span className="font-medium">1 Adult</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room</span>
                    <span className="font-medium text-right">Private Room</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Course Price</span>
                    <span className="font-medium">$800.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room Upgrade</span>
                    <span className="font-medium">$400.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg font-bold border-t border-border pt-4 text-primary">
                  <span>Total</span>
                  <span>$1,200.00</span>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
