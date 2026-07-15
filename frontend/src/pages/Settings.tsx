import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Field, inputClass, buttonPrimary } from "../components/ui/Field";
import { User, Bell, GraduationCap, DollarSign, Plus, Trash2, GripVertical, Settings2 } from "lucide-react";
import { COUNTRY_CURRENCY_MAP } from "../utils/countryDefaults";

type SettingsTab = "profile" | "qualifications" | "concessions" | "currency" | "notifications";

export default function Settings() {
  const { settings, setSettings } = useApp();
  const [tab, setTab]           = useState<SettingsTab>("profile");
  const [tutorName, setTutorName] = useState(settings.tutorName);
  const [baseCurrency, setBaseCurrency] = useState(settings.currency.baseCurrency);
  const [reminderDays, setReminderDays] = useState(settings.paymentReminderDaysAfterDue);
  const [qualLevels, setQualLevels] = useState<string[]>(settings.qualificationLevels ?? ["O' Level","A Level","IGCSE","GCSE","IB","AS Level","Grade 8","Grade 7","Grade 6","Grade 5","Grade 4","Grade 3"]);
  const [newQual, setNewQual]   = useState("");
  const [concessions, setConcessions] = useState(settings.concessions ?? []);
  const [notifPayment, setNotifPayment] = useState(true);
  const [notifSession, setNotifSession] = useState(true);

  const rates: Record<string, number> = { USD: 1, GBP: 0.79, PKR: 278, INR: 83, EUR: 0.92, AED: 3.67 };
  const [exchangeRates, setExchangeRates] = useState(rates);

  const TABS: { id: SettingsTab; label: string; Icon: typeof User }[] = [
    { id: "profile",       label: "Profile",         Icon: User },
    { id: "qualifications",label: "Qualifications",  Icon: GraduationCap },
    { id: "concessions",   label: "Concessions",     Icon: DollarSign },
    { id: "currency",      label: "Currency",        Icon: DollarSign },
    { id: "notifications", label: "Notifications",   Icon: Bell },
  ];

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-900/50 dark:text-white/40 mt-0.5">Manage your profile and preferences.</p>
        </div>
      </div>

      <div className="surface-panel overflow-hidden">
        {/* Tab Bar */}
        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                tab === id
                  ? "text-accent border-accent bg-accent/5"
                  : "text-gray-900/40 dark:text-white/30 border-transparent hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/40"
              }`}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8">

          {/* ── PROFILE ── */}
          {tab === "profile" && (
            <form className="space-y-6" onSubmit={e => { e.preventDefault(); setSettings(p => ({ ...p, tutorName, paymentReminderDaysAfterDue: reminderDays, currency: { ...p.currency, baseCurrency: baseCurrency as any } })); }}>
              <div className="flex items-center gap-2 mb-5">
                <Settings2 size={18} className="text-accent" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Personal Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Tutor Name"><input className={inputClass} value={tutorName} onChange={e => setTutorName(e.target.value)} required /></Field>
                <Field label="Email Address"><input className={inputClass} value="tutor@example.com" disabled /></Field>
                <Field label="Country"><input className={inputClass} defaultValue="Pakistan" /></Field>
                <Field label="Timezone"><input className={inputClass} defaultValue="Asia/Karachi" /></Field>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-end">
                <button type="submit" className={buttonPrimary}>Save Changes</button>
              </div>
            </form>
          )}

          {/* ── QUALIFICATIONS ── */}
          {tab === "qualifications" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap size={18} className="text-accent" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Qualification Levels</h2>
              </div>
              <p className="text-sm text-gray-900/40 dark:text-white/30">These appear in the student and batch level dropdowns.</p>
              <div className="space-y-2">
                {qualLevels.map((q, i) => (
                  <div key={i} className="flex items-center gap-3 surface-card px-4 py-2.5 group">
                    <GripVertical size={14} className="text-gray-900/20 dark:text-white/15 cursor-grab" />
                    <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{q}</span>
                    <button onClick={() => setQualLevels(prev => prev.filter((_, j) => j !== i))}
                      className="text-gray-900/20 dark:text-white/15 hover:text-danger transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newQual} onChange={e => setNewQual(e.target.value)} placeholder="Add level e.g. Grade 2"
                  className={inputClass} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), newQual.trim() && (setQualLevels(p => [...p, newQual.trim()]), setNewQual("")))} />
                <button onClick={() => newQual.trim() && (setQualLevels(p => [...p, newQual.trim()]), setNewQual(""))}
                  className={`${buttonPrimary} !px-4 shrink-0`}><Plus size={16} /></button>
              </div>
            </div>
          )}

          {/* ── CONCESSIONS ── */}
          {tab === "concessions" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign size={18} className="text-accent" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Concessions</h2>
              </div>
              <p className="text-sm text-gray-900/40 dark:text-white/30">Discounts applied to student fees (sibling discount, early bird, etc.)</p>
              <div className="space-y-2">
                {concessions.length === 0 && <p className="text-sm text-gray-900/25 dark:text-white/15 text-center py-4">No concessions yet.</p>}
                {concessions.map(c => (
                  <div key={c.id} className="flex items-center gap-3 surface-card px-4 py-3 group">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.label}</p>
                      <p className="text-xs text-gray-900/40 dark:text-white/30">{c.type === "percent" ? `${c.value}% off` : `Flat ${c.value} off`}</p>
                    </div>
                    <button onClick={() => setConcessions(prev => prev.filter(x => x.id !== c.id))}
                      className="text-gray-900/20 dark:text-white/15 hover:text-danger transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <form className="surface-card p-4 space-y-3" onSubmit={e => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget as HTMLFormElement);
                setConcessions(prev => [...prev, {
                  id: `c${Date.now()}`, label: fd.get("label") as string,
                  type: fd.get("type") as "percent"|"flat", value: Number(fd.get("value"))
                }]);
                (e.currentTarget as HTMLFormElement).reset();
              }}>
                <p className="text-xs font-semibold text-gray-900/40 dark:text-white/30 uppercase tracking-wider mb-2">Add Concession</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Label"><input name="label" className={inputClass} placeholder="Sibling discount" required /></Field>
                  <Field label="Type">
                    <select name="type" className={inputClass}><option value="percent">Percent (%)</option><option value="flat">Flat amount</option></select>
                  </Field>
                </div>
                <Field label="Value"><input name="value" className={inputClass} type="number" min={0} step={0.01} required /></Field>
                <button type="submit" className={`${buttonPrimary} w-full !text-xs`}>Add Concession</button>
              </form>
            </div>
          )}

          {/* ── CURRENCY / BUSINESS SETTINGS ── */}
          {tab === "currency" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign size={18} className="text-accent" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Business Settings</h2>
              </div>

              {/* Preferred currency override */}
              <div className="surface-card p-5 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Preferred Currency</p>
                  <p className="text-xs text-gray-900/45 dark:text-white/35 mt-0.5">
                    Your currency was auto-assigned when you signed up based on your country. You can override it here at any time.
                  </p>
                </div>
                <Field label="Currency">
                  <select
                    className={inputClass}
                    value={baseCurrency}
                    onChange={e => setBaseCurrency(e.target.value as any)}
                  >
                    {Object.entries(COUNTRY_CURRENCY_MAP).map(([country, { code, symbol }]) => (
                      <option key={code} value={code}>
                        {code} ({symbol}) — {country}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="flex justify-end">
                  <button
                    onClick={() => setSettings(p => ({ ...p, currency: { ...p.currency, baseCurrency: baseCurrency as any } }))}
                    className={buttonPrimary}
                  >
                    Save Currency
                  </button>
                </div>
              </div>

              {/* Exchange rates */}
              <div className="surface-card p-5 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Exchange Rates</p>
                  <p className="text-xs text-gray-900/45 dark:text-white/35 mt-0.5">
                    Manual overrides for currency conversion (units per 1 USD).
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(exchangeRates).map(([code, rate]) => (
                    <Field key={code} label={code}>
                      <input
                        className={inputClass}
                        type="number"
                        step={0.0001}
                        value={rate}
                        onChange={e => setExchangeRates(p => ({ ...p, [code]: Number(e.target.value) }))}
                      />
                    </Field>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {tab === "notifications" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <Bell size={18} className="text-accent" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Notification Settings</h2>
              </div>
              {[
                { label: "Payment reminders", desc: "Send overdue payment reminder emails", state: notifPayment, setState: setNotifPayment },
                { label: "Session notifications", desc: "Notify students when sessions are rescheduled or cancelled", state: notifSession, setState: setNotifSession },
              ].map(({ label, desc, state, setState }) => (
                <div key={label} className="surface-card p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                    <p className="text-xs text-gray-900/40 dark:text-white/30 mt-0.5">{desc}</p>
                  </div>
                  <button onClick={() => setState(v => !v)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${state ? "bg-accent" : "bg-gray-200 dark:bg-gray-600"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${state ? "translate-x-5" : ""}`} />
                  </button>
                </div>
              ))}
              <Field label="Payment reminder — days after due">
                <select className={inputClass} value={reminderDays} onChange={e => setReminderDays(Number(e.target.value))}>
                  <option value={1}>1 day after due</option>
                  <option value={2}>2 days after due</option>
                  <option value={3}>3 days after due</option>
                  <option value={7}>7 days after due</option>
                </select>
              </Field>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
