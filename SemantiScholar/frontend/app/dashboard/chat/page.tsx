"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Sparkles, Bot, Loader2, FileText, Search, AlignLeft } from "lucide-react";
import { Container, Button } from "@/components/ui";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  sources?: string[];
  timestamp: Date;
}

export default function ChatPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"search" | "summary">("search");
  
  // Search State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: `Hello ${user?.name || ""}! I'm your AI Research Assistant. Ask me anything about the documents you've uploaded.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Summary State
  const [summaryText, setSummaryText] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Shared State
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedPaperId, setSelectedPaperId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");
        setProjects(response.data.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const scrollToBottom = () => {
    if (activeTab === "search") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, activeTab]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    if (!selectedPaperId) {
      toast.error("Please select a Project and PDF first.");
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await api.post("/ai/query", { 
        query: userMsg.content,
        paperId: selectedPaperId
      });
      const { answer, sources } = response.data.data;

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: answer,
        sources: sources,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to get AI response");
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedPaperId) {
      toast.error("Please select a Project and PDF first.");
      return;
    }

    setIsSummarizing(true);
    setSummaryText("");

    try {
      const response = await api.post("/ai/summary", { 
        paperId: selectedPaperId
      });
      setSummaryText(response.data.data.summary);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to generate summary");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Shared Selectors Component
  const Selectors = (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          value={selectedProjectId}
          onChange={(e) => {
            setSelectedProjectId(e.target.value);
            setSelectedPaperId("");
          }}
          className="appearance-none pl-3 pr-7 py-1.5 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded-lg text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all cursor-pointer text-surface-900 dark:text-surface-100"
        >
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-surface-500">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      <div className="relative">
        <select
          value={selectedPaperId}
          onChange={(e) => setSelectedPaperId(e.target.value)}
          disabled={!selectedProjectId}
          className="appearance-none pl-3 pr-7 py-1.5 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded-lg text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-surface-900 dark:text-surface-100"
        >
          <option value="">Select PDF</option>
          {projects.find(p => p._id === selectedProjectId)?.papers?.map((paper: any) => (
            <option key={paper._id} value={paper._id}>{paper.fileName}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-surface-500">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
    </div>
  );

  return (
    <Container size="lg" className="!p-0 h-[calc(100vh-8rem)] flex flex-col pt-1 pb-0">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-3 flex-wrap px-1">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-primary-500" />
          <h1 className="text-lg font-bold tracking-tight">AI Assistant</h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-surface-100 dark:bg-surface-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === "search" ? "bg-white dark:bg-surface-700 shadow-sm text-surface-900 dark:text-surface-100" : "text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"}`}
          >
            <Search size={14} /> Semantic Search
          </button>
          <button
            onClick={() => setActiveTab("summary")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === "summary" ? "bg-white dark:bg-surface-700 shadow-sm text-surface-900 dark:text-surface-100" : "text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"}`}
          >
            <AlignLeft size={14} /> Summary
          </button>
        </div>

        {/* Desktop Selectors */}
        <div className="hidden sm:block">
          {Selectors}
        </div>
      </div>
      
      {/* Mobile Selectors */}
      <div className="sm:hidden mb-3 px-1">
        {Selectors}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-dark-card border border-surface-200 dark:border-dark-border rounded-xl shadow-sm overflow-hidden relative">
        
        {activeTab === "search" ? (
          <>
            {/* Search Tab Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div className={`flex shrink-0 h-10 w-10 rounded-full items-center justify-center shadow-sm ${
                      msg.role === "user" 
                        ? "bg-gradient-to-br from-primary-500 to-accent-500 text-white"
                        : "bg-gradient-to-br from-surface-800 to-surface-900 text-surface-50 dark:from-surface-100 dark:to-surface-200 dark:text-surface-900"
                    }`}>
                      {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
                    </div>

                    {/* Bubble */}
                    <div className={`flex flex-col max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-primary-600 text-white rounded-tr-sm shadow-sm"
                          : "bg-surface-100 text-surface-900 dark:bg-surface-800/50 dark:text-surface-100 rounded-tl-sm border border-surface-200 dark:border-surface-700/50"
                      }`}>
                        {msg.content}
                      </div>
                      
                      {/* Sources Tag */}
                      {msg.role === "ai" && msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="text-xs font-medium text-surface-500">Sources:</span>
                          {msg.sources.map((src, i) => (
                            <div key={i} className="flex items-center gap-1 text-[10px] bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 px-2 py-0.5 rounded-full border border-primary-100 dark:border-primary-800">
                              <FileText size={10} />
                              {src}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <span className="mt-1.5 text-[10px] font-medium text-surface-400 uppercase tracking-wider">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 flex-row"
                >
                  <div className="flex shrink-0 h-10 w-10 rounded-full items-center justify-center shadow-sm bg-gradient-to-br from-surface-800 to-surface-900 text-surface-50 dark:from-surface-100 dark:to-surface-200 dark:text-surface-900">
                    <Bot size={20} />
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="px-5 py-4 rounded-2xl bg-surface-100 dark:bg-surface-800/50 rounded-tl-sm border border-surface-200 dark:border-surface-700/50 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-2 py-2 bg-surface-50 dark:bg-dark-card border-t border-surface-200 dark:border-dark-border">
              <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
                <div className="relative flex-1">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about your research papers..."
                    className="w-full min-h-[44px] max-h-32 resize-none rounded-xl border border-surface-300 bg-white dark:bg-surface-800/80 pl-4 pr-4 py-3 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-surface-700 dark:text-surface-100 outline-none transition-all"
                    rows={1}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="flex shrink-0 h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm transition-all hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow focus-ring"
                >
                  {isTyping ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} className="ml-0.5" />}
                </button>
              </div>
              <p className="text-center text-[10px] text-surface-400 mt-1">AI can make mistakes. Verify important information against your source documents.</p>
            </div>
          </>
        ) : (
          /* Summary Tab Content */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col bg-surface-50/50 dark:bg-dark-card/50">
            <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">Document Summary</h2>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Generate a comprehensive summary of your selected document.</p>
                </div>
                <Button 
                  onClick={handleGenerateSummary} 
                  disabled={isSummarizing || !selectedPaperId}
                  className="gap-2 shrink-0"
                >
                  {isSummarizing ? <Loader2 size={16} className="animate-spin" /> : <AlignLeft size={16} />}
                  {isSummarizing ? "Summarizing..." : "Generate Summary"}
                </Button>
              </div>

              <div className="flex-1 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 shadow-sm overflow-hidden relative">
                {isSummarizing ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm z-10">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-primary-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                      <Loader2 size={48} className="text-primary-500 animate-spin relative z-10" />
                    </div>
                    <p className="text-surface-600 dark:text-surface-300 font-medium animate-pulse">Analyzing document structure & extracting insights...</p>
                    <p className="mt-2 text-xs text-surface-400">This may take a few moments depending on the document length.</p>
                  </div>
                ) : summaryText ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-surface-700 dark:text-surface-300 whitespace-pre-wrap">
                    {summaryText}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-surface-400">
                    <div className="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
                      <FileText size={32} className="text-surface-300 dark:text-surface-600" />
                    </div>
                    <p className="text-base font-medium text-surface-500 dark:text-surface-400">No summary generated yet</p>
                    <p className="text-sm mt-1 max-w-sm">Select a project and PDF from the dropdowns above, then click &quot;Generate Summary&quot;.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
