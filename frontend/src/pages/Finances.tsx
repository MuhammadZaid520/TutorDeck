import { useState } from "react";
import { useApp } from "../context/AppContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
         PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area } from "recharts";
import Modal from "../components/ui/Modal";
import { Field, inputClass, buttonPrimary, buttonSecondary } from "../components/ui/Field";
import { DollarSign, Download, TrendingDown, TrendingUp, Plus, Trash2, Receipt } from "lucide-react";
import { useEffect } from "react";

const EXPENSE_CATEGORIES = ["Software", "Internet", "Marketing", "Supplies", "Rent", "Transport", "Other"];
const ACCENT_COLORS = ["#3B82F6","#10B981","#F59E0B","#F43F5E","#8B5CF6","#06b6d4","#64748b"];

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

const MONTH_DATA = [
  { name:"Jan", Income:4200, Expenses:1800, Profit: 2400 }, 
  { name:"Feb", Income:3800, Expenses:2100, Profit: 1700 },
  { name:"Mar", Income:5100, Expenses:2400, Profit: 2700 }, 
  { name:"Apr", Income:4700, Expenses:1900, Profit: 2800 },
  { name:"May", Income:5500, Expenses:2800, Profit: 2700 }, 
  { name:"Jun", Income:4900, Expenses:2200, Profit: 2700 },
  { name:"Jul", Income:6100, Expenses:2600, Profit: 3500 },
];

