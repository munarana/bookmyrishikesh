"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Star,
  Eye,
  ShieldX,
  Zap,
} from "lucide-react";

interface School {
  id: string;
  name: string;
  city: string;
  activeCourses: number;
  thisMonthBookings: number;
  totalRevenue: number;
  avgRating: number;
  slug: string;
}

interface SchoolsTableProps {
  schools: School[];
  onSuspend?: (schoolId: string) => void;
  onFeature?: (schoolId: string, featured: boolean) => void;
}

type SortField = "name" | "bookings" | "revenue" | "rating";
type SortOrder = "asc" | "desc";

function renderSortIcon(field: SortField, sortField: SortField, sortOrder: SortOrder) {
  if (sortField !== field) {
    return <ChevronUp className="w-4 h-4 text-slate-300" />;
  }

  return sortOrder === "asc" ? (
    <ChevronUp className="w-4 h-4 text-orange-500" />
  ) : (
    <ChevronDown className="w-4 h-4 text-orange-500" />
  );
}

export function SchoolsTable({
  schools,
  onSuspend,
  onFeature,
}: SchoolsTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("bookings");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [featuredSchools, setFeaturedSchools] = useState<Set<string>>(new Set());

  const filtered = schools.filter((school) =>
    school.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let aVal: string | number = a.name;
    let bVal: string | number = b.name;

    if (sortField === "bookings") {
      aVal = a.thisMonthBookings;
      bVal = b.thisMonthBookings;
    } else if (sortField === "revenue") {
      aVal = a.totalRevenue;
      bVal = b.totalRevenue;
    } else if (sortField === "rating") {
      aVal = a.avgRating;
      bVal = b.avgRating;
    }

    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    }

    return aVal < bVal ? 1 : -1;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      return;
    }

    setSortField(field);
    setSortOrder("desc");
  };

  const toggleFeatured = (schoolId: string) => {
    const nextFeatured = new Set(featuredSchools);
    if (nextFeatured.has(schoolId)) {
      nextFeatured.delete(schoolId);
    } else {
      nextFeatured.add(schoolId);
    }

    setFeaturedSchools(nextFeatured);
    onFeature?.(schoolId, nextFeatured.has(schoolId));
  };

  return (
    <Card className="col-span-2 rounded-xl border-none bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Top Performing Schools</CardTitle>
            <CardDescription>
              Schools generating the most bookings and revenue
            </CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by school name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-10 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th
                  className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    School Name
                    {renderSortIcon("name", sortField, sortOrder)}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                  City
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">
                  Courses
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  onClick={() => handleSort("bookings")}
                >
                  <div className="flex items-center justify-center gap-2">
                    Bookings
                    {renderSortIcon("bookings", sortField, sortOrder)}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-right text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  onClick={() => handleSort("revenue")}
                >
                  <div className="flex items-center justify-end gap-2">
                    Revenue
                    {renderSortIcon("revenue", sortField, sortOrder)}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  onClick={() => handleSort("rating")}
                >
                  <div className="flex items-center justify-center gap-2">
                    Rating
                    {renderSortIcon("rating", sortField, sortOrder)}
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((school) => (
                <tr
                  key={school.id}
                  className="border-b border-slate-50 transition-colors hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{school.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600">{school.city}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-slate-900">
                      {school.activeCourses}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-slate-900">
                      {school.thisMonthBookings}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-emerald-600">
                      ₹{school.totalRevenue.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                      <span className="text-sm font-medium text-slate-900">
                        {school.avgRating}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="View Profile"
                      >
                        <Eye className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => toggleFeatured(school.id)}
                        title={
                          featuredSchools.has(school.id)
                            ? "Remove from featured"
                            : "Add to featured"
                        }
                      >
                        <Zap
                          className={`h-4 w-4 ${
                            featuredSchools.has(school.id)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-400"
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                        onClick={() => onSuspend?.(school.id)}
                        title="Suspend school"
                      >
                        <ShieldX className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
