/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Car, Wrench, ShieldCheck, AlertTriangle, Phone, Calendar, Info, User, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { getCeeCeeResponse } from './lib/gemini';
import { cn } from './lib/utils';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hello! I'm CeeCee, your premium CARCARE concierge. How can I assist you with your vehicle today? Whether it's routine maintenance or a specific concern, I'm here to help."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const responseText = await getCeeCeeResponse([...messages, userMessage]);
    setMessages(prev => [...prev, { role: 'model', content: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#FACC15] selection:text-black">
      {/* Background Accent */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FACC15]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#22D3EE]/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto h-screen flex flex-col p-4 md:p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 bg-[#1A1A1A] border-2 border-[#FACC15] p-4 rounded-2xl shadow-[8px_8px_0px_0px_rgba(250,204,21,0.2)]">
          <div className="flex items-center gap-3">
            <div className="bg-[#FACC15] p-2 rounded-lg text-black animate-pulse">
              <Car size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic line-height-none">
                CAR<span className="text-[#FACC15]">CARE</span>
              </h1>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#FACC15] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-ping" />
                CEECEE AI CONCIERGE
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Warranty</span>
              <span className="text-sm font-bold text-[#FACC15]">6 Months Repaired</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Quality</span>
              <span className="text-sm font-bold text-[#22D3EE]">OEM Parts Only</span>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 bg-[#1A1A1A]/80 backdrop-blur-xl border-x-2 border-t-2 border-zinc-800 rounded-t-3xl overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-[#FACC15] scrollbar-track-transparent pt-10"
        >
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex gap-3 max-w-[85%] md:max-w-[75%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl flex-shrink-0 mt-1",
                  msg.role === 'user' ? "bg-zinc-800 text-zinc-400" : "bg-[#FACC15] text-black"
                )}>
                  {msg.role === 'user' ? <User size={18} /> : <MessageCircle size={18} />}
                </div>
                <div className={cn(
                  "px-5 py-3 rounded-2xl text-sm md:text-base leading-relaxed tracking-tight shadow-lg",
                  msg.role === 'user' 
                    ? "bg-zinc-800 text-zinc-100 rounded-tr-none border border-zinc-700" 
                    : "bg-[#252525] text-zinc-200 border-l-4 border-[#FACC15] rounded-tl-none"
                )}>
                  <div className="markdown-body prose prose-invert prose-sm">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 items-center text-[#FACC15]/60 italic text-sm font-medium ml-2"
              >
                <Wrench className="animate-spin" size={16} />
                CeeCee is checking the toolbox...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Quick Chips */}
        <div className="bg-[#1A1A1A]/80 backdrop-blur-xl border-x-2 border-zinc-800 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { label: "Book Oil Change", icon: Wrench },
            { label: "Brake Squeaking", icon: AlertTriangle },
            { label: "AC Not Cooling", icon: Info },
            { label: "Check Warranty", icon: ShieldCheck },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                setInput(chip.label);
                // Trigger submit after state update is tricky, opting for user-facing set value
              }}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-[#FACC15] hover:text-black transition-all text-[11px] font-bold uppercase tracking-wider border border-zinc-700 hover:border-[#FACC15]"
            >
              <chip.icon size={12} />
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div className="bg-[#1A1A1A]/80 backdrop-blur-xl border-2 border-zinc-800 rounded-b-3xl p-4 md:p-6">
          <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your car issue or service needed..."
              className="flex-1 bg-zinc-900 border-2 border-zinc-700 focus:border-[#FACC15] rounded-2xl px-5 py-4 text-sm md:text-base outline-none transition-all placeholder:text-zinc-600 font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#FACC15] text-black p-4 rounded-2xl hover:bg-[#EAB308] disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 transition-all active:scale-95 flex items-center justify-center"
            >
              <Send size={24} strokeWidth={2.5} />
            </button>
          </form>
          
          <div className="mt-4 flex items-center justify-center gap-6 text-[10px] text-zinc-500 border-t border-zinc-800 pt-4 font-bold tracking-widest">
            <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-[#FACC15]" /> 6M WARRANTY</span>
            <span className="flex items-center gap-1.5"><Car size={12} className="text-[#22D3EE]" /> MULTI-BRAND EXPERTS</span>
            <span className="flex items-center gap-1.5"><Phone size={12} className="text-red-500" /> EMERGENCY: 1-800-CARCARE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
