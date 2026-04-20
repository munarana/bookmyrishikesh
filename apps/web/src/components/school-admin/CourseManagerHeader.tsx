import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Plus, LayoutGrid, List } from 'lucide-react';

interface CourseManagerHeaderProps {
  stats: {
    total: number;
    published: number;
    draft: number;
    upcomingDates: number;
  };
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string | null) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string | null) => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  onAddCourse: () => void;
}

export function CourseManagerHeader({
  stats,
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onAddCourse
}: CourseManagerHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 mb-1">Course Manager</h1>
          <p className="text-slate-500 text-sm">Manage your courses, schedules, and availability</p>
        </div>
        <Button onClick={onAddCourse} className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add New Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm border-none rounded-xl">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-slate-500 mb-1">Total Courses</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-none rounded-xl">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-slate-500 mb-1">Published</p>
            <h3 className="text-2xl font-bold text-green-600">{stats.published}</h3>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-none rounded-xl">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-slate-500 mb-1">Drafts</p>
            <h3 className="text-2xl font-bold text-slate-600">{stats.draft}</h3>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-none rounded-xl">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-slate-500 mb-1">Upcoming Dates</p>
            <h3 className="text-2xl font-bold text-blue-600">{stats.upcomingDates}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search courses..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-slate-50 border-none"
          />
        </div>
        <div className="flex gap-3">
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-[140px] bg-slate-50 border-none">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="TTC_100HR">TTC 100HR</SelectItem>
              <SelectItem value="TTC_200HR">TTC 200HR</SelectItem>
              <SelectItem value="TTC_300HR">TTC 300HR</SelectItem>
              <SelectItem value="TTC_500HR">TTC 500HR</SelectItem>
              <SelectItem value="RETREAT">Retreat</SelectItem>
              <SelectItem value="WORKSHOP">Workshop</SelectItem>
              <SelectItem value="MEDITATION">Meditation</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[140px] bg-slate-50 border-none">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center bg-slate-50 p-1 rounded-md">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${viewMode === 'table' ? 'bg-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              onClick={() => onViewModeChange('table')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              onClick={() => onViewModeChange('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
