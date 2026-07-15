import { useState } from "react";
import { useApp } from "../context/AppContext";
import Modal from "../components/ui/Modal";
import { Field, inputClass, buttonPrimary } from "../components/ui/Field";
import { format, parseISO, isSameDay, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, Wifi, MapPin, Edit3, CheckCircle2, Trash2, XCircle } from "lucide-react";
import type { Session } from "../types";

export default function Sessions() {
  const { sessions, students, batches, updateSession, cancelSession } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // State for creating new session
  const [modal, setModal] = useState<{ open: boolean; day: Date | null; hour: number }>({ open: false, day: null, hour: 0 });
  const [classMode, setClassMode] = useState<"online" | "physical">("online");
  
  // State for viewing/editing existing session
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isEditingSession, setIsEditingSession] = useState(false);

  const weekStart = subDays(currentDate, currentDate.getDay());
  const weekDays  = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours     = Array.from({ length: 14 }, (_, i) => i + 6); // 6AM–7PM

  const handleSessionClick = (e: React.MouseEvent, s: Session) => {
    e.stopPropagation();
    setSelectedSession(s);
    setIsEditingSession(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const date = fd.get("date") as string;
    const startTime = fd.get("startTime") as string;
    const endTime = fd.get("endTime") as string;
    const durationMins = (parseInt(endTime.split(":")[0]) - parseInt(startTime.split(":")[0])) * 60 + 
                         (parseInt(endTime.split(":")[1]) - parseInt(startTime.split(":")[1]));
    
    updateSession(selectedSession.id, {
      date,
      startTime,
      durationMins,
      title: fd.get("title") as string,
      status: (fd.get("status") as any) || selectedSession.status
    });
    setSelectedSession(null);
    setIsEditingSession(false);
  };

  return (
    <div className="space-y-5 h-[calc(100vh-5rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Sessions</h1>
          <p className="text-sm text-foreground/50 mt-1">Click any empty slot to schedule a session, or click a session to edit.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center surface-card p-1 gap-0.5">
            <button onClick={() => setCurrentDate(subDays(currentDate, 7))}
              className="p-1.5 hover:bg-surface-muted dark:hover:bg-navy-800 rounded-btn transition-colors text-navy-900/40 dark:text-white/30 hover:text-navy-900 dark:hover:text-white">
              <ChevronLeft size={16} />
            </button>
            <div className="px-3 text-sm font-semibold text-navy-900 dark:text-white flex items-center gap-1.5">
              <Calendar size={13} className="text-accent" />
              {format(weekStart, "MMM d")} – {format(addDays(weekStart, 6), "MMM d, yyyy")}
            </div>
            <button onClick={() => setCurrentDate(addDays(currentDate, 7))}
              className="p-1.5 hover:bg-surface-muted dark:hover:bg-navy-800 rounded-btn transition-colors text-navy-900/40 dark:text-white/30 hover:text-navy-900 dark:hover:text-white">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 surface-panel overflow-hidden flex flex-col">

        {/* Day headers */}
        <div className="grid grid-cols-8 border-b border-surface-border dark:border-navy-border shrink-0">
          <div className="p-3 border-r border-surface-border dark:border-navy-border" />
          {weekDays.map((day, i) => {
            const today = isSameDay(day, new Date());
            return (
              <div key={i} className={`p-3 text-center border-r border-surface-border dark:border-navy-border last:border-0 relative ${today ? "bg-accent/5" : ""}`}>
                {today && <div className="absolute top-0 inset-x-0 h-0.5 bg-accent rounded-b" />}
                <p className={`text-[10px] font-semibold uppercase tracking-widest mb-1 ${today ? "text-accent" : "text-navy-900/30 dark:text-white/25"}`}>
                  {format(day, "EEE")}
                </p>
                <p className={`text-lg font-display font-bold ${today ? "text-accent" : "text-navy-900 dark:text-white"}`}>
                  {format(day, "d")}
                </p>
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-8" style={{ minHeight: `${hours.length * 80}px` }}>

            {/* Time gutter */}
            <div className="border-r border-surface-border dark:border-navy-border">
              {hours.map(h => (
                <div key={h} className="h-20 border-b border-surface-border dark:border-navy-border px-2 flex items-start pt-2">
                  <span className="text-[10px] font-semibold text-navy-900/25 dark:text-white/20 font-mono">
                    {h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`}
                  </span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day, di) => (
              <div key={di} className="border-r border-surface-border dark:border-navy-border last:border-0 relative">
                {hours.map(h => (
                  <div
                    key={h}
                    onClick={() => setModal({ open: true, day, hour: h })}
                    className="h-20 border-b border-dashed border-surface-border dark:border-navy-border hover:bg-accent/5 transition-colors cursor-pointer group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-accent font-semibold p-1.5 block">+ Add</span>
                  </div>
                ))}

                {/* Render sessions */}
                {sessions
                  .filter(s => s.date && isSameDay(parseISO(s.date), day) && s.status !== "cancelled")
                  .map(s => {
                    const sh = parseInt(s.startTime.split(":")[0]);
                    const sm = parseInt(s.startTime.split(":")[1]);
                    if (sh < 6 || sh > 19) return null;
                    const top    = ((sh - 6) * 80) + (sm / 60 * 80);
                    const height = (s.durationMins / 60) * 80;
                    const eh     = sh + Math.floor((sm + s.durationMins) / 60);
                    const em     = (sm + s.durationMins) % 60;
                    const isOnline = (s as any).classMode !== "physical";

                    return (
                      <div
                        key={s.id}
                        onClick={(e) => handleSessionClick(e, s)}
                        className={`absolute left-1 right-1 rounded-btn p-2 overflow-hidden border transition-all cursor-pointer z-10 group ${
                          s.status === 'completed' 
                            ? 'bg-success/10 border-success/20 hover:bg-success/20' 
                            : 'bg-accent/10 border-accent/20 hover:bg-accent/20'
                        }`}
                        style={{ top: `${top}px`, height: `${Math.max(height - 2, 24)}px` }}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-0.5 group-hover:w-1 transition-all rounded-l ${s.status === 'completed' ? 'bg-success' : 'bg-accent'}`} />
                        <div className="flex items-center gap-1 mb-0.5">
                          {isOnline
                            ? <Wifi size={9} className="text-foreground/50 shrink-0" />
                            : <MapPin size={9} className="text-foreground/50 shrink-0" />}
                          <p className="text-[10px] font-semibold text-foreground/60 font-mono truncate">
                            {s.startTime}–{eh.toString().padStart(2,"0")}:{em.toString().padStart(2,"0")}
                          </p>
                        </div>
                        <p className={`text-xs font-semibold leading-tight truncate ${s.status === 'completed' ? 'text-success line-through opacity-70' : 'text-foreground'}`}>
                          {s.title}
                        </p>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <Modal size="lg" isOpen={modal.open} onClose={() => setModal({ open: false, day: null, hour: 0 })} title="Schedule Session">
        <form className="space-y-3" onSubmit={e => { e.preventDefault(); setModal({ open: false, day: null, hour: 0 }); }}>

          <Field label="Student / Batch">
            <select className={inputClass} required>
              <option value="">Select student or batch…</option>
              <optgroup label="Students">
                {students.filter(s => s.active).flatMap(s => 
                  (s.enrollments || []).filter(e => e.type === "individual").map(e => (
                    <option key={e.id} value={e.id}>{s.name} — {e.subject}</option>
                  ))
                )}
              </optgroup>
              <optgroup label="Batches">
                {batches.filter(b => b.active).map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </optgroup>
            </select>
          </Field>

          <Field label="Date">
            <input className={inputClass} type="date"
              defaultValue={modal.day ? format(modal.day, "yyyy-MM-dd") : ""}
              required />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Time">
              <input className={inputClass} type="time"
                defaultValue={`${modal.hour.toString().padStart(2,"0")}:00`} required />
            </Field>
            <Field label="End Time">
              <input className={inputClass} type="time"
                defaultValue={`${(modal.hour + 1).toString().padStart(2,"0")}:00`} required />
            </Field>
          </div>

          {/* Class Mode Toggle */}
          <Field label="Class Mode">
            <div className="flex gap-2">
              <button type="button" onClick={() => setClassMode("online")}
                className={`flex-1 py-2.5 rounded-btn text-sm font-semibold flex items-center justify-center gap-2 border transition-all ${
                  classMode === "online"
                    ? "bg-accent text-white border-accent shadow-glow"
                    : "bg-card border-border text-foreground/60 hover:border-accent/40"
                }`}>
                <Wifi size={15} /> Online
              </button>
              <button type="button" onClick={() => setClassMode("physical")}
                className={`flex-1 py-2.5 rounded-btn text-sm font-semibold flex items-center justify-center gap-2 border transition-all ${
                  classMode === "physical"
                    ? "bg-violet text-white border-violet"
                    : "bg-card border-border text-foreground/60 hover:border-violet/40"
                }`}>
                <MapPin size={15} /> Physical
              </button>
            </div>
          </Field>

          {classMode === "physical" && (
            <Field label="Location / Venue">
              <input className={inputClass} placeholder="e.g. Academy XYZ, Student home, Own home" />
            </Field>
          )}

          <Field label="Session Notes (optional)">
            <textarea className={inputClass + " !py-2 resize-none"} rows={3}
              placeholder="e.g. Covered quadratic equations, homework: ex 5–10" />
          </Field>

          <button type="submit" className={`${buttonPrimary} w-full`}>Schedule Session</button>
        </form>
      </Modal>

      {/* Session Details / Edit Modal */}
      <Modal size="lg" isOpen={!!selectedSession} onClose={() => { setSelectedSession(null); setIsEditingSession(false); }} title={isEditingSession ? "Edit Session" : "Session Details"}>
        {selectedSession && (
          isEditingSession ? (
            <form className="space-y-3" onSubmit={handleSaveEdit}>
              <Field label="Title">
                <input name="title" className={inputClass} defaultValue={selectedSession.title} required />
              </Field>
              <Field label="Date">
                <input name="date" className={inputClass} type="date" defaultValue={selectedSession.date} required />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start Time">
                  <input name="startTime" className={inputClass} type="time" defaultValue={selectedSession.startTime} required />
                </Field>
                <Field label="End Time">
                  <input name="endTime" className={inputClass} type="time" 
                    defaultValue={(() => {
                      const sh = parseInt(selectedSession.startTime.split(":")[0]);
                      const sm = parseInt(selectedSession.startTime.split(":")[1]);
                      const eh = sh + Math.floor((sm + selectedSession.durationMins) / 60);
                      const em = (sm + selectedSession.durationMins) % 60;
                      return `${eh.toString().padStart(2,"0")}:${em.toString().padStart(2,"0")}`;
                    })()} 
                    required />
                </Field>
              </div>
              <Field label="Status">
                <select name="status" className={inputClass} defaultValue={selectedSession.status}>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </select>
              </Field>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditingSession(false)} className="flex-1 py-2 rounded-btn font-semibold text-sm border border-border hover:bg-muted text-foreground">Cancel</button>
                <button type="submit" className={`${buttonPrimary} flex-1`}>Save Changes</button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-display font-bold text-foreground mb-1">{selectedSession.title}</h3>
                <div className="flex items-center gap-3 text-sm text-foreground/60 font-medium">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {format(parseISO(selectedSession.date), "EEEE, MMM d, yyyy")}</span>
                  <span>·</span>
                  <span>{selectedSession.startTime} ({selectedSession.durationMins} mins)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  selectedSession.status === 'completed' ? 'bg-success/10 text-success' : 
                  selectedSession.status === 'cancelled' ? 'bg-danger/10 text-danger' : 
                  'bg-accent/10 text-accent'
                }`}>
                  {selectedSession.status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-foreground/60 flex items-center gap-1.5">
                  {(selectedSession as any).classMode === "physical" ? <MapPin size={12}/> : <Wifi size={12}/>}
                  {(selectedSession as any).classMode || "Online"}
                </span>
              </div>

              <div className="pt-6 border-t border-border flex flex-wrap gap-3">
                <button onClick={() => setIsEditingSession(true)} className="flex items-center gap-2 px-4 py-2 rounded-btn bg-accent text-white hover:brightness-110 font-semibold text-sm transition-all shadow-glow">
                  <Edit3 size={15} /> Edit Session
                </button>
                {selectedSession.status !== 'completed' && (
                  <button 
                    onClick={() => {
                      updateSession(selectedSession.id, { status: "completed" });
                      setSelectedSession(null);
                    }} 
                    className="flex items-center gap-2 px-4 py-2 rounded-btn bg-success/10 text-success hover:bg-success hover:text-white font-semibold text-sm transition-all"
                  >
                    <CheckCircle2 size={15} /> Mark Completed
                  </button>
                )}
                <button 
                  onClick={() => {
                    cancelSession(selectedSession.id);
                    setSelectedSession(null);
                  }} 
                  className="flex items-center gap-2 px-4 py-2 rounded-btn border border-danger/30 text-danger hover:bg-danger hover:text-white font-semibold text-sm transition-all ml-auto"
                >
                  <XCircle size={15} /> Cancel Session
                </button>
              </div>
            </div>
          )
        )}
      </Modal>

    </div>
  );
}
