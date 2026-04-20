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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, Trash2, Lock, Unlock } from "lucide-react";

interface User {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  image?: string | null;
  createdAt: Date;
  lastLogin: Date;
  active: boolean;
}

interface UserManagementTableProps {
  users: User[];
  onSuspend?: (userId: string) => void;
  onDelete?: (userId: string) => void;
}

export function UserManagementTable({
  users,
  onSuspend,
  onDelete,
}: UserManagementTableProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const filtered = users.filter((user) => {
    if (roleFilter !== "all" && user.role !== roleFilter) return false;
    return (
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const toggleAllUsers = () => {
    setSelectedUsers((prev) =>
      prev.size === filtered.length ? new Set() : new Set(filtered.map((user) => user.id))
    );
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-red-100 text-red-800";
      case "SCHOOL_ADMIN":
        return "bg-blue-100 text-blue-800";
      case "STUDENT":
        return "bg-slate-100 text-slate-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <Card className="border-none shadow-sm rounded-xl bg-white">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">User Management</CardTitle>
            <CardDescription>Manage platform users, roles, and permissions</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value ?? "all")}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              <SelectItem value="SCHOOL_ADMIN">School Admin</SelectItem>
              <SelectItem value="STUDENT">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedUsers.size > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedUsers.size} user{selectedUsers.size > 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => selectedUsers.forEach((id) => onSuspend?.(id))}
              >
                <Lock className="w-3 h-3 mr-1" />
                Suspend
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs text-red-600 hover:bg-red-50"
                onClick={() => selectedUsers.forEach((id) => onDelete?.(id))}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-4 w-8">
                  <Checkbox
                    checked={selectedUsers.size === filtered.length && filtered.length > 0}
                    onCheckedChange={toggleAllUsers}
                  />
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">User</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-slate-600">Role</th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-slate-600">Joined</th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-slate-600">Last Login</th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-slate-600">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                      selectedUsers.has(user.id) ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <Checkbox
                        checked={selectedUsers.has(user.id)}
                        onCheckedChange={() => toggleUser(user.id)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img src={user.image} alt={user.name ?? user.email} className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                            {(user.name ?? user.email).charAt(0)}
                          </div>
                        )}
                        <div className="font-medium text-sm text-slate-900">{user.name || "-"}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-600">{user.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-slate-600">{formatDate(user.createdAt)}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-slate-600">{formatDate(user.lastLogin)}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.active ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onSuspend?.(user.id)}>
                          {user.active ? (
                            <Lock className="w-4 h-4 text-slate-600" />
                          ) : (
                            <Unlock className="w-4 h-4 text-slate-600" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
