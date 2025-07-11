"use client";

import { useEffect, useState } from "react";
import { getClients, getSessionsByMonth } from "@/lib/api";
import { Client, Session } from "@/types/types";
import { Calendar as CalendarIcon, Users, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar } from '@/components/ui/Avatar';

function getTodayISO() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function getInitials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [trainerName, setTrainerName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const clientsData = await getClients();
        setClients(clientsData);
        const now = new Date();
        const sessionsData = await getSessionsByMonth(now.getFullYear(), now.getMonth() + 1);
        setSessions(sessionsData);
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setTrainerName(data?.name || ""));
  }, []);

  const activeClients = clients.length;
  const today = new Date();
  const upcomingSessions = sessions.filter(s => new Date(s.date) >= today);
  const todaySessions = sessions.filter(s => s.date.startsWith(getTodayISO()));

  const clientSessionCount: Record<number, number> = {};
  sessions.forEach(s => {
    if (s.clientId) {
      clientSessionCount[s.clientId] = (clientSessionCount[s.clientId] || 0) + 1;
    }
  });
  const topClients = [...clients]
    .map(c => ({
      ...c,
      sessionCount: clientSessionCount[c.id] || 0,
    }))
    .sort((a, b) => b.sessionCount - a.sessionCount)
    .slice(0, 3);

  const cancelledCount = sessions.filter(s => s.status === 'cancelled').length;
  const completedCount = sessions.filter(s => s.status === 'completed').length;

  return (
    <div className="min-h-screen bg-background-light font-sans p-0 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-primary">
              Welcome back{trainerName ? `, ${trainerName}` : ""}!
            </h1>
            <p className="text-lg text-secondary">Here's what's happening with your clients today.</p>
          </div>
        </div>

        {/* Top cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-between border-t-4 border-main transition hover:shadow-2xl hover:-translate-y-1">
            <div>
              <div className="text-secondary text-sm mb-1">Active Clients</div>
              <div className="text-4xl font-extrabold text-main">{activeClients}</div>
              <div className="text-success text-xs mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <Users className="w-12 h-12 text-main" />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-between border-t-4 border-success transition hover:shadow-2xl hover:-translate-y-1">
            <div>
              <div className="text-secondary text-sm mb-1">Upcoming Sessions</div>
              <div className="text-4xl font-extrabold text-success">{upcomingSessions.length}</div>
              <div className="text-secondary text-xs mt-1">Today: {todaySessions.length}</div>
            </div>
            <CalendarIcon className="w-12 h-12 text-success" />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-start justify-between border-t-4 border-yellow-400 transition hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="text-lg font-semibold text-yellow-600">Cancelled</span>
            </div>
            <div className="text-3xl font-extrabold text-yellow-600 mb-2">{cancelledCount}</div>
            <div className="flex items-center gap-2 text-sm text-secondary mb-4">
              <span>Completed:</span>
              <span className="font-bold text-green-600">{completedCount}</span>
            </div>
            <div className="flex gap-2 mt-auto">
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Cancelled</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Completed</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Upcoming sessions */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-8 transition hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2 text-main">
                <CalendarIcon className="w-6 h-6" /> Upcoming Sessions
              </h2>
              <Button variant="default" onClick={() => router.push("/calendar")}>View Calendar</Button>
            </div>
            <ul className="divide-y divide-background-light">
              {upcomingSessions.slice(0, 5).map(s => {
                const client = clients.find(c => c.id === s.clientId);
                return (
                  <li key={s.id} className="flex items-center justify-between py-4 group">
                    <div className="flex items-center gap-4">
                      <Avatar
                        name={client?.User?.name || 'Client'}
                        photoUrl={client?.profile}
                        size="w-12 h-12"
                      />
                      <div>
                        <div className="font-semibold text-primary text-lg group-hover:text-main transition">
                          {client?.User?.name || "Client"}
                        </div>
                        <div className="text-xs text-secondary mt-1">{new Date(s.date).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-secondary font-mono min-w-[70px]">{s.time}</div>
                  </li>
                );
              })}
              {upcomingSessions.length === 0 && <li className="text-secondary py-8 text-center">No upcoming sessions</li>}
            </ul>
          </div>

          {/* Top clients */}
          <div className="bg-white rounded-xl shadow-lg p-8 transition hover:shadow-2xl hover:-translate-y-1">
            <h2 className="text-2xl font-semibold mb-6 text-main flex items-center gap-2">
              <Users className="w-6 h-6" /> Top Performing Clients
            </h2>
            <ul>
              {topClients.map((c, idx) => (
                <li key={c.id} className="flex items-center gap-4 mb-6 last:mb-0">
                  <Avatar
                    name={c.User?.name || 'Client'}
                    photoUrl={c.profile}
                    size="w-12 h-12"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-primary text-lg">{c.User?.name}</div>
                    <div className="w-full bg-background-light rounded-full h-2 mt-2">
                      <div className="bg-main h-2 rounded-full" style={{ width: `${Math.min(100, (c.sessionCount / (topClients[0]?.sessionCount || 1)) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="text-sm text-secondary font-mono min-w-[32px] text-right">{c.sessionCount}</div>
                </li>
              ))}
              {topClients.length === 0 && <li className="text-secondary py-8 text-center">No data</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
