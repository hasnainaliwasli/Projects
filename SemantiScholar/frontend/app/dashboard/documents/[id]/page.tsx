"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import {
  ChevronLeft, Highlighter, Trash2, X,
  PanelLeftClose, PanelLeft, Loader2,
  StickyNote, BookOpen,
} from "lucide-react";
import { Container } from "@/components/ui";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

/* ── CSS fix for text layer interactivity ───────────── */
const textLayerStyles = `
  .react-pdf__Page__textContent {
    z-index: 2 !important;
    pointer-events: auto !important;
    user-select: text !important;
  }
  .react-pdf__Page__textContent span {
    pointer-events: auto !important;
    user-select: text !important;
  }
  .react-pdf__Page__textContent span[data-hid] {
    border-radius: 2px;
    transition: background-color 0.2s;
  }
`;

/* ── Types ──────────────────────────────────────────── */
interface Highlight {
  _id: string;
  selectedText: string;
  startOffset: number;
  endOffset: number;
  heading: string;
  note: string;
  color: string;
  pageNumber: number;
}

const COLORS = [
  { name: "Yellow", value: "#FBBF24" },
  { name: "Green",  value: "#34D399" },
  { name: "Blue",   value: "#60A5FA" },
  { name: "Pink",   value: "#F472B6" },
  { name: "Purple", value: "#A78BFA" },
];

