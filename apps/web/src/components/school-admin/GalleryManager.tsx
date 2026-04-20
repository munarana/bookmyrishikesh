"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

type GalleryManagerProps = {
  initialGallery: string[];
};

export default function GalleryManager({ initialGallery }: GalleryManagerProps) {
  const [gallery, setGallery] = useState<string[]>(initialGallery);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleAddPhoto = async () => {
    if (!photoUrl.trim()) {
      toast({ title: 'Photo URL required', description: 'Please enter a valid image URL.', variant: 'destructive' });
      return;
    }

    if (!isValidUrl(photoUrl.trim())) {
      toast({ title: 'Invalid URL', description: 'Please enter a valid URL for the photo.', variant: 'destructive' });
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch('/api/school-admin/gallery', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoUrl: photoUrl.trim() }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || 'Failed to add photo');
      }

      const data = await res.json();
      setGallery(data.gallery || [...gallery, photoUrl.trim()]);
      setPhotoUrl('');
      toast({ title: 'Photo added', description: 'Your gallery photo was added successfully.' });
    } catch (error: any) {
      toast({ title: 'Unable to add photo', description: error?.message ?? 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
          <div>
            <Label htmlFor="photo-url">Gallery photo URL</Label>
            <Input
              id="photo-url"
              type="text"
              value={photoUrl}
              onChange={(event) => setPhotoUrl(event.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          <Button onClick={handleAddPhoto} disabled={isSaving} className="h-12">
            {isSaving ? 'Saving...' : 'Add Photo'}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Add an image URL to the school gallery. The image will appear immediately after saving.
        </p>
      </div>

      {gallery.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gallery.map((item, index) => (
            <div key={index} className="overflow-hidden rounded-xl border border-slate-200">
              <img src={item} alt={`Gallery ${index + 1}`} className="w-full h-48 object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-50 border-dashed border-slate-200">
          <CardContent>
            <CardDescription className="text-center text-slate-500">
              No gallery images available yet. Add a photo URL above to populate your gallery.
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </>
  );
}
