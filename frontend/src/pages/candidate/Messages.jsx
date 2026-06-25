import { Mail } from 'lucide-react';

export default function CandidateMessages() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6 text-center max-w-2xl mx-auto py-12">
      <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-650 mx-auto">
        <Mail size={28} />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-black text-slate-800">Support Inbox & Messages</h2>
        <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto">
          Any direct messages, selection emails, or support requests from the Even Cargo operations team will appear here. Currently, your inbox is empty.
        </p>
      </div>
    </div>
  );
}
