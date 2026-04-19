import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Calendar, Eye, EyeOff, Trash2, Clock, Users, DollarSign } from 'lucide-react';

interface CourseGridProps {
  courses: any[];
  onEdit: (course: any) => void;
  onManageDates: (course: any) => void;
  onTogglePublish: (course: any) => void;
  onDelete: (course: any) => void;
}

export function CourseGrid({ courses, onEdit, onManageDates, onTogglePublish, onDelete }: CourseGridProps) {
  if (courses.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden flex flex-col border-none shadow-sm group hover:shadow-md transition-shadow">
          {/* Thumbnail Placeholder */}
          <div className="h-32 bg-gradient-to-br from-orange-100 to-orange-50 relative flex items-center justify-center border-b">
            <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center">
              <span className="text-2xl opacity-50">🧘‍♀️</span>
            </div>
            <div className="absolute top-3 right-3 flex gap-2">
              {course.isPublished ? (
                <Badge className="bg-emerald-500/90 hover:bg-emerald-500 shadow-sm border-none">Published</Badge>
              ) : (
                <Badge variant="secondary" className="bg-white/90 text-slate-600 shadow-sm">Draft</Badge>
              )}
            </div>
          </div>

          <CardContent className="p-5 flex-1">
            <Badge variant="outline" className="mb-3 text-[10px] uppercase tracking-wider text-slate-500 border-slate-200">
              {course.category.replace('_', ' ')}
            </Badge>
            <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 leading-tight">
              {course.name}
            </h3>
            
            <div className="space-y-2 mt-4">
              <div className="flex items-center text-sm text-slate-600">
                <Clock className="w-4 h-4 mr-2 text-slate-400" />
                <span>{course.durationDays} Days</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                <span className="font-medium">${course.priceUSD}</span>
                {course.priceINR && <span className="text-xs text-slate-400 ml-1">/ ₹{course.priceINR}</span>}
              </div>
              <div className="flex justify-between items-center text-sm text-slate-600 pt-2 border-t mt-2">
                <button 
                  onClick={() => onManageDates(course)}
                  className="flex items-center hover:text-blue-600 transition-colors"
                >
                  <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="font-medium text-blue-600">{course.courseDates?.length || 0} Dates</span>
                </button>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-slate-400" />
                  <span>{course.courseDates?.reduce((acc: number, d: any) => acc + (d._count?.bookings || 0), 0) || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-3 bg-slate-50 border-t flex justify-between">
             <Button variant="ghost" size="sm" onClick={() => onEdit(course)} className="text-slate-500 hover:text-slate-900 px-2">
               <Pencil className="w-4 h-4 mr-1" /> Edit
             </Button>
             <div className="flex gap-1">
               <Button 
                 variant="ghost" 
                 size="icon" 
                 onClick={() => onTogglePublish(course)} 
                 title={course.isPublished ? "Unpublish" : "Publish"}
                 className="h-8 w-8 text-slate-400 hover:text-orange-500"
               >
                 {course.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
               </Button>
               <Button variant="ghost" size="icon" onClick={() => onDelete(course)} title="Delete" className="h-8 w-8 text-slate-400 hover:text-red-600">
                 <Trash2 className="w-4 h-4" />
               </Button>
             </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
