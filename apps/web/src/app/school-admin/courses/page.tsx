"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { CourseManagerHeader } from '@/components/school-admin/CourseManagerHeader';
import { CourseTable } from '@/components/school-admin/CourseTable';
import { CourseGrid } from '@/components/school-admin/CourseGrid';
import { CourseFormDialog } from '@/components/school-admin/CourseFormDialog';
import { CourseDatePanel } from '@/components/school-admin/CourseDatePanel';

export default function CourseManagerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters and View State
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Dialogs State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  
  const [isDatePanelOpen, setIsDatePanelOpen] = useState(false);
  const [activeCourseForDates, setActiveCourseForDates] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if ((session.user as any).role !== 'SCHOOL_ADMIN') {
        router.push('/login');
      } else {
        fetchCourses();
      }
    }
  }, [status, session, router]);

  useEffect(() => {
    const savedMode = localStorage.getItem('courseManagerViewMode');
    if (savedMode === 'table' || savedMode === 'grid') {
      setViewMode(savedMode);
    }
  }, []);

  const handleViewModeChange = (mode: 'table' | 'grid') => {
    setViewMode(mode);
    localStorage.setItem('courseManagerViewMode', mode);
  };

  const handleTypeFilterChange = (value: string | null) => {
    setTypeFilter(value || 'ALL');
  };

  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value || 'ALL');
  };

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/school-admin/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      } else {
        toast({ title: 'Error', description: 'Failed to fetch courses', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An unexpected error occurred', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePublish = async (course: any) => {
    const originalStatus = course.isPublished;
    // Optimistic UI update
    setCourses(prev => prev.map(c => c.id === course.id ? { ...c, isPublished: !originalStatus } : c));

    try {
      const res = await fetch(`/api/school-admin/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !originalStatus })
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      toast({ title: "Success", description: `Course ${!originalStatus ? 'published' : 'unpublished'} successfully.` });
    } catch (error: any) {
      // Revert on error
      setCourses(prev => prev.map(c => c.id === course.id ? { ...c, isPublished: originalStatus } : c));
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (course: any) => {
    if (!confirm(`Are you sure you want to delete ${course.name}?`)) return;

    try {
      const res = await fetch(`/api/school-admin/courses/${course.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete");
      }
      toast({ title: "Success", description: "Course deleted/unpublished successfully." });
      fetchCourses();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const openEdit = (course: any) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  const openAdd = () => {
    setEditingCourse(null);
    setIsFormOpen(true);
  };

  const openDates = (course: any) => {
    setActiveCourseForDates(course);
    setIsDatePanelOpen(true);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'ALL' || course.category === typeFilter;
      const matchesStatus = statusFilter === 'ALL' || 
                            (statusFilter === 'PUBLISHED' && course.isPublished) ||
                            (statusFilter === 'DRAFT' && !course.isPublished);
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [courses, searchTerm, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: courses.length,
      published: courses.filter(c => c.isPublished).length,
      draft: courses.filter(c => !c.isPublished).length,
      upcomingDates: courses.reduce((acc, c) => acc + (c.courseDates?.length || 0), 0)
    };
  }, [courses]);

  if (status === 'loading' || (isLoading && courses.length === 0)) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <CourseManagerHeader 
        stats={stats}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={handleTypeFilterChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onAddCourse={openAdd}
      />

      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🧘‍♂️</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
          <p className="text-slate-500 max-w-md mb-6">
            {courses.length === 0 
              ? "You haven't added any courses yet. Add your first course to get started." 
              : "No courses match your current filters. Try adjusting your search."}
          </p>
          {courses.length === 0 && (
            <Button onClick={openAdd} className="bg-orange-500 hover:bg-orange-600">
              Add First Course
            </Button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        <CourseTable 
          courses={filteredCourses}
          onEdit={openEdit}
          onManageDates={openDates}
          onTogglePublish={handleTogglePublish}
          onDelete={handleDelete}
        />
      ) : (
        <CourseGrid 
          courses={filteredCourses}
          onEdit={openEdit}
          onManageDates={openDates}
          onTogglePublish={handleTogglePublish}
          onDelete={handleDelete}
        />
      )}

      {/* Dialogs */}
      <CourseFormDialog 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingCourse}
        onSave={fetchCourses}
      />

      <CourseDatePanel 
        isOpen={isDatePanelOpen}
        onClose={() => setIsDatePanelOpen(false)}
        course={activeCourseForDates}
        onUpdate={fetchCourses}
      />
    </div>
  );
}
