import { useApp } from "../context/AppContext";
import { Users, DollarSign, CalendarClock, TrendingUp, TrendingDown, AlertTriangle, ChevronRight, Zap, Mail, BookOpen, CheckCircle2, Receipt } from "lucide-react";
import { format, parseISO, isToday } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function CountUp({ end, prefix = "", suffix = "", decimals = 0 }: { end: number, prefix?: string, suffix?: string, decimals?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let startTime: number;
    const duration = 1200;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setVal(end * easeOutQuart);
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end]);
  
  return <>{prefix}{val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}

export default function Dashboard() {
  const { students, sessions, settings } = useApp();
  const navigate = useNavigate();

  const activeStudents   = students.filter(s => s.active);
  const todaySessions    = sessions.filter(s => s.date && isToday(parseISO(s.date)) && s.status !== "cancelled");
  
  const allEnrollments = activeStudents.flatMap(s => (s.enrollments || []).map(e => ({...e, studentName: s.name, studentEmail: s.contact.email})));
  const pendingDuesList  = allEnrollments.filter(e => e.status === "due" || e.status === "overdue");

  const thisMonthRevenue = allEnrollments.reduce((sum, e) => e.status === "paid" ? sum + e.feeAmount : sum, 0);
  const thisMonthExpenses = 450; // Mock expenses
  const thisMonthProfit = thisMonthRevenue - thisMonthExpenses;
  const thisMonthSessions = sessions.length;

  // Chart data
  const chartData = [
    { name: "Jan", revenue: 4000, profit: 3200 },
    { name: "Feb", revenue: 4200, profit: 3400 },
    { name: "Mar", revenue: 4800, profit: 4100 },
    { name: "Apr", revenue: 4600, profit: 3900 },
    { name: "May", revenue: 5100, profit: 4500 },
    { name: "Jun", revenue: 5800, profit: 5100 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/80 dark:bg-navy-900/80 backdrop-blur-md px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border border-border/50">
          <p className="text-foreground/60 mb-2 uppercase tracking-widest text-[10px]">{label}</p>
          <div className="space-y-1.5">
            <p className="text-success font-mono flex items-center justify-between gap-6">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success"/> Revenue</span>
              <span>{settings.currency.baseCurrency} {payload[0].value.toLocaleString()}</span>
            </p>
            <p className="text-accent font-mono flex items-center justify-between gap-6">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent"/> Profit</span>
              <span>{settings.currency.baseCurrency} {payload[1].value.toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <h1 className="text-xl font-display font-bold text-foreground leading-tight">Overview</h1>
          <p className="text-[11px] text-foreground/50 font-medium">Your tutoring business at a glance.</p>
        </div>
        <div className="px-3 py-1.5 surface-card border border-border rounded-full text-[11px] font-bold text-foreground/70 flex items-center gap-1.5 shadow-sm">
          <CalendarClock size={13} className="text-blue-500" />
          {format(new Date(), "EEEE, MMM d")}
        </div>
      </div>

      {/* Row 1: Today's Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        
        {/* Today's Schedule */}
        <div className="surface-card p-0 flex flex-col overflow-hidden shadow-sm h-52">
          <div className="px-4 py-3 border-b border-border bg-blue-500/5">
            <h2 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2"><BookOpen size={13} /> Today's Schedule</h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            {todaySessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-2 opacity-70">
                <CalendarClock size={20} className="mb-2 text-foreground/30" />
                <p className="text-[11px] font-medium text-foreground/50">Your schedule is clear for today.</p>
              </div>
            ) : (
              <div className="space-y-3 relative before:absolute before:inset-y-1.5 before:left-1.5 before:w-[2px] before:bg-border/60">
                {todaySessions.map((s, i) => (
                  <div key={i} className="flex gap-3 relative">
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-card shrink-0 mt-0.5 relative z-10" />
                    <div>
                      <h4 className="font-semibold text-foreground text-[13px] leading-tight">{s.title}</h4>
                      <p className="text-[10px] text-foreground/50 font-mono mt-0.5">{s.startTime} ({s.durationMins}m)</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Payments */}
        <div className="surface-card p-0 flex flex-col overflow-hidden shadow-sm h-52">
          <div className="px-4 py-3 border-b border-border bg-danger/5">
            <h2 className="text-[11px] font-bold text-danger uppercase tracking-wider flex items-center gap-2"><AlertTriangle size={13} /> Pending Dues</h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
            {pendingDuesList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-2 opacity-70">
                <CheckCircle2 size={20} className="mb-2 text-success" />
                <p className="text-[11px] font-medium text-foreground/50">All payments are up to date.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingDuesList.slice(0, 3).map(s => (
                  <div key={s.id} className="flex flex-col gap-1.5 p-2.5 border border-border rounded-lg bg-card hover:border-danger/30 transition-all shadow-sm group cursor-pointer">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-foreground text-[11px] leading-tight truncate">{s.studentName}</h4>
                      <p className="text-[11px] font-mono text-danger font-bold shrink-0">{s.currency} {s.feeAmount}</p>
                    </div>
                    <button 
                      onClick={() => navigate("/messages", { state: { recipient: s.studentEmail, template: "fee_reminder" } })}
                      className="flex items-center justify-center gap-1 w-full py-1 bg-danger/10 group-hover:bg-danger text-danger group-hover:text-white transition-colors rounded-md text-[9px] font-bold uppercase tracking-wider"
                    >
                      <Mail size={10} /> Send Reminder
                    </button>
                  </div>
                ))}
                {pendingDuesList.length > 3 && (
                  <div className="pt-1 text-center">
                    <Link to="/finances" className="text-[10px] font-bold text-foreground/50 hover:text-foreground transition-colors">
                      View all {pendingDuesList.length} <ChevronRight size={10} className="inline -mt-0.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="surface-card p-0 flex flex-col overflow-hidden shadow-sm h-52">
          <div className="px-4 py-3 border-b border-border bg-warning/5">
            <h2 className="text-[11px] font-bold text-warning uppercase tracking-wider flex items-center gap-2"><Zap size={13} /> Recent Activity</h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 text-sm hover:bg-muted/50 p-1.5 rounded-lg transition-colors cursor-default">
                <div className="w-6 h-6 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0"><DollarSign size={12} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-[11px] font-semibold truncate">Payment from Ali Hassan</p>
                  <p className="text-[9px] text-foreground/40 mt-0.5">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 text-sm hover:bg-muted/50 p-1.5 rounded-lg transition-colors cursor-default">
                <div className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0"><Users size={12} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-[11px] font-semibold truncate">Sara Khan enrolled</p>
                  <p className="text-[9px] text-foreground/40 mt-0.5">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-sm hover:bg-muted/50 p-1.5 rounded-lg transition-colors cursor-default">
                <div className="w-6 h-6 rounded-full bg-violet/10 text-violet flex items-center justify-center shrink-0"><Mail size={12} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-[11px] font-semibold truncate">Reminder sent to John Doe</p>
                  <p className="text-[9px] text-foreground/40 mt-0.5">1 day ago</p>
                </div>
              </div>
            </div>
            <Link to="/finances" className="text-[10px] font-bold text-accent hover:underline mt-2 block px-1.5">View all activity →</Link>
          </div>
        </div>

      </div>

      {/* Row 2: Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        
        {/* Revenue (Green) */}
        <div className="surface-card p-3 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-success opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Revenue</p>
            <div className="w-6 h-6 rounded-full bg-success/10 text-success flex items-center justify-center"><DollarSign size={12} /></div>
          </div>
          <h3 className="text-lg font-mono font-bold text-foreground mb-1 leading-none"><CountUp end={thisMonthRevenue} prefix={`${settings.currency.baseCurrency} `} /></h3>
          <p className="text-[10px] font-semibold text-success flex items-center gap-1"><TrendingUp size={10}/> +12% vs last mo</p>
        </div>

        {/* Expenses (Red) */}
        <div className="surface-card p-3 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-danger opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Expenses</p>
            <div className="w-6 h-6 rounded-full bg-danger/10 text-danger flex items-center justify-center"><Receipt size={12} /></div>
          </div>
          <h3 className="text-lg font-mono font-bold text-foreground mb-1 leading-none"><CountUp end={thisMonthExpenses} prefix={`${settings.currency.baseCurrency} `} /></h3>
          <p className="text-[10px] font-semibold text-success flex items-center gap-1"><TrendingDown size={10}/> -5% vs last mo</p>
        </div>
        
        {/* Profit (Terracotta) */}
        <div className="surface-card p-3 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Profit</p>
            <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center"><TrendingUp size={12} /></div>
          </div>
          <h3 className="text-lg font-mono font-bold text-foreground mb-1 leading-none"><CountUp end={thisMonthProfit} prefix={`${settings.currency.baseCurrency} `} /></h3>
          <p className="text-[10px] font-semibold text-success flex items-center gap-1"><TrendingUp size={10}/> +14.5% growth</p>
        </div>

        {/* Students (Teal) */}
        <div className="surface-card p-3 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-teal-500 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Students</p>
            <div className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center"><Users size={12} /></div>
          </div>
          <h3 className="text-lg font-mono font-bold text-foreground mb-1 leading-none"><CountUp end={activeStudents.length} /></h3>
          <p className="text-[10px] font-semibold text-teal-500 flex items-center gap-1"><TrendingUp size={10}/> 4 new enrollments</p>
        </div>
        
        {/* Sessions (Blue) */}
        <div className="surface-card p-3 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Sessions</p>
            <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center"><CalendarClock size={12} /></div>
          </div>
          <h3 className="text-lg font-mono font-bold text-foreground mb-1 leading-none"><CountUp end={thisMonthSessions} /></h3>
          <p className="text-[10px] font-semibold text-blue-500 flex items-center gap-1"><CheckCircle2 size={10}/> {todaySessions.length} scheduled today</p>
        </div>
      </div>

      {/* Row 3: Performance Chart */}
      <div className="surface-panel p-4 flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="text-sm font-bold text-foreground">Performance Trend</h2>
          <div className="flex items-center gap-3 text-[10px] font-bold text-foreground/60 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success shadow-glow" /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent shadow-glow" /> Profit</span>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex-1 min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.05} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "currentColor", opacity: 0.5, fontSize: 10, fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "currentColor", opacity: 0.5, fontSize: 10, fontFamily: "monospace", fontWeight: 600 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border-color)", strokeWidth: 1, strokeDasharray: "4 4", fill: "rgba(0,0,0,0.02)" }} />
              <Area type="natural" dataKey="revenue" stroke="var(--success)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="natural" dataKey="profit" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorProf)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

    </div>
  );
}
