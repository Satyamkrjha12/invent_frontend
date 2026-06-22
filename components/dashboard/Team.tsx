"use client";

import React, { useState, useEffect } from "react";
import { Plus, Mail, ShieldAlert, ShieldCheck, UserCheck, X } from "lucide-react";
import { api } from "@/utils/api";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedDate?: string;
}

const INITIAL_MEMBERS: Member[] = [
  {
    id: "1",
    name: "Developer",
    email: "developer@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "2",
    name: "Sarah Smith",
    email: "sarah@example.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: "3",
    name: "John Doe",
    email: "john@example.com",
    role: "Operator",
    status: "Active",
  },
];

export default function Team() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Invite Form State
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Operator" });

  const getRoleIcon = (role: string) => {
    const r = role.toLowerCase();
    if (r === "admin") return ShieldAlert;
    if (r === "manager") return ShieldCheck;
    return UserCheck;
  };

  const getRoleColor = (role: string) => {
    const r = role.toLowerCase();
    if (r === "admin") return "text-red-600 bg-red-50";
    if (r === "manager") return "text-blue-600 bg-blue-50";
    return "text-slate-600 bg-slate-50";
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) return;

    setIsSubmitting(true);
    try {
      // Simulate adding a member locally since /api/team is not a listed backend route
      const newMember: Member = {
        id: Math.random().toString(36).substring(2, 9),
        name: form.name,
        email: form.email,
        role: form.role,
        status: "Active",
      };
      setMembers((prev) => [...prev, newMember]);
      setIsModalOpen(false);
      setForm({ name: "", email: "", password: "", role: "Operator" });
    } catch (err: any) {
      console.error(err);
      alert("Failed to invite member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-950 md:text-3xl">Team Directory</h1>
          <p className="text-sm text-gray-500 font-medium">Invite and manage roles for managers, operators, and staff.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 hover:bg-orange-600 transition-all cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Invite Member
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.length > 0 ? (
          members.map((member) => {
            const RoleIcon = getRoleIcon(member.role);
            const roleBadge = getRoleColor(member.role);

            return (
              <div
                key={member.id}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Avatar / Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 font-bold text-lg">
                      {member.name.charAt(0)}
                    </div>

                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-3xs font-bold uppercase
                        ${member.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                    >
                      {member.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div>
                    <h3 className="font-bold text-gray-950 text-base truncate">{member.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-medium truncate mt-1">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{member.email}</span>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className="mt-5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-3xs font-bold uppercase ${roleBadge}`}>
                      <RoleIcon className="h-3.5 w-3.5" />
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-gray-400 text-sm font-semibold">
            No team members found.
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-orange-100 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Plus className="h-5 w-5 text-orange-500" />
                Invite Team Member
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label htmlFor="memName" className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="memName"
                  required
                  placeholder="e.g. Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 py-2.5 px-3.5 text-sm outline-none focus:border-[#FF5A1F] focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label htmlFor="memEmail" className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="memEmail"
                  required
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 py-2.5 px-3.5 text-sm outline-none focus:border-[#FF5A1F] focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label htmlFor="memPass" className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  id="memPass"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 py-2.5 px-3.5 text-sm outline-none focus:border-[#FF5A1F] focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label htmlFor="memRole" className="mb-2 block text-sm font-medium text-slate-700">
                  Role
                </label>
                <select
                  id="memRole"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-[#FF5A1F] focus:ring-4 focus:ring-orange-100 bg-white"
                >
                  <option value="Operator">Operator</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
