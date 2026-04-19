"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Trash2, Edit2, Check, X, Users, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface CourseDatePanelProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  onUpdate: () => void;
}

export function CourseDatePanel({ isOpen, onClose, course, onUpdate }: CourseDatePanelProps) {
  const { toast } = useToast();
  const [dates, setDates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [priceModifier, setPriceModifier] = useState('');

  // Editing existing date state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCapacity, setEditCapacity] = useState('');

  useEffect(() => {
    if (isOpen && course) {
      fetchDates();
      // Calculate default end date based on course duration if possible
      // This is simplified; ideally, we'd use date-fns addDays
    }
  }, [isOpen, course]);

  const fetchDates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/school-admin/courses/${course.id}/dates`);
      if (res.ok) {
        const data = await res.json();
        setDates(data);
      }
    } catch (error) {
      console.error("Failed to fetch dates", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !capacity) {
      toast({ title: "Error", description: "Start Date, End Date, and Capacity are required.", variant: "destructive" });
      return;
    }

    if (new Date(startDate) < new Date()) {
      toast({ title: "Error", description: "Start date must be in the future.", variant: "destructive" });
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast({ title: "Error", description: "End date must be after start date.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/school-admin/courses/${course.id}/dates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate,
          endDate,
          capacity: parseInt(capacity),
          priceModifier: priceModifier ? parseFloat(priceModifier) : undefined
        })
      });

      if (!res.ok) throw new Error("Failed to add date");
      
      toast({ title: "Success", description: "Date added successfully" });
      setStartDate('');
      setEndDate('');
      setCapacity('');
      setPriceModifier('');
      fetchDates();
      onUpdate();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (dateId: string, currentStatus: boolean) => {
    try {
      // Optimistic UI update could go here
      const res = await fetch(`/api/school-admin/courses/${course.id}/dates/${dateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (!res.ok) throw new Error("Failed to update status");
      fetchDates();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (dateId: string) => {
    if (!confirm("Are you sure you want to delete this date?")) return;
    
    try {
      const res = await fetch(`/api/school-admin/courses/${course.id}/dates/${dateId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      
      toast({ title: "Success", description: "Date deleted successfully" });
      fetchDates();
      onUpdate();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const saveEditCapacity = async (dateId: string) => {
    try {
      const res = await fetch(`/api/school-admin/courses/${course.id}/dates/${dateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacity: parseInt(editCapacity) })
      });

      if (!res.ok) {
         const data = await res.json();
         throw new Error(data.error || "Failed to update capacity");
      }
      setEditingId(null);
      fetchDates();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Management</DialogTitle>
          <p className="text-sm text-muted-foreground">Manage dates and capacity for <strong>{course.name}</strong></p>
        </DialogHeader>

        {/* Add Date Form */}
        <div className="bg-slate-50 p-4 rounded-lg border mb-6">
          <h3 className="text-sm font-semibold mb-3">Add New Schedule</h3>
          <form onSubmit={handleAddDate} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div className="space-y-1">
              <Label className="text-xs">Start Date</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">End Date</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Capacity</Label>
              <Input type="number" min="1" placeholder="e.g. 20" value={capacity} onChange={e => setCapacity(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Price Multiplier <span className="text-muted-foreground font-normal">(Opt)</span></Label>
              <Input type="number" step="0.1" min="0.5" max="3" placeholder="1.0" value={priceModifier} onChange={e => setPriceModifier(e.target.value)} />
            </div>
            <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600 text-white">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Date"}
            </Button>
          </form>
        </div>

        {/* Dates List */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Upcoming Schedules</h3>
          {isLoading ? (
            <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
          ) : dates.length === 0 ? (
            <div className="text-center py-8 text-slate-500 border rounded-lg bg-slate-50 border-dashed">
              No dates scheduled yet. Add one above.
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="text-left p-3 font-medium">Dates</th>
                    <th className="text-center p-3 font-medium">Spots (Booked/Total)</th>
                    <th className="text-center p-3 font-medium">Status</th>
                    <th className="text-right p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {dates.map((date) => {
                    const booked = date._count?.bookings || 0;
                    const spotsLeft = date.capacity - booked;
                    const isPast = new Date(date.startDate) < new Date();
                    
                    let statusBadge;
                    if (isPast) statusBadge = <Badge variant="secondary" className="bg-slate-200 text-slate-600 hover:bg-slate-200">Completed</Badge>;
                    else if (!date.isActive) statusBadge = <Badge variant="outline" className="text-slate-400 border-slate-300">Inactive</Badge>;
                    else if (spotsLeft === 0) statusBadge = <Badge variant="destructive">FULL</Badge>;
                    else if (spotsLeft <= 3) statusBadge = <Badge className="bg-orange-500 hover:bg-orange-600">Almost Full</Badge>;
                    else statusBadge = <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>;

                    return (
                      <tr key={date.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-medium">{format(new Date(date.startDate), 'MMM dd, yyyy')}</div>
                          <div className="text-xs text-slate-500">to {format(new Date(date.endDate), 'MMM dd, yyyy')}</div>
                        </td>
                        <td className="p-3 text-center">
                          {editingId === date.id ? (
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-slate-400 text-xs">{booked} /</span>
                              <Input 
                                type="number" 
                                className="w-16 h-7 text-xs" 
                                value={editCapacity} 
                                onChange={e => setEditCapacity(e.target.value)}
                                min={booked}
                              />
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600" onClick={() => saveEditCapacity(date.id)}><Check className="w-3 h-3" /></Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => setEditingId(null)}><X className="w-3 h-3" /></Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <Users className="w-4 h-4 text-slate-400" />
                              <span className={spotsLeft === 0 ? "text-red-600 font-bold" : ""}>
                                {booked} / {date.capacity}
                              </span>
                              {!isPast && (
                                <button onClick={() => { setEditingId(date.id); setEditCapacity(date.capacity.toString()); }} className="text-slate-400 hover:text-primary">
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {statusBadge}
                          {!isPast && (
                            <div className="mt-1">
                               <button 
                                 onClick={() => handleToggleActive(date.id, date.isActive)}
                                 className="text-[10px] text-blue-600 hover:underline"
                               >
                                 Toggle {date.isActive ? 'Inactive' : 'Active'}
                               </button>
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2">
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             onClick={() => handleDelete(date.id)}
                             disabled={booked > 0 || isPast}
                             title={booked > 0 ? "Cannot delete: has bookings" : "Delete date"}
                             className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50"
                           >
                             <Trash2 className="w-4 h-4" />
                           </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
