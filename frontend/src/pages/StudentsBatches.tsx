import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import Modal from "../components/ui/Modal";
import { Field, inputClass, buttonPrimary } from "../components/ui/Field";
import { Search, Plus, MoreHorizontal, BookOpen, Users, ChevronRight, UserPlus } from "lucide-react";

// ─── View Toggle ──────────────────────────────────────────────────────────────

type ViewMode = "students" | "batches";

function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div className="flex gap-1 p-1 surface-card rounded-full shadow-sm w-fit">
      {(["students", "batches"] as ViewMode[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold uppercase tracking-wider transition-all ${
            mode === m
              ? "bg-accent/15 text-accent shadow-sm"
              : "text-foreground/50 hover:bg-muted hover:text-foreground/70"
          }`}
        >
          {m === "students" ? <Users size={14} /> : <BookOpen size={14} />}
          {m === "students" ? "Students" : "Batches"}
        </button>
      ))}
    </div>
  );
}

// ─── Avatar colors ────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  "bg-violet/10 text-violet",
  "bg-warning/10 text-warning",
  "bg-danger/10 text-danger",
  "bg-accent/10 text-accent",
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function StudentsBatches() {
  const { students, batches } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>("students");
  const [searchTerm, setSearchTerm] = useState("");

  // Students state
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [addStudentType, setAddStudentType] = useState<"individual" | "batch" | "both">("individual");
  const [addStudentBatchId, setAddStudentBatchId] = useState("");

  // Batches state
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [isEnrollStudentOpen, setIsEnrollStudentOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  const filteredStudents = useMemo(() => {
    return students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [students, searchTerm]);

  const filteredBatches = batches.filter(
    (b) => b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           b.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
            Students & Batches
          </h1>
          <p className="text-sm font-medium text-foreground/50 mt-1">
            {viewMode === "students"
              ? "Manage your enrolled students and their active tuitions."
              : "Manage group classes and their enrolled students."}
          </p>
        </div>
        <button 
          onClick={() => viewMode === "students" ? (setStep(1), setIsAddStudentOpen(true)) : setIsAddBatchOpen(true)}
          className={`${buttonPrimary} !py-2 !px-4 !text-[13px] !rounded-full shadow-sm shrink-0`}
        >
          <Plus size={16} strokeWidth={2.5} />
          {viewMode === "students" ? "Add Student" : "Create Batch"}
        </button>
      </div>

      {/* Toggle + Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <ViewToggle mode={viewMode} onChange={(m) => { setViewMode(m); setSearchTerm(""); }} />
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={15} />
          <input
            type="text"
            placeholder={viewMode === "students" ? "Search students..." : "Search batches..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={inputClass + " !pl-9 !py-2 !text-[13px] !rounded-full bg-card shadow-sm"}
          />
        </div>
      </div>

      {/* ──────────────── STUDENTS VIEW ──────────────── */}
      {viewMode === "students" && (
        <div className="surface-panel overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 border-b border-border bg-muted/30">
                <tr>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Active Enrollments</th>
                  <th className="px-5 py-3.5">Total Monthly Fee</th>
                  <th className="px-5 py-3.5">Fee Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStudents.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-12 text-center text-foreground/40 font-semibold text-sm">No students found.</td></tr>
                ) : (
                  filteredStudents.map((s, index) => {
                    const totalFee = (s.enrollments || []).reduce((sum, e) => sum + e.feeAmount, 0);
                    const currency = (s.enrollments || []).length > 0 ? s.enrollments[0].currency : "USD";
                    const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
                    
                    return (
                      <tr key={s.id} className="hover:bg-muted/40 even:bg-muted/10 transition-colors group">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${avatarColor}`}>
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-[13px] text-foreground">{s.name}</p>
                              <p className="text-[11px] text-foreground/50 font-medium">{s.contact.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {(!s.enrollments || s.enrollments.length === 0) && (
                              <span className="px-2 py-0.5 rounded-full bg-muted border border-border text-[10px] font-semibold text-foreground/40">
                                No Enrollments
                              </span>
                            )}
                            {(s.enrollments || []).map(e => (
                              <div key={e.id} className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                                e.type === 'batch' 
                                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' 
                                  : 'bg-violet/10 text-violet border border-violet/20'
                              }`}>
                                {e.type === 'batch' ? <Users size={10} /> : <BookOpen size={10} />}
                                {e.type === 'batch' ? batches.find(b => b.id === e.batchId)?.name || 'Batch' : `${e.subject} • Individual`}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3 font-mono font-bold text-[13px] text-foreground">
                          {totalFee > 0 ? `${currency} ${totalFee}` : '-'}
                        </td>
                        <td className="px-5 py-3">
                          {(() => {
                            if (!s.enrollments || s.enrollments.length === 0) return <span className="text-foreground/40 text-[11px] font-medium">-</span>;
                            const statuses = s.enrollments.map(e => e.status);
                            if (statuses.includes('overdue')) {
                              return <span className="px-2 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/20 text-[10px] font-bold uppercase tracking-wider">Overdue</span>;
                            } else if (statuses.includes('due')) {
                              return <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20 text-[10px] font-bold uppercase tracking-wider">Due</span>;
                            } else {
                              return <span className="px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20 text-[10px] font-bold uppercase tracking-wider">Paid</span>;
                            }
                          })()}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button className="text-foreground/30 hover:text-accent hover:bg-accent/10 w-8 h-8 rounded-full flex items-center justify-center transition-all ml-auto opacity-0 group-hover:opacity-100">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ──────────────── BATCHES VIEW ──────────────── */}
      {viewMode === "batches" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredBatches.length === 0 ? (
            <div className="col-span-full surface-panel p-10 text-center">
              <p className="text-foreground/40 font-medium">No batches found.</p>
            </div>
          ) : (
            filteredBatches.map((batch) => {
              const batchStudents = students.filter(s => 
                (s.enrollments || []).some(e => e.type === 'batch' && e.batchId === batch.id)
              );
              const enrolledCount = batchStudents.length;
              const revenue = enrolledCount * batch.feePerStudent;
              const isExpanded = expandedBatch === batch.id;
              
              return (
                <div key={batch.id} className="surface-card p-6 flex flex-col hover:-translate-y-1 hover:shadow-soft transition-all duration-200">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="text-lg font-display font-bold text-foreground leading-tight">{batch.name}</h3>
                      <p className="text-sm text-foreground/50 mt-1">{batch.subject} · {batch.level}</p>
                    </div>
                    <button className="text-foreground/30 hover:text-foreground w-8 h-8 rounded-btn flex items-center justify-center hover:bg-muted transition-all">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex items-center gap-2 text-sm">
                      <Users size={15} className="text-foreground/40" />
                      <span className="font-semibold text-foreground">{enrolledCount}</span>
                    </div>
                    <div className="text-sm font-mono font-semibold text-foreground/60">{batch.currency} {revenue}/mo</div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-[10px] font-semibold text-foreground/40 mb-2.5 uppercase tracking-wider">Schedule</p>
                    <div className="flex flex-wrap gap-2">
                      {batch.schedule.map((sch, i) => (
                        <div key={i} className="text-xs bg-muted text-foreground/70 font-semibold px-3 py-1.5 rounded-md border border-border">
                          {sch.day.substring(0,3)} {sch.startTime}–{sch.endTime}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <button 
                      onClick={() => setExpandedBatch(isExpanded ? null : batch.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
                    >
                      <ChevronRight size={14} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      {isExpanded ? 'Hide students' : 'View students'}
                    </button>
                    
                    <button 
                      onClick={() => { setSelectedBatchId(batch.id); setIsEnrollStudentOpen(true); }}
                      className="flex items-center gap-1 text-xs font-semibold text-foreground/60 hover:text-foreground transition-colors px-2 py-1 bg-muted rounded-md"
                    >
                      <UserPlus size={13} /> Add
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-2 pt-3 border-t border-border">
                      {batchStudents.length === 0 ? (
                        <p className="text-xs text-foreground/40 py-2">No students enrolled yet.</p>
                      ) : (
                        batchStudents.map(s => (
                          <div key={s.id} className="flex items-center gap-3 py-1.5 px-2 hover:bg-muted/50 rounded-md transition-colors">
                            <div className="w-7 h-7 rounded-md bg-accent/10 text-accent flex items-center justify-center font-bold text-xs">
                              {s.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-foreground">{s.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ──────────────── MODALS ──────────────── */}

      {/* Add Student Flow Modal */}
      <Modal isOpen={isAddStudentOpen} onClose={() => setIsAddStudentOpen(false)} title="Enroll New Student">
        {step === 1 ? (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
            <div className="space-y-3">
              <h3 className="text-[13px] font-bold text-foreground border-b border-border pb-2">1. Student Details</h3>
              <Field label="Full Name"><input className={inputClass} placeholder="John Doe" required /></Field>
              <Field label="Email Address"><input type="email" className={inputClass} placeholder="john@example.com" required /></Field>
              <Field label="Timezone">
                <select className={inputClass} defaultValue="Europe/London">
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Asia/Dubai">Dubai (GST)</option>
                  <option value="Asia/Karachi">Karachi (PKT)</option>
                </select>
              </Field>
            </div>
            <button type="submit" className={`${buttonPrimary} w-full !mt-5 hover:scale-[1.02] transition-transform`}>Continue to Enrollment</button>
          </form>
        ) : (
          <form className="space-y-4 animate-in fade-in slide-in-from-right-4" onSubmit={(e) => { e.preventDefault(); setIsAddStudentOpen(false); }}>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="text-[13px] font-bold text-foreground">2. Select Tuitions</h3>
                <button type="button" onClick={() => setStep(1)} className="text-[11px] font-bold text-accent hover:underline">Back</button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {(['individual', 'batch', 'both'] as const).map(type => (
                  <button 
                    key={type}
                    type="button"
                    onClick={() => setAddStudentType(type)}
                    className={`py-2 text-[11px] font-bold rounded-full transition-colors border ${addStudentType === type ? "bg-accent/15 border-accent/30 text-accent shadow-sm" : "border-border text-foreground/50 hover:bg-muted"}`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              {(addStudentType === "batch" || addStudentType === "both") && (
                <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-3">
                  <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Batch Enrollment</p>
                  <Field label="Select Batch">
                    <select className={inputClass} required value={addStudentBatchId} onChange={(e) => setAddStudentBatchId(e.target.value)}>
                      <option value="" disabled>Select a batch...</option>
                      {batches.map(b => (
                        <option key={b.id} value={b.id}>{b.name} ({b.subject})</option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}

              {(addStudentType === "individual" || addStudentType === "both") && (
                <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-3">
                  <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Individual Enrollment</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Subject"><input className={inputClass} placeholder="Mathematics" required /></Field>
                    <Field label="Level"><input className={inputClass} placeholder="O Level" required /></Field>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Monthly Fee"><input className={inputClass} type="number" placeholder="5000" required /></Field>
                    <Field label="Currency">
                      <select className={inputClass} defaultValue="USD"><option value="USD">USD</option><option value="GBP">GBP</option><option value="PKR">PKR</option></select>
                    </Field>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className={`${buttonPrimary} w-full !mt-5 hover:scale-[1.02] transition-transform`}>Complete Enrollment</button>
          </form>
        )}
      </Modal>

      {/* Add Batch Modal */}
      <Modal isOpen={isAddBatchOpen} onClose={() => setIsAddBatchOpen(false)} title="Create New Batch">
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsAddBatchOpen(false); }}>
          <Field label="Batch Name"><input className={inputClass} placeholder="A Level Math 2026" required /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Subject"><input className={inputClass} placeholder="Mathematics" required /></Field>
            <Field label="Level"><input className={inputClass} placeholder="A Level" required /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Fee Per Student"><input className={inputClass} type="number" placeholder="4000" required /></Field>
            <Field label="Currency">
              <select className={inputClass} defaultValue="USD"><option value="USD">USD</option><option value="GBP">GBP</option><option value="PKR">PKR</option></select>
            </Field>
          </div>
          <button type="submit" className={`${buttonPrimary} w-full !mt-6 hover:scale-[1.02] transition-transform`}>Create Batch</button>
        </form>
      </Modal>

      {/* Quick Enroll Modal */}
      <Modal isOpen={isEnrollStudentOpen} onClose={() => setIsEnrollStudentOpen(false)} title="Enroll Student in Batch">
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsEnrollStudentOpen(false); }}>
          <p className="text-sm text-foreground/60">Search for an existing student or create a new one to immediately add them to this batch.</p>
          <Field label="Select Student">
            <select className={inputClass} required defaultValue="">
              <option value="" disabled>Select an existing student...</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.contact.email})</option>
              ))}
            </select>
          </Field>
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-semibold text-foreground/40 uppercase">or add new</span>
            <div className="flex-grow border-t border-border"></div>
          </div>
          <Field label="Full Name"><input className={inputClass} placeholder="New Student Name" /></Field>
          <Field label="Email"><input type="email" className={inputClass} placeholder="student@example.com" /></Field>
          <button type="submit" className={`${buttonPrimary} w-full !mt-6 hover:scale-[1.02] transition-transform`}>Enroll Student</button>
        </form>
      </Modal>

    </div>
  );
}
