import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto custom-scrollbar">
            {/* Backdrop */}
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-navy-950/60 dark:bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="min-h-screen grid place-items-center p-4 sm:p-6 md:pl-72">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`surface-panel w-full ${widths[size]} relative z-10 flex flex-col shadow-xl`}
            >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border dark:border-navy-border shrink-0">
              <h2 className="text-base font-display font-bold text-navy-900 dark:text-white">{title}</h2>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-btn text-navy-900/30 dark:text-white/25 hover:bg-surface-muted dark:hover:bg-navy-800 hover:text-navy-900 dark:hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            {/* Body */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