/* ── Page ───────────────────────────────────────────── */
export default function DocumentViewerPage() {
  const params = useParams();
  const router = useRouter();
  const paperId = params.id as string;
  const qc = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(800);
  const [showPanel, setShowPanel] = useState(false);

  const [popup, setPopup] = useState<{
    x: number; y: number; text: string; pageNumber: number;
  } | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [heading, setHeading] = useState("");
  const [note, setNote] = useState("");
  const [color, setColor] = useState(COLORS[0].value);

  /* ── Data ────────────────────────────────────────── */
  const { data: paper, isLoading } = useQuery({
    queryKey: ["paper-view", paperId],
    queryFn: async () => (await api.get(`/papers/${paperId}`)).data.data,
  });

  const pdfFile = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const token = localStorage.getItem("token") || "";
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    return { url: `${base}/papers/${paperId}/file`, httpHeaders: { Authorization: `Bearer ${token}` } };
  }, [paperId]);

  const addMut = useMutation({
    mutationFn: (b: any) => api.post(`/papers/${paperId}/highlights`, b),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["paper-view", paperId] }); toast.success("Highlight saved"); resetPopup(); },
    onError: () => toast.error("Failed to save highlight"),
  });
  const delMut = useMutation({
    mutationFn: (hId: string) => api.delete(`/papers/${paperId}/highlights/${hId}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["paper-view", paperId] }); toast.success("Highlight removed"); },
    onError: () => toast.error("Failed to delete"),
  });

  /* ── Responsive width ────────────────────────────── */
  useEffect(() => {
    const update = () => { if (wrapRef.current) setPageWidth(wrapRef.current.clientWidth - 48); };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [showPanel]);

  /* ── Apply visual highlights to text layer ────────── */
  const applyHighlights = useCallback(() => {
    if (!paper?.highlights?.length) return;
    const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
    const pages = document.querySelectorAll('.react-pdf__Page');
    pages.forEach((page) => {
      const pageNum = parseInt(page.getAttribute('data-page-number') || '0', 10);
      const textLayer = page.querySelector('.react-pdf__Page__textContent');
      if (!textLayer) return;
      const spans = Array.from(textLayer.querySelectorAll('span'));
      // Reset
      spans.forEach((s) => { (s as HTMLElement).style.backgroundColor = ''; s.removeAttribute('data-hid'); });
      // Build text map with spaces between spans
      const rawTexts = spans.map((s) => s.textContent || '');
      const fullRaw = rawTexts.join(' ');
      const fullNorm = norm(fullRaw);
      // For each highlight on this page (or all pages if pageNumber=0)
      for (const h of paper.highlights as Highlight[]) {
        if (h.pageNumber > 0 && h.pageNumber !== pageNum) continue;
        const searchNorm = norm(h.selectedText);
        if (!searchNorm) continue;
        let nIdx = fullNorm.indexOf(searchNorm);
        if (nIdx === -1) continue;
        // Map normalized index back to raw text spans
        let rawPos = 0;
        let normPos = 0;
        const startSpans: number[] = [];
        for (let si = 0; si < spans.length; si++) {
          const raw = rawTexts[si];
          const segStart = normPos;
          const segNorm = norm(raw);
          const segEnd = normPos + segNorm.length;
          // Account for the space between spans
          if (si > 0) normPos += 1; // space separator
          normPos = segStart + (si > 0 ? 1 : 0);
          // Recalculate
        }
        // Simpler approach: mark spans whose text appears in the highlighted region
        let charCount = 0;
        for (let si = 0; si < spans.length; si++) {
          const t = rawTexts[si];
          const spanStart = charCount;
          const spanEnd = charCount + t.length + (si > 0 ? 1 : 0);
          if (spanEnd > nIdx && spanStart < nIdx + searchNorm.length + spans.length) {
            // Check if this span's text is part of the highlight
            if (searchNorm.includes(norm(t)) && norm(t).length > 0) {
              (spans[si] as HTMLElement).style.backgroundColor = h.color + '40';
              spans[si].setAttribute('data-hid', h._id);
            }
          }
          charCount = spanEnd;
        }
      }
    });
  }, [paper]);

  // Re-apply highlights every time a page finishes rendering
  const handlePageRender = useCallback(() => {
    if (paper?.highlights?.length) {
      setTimeout(applyHighlights, 200);
    }
  }, [applyHighlights, paper]);

  // Also apply when paper data loads/changes
  useEffect(() => {
    if (numPages > 0 && paper?.highlights?.length) {
      const t1 = setTimeout(applyHighlights, 500);
      const t2 = setTimeout(applyHighlights, 1500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [numPages, paper, applyHighlights]);

  /* ── Selection ───────────────────────────────────── */
  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !scrollRef.current) return;
    const t = sel.toString().trim();
    if (!t || t.length < 2) return;
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const cRect = scrollRef.current.getBoundingClientRect();
    // Detect page number
    const ancestor = range.commonAncestorContainer instanceof HTMLElement
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentElement;
    const pageEl = ancestor?.closest('.react-pdf__Page');
    const pageNum = parseInt(pageEl?.getAttribute('data-page-number') || '0', 10);
    setPopup({
      x: rect.left - cRect.left + rect.width / 2,
      y: rect.top - cRect.top + scrollRef.current.scrollTop - 12,
      text: t,
      pageNumber: pageNum,
    });
    setFormOpen(false);
  }, []);

  const resetPopup = () => { setPopup(null); setFormOpen(false); setHeading(""); setNote(""); setColor(COLORS[0].value); window.getSelection()?.removeAllRanges(); };

  const handleSave = () => {
    if (!popup || !paper) return;
    const idx = (paper.extractedText || "").indexOf(popup.text);
    addMut.mutate({
      selectedText: popup.text,
      startOffset: idx >= 0 ? idx : 0,
      endOffset: idx >= 0 ? idx + popup.text.length : 0,
      heading, note, color,
      pageNumber: popup.pageNumber,
    });
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-popup]")) return;
      if (popup && !formOpen) resetPopup();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [popup, formOpen]);

  const scrollToHighlight = (hId: string) => {
    const tryScroll = (attempt = 0) => {
      // Try data-hid first
      const el = document.querySelector(`[data-hid="${hId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const prev = (el as HTMLElement).style.backgroundColor;
        (el as HTMLElement).style.backgroundColor = '#FBBF2480';
        setTimeout(() => { (el as HTMLElement).style.backgroundColor = prev; }, 1500);
        return;
      }
      // Fallback: scroll to the page where the highlight was made
      const h = (paper?.highlights as Highlight[])?.find((x) => x._id === hId);
      if (!h) return;
      if (h.pageNumber > 0) {
        const pageEl = document.querySelector(`.react-pdf__Page[data-page-number="${h.pageNumber}"]`);
        if (pageEl) {
          pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Retry once more to find the exact span after scrolling
          if (attempt < 2) setTimeout(() => tryScroll(attempt + 1), 600);
          return;
        }
      }
      // Retry if elements aren't ready yet
      if (attempt < 3) setTimeout(() => tryScroll(attempt + 1), 400);
    };
    tryScroll();
  };

  /* ── Render ──────────────────────────────────────── */
  if (isLoading) return <Container size="xl" className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-primary-500" /></Container>;
  if (!paper) return <Container size="xl" className="py-12 text-center"><h1 className="text-2xl font-bold mb-4">Document not found</h1><Link href="/dashboard/documents" className="text-primary-500 hover:underline">Back</Link></Container>;

  const highlights: Highlight[] = paper.highlights || [];

  /* ── Highlights Panel (shared markup) ────────────── */
  const panelContent = (onClose?: () => void) => (
    <>
      <div className="p-3 border-b border-surface-200 dark:border-surface-800 flex items-center gap-2">
        <button onClick={onClose || (() => setShowPanel(false))} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 transition-colors" title="Close panel">
          <X size={16} />
        </button>
        <Highlighter size={14} className="text-primary-500" />
        <h2 className="text-xs font-semibold">Highlights</h2>
        <span className="ml-auto text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 px-1.5 py-0.5 rounded-full font-medium">{highlights.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {highlights.length === 0 ? (
          <div className="text-center py-12 px-4">
            <StickyNote size={32} className="mx-auto text-surface-300 dark:text-surface-600 mb-3" />
            <p className="text-sm text-surface-400">No highlights yet</p>
            <p className="text-xs text-surface-400 mt-1">Select text in the PDF to add highlights</p>
          </div>
        ) : highlights.map((h) => (
          <button key={h._id} onClick={() => { scrollToHighlight(h._id); onClose?.(); }}
            className="w-full text-left group rounded-xl p-3 border border-surface-200 dark:border-surface-800 bg-white dark:bg-dark-card hover:border-primary-300 dark:hover:border-primary-800 transition-all">
            <div className="flex items-start gap-2">
              <span className="mt-1 shrink-0 w-3 h-3 rounded-full" style={{ background: h.color }} />
              <div className="flex-1 min-w-0">
                {h.heading && <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">{h.heading}</p>}
                <p className="text-xs text-surface-500 line-clamp-2 mt-0.5 italic">&ldquo;{h.selectedText.length > 80 ? h.selectedText.slice(0, 80) + "…" : h.selectedText}&rdquo;</p>
                {h.note && <p className="text-xs text-surface-600 dark:text-surface-400 mt-1.5 line-clamp-2">{h.note}</p>}
              </div>
              <button onClick={(e) => { e.stopPropagation(); delMut.mutate(h._id); }}
                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Text layer CSS */}
      <style>{textLayerStyles}</style>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-surface-200 dark:border-dark-border bg-white dark:bg-dark-card shrink-0">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-surface-500"><ChevronLeft size={20} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold truncate">{paper.fileName}</h1>
          <p className="text-xs text-surface-400">{highlights.length} highlights · {numPages} pages</p>
        </div>
        <button onClick={() => setShowPanel((p) => !p)} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-surface-500">
          {showPanel ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Panel */}
        <AnimatePresence>
          {showPanel && (
            <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 260, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.25 }}
              className="shrink-0 overflow-hidden border-r border-surface-200 dark:border-dark-border bg-surface-50 dark:bg-surface-900/30 hidden lg:flex flex-col">
              {panelContent()}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {showPanel && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setShowPanel(false)} />
              <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-80 z-50 bg-white dark:bg-dark-card border-r border-surface-200 dark:border-dark-border flex flex-col lg:hidden">
                {panelContent(() => setShowPanel(false))}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* PDF Viewer */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto bg-surface-100 dark:bg-surface-900/50 relative" onMouseUp={handleMouseUp}>
          <div ref={wrapRef} className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            <Document
              file={pdfFile}
              onLoadSuccess={({ numPages: n }) => setNumPages(n)}
              loading={<div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary-500" /></div>}
              error={
                <div className="text-center py-16 text-surface-500">
                  <BookOpen size={40} className="mx-auto mb-4 text-surface-300" />
                  <p className="font-medium">Could not load PDF</p>
                  <p className="text-sm mt-1">The file may have been uploaded before PDF storage was enabled.</p>
                </div>
              }
            >
              {Array.from({ length: numPages }, (_, i) => (
                <div key={i} className="mb-6 shadow-xl rounded-lg overflow-hidden bg-white dark:bg-white mx-auto" style={{ width: "fit-content" }}>
                  <Page
                    pageNumber={i + 1}
                    width={Math.min(pageWidth, 900)}
                    renderTextLayer
                    renderAnnotationLayer={false}
                    onRenderSuccess={handlePageRender}
                  />
                </div>
              ))}
            </Document>
          </div>

          {/* Selection Popup */}
          <AnimatePresence>
            {popup && (
              <motion.div data-popup="true" initial={{ opacity: 0, y: 6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.95 }}
                className="absolute z-30" style={{ left: popup.x, top: popup.y, transform: "translate(-50%, -100%)" }}>
                {!formOpen ? (
                  <button onClick={() => setFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 rounded-xl shadow-xl text-sm font-medium hover:scale-105 transition-transform">
                    <Highlighter size={14} /> Highlight
                  </button>
                ) : (
                  <div className="w-72 sm:w-80 bg-white dark:bg-dark-card border border-surface-200 dark:border-dark-border rounded-2xl shadow-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-surface-500">Color:</span>
                      {COLORS.map((c) => (
                        <button key={c.value} onClick={() => setColor(c.value)}
                          className={`w-6 h-6 rounded-full transition-all ${color === c.value ? "ring-2 ring-offset-2 ring-surface-400 dark:ring-offset-dark-card scale-110" : "hover:scale-110"}`}
                          style={{ background: c.value }} title={c.name} />
                      ))}
                    </div>
                    <input value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="Heading (optional)"
                      className="w-full h-9 rounded-lg border border-surface-200 bg-surface-50 px-3 text-sm outline-none focus:border-primary-400 dark:border-dark-border dark:bg-surface-800 transition-colors" />
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." rows={2}
                      className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm outline-none resize-none focus:border-primary-400 dark:border-dark-border dark:bg-surface-800 transition-colors" />
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={resetPopup} className="px-3 py-1.5 text-xs font-medium text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors">Cancel</button>
                      <button onClick={handleSave} disabled={addMut.isPending}
                        className="px-4 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors disabled:opacity-50">
                        {addMut.isPending ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