export default function Finances() {
  const { payments, expenses, settings } = useApp();
  const [period, setPeriod]         = useState<"monthly" | "yearly">("monthly");
  const [addExpOpen, setAddExpOpen] = useState(false);
  const [mockExpenses, setMockExpenses] = useState([
    { id:"e1", date:"2026-06-01", category:"Software", description:"Zoom Pro",  amount:149.99, currency:"USD" },
    { id:"e2", date:"2026-06-05", category:"Internet",  description:"Fiber bill", amount:3500,  currency:"PKR" },
  ]);

  const totalIncome   = payments.reduce((s,p) => s + p.amount, 0);
  const totalExpenses = [...expenses, ...mockExpenses].reduce((s,e) => s + e.amount, 0);
  const netProfit     = totalIncome - totalExpenses;
  const profitMargin  = totalIncome ? ((netProfit / totalIncome) * 100).toFixed(1) : "0";

  const pieData = EXPENSE_CATEGORIES.map((cat, i) => ({
    name: cat,
    value: mockExpenses.filter(e => e.category === cat).reduce((s,e) => s + e.amount, 0),
  })).filter(d => d.value > 0);

  const Tip = ({ active, payload, label }: any) =>
    active && payload?.length ? (
      <div className="bg-white/80 dark:bg-navy-900/80 backdrop-blur-md px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border border-border/50">
        <p className="text-foreground/60 mb-2 uppercase tracking-widest text-[10px]">{label}</p>
        <div className="space-y-1.5">
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color }} className="font-mono flex items-center justify-between gap-6">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: p.color }}/> {p.name}</span>
              <span>{settings.currency.baseCurrency} {p.value?.toLocaleString()}</span>
            </p>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h1 className="text-xl font-display font-bold text-foreground leading-tight">Ledger</h1>
          <p className="text-[11px] text-foreground/50 font-medium">Income, expenses, and profit at a glance.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Period toggle */}
          <div className="flex gap-1 p-1 surface-card rounded-full shadow-sm">
            {(["monthly","yearly"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                  period === p ? "bg-accent/15 text-accent shadow-sm" : "text-foreground/50 hover:bg-muted"
                }`}>{p}</button>
            ))}
          </div>
          <button className="h-7 px-3 flex items-center gap-1.5 rounded-full text-[11px] font-bold bg-white dark:bg-navy-900 border border-border text-foreground hover:bg-muted transition-colors shadow-sm">
            <Download size={12} /> Export PDF
          </button>
        </div>
      </div>

      {/* Sparkline Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Revenue */}
        <div className="surface-card p-3 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-lg font-mono font-bold text-foreground leading-tight mt-1"><CountUp end={totalIncome} prefix={`${settings.currency.baseCurrency} `} /></h3>
            </div>
            <div className="w-6 h-6 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0"><DollarSign size={12} /></div>
          </div>
          <div className="h-10 mt-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTH_DATA}>
                <defs><linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/><stop offset="95%" stopColor="var(--success)" stopOpacity={0}/></linearGradient></defs>
                <Area type="natural" dataKey="Income" stroke="var(--success)" strokeWidth={2.5} fillOpacity={1} fill="url(#gRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] font-semibold text-success flex items-center gap-1 mt-1"><TrendingUp size={10}/> +8.2% vs last mo</p>
        </div>

        {/* Expenses */}
        <div className="surface-card p-3 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Total Expenses</p>
              <h3 className="text-lg font-mono font-bold text-foreground leading-tight mt-1"><CountUp end={totalExpenses} prefix={`${settings.currency.baseCurrency} `} /></h3>
            </div>
            <div className="w-6 h-6 rounded-full bg-danger/10 text-danger flex items-center justify-center shrink-0"><Receipt size={12} /></div>
          </div>
          <div className="h-10 mt-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTH_DATA}>
                <defs><linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--danger)" stopOpacity={0.3}/><stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/></linearGradient></defs>
                <Area type="natural" dataKey="Expenses" stroke="var(--danger)" strokeWidth={2.5} fillOpacity={1} fill="url(#gExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] font-semibold text-success flex items-center gap-1 mt-1"><TrendingDown size={10}/> -2.4% vs last mo</p>
        </div>

        {/* Net Profit */}
        <div className="surface-card p-3 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Net Profit</p>
              <h3 className="text-lg font-mono font-bold text-foreground leading-tight mt-1"><CountUp end={netProfit} prefix={`${settings.currency.baseCurrency} `} /></h3>
            </div>
            <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0"><TrendingUp size={12} /></div>
          </div>
          <div className="h-10 mt-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTH_DATA}>
                <defs><linearGradient id="gProf" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/><stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/></linearGradient></defs>
                <Area type="natural" dataKey="Profit" stroke="var(--accent)" strokeWidth={2.5} fillOpacity={1} fill="url(#gProf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] font-semibold text-success flex items-center gap-1 mt-1"><TrendingUp size={10}/> +11.1% vs last mo</p>
        </div>

        {/* Profit Margin */}
        <div className="surface-card p-3 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Profit Margin</p>
              <h3 className="text-lg font-mono font-bold text-foreground leading-tight mt-1"><CountUp end={Number(profitMargin)} decimals={1} suffix="%" /></h3>
            </div>
            <div className="w-6 h-6 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0"><TrendingUp size={12} /></div>
          </div>
          <div className="h-10 mt-1 w-full flex items-center">
            {/* Visual indicator for margin health instead of sparkline since it's a fixed ratio */}
            <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
              <div className="bg-warning h-full rounded-full" style={{ width: `${Math.min(Number(profitMargin), 100)}%` }} />
            </div>
          </div>
          <p className="text-[10px] font-semibold text-success flex items-center gap-1 mt-1"><TrendingUp size={10}/> +1.5% improvement</p>
        </div>
      </div>

      {/* Expenses List */}
      <div className="surface-panel overflow-hidden mb-4">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-danger/5">
          <h2 className="text-[13px] font-bold text-danger flex items-center gap-2"><Receipt size={14} /> Expense Log</h2>
          <button onClick={() => setAddExpOpen(true)} className="h-7 px-3 flex items-center gap-1.5 rounded-full text-[11px] font-bold bg-danger/10 text-danger hover:bg-danger hover:text-white transition-colors">
            <Plus size={12} strokeWidth={3} /> Add Expense
          </button>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 border-b border-border">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockExpenses.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-foreground/30 font-semibold text-xs">No expenses recorded yet.</td></tr>
              ) : mockExpenses.map(e => (
                <tr key={e.id} className="hover:bg-muted/40 transition-colors group">
                  <td className="px-5 py-3 text-[11px] text-foreground/60 font-semibold">{e.date}</td>
                  <td className="px-5 py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted border border-border text-foreground/70">{e.category}</span>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-foreground font-semibold">{e.description}</td>
                  <td className="px-5 py-3 text-right font-mono text-[13px] font-bold text-danger">{e.currency} {e.amount.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setMockExpenses(prev => prev.filter(x => x.id !== e.id))}
                      className="text-foreground/20 hover:text-danger transition-colors p-1 opacity-0 group-hover:opacity-100">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        
        {/* Income vs Expenses Area */}
        <div className="xl:col-span-2 surface-panel p-5 flex flex-col">
          <h2 className="text-sm font-bold text-foreground mb-4 shrink-0">Cash Flow Trend</h2>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTH_DATA} margin={{ top:5, right:0, left:-20, bottom:0 }}>
                <defs>
                  <linearGradient id="flowRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="flowExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.05} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill:"currentColor", opacity:0.5, fontSize:10, fontWeight:600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill:"currentColor", opacity:0.5, fontSize:10, fontFamily:"monospace", fontWeight:600 }} />
                <Tooltip content={<Tip />} cursor={{ stroke: "var(--border-color)", strokeWidth: 1, strokeDasharray: "4 4", fill: "rgba(0,0,0,0.02)" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 600, opacity: 0.8 }} />
                <Area type="natural" dataKey="Income" stroke="var(--success)" strokeWidth={3} fillOpacity={1} fill="url(#flowRev)" />
                <Area type="natural" dataKey="Expenses" stroke="var(--danger)" strokeWidth={3} fillOpacity={1} fill="url(#flowExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown pie */}
        <div className="surface-panel p-5 flex flex-col">
          <h2 className="text-sm font-bold text-foreground mb-4 shrink-0">Expense Breakdown</h2>
          {pieData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-foreground/40 text-xs font-semibold">No expenses recorded</div>
          ) : (
            <>
              <div className="flex-1 min-h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                      {pieData.map((_, i) => <Cell key={i} fill={ACCENT_COLORS[i % ACCENT_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<Tip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar pr-2">
                {pieData.map((d,i) => (
                  <div key={d.name} className="flex items-center justify-between text-[11px] font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: ACCENT_COLORS[i % ACCENT_COLORS.length] }} />
                      <span className="text-foreground/70">{d.name}</span>
                    </div>
                    <span className="font-mono text-foreground">{d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal isOpen={addExpOpen} onClose={() => setAddExpOpen(false)} title="Add Expense">
        <form className="space-y-3" onSubmit={e => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget as HTMLFormElement);
          setMockExpenses(prev => [...prev, {
            id: `e${Date.now()}`,
            date: fd.get("date") as string,
            category: fd.get("category") as string,
            description: fd.get("description") as string,
            amount: Number(fd.get("amount")),
            currency: fd.get("currency") as string,
          }]);
          setAddExpOpen(false);
        }}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><input name="date" className={inputClass} type="date" required /></Field>
            <Field label="Category">
              <select name="category" className={inputClass}>
                {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Description"><input name="description" className={inputClass} placeholder="e.g. Zoom Pro subscription" required /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount"><input name="amount" className={inputClass} type="number" min={0} step={0.01} required /></Field>
            <Field label="Currency">
              <select name="currency" className={inputClass}>
                <option>USD</option><option>GBP</option><option>PKR</option><option>INR</option><option>AED</option>
              </select>
            </Field>
          </div>
          <button type="submit" className={`${buttonPrimary} w-full !mt-4`}>Save Expense</button>
        </form>
      </Modal>
    </div>
  );
}
