"use client";

import React, { useState } from "react";
import { Users, Plus, Mail, ShieldAlert, ShieldCheck, UserCheck } from "lucide-react";

interface Member {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Operator";
  status: "Active" | "Invited";
}

const INITIAL_MEMBERS: Member[] = [
  { id: 1, name: "Shubh Verma", email: "shubh@verma.com", role: "Admin", status: "Active" },
  { id: 2, name: "John Doe", email: "john@company.com", role: "Manager", status: "Active" },
  { id: 3, name: "Sarah Smith", email: "sarah@company.com", role: "Operator", status: "Active" },
  { id: 4, name: "Alex Jones", email: "alex@company.com", role: "Operator", status: "Invited" },
];

export default function Team() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return ShieldAlert;
      case "Manager":
        return ShieldCheck;
      default:
        return UserCheck;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "text-red-600 bg-red-50";
      case "Manager":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-950 md:text-3xl">Team Directory</h1>
          <p className="text-sm text-gray-500 font-medium">Invite and manage roles for managers, operators, and staff.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 hover:bg-orange-600 transition-all cursor-pointer">
          <Plus className="h-4.5 w-4.5" />
          Invite Member
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member) => {
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
                      ${member.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600 animate-pulse"}`}
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
        })}
      </div>
    </div>
  );
}
