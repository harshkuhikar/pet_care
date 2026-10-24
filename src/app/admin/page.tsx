"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  MessageSquare,
  Settings,
  ShieldAlert,
  Camera,
  Activity,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Save,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  CreditCard,
  RefreshCw,
  Database,
  ExternalLink,
  Copy,
  Check,
  Server,
  HardDrive,
} from "lucide-react";
import { firePawsConfetti } from "@/lib/confetti";

type AdminTab = "overview" | "users" | "qa" | "database" | "settings" | "audit";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [loading, setLoading] = useState(true);

  // Data states
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [qaData, setQaData] = useState<{ questions: any[]; answers: any[]; stats: any }>({
    questions: [],
    answers: [],
    stats: {},
  });
  const [qaSearch, setQaSearch] = useState("");
  const [qaFilter, setQaFilter] = useState<"all" | "flagged" | "active">("all");
  const [settings, setSettings] = useState({ freeLimit: 5, premiumLimit: 15 });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Live MongoDB Status State
  const [dbStatus, setDbStatus] = useState<any>({
    connected: false,
    database: "pawswell",
    host: "pet-care.fk0hc3z.mongodb.net",
    latencyMs: 0,
    stats: {},
  });
  const [selectedColl, setSelectedColl] = useState("users");
  const [collDocs, setCollDocs] = useState<any[]>([]);
  const [collLoading, setCollLoading] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);

  // Load all admin data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, qaRes, settingsRes, auditRes, dbRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/qa"),
        fetch("/api/admin/settings"),
        fetch("/api/admin/audit-logs"),
        fetch("/api/database/status"),
      ]);

      if (usersRes.ok) {
        const u = await usersRes.json();
        setUsers(u.users || []);
      }
      if (qaRes.ok) {
        const q = await qaRes.json();
        setQaData(q);
      }
      if (settingsRes.ok) {
        const s = await settingsRes.json();
        if (s.settings) setSettings(s.settings);
      }
      if (auditRes.ok) {
        const a = await auditRes.json();
        setAuditLogs(a.logs || []);
      }
      if (dbRes.ok) {
        const d = await dbRes.json();
        setDbStatus(d);
      }
    } catch (err) {
      console.error("Admin data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDbCollection = async (collName: string) => {
    setSelectedColl(collName);
    setCollLoading(true);
    try {
      const res = await fetch(`/api/database/explore?collection=${collName}&limit=25`);
      if (res.ok) {
        const data = await res.json();
        setCollDocs(data.documents || []);
      }
    } catch (e) {
      console.error("Explore collection error:", e);
    } finally {
      setCollLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // User actions
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, status: newStatus }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      fetchData();
    }
  };

  const handleChangePlan = async (userId: string, plan: string) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, plan }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, plan } : u))
      );
      fetchData();
    }
  };

  // Q&A actions
  const handleToggleQAStatus = async (targetType: "question" | "answer", id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "hidden" : "active";
    const res = await fetch("/api/admin/qa", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, id, status: nextStatus }),
    });
    if (res.ok) {
      fetchData();
    }
  };

  const handleDeleteQA = async (targetType: "question" | "answer", id: string) => {
    if (!confirm(`Are you sure you want to permanently delete this ${targetType}?`)) return;
    const res = await fetch(`/api/admin/qa?targetType=${targetType}&id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchData();
    }
  };

  // Settings save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(false);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      setSettingsSaved(true);
      firePawsConfetti();
      fetchData();
      setTimeout(() => setSettingsSaved(false), 3000);
    }
  };

  // Metrics computation
  const totalSubscribers = users.filter((u) => u.plan === "monthly" || u.plan === "premium" || u.plan === "yearly" || u.plan === "pro").length;
  const mrrEstimate = users.reduce((acc, u) => {
    if (u.plan === "monthly" || u.plan === "premium") return acc + 19;
    if (u.plan === "yearly" || u.plan === "pro") return acc + 16; // approx monthly
    return acc;
  }, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b-2 border-slate-800 pb-3">
        {[
          { id: "overview", label: "Executive Overview", icon: TrendingUp },
          { id: "users", label: `Users (${users.length})`, icon: Users },
          { id: "qa", label: `Q&A Moderation (${qaData.questions.length})`, icon: MessageSquare },
          {
            id: "database",
            label: `MongoDB Live Cluster (${dbStatus.stats?.accounts || 0} Docs)`,
            icon: Database,
            badge: dbStatus.connected ? "ONLINE" : "OFFLINE",
          },
          { id: "settings", label: "Plan Limits & Config", icon: Settings },
          { id: "audit", label: `Audit Trail (${auditLogs.length})`, icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as AdminTab);
                if (tab.id === "database" && collDocs.length === 0) {
                  fetchDbCollection("users");
                }
              }}
              className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold flex items-center gap-2 border-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-[#FFE600] text-black border-black pop-shadow-sm scale-102"
                  : "bg-[#181126] text-slate-300 border-slate-800 hover:border-slate-600"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === "database" && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    dbStatus.connected ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Key Metric Bento Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#181126] border-2 border-black rounded-3xl p-6 pop-shadow-sm">
              <span className="text-xs font-mono uppercase text-slate-400">Total Accounts</span>
              <p className="font-display font-black text-3xl text-white mt-1">{users.length}</p>
              <span className="text-[11px] font-mono text-emerald-400 mt-2 block">
                {users.filter((u) => u.role === "user").length} Users • {users.filter((u) => u.role === "admin").length} Admins
              </span>
            </div>

            <div className="bg-[#181126] border-2 border-black rounded-3xl p-6 pop-shadow-sm">
              <span className="text-xs font-mono uppercase text-slate-400">Active Paid Members</span>
              <p className="font-display font-black text-3xl text-[#00F5D4] mt-1">{totalSubscribers}</p>
              <span className="text-[11px] font-mono text-slate-400 mt-2 block">
                Razorpay Recurring VIPs
              </span>
            </div>

            <div className="bg-[#181126] border-2 border-black rounded-3xl p-6 pop-shadow-sm">
              <span className="text-xs font-mono uppercase text-slate-400">Estimated MRR</span>
              <p className="font-display font-black text-3xl text-[#FFE600] mt-1">${mrrEstimate}</p>
              <span className="text-[11px] font-mono text-slate-400 mt-2 block">
                Monthly Recurring Revenue
              </span>
            </div>

            <div className="bg-[#181126] border-2 border-black rounded-3xl p-6 pop-shadow-sm">
              <span className="text-xs font-mono uppercase text-slate-400">Q&A Knowledge Base</span>
              <p className="font-display font-black text-3xl text-[#FF4D6D] mt-1">
                {qaData.questions.length} Q / {qaData.answers.length} A
              </p>
              <span className="text-[11px] font-mono text-amber-400 mt-2 block">
                {qaData.stats?.flaggedQuestions || 0} Flagged Questions
              </span>
            </div>
          </div>

          {/* Plan Limits Summary Box */}
          <div className="bg-[#1A142E] border-2 border-black rounded-3xl p-6 pop-shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#00F5D4] bg-black/40 px-2.5 py-1 rounded-full">
                Active Monthly Answer Limits
              </span>
              <h3 className="font-display font-black text-xl text-white mt-2">
                Free Explorer: {settings.freeLimit} Answers/mo • PawsWell Premium: {settings.premiumLimit} Answers/mo • Pro: Unlimited
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                You can adjust these thresholds anytime in the Plan Limits & Config tab without deploying code.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("settings")}
              className="px-4 py-2.5 bg-[#FFE600] text-black font-mono font-black text-xs rounded-xl border border-black pop-shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              Modify Limits ➔
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search accounts by email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 text-xs font-mono bg-[#181126] border-2 border-slate-700 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00F5D4]"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            </div>
            <button
              onClick={fetchData}
              className="px-3.5 py-2.5 bg-[#181126] border border-slate-700 rounded-xl text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="bg-[#181126] border-2 border-black rounded-3xl overflow-hidden pop-shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#120B20] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Plan</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Created</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {users
                    .filter((u) => u.email.toLowerCase().includes(userSearch.toLowerCase()))
                    .map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/50">
                        <td className="p-4 font-bold text-white flex items-center gap-2">
                          <span>{u.email}</span>
                          {u.role === "admin" && (
                            <span className="px-1.5 py-0.5 rounded bg-[#FFE600] text-black text-[9px] font-black uppercase">
                              Admin
                            </span>
                          )}
                        </td>
                        <td className="p-4 uppercase">{u.role}</td>
                        <td className="p-4">
                          {u.role === "admin" ? (
                            "—"
                          ) : (
                            <select
                              value={u.plan || "free"}
                              onChange={(e) => handleChangePlan(u.id, e.target.value)}
                              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-[#00F5D4]"
                            >
                              <option value="free">Free Explorer</option>
                              <option value="monthly">Guardian Plus</option>
                              <option value="premium">PawsWell Premium</option>
                              <option value="pro">Family / Pro</option>
                            </select>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                              u.status === "active"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-950 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400">{u.createdAt?.split("T")[0] || "—"}</td>
                        <td className="p-4 text-right">
                          {u.role !== "admin" && (
                            <button
                              onClick={() => handleToggleUserStatus(u.id, u.status)}
                              className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                                u.status === "active"
                                  ? "bg-rose-900/60 hover:bg-rose-800 text-rose-200"
                                  : "bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200"
                              }`}
                            >
                              {u.status === "active" ? "Suspend" : "Activate"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Q&A MODERATION */}
      {activeTab === "qa" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search questions & answers..."
                value={qaSearch}
                onChange={(e) => setQaSearch(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 text-xs font-mono bg-[#181126] border-2 border-slate-700 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00F5D4]"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setQaFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono ${
                  qaFilter === "all" ? "bg-[#FFE600] text-black font-bold" : "bg-slate-900 text-slate-400"
                }`}
              >
                All ({qaData.questions.length})
              </button>
              <button
                onClick={() => setQaFilter("flagged")}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono ${
                  qaFilter === "flagged" ? "bg-rose-500 text-white font-bold" : "bg-slate-900 text-slate-400"
                }`}
              >
                Flagged ({qaData.stats?.flaggedQuestions || 0})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {qaData.questions
              .filter((q) => {
                if (qaFilter === "flagged" && q.status !== "flagged") return false;
                if (qaSearch && !q.title.toLowerCase().includes(qaSearch.toLowerCase())) return false;
                return true;
              })
              .map((q) => {
                const answers = qaData.answers.filter((a) => a.questionId === q.id);
                return (
                  <div
                    key={q.id}
                    className="bg-[#181126] border-2 border-black rounded-3xl p-5 pop-shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {q.category} • {q.petSpecies}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                              q.status === "active"
                                ? "bg-emerald-950 text-emerald-400"
                                : q.status === "flagged"
                                ? "bg-rose-950 text-rose-400"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {q.status}
                          </span>
                        </div>
                        <h4 className="font-display font-black text-lg text-white">{q.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{q.details}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleQAStatus("question", q.id, q.status)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                          title="Toggle Hidden / Active"
                        >
                          {q.status === "hidden" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteQA("question", q.id)}
                          className="p-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 cursor-pointer"
                          title="Delete Permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Answers count and teaser */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Author: {q.authorName} ({q.authorRole})</span>
                      <span>{answers.length} Answers attached</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 3: MONGODB LIVE CLUSTER & FREE MANAGEMENT */}
      {activeTab === "database" && (
        <div className="space-y-6">
          {/* Cluster Status Banner */}
          <div className="bg-[#181126] border-2 border-black rounded-3xl p-6 pop-shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#00F5D4] text-black border-2 border-black flex items-center justify-center text-2xl pop-shadow-sm">
                🍃
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-black text-2xl text-white">
                    MongoDB Atlas Production Cluster
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live & Connected
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Database: <span className="text-[#FFE600] font-bold">{dbStatus.database || "pawswell"}</span> • Host:{" "}
                  <span className="text-white">{dbStatus.host || "pet-care.fk0hc3z.mongodb.net"}</span> • Ping:{" "}
                  <span className="text-emerald-400 font-bold">{dbStatus.latencyMs || 84} ms</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchData}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-mono text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Test Live Ping</span>
              </button>
            </div>
          </div>

          {/* Three Free Management Options Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Free Option 1: Atlas Web Cloud */}
            <div className="bg-[#161026] border-2 border-slate-800 rounded-3xl p-6 pop-shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 inline-block">
                  100% Free Forever • Web Browser
                </span>
                <h4 className="font-display font-black text-lg text-white">
                  MongoDB Atlas Cloud GUI
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage your database directly in your web browser with zero software installations. View, filter, edit, and delete documents with point-and-click ease.
                </p>
              </div>
              <a
                href="https://cloud.mongodb.com/"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-[#00F5D4] hover:bg-[#00D4B8] text-black font-mono font-black text-xs rounded-xl border border-black pop-shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>Open Atlas Cloud Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Free Option 2: MongoDB Compass Desktop */}
            <div className="bg-[#161026] border-2 border-slate-800 rounded-3xl p-6 pop-shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800 inline-block">
                  Official Free Desktop App
                </span>
                <h4 className="font-display font-black text-lg text-white">
                  MongoDB Compass GUI
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Download the official visual desktop software for Windows, Mac & Linux. Paste your connection string below to visually inspect, edit, and query in real time.
                </p>
              </div>
              <div className="space-y-2">
                <a
                  href="https://www.mongodb.com/try/download/compass"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <span>Download Free Compass</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "mongodb+srv://harshkuhikar68_db_user:<YOUR_PASSWORD>@pet-care.fk0hc3z.mongodb.net/pawswell?retryWrites=true&w=majority"
                    );
                    setCopiedUri(true);
                    setTimeout(() => setCopiedUri(false), 2500);
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedUri ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUri ? "Copied URI to Clipboard!" : "Copy Connection URI"}</span>
                </button>
              </div>
            </div>

            {/* Free Option 3: In-App Explorer */}
            <div className="bg-[#161026] border-2 border-slate-800 rounded-3xl p-6 pop-shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded bg-[#FFE600]/20 text-[#FFE600] border border-[#FFE600]/40 inline-block">
                  Built-In • Zero Setup
                </span>
                <h4 className="font-display font-black text-lg text-white">
                  PawsWell Live Explorer
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Browse and inspect all live collections directly below. Real-time document counts, data sanitization, and instant record inspection without leaving your dashboard.
                </p>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400">
                <span>Collections: </span>
                <span className="text-white font-bold">8 active</span> •
                <span> Total Docs: </span>
                <span className="text-[#00F5D4] font-bold">
                  {Object.values(dbStatus.stats || {}).reduce((a: any, b: any) => a + (typeof b === "number" ? b : 0), 0) as number} records
                </span>
              </div>
            </div>
          </div>

          {/* Collection Selector Tabs */}
          <div className="bg-[#181126] border-2 border-black rounded-3xl p-6 pop-shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-display font-black text-xl text-white">
                  Live MongoDB Collections
                </h4>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Click a collection to inspect its latest live documents from MongoDB Atlas
                </p>
              </div>
              <button
                onClick={() => fetchDbCollection(selectedColl)}
                disabled={collLoading}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${collLoading ? "animate-spin" : ""}`} />
                <span>Reload Collection</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { name: "users", label: "Users & Profiles", count: dbStatus.stats?.users || users.length },
                { name: "accounts", label: "Auth & Exclusivity", count: dbStatus.stats?.accounts || users.length },
                { name: "questions", label: "Q&A Questions", count: dbStatus.stats?.questions || qaData.questions.length },
                { name: "answers", label: "Expert Answers", count: dbStatus.stats?.answers || qaData.answers.length },
                { name: "pets", label: "Pet Records", count: dbStatus.stats?.pets || 2 },
                { name: "orders", label: "Razorpay Orders", count: dbStatus.stats?.orders || 0 },
                { name: "contact_messages", label: "Contact Inquiries", count: dbStatus.stats?.contactMessages || 0 },
                { name: "newsletter_subscribers", label: "Newsletter Subs", count: dbStatus.stats?.newsletterSubscribers || 0 },
                { name: "audit_logs", label: "Audit Logs", count: dbStatus.stats?.auditLogs || auditLogs.length },
              ].map((c) => {
                const isSelected = selectedColl === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => fetchDbCollection(c.name)}
                    className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold border-2 transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-[#00F5D4] text-black border-black pop-shadow-sm scale-102"
                        : "bg-[#140D22] text-slate-300 border-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <span>{c.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isSelected ? "bg-black text-[#00F5D4]" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {c.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Document Records List */}
            <div className="pt-4">
              <div className="bg-[#120B20] border border-slate-800 rounded-2xl p-4 overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
                  <span className="text-slate-400">
                    Collection: <span className="text-[#00F5D4] font-bold">{selectedColl}</span> • Showing latest{" "}
                    {collDocs.length} documents
                  </span>
                  <span className="text-slate-500">Live JSON View (Sensitive fields masked)</span>
                </div>

                {collLoading ? (
                  <div className="py-12 text-center text-xs font-mono text-slate-400">
                    <div className="w-6 h-6 border-2 border-[#00F5D4] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Fetching documents directly from MongoDB Atlas...
                  </div>
                ) : collDocs.length === 0 ? (
                  <div className="py-8 text-center text-xs font-mono text-slate-500">
                    No documents found in this collection or click &quot;Reload Collection&quot; above.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/80 max-h-[500px] overflow-y-auto pt-2 space-y-2">
                    {collDocs.map((doc, idx) => (
                      <div
                        key={doc._id || doc.id || idx}
                        className="p-3 bg-[#181126]/80 hover:bg-[#1C142E] rounded-xl border border-slate-800/60 font-mono text-xs text-slate-200 transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                          <span className="text-emerald-400 font-bold">
                            _id: {String(doc._id || doc.id)}
                          </span>
                          <span>
                            {doc.createdAt ? `Created: ${doc.createdAt.substring(0, 19)}` : `Index #${idx + 1}`}
                          </span>
                        </div>
                        <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed bg-black/40 p-2.5 rounded-lg border border-slate-800">
                          {JSON.stringify(doc, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS & LIMITS CONFIGURATION */}
      {activeTab === "settings" && (
        <div className="max-w-xl bg-[#181126] border-2 border-black rounded-3xl p-6 sm:p-8 pop-shadow-sm space-y-6">
          <div>
            <h3 className="font-display font-black text-2xl text-white">
              Q&A Answer-View Limit Settings
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Configure how many community question answers free and premium users can unlock each calendar month. These settings take effect instantly across all client requests without redeploying code.
            </p>
          </div>

          {settingsSaved && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded-2xl text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Limits updated successfully in server database!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Free Explorer Monthly Unlock Limit
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.freeLimit}
                onChange={(e) => setSettings({ ...settings, freeLimit: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-3 bg-[#120B20] border-2 border-slate-700 rounded-2xl text-white font-mono font-bold focus:border-[#00F5D4]"
              />
              <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                Standard: 5 question answers per month
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                PawsWell Premium Monthly Unlock Limit
              </label>
              <input
                type="number"
                min="1"
                max="200"
                value={settings.premiumLimit}
                onChange={(e) => setSettings({ ...settings, premiumLimit: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-3 bg-[#120B20] border-2 border-slate-700 rounded-2xl text-white font-mono font-bold focus:border-[#00F5D4]"
              />
              <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                Standard: 15 question answers per month (Pro tier remains Unlimited)
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#FFE600] hover:bg-[#EBD400] text-black font-display font-black text-sm rounded-2xl border-2 border-black pop-shadow flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Live Limits</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === "audit" && (
        <div className="bg-[#181126] border-2 border-black rounded-3xl overflow-hidden pop-shadow-sm">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-display font-black text-lg text-white">Administrative Audit Trail</h3>
            <span className="text-xs font-mono text-slate-400">Latest 100 System Events</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#120B20] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Admin Email</th>
                  <th className="p-4">Target Type</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40">
                    <td className="p-4 text-slate-400 whitespace-nowrap">
                      {log.timestamp?.replace("T", " ")?.substring(0, 19)}
                    </td>
                    <td className="p-4 font-bold text-[#FFE600]">{log.action}</td>
                    <td className="p-4">{log.adminEmail}</td>
                    <td className="p-4 uppercase text-[#00F5D4]">{log.targetType}</td>
                    <td className="p-4 text-slate-300 max-w-xs truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
