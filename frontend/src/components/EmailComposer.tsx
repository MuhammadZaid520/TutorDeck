import { useState } from "react";
import { Send, X, Eye, Edit2 } from "lucide-react";
import { Field, inputClass, buttonPrimary, buttonSecondary } from "./ui/Field";
import Modal from "./ui/Modal";
import { motion } from "framer-motion";

interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName?: string;
  recipientEmail?: string;
}

export default function EmailComposer({ isOpen, onClose, recipientName = "Student", recipientEmail = "" }: EmailComposerProps) {
  const [recipient, setRecipient] = useState(recipientEmail);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!recipient || !subject || !body) {
      alert("Please fill in all fields");
      return;
    }
    
    setIsSending(true);
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Email sent:", { recipient, subject, body });
    setIsSending(false);
    alert("Email sent successfully!");
    
    setRecipient("");
    setSubject("");
    setBody("");
    setPreview(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compose Email" size="lg">
      <div className="space-y-5">
        {!preview ? (
          <>
            {/* Recipient */}
            <Field label="Send to">
              <input
                className={inputClass}
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={recipientEmail || "recipient@example.com"}
              />
              {recipientName && <p className="text-xs text-gray-900/50 dark:text-white/40 mt-1">{recipientName}</p>}
            </Field>

            {/* Subject */}
            <Field label="Subject">
              <input
                className={inputClass}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
              />
            </Field>

            {/* Body */}
            <Field label="Message">
              <textarea
                className={inputClass + " resize-none h-48"}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here..."
              />
            </Field>

            {/* Character count */}
            <div className="text-xs text-gray-900/40 dark:text-white/30 text-right">
              {body.length} characters
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setPreview(true)}
                className={buttonSecondary}
              >
                <Eye size={16} />
                Preview
              </button>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-btn text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSending}
                  className={buttonPrimary}
                >
                  <Send size={16} />
                  {isSending ? "Sending..." : "Send Email"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Preview Mode */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-btn p-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-900/50 dark:text-white/40 uppercase">To:</p>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{recipient}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900/50 dark:text-white/40 uppercase">Subject:</p>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{subject}</p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-xs font-semibold text-gray-900/50 dark:text-white/40 uppercase mb-3">Message:</p>
                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {body}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setPreview(false)}
                  className={buttonSecondary}
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-btn text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={isSending}
                    className={buttonPrimary}
                  >
                    <Send size={16} />
                    {isSending ? "Sending..." : "Send Email"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </Modal>
  );
}
