import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Calendar, Eye, EyeOff, Trash2 } from 'lucide-react';

interface CourseTableProps {
  courses: any[];
  onEdit: (course: any) => void;
  onManageDates: (course: any) => void;
  onTogglePublish: (course: any) => void;
  onDelete: (course: any) => void;
}

export function CourseTable({ courses, onEdit, onManageDates, onTogglePublish, onDelete }: CourseTableProps) {
  if (courses.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th className="p-4 py-3 whitespace-nowrap">Course Name</th>
              <th className="p-4 py-3">Duration</th>
              <th className="p-4 py-3">Base Price</th>
              <th className="p-4 py-3 text-center">Dates</th>
              <th className="p-4 py-3 text-center">Bookings</th>
              <th className="p-4 py-3 text-center">Status</th>
              <th className="p-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-900 mb-1">{course.name}</div>
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider bg-slate-100">
                    {course.category.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="p-4 text-slate-600">
                  {course.durationDays} days
                </td>
                <td className="p-4 text-slate-600 font-medium">
                  ${course.priceUSD}
                  {course.priceINR ? <span className="text-slate-400 text-xs ml-1 block">₹{course.priceINR}</span> : null}
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => onManageDates(course)}
                    className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-xs transition-colors"
                  >
                    {course.courseDates?.length || 0} Upcoming
                  </button>
                </td>
                <td className="p-4 text-center font-medium text-slate-600">
                  {course.courseDates?.reduce((acc: number, d: any) => acc + (d._count?.bookings || 0), 0) || 0}
                </td>
                <td className="p-4 text-center">
                  {course.isPublished ? (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none shadow-none">Published</Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-500 border-slate-200">Draft</Badge>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(course)} title="Edit Course" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onManageDates(course)} title="Manage Dates" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onTogglePublish(course)} 
                      title={course.isPublished ? "Unpublish" : "Publish"}
                      className="h-8 w-8 text-slate-400 hover:text-orange-500 hover:bg-orange-50"
                    >
                      {course.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(course)} title="Delete" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
