"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, RefreshCw, Trash2, Search, Play, Pause, ArrowDown } from "lucide-react";
import { api } from "@/utils/api";
import { Spinner } from "@/components/ui/Spinner";

export default function LogsTab() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [autoscroll, setAutoscroll] = useState(true);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const res = await api.get("/logs");
      setLogs(res.logs || []);
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(true);
  }, []);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLogs(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Autoscroll to bottom
  useEffect(() => {
    if (autoscroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoscroll]);

  const handleClearLogs = async () => {
    if (!confirm("Are you sure you want to clear all backend logs? This cannot be undone.")) return;
    try {
      setIsLoading(true);
      await api.delete("/logs");
      setLogs([]);
    } catch (err: any) {
      alert(err.message || "Failed to clear logs.");
    } finally {
      setIsLoading(false);
    }
  };

  // Colorize/format log lines
  const renderLogLine = (line: string, index: number) => {
    // If we have search filter
    if (search && !line.toLowerCase().includes(search.toLowerCase())) {
      return null;
    }

    let levelColor = "text-slate-300";
    if (line.includes("[ERROR]") || line.includes("error") || line.includes("Error:") || line.includes("exception")) {
      levelColor = "text-red-400 font-bold bg-red-950/20";
    } else if (line.includes("[WARN]") || line.includes("[WARNING]")) {
      levelColor = "text-amber-400 font-medium";
    } else if (line.includes("[INFO]")) {
      levelColor = "text-emerald-400";
    } else if (line.includes("PRISMA") || line.includes("query") || line.includes("SELECT") || line.includes("INSERT") || line.includes("UPDATE")) {
      levelColor = "text-indigo-300 italic";
    } else if (line.includes("OTP")) {
      levelColor = "text-orange-400 font-bold bg-orange-950/10";
    }

    // Highlight search match
    if (search) {
      const parts = line.split(new RegExp(`(${search})`, "gi"));
      return (
        <div key={index} className={`py-1 border-b border-slate-900 px-4 hover:bg-slate-900/40 text-xs font-mono leading-relaxed break-all ${levelColor}`}>
          {parts.map((part, i) =>
            part.toLowerCase() === search.toLowerCase() ? (
              <mark key={i} className="bg-yellow-500 text-slate-950 px-0.5 rounded font-bold">
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </div>
      );
    }

    return (
      <div key={index} className={`py-1 border-b border-slate-900 px-4 hover:bg-slate-900/40 text-xs font-mono leading-relaxed break-all ${levelColor}`}>
        {line}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-950 md:text-3xl flex items-center gap-2">
            <Terminal className="h-6.5 w-6.5 text-orange-500" />
            Backend System Logs
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            View system prints, console logs, database queries, and test verification codes (OTPs).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchLogs(true)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-950 transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={handleClearLogs}
            className="flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2 text-xs font-bold text-red-500 hover:bg-red-100 transition-colors shadow-sm cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Clear Logs
          </button>
        </div>
      </div>

      {/* Control panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search or filter log lines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500/50 focus:outline-none border focus:ring-4 focus:ring-orange-500/5 transition-all"
          />
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 border transition-all cursor-pointer ${
              autoRefresh
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : "bg-white border-gray-200 text-gray-500"
            }`}
          >
            {autoRefresh ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            Auto-Refresh (5s)
          </button>

          <button
            onClick={() => setAutoscroll(!autoscroll)}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 border transition-all cursor-pointer ${
              autoscroll
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "bg-white border-gray-200 text-gray-500"
            }`}
          >
            <ArrowDown className="h-3.5 w-3.5" />
            Auto-Scroll
          </button>
        </div>
      </div>

      {/* Terminal View */}
      <div className="rounded-3xl bg-slate-950 border border-slate-900 shadow-2xl overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between bg-slate-900/60 px-5 py-3 border-b border-slate-900">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-2.5 text-[11px] font-mono text-slate-500 font-bold uppercase">
              system@nesa-one-be:~
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 font-mono">
            {logs.length} Lines Logged
          </span>
        </div>

        {/* Console Container */}
        <div className="h-[480px] overflow-y-auto py-4 flex flex-col bg-slate-950/95 scrollbar-thin scrollbar-thumb-slate-800">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <Spinner size="lg" />
              <p className="text-xs font-mono text-slate-500">Connecting to stream logs...</p>
            </div>
          ) : logs.length > 0 ? (
            <div className="flex-1 flex flex-col font-mono text-xs">
              {logs.map((line, idx) => renderLogLine(line, idx))}
              <div ref={terminalEndRef} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <Terminal className="h-10 w-10 text-slate-700 mb-2.5" />
              <p className="text-xs font-mono text-slate-500">No logs found on system backend.log.</p>
              <p className="text-3xs font-mono text-slate-600 mt-1">Actions in the app will print details here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
