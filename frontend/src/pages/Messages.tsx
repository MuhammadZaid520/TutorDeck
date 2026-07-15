import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Send, ChevronDown, CheckCircle2 } from "lucide-react";

import { useLocation } from "react-router-dom";

type TemplateType = "custom" | "fee_reminder" | "class_reschedule" | "batch_induction";

export default function Messages() {
  const { students } = useApp();
  const location = useLocation();
  
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(location.state?.template || "fee_reminder");
  const [recipient, setRecipient] = useState(location.state?.recipient || "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSent, setIsSent] = useState(false);

  // Auto-generate draft based on template selection
  useEffect(() => {
    switch (selectedTemplate) {
      case "fee_reminder":
        setSubject("Action Required: Outstanding Fee Reminder");
        setBody("Dear [Parent/Student Name],\n\nThis is a gentle reminder that the tuition fee for the current month is now due. Please process the payment at your earliest convenience to ensure uninterrupted access to our sessions.\n\nAmount Due: [Amount]\nDue Date: [Date]\n\nIf you have already made the payment, kindly ignore this email.\n\nBest regards,\nTutorDeck Support");
        break;
      case "class_reschedule":
        setSubject("Notice: Upcoming Class Rescheduled");
        setBody("Dear [Parent/Student Name],\n\nPlease be advised that your upcoming session on [Original Date/Time] has been rescheduled. \n\nNew Date & Time: [New Date/Time]\nReason: [Optional Reason]\n\nWe apologize for any inconvenience this may cause. Please confirm receipt of this email.\n\nBest regards,\nYour Tutor");
        break;
      case "batch_induction":
        setSubject("Welcome! Induction to New Batch");
        setBody("Dear [Parent/Student Name],\n\nWe are thrilled to welcome you to the [Batch Name]! \n\nYour classes will commence on [Start Date]. Please find attached the curriculum and general guidelines for our sessions.\n\nLooking forward to a great learning journey together.\n\nBest regards,\nYour Tutor");
        break;
      case "custom":
      default:
        setSubject("");
        setBody("");
        break;
    }
  }, [selectedTemplate]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !subject || !body) return;
    
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setRecipient("");
      setSelectedTemplate("custom");
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
            Messages
          </h1>
          <p className="text-sm font-medium text-foreground/50 mt-1">
            Send automated emails to students or parents directly from your workspace.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Panel: Template Selection */}
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="surface-panel p-5">
            <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Mail size={16} className="text-accent" /> Email Templates
            </h2>
            <div className="space-y-2">
              {[
                { id: "fee_reminder", label: "Fee Reminder", desc: "Send an outstanding balance notice" },
                { id: "class_reschedule", label: "Class Rescheduling", desc: "Notify about a changed schedule" },
                { id: "batch_induction", label: "Batch Induction", desc: "Welcome a student to a new batch" },
                { id: "custom", label: "Custom Email", desc: "Start from a blank slate" }
              ].map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id as TemplateType)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedTemplate === tpl.id 
                      ? "bg-accent/10 border-accent/30 shadow-sm" 
                      : "bg-card border-border hover:bg-muted"
                  }`}
                >
                  <p className={`text-sm font-bold ${selectedTemplate === tpl.id ? "text-accent" : "text-foreground"}`}>
                    {tpl.label}
                  </p>
                  <p className="text-xs text-foreground/50 mt-1">{tpl.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Compose & Send */}
        <div className="w-full lg:w-2/3">
          <div className="surface-panel p-6 relative">
            
            {isSent && (
              <div className="absolute inset-0 bg-white/80 dark:bg-navy-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl animate-in fade-in">
                <CheckCircle2 size={48} className="text-success mb-4" />
                <h3 className="text-xl font-bold text-foreground">Email Sent!</h3>
                <p className="text-sm text-foreground/50 mt-2">Your message has been delivered to the recipient.</p>
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-5">
              
              {/* Recipient */}
              <div>
                <label className="block text-sm font-semibold text-foreground/70 mb-1.5">Recipient</label>
                <div className="relative">
                  <select
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                    className="w-full h-11 pl-4 pr-10 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>Select a student or parent email...</option>
                    {students.filter(s => s.contact.email).map(s => (
                      <option key={s.id} value={s.contact.email}>
                        {s.name} ({s.contact.email})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-foreground/70 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder="Email subject..."
                  className="w-full h-11 px-4 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                />
              </div>

              {/* Body */}
              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <label className="block text-sm font-semibold text-foreground/70">Message Body</label>
                  <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    Editable Draft
                  </span>
                </div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  rows={12}
                  className="w-full p-4 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all resize-none custom-scrollbar leading-relaxed"
                />
                <p className="text-xs text-foreground/40 mt-2 font-medium">
                  Tip: Replace bracketed text like [Parent/Student Name] with actual details before sending.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 bg-accent flex items-center gap-2"
                >
                  <Send size={16} /> Send Email
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
