"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { DynamicListInput } from './DynamicListInput';
import { RoomTypeEditor, RoomType } from './RoomTypeEditor';

interface CourseFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: any; // If undefined, it's 'Add New'
}

export function CourseFormDialog({ isOpen, onClose, onSave, initialData }: CourseFormDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: '',
    category: 'TTC_200HR',
    durationDays: '',
    priceUSD: '',
    priceINR: '',
    description: '',
    highlights: [] as string[],
    includedItems: [] as string[],
    excludes: [] as string[],
    roomTypes: [] as RoomType[],
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          category: initialData.category || 'TTC_200HR',
          durationDays: initialData.durationDays?.toString() || '',
          priceUSD: initialData.priceUSD?.toString() || '',
          priceINR: initialData.priceINR?.toString() || '',
          description: initialData.description || '',
          highlights: initialData.highlights || [],
          includedItems: initialData.includedItems || [],
          excludes: initialData.excludes || [],
          roomTypes: initialData.roomTypes || [
            { type: "Shared Room", priceAddon: 0 },
            { type: "Private Room", priceAddon: 150 }
          ],
        });
      } else {
        // Reset form for new
        setFormData({
          name: '',
          category: 'TTC_200HR',
          durationDays: '',
          priceUSD: '',
          priceINR: '',
          description: '',
          highlights: [],
          includedItems: [],
          excludes: [],
          roomTypes: [
            { type: "Shared Room", priceAddon: 0 },
            { type: "Private Room", priceAddon: 150 }
          ],
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!formData.name.trim()) return "Course Title is required.";
    if (!formData.durationDays || isNaN(Number(formData.durationDays))) return "Valid duration in days is required.";
    if (!formData.priceUSD || isNaN(Number(formData.priceUSD))) return "Valid Base Price (USD) is required.";
    return null;
  };

  const handleSubmit = async (isPublished: boolean) => {
    const error = validate();
    if (error) {
      toast({ title: "Validation Error", description: error, variant: "destructive" });
      return;
    }

    setIsLoading(true);

    const payload = {
      ...formData,
      isPublished
    };

    try {
      const url = isEditing 
        ? `/api/school-admin/courses/${initialData.id}` 
        : `/api/school-admin/courses`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMsg = "Failed to save course";
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
          // Strip Prisma boilerplate to show human-readable message
          if (errorMsg.includes('\nInvalid `prisma.course')) {
            errorMsg = errorMsg.split('\n').find((l: string) => l.trim().startsWith('Unique constraint')) || errorMsg;
          }
        } catch {}
        throw new Error(errorMsg);
      }

      toast({
        title: "Success",
        description: `Course successfully ${isEditing ? 'updated' : 'created'}.`,
      });
      
      onSave();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Course' : 'Add New Course'}</DialogTitle>
          <DialogDescription>
            Fill in the details for your yoga program. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="rooms">Room Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Course Title <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                placeholder="e.g. 200 Hour Yoga Teacher Training" 
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course Type</Label>
                <Select value={formData.category} onValueChange={(val) => handleChange('category', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TTC_200HR">TTC 200HR</SelectItem>
                    <SelectItem value="TTC_300HR">TTC 300HR</SelectItem>
                    <SelectItem value="TTC_500HR">TTC 500HR</SelectItem>
                    <SelectItem value="RETREAT">Retreat</SelectItem>
                    <SelectItem value="WORKSHOP">Workshop</SelectItem>
                    <SelectItem value="MEDITATION">Meditation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationDays">Duration (Days) <span className="text-red-500">*</span></Label>
                <Input 
                  id="durationDays" 
                  type="number" 
                  min="1"
                  placeholder="28" 
                  value={formData.durationDays}
                  onChange={e => handleChange('durationDays', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceUSD">Base Price (USD) <span className="text-red-500">*</span></Label>
                <Input 
                  id="priceUSD" 
                  type="number" 
                  placeholder="1200" 
                  value={formData.priceUSD}
                  onChange={e => handleChange('priceUSD', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceINR">Base Price (INR) <span className="text-slate-400 text-xs font-normal">(Optional)</span></Label>
                <Input 
                  id="priceINR" 
                  type="number" 
                  placeholder="99000" 
                  value={formData.priceINR}
                  onChange={e => handleChange('priceINR', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="description">Short Description</Label>
                <span className="text-xs text-slate-400">{formData.description.length}/500</span>
              </div>
              <Textarea 
                id="description" 
                placeholder="Describe your course briefly..." 
                rows={4}
                maxLength={500}
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6 pt-4">
            <DynamicListInput 
              label="Highlights" 
              placeholder="e.g. Yoga Alliance Certified"
              items={formData.highlights}
              onChange={(items) => handleChange('highlights', items)}
            />
            <DynamicListInput 
              label="What's Included" 
              placeholder="e.g. 3 Meals Daily, Course Material"
              items={formData.includedItems}
              onChange={(items) => handleChange('includedItems', items)}
            />
            <DynamicListInput 
              label="What's Not Included" 
              placeholder="e.g. Flights, Visa"
              items={formData.excludes}
              onChange={(items) => handleChange('excludes', items)}
            />
          </TabsContent>
          
          <TabsContent value="rooms" className="pt-4">
            <RoomTypeEditor 
              roomTypes={formData.roomTypes}
              onChange={(types) => handleChange('roomTypes', types)}
              basePriceUSD={parseFloat(formData.priceUSD) || 0}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
            className="bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Save as Draft
          </Button>
          <Button 
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Save & Publish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
