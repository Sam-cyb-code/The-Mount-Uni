import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ChevronRight, Pause, Play, X, Bell } from 'lucide-react';
import { EMERGENCY_NOTICES } from '../data/navigationData';
import { EmergencyNotice } from '../types/navigation';
import { db, collection, onSnapshot } from '../lib/firebase';

interface EmergencyTickerProps {
  notices?: EmergencyNotice[];
  onNoticeClick?: (notice: EmergencyNotice) => void;
}

export const EmergencyTicker: React.FC<EmergencyTickerProps> = ({
  notices: propNotices,
  onNoticeClick,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeNoticeModal, setActiveNoticeModal] = useState<EmergencyNotice | null>(null);
  const [liveNotices, setLiveNotices] = useState<EmergencyNotice[]>(propNotices || EMERGENCY_NOTICES);

  // Subscribe to live Firestore announcements collection
  useEffect(() => {
    if (propNotices && propNotices.length > 0) {
      setLiveNotices(propNotices);
      return;
    }

    try {
      const unsubscribe = onSnapshot(
        collection(db, 'announcements'),
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched: EmergencyNotice[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              fetched.push({
                id: doc.id,
                priority: data.priority || 'announcement',
                badge: data.badge || 'Notice',
                text: data.text || '',
                actionLabel: data.actionLabel || '',
                actionHref: data.actionHref || '',
              });
            });
            setLiveNotices(fetched);
          } else {
            setLiveNotices(EMERGENCY_NOTICES);
          }
        },
        (error) => {
          console.warn('Emergency ticker Firestore listener fallback:', error);
          setLiveNotices(EMERGENCY_NOTICES);
        }
      );

      return () => unsubscribe();
    } catch {
      setLiveNotices(EMERGENCY_NOTICES);
    }
  }, [propNotices]);

  if (isDismissed || liveNotices.length === 0) {
    return null;
  }

  // Double the notices array for a seamless loop
  const tickerItems = [...liveNotices, ...liveNotices, ...liveNotices];

  return (
    <>
      <div
        role="region"
        aria-label="Campus Announcements and Emergency Ticker"
        className="relative z-40 bg-stone-900 border-b border-stone-800 text-stone-200 text-xs tracking-wide overflow-hidden transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 py-2">
          {/* Static Alert Pill/Label */}
          <div className="flex items-center gap-2 pr-3 sm:pr-4 shrink-0 bg-stone-900 z-10 border-r border-stone-800">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Notice
            </span>
            <span className="hidden md:inline text-stone-400 text-[11px] font-medium uppercase tracking-widest">
              The Mount Uni Dispatch
            </span>
          </div>

          {/* Marquee Track */}
          <div
            className="flex-1 overflow-hidden relative mx-2 sm:mx-4 mask-radial"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <motion.div
              className="flex items-center gap-8 whitespace-nowrap w-max"
              animate={{
                x: isPaused ? undefined : ['0%', '-50%'],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 40,
                  ease: 'linear',
                },
              }}
            >
              {tickerItems.map((notice, idx) => (
                <div
                  key={`${notice.id}-${idx}`}
                  className="inline-flex items-center gap-2 group cursor-pointer"
                  onClick={() => {
                    setActiveNoticeModal(notice);
                    if (onNoticeClick) onNoticeClick(notice);
                  }}
                >
                  <span className="text-amber-400 font-semibold text-[11px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-800/80 border border-stone-700/60">
                    {notice.badge}
                  </span>
                  <span className="text-stone-300 group-hover:text-amber-200 transition-colors font-medium">
                    {notice.text}
                  </span>
                  {notice.actionLabel && (
                    <a
                      href={notice.actionHref || '#'}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (notice.actionHref?.startsWith('#')) {
                          const target = document.querySelector(notice.actionHref);
                          target?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="inline-flex items-center gap-0.5 text-amber-400 hover:text-amber-300 underline underline-offset-2 ml-1 text-[11px] font-semibold"
                    >
                      {notice.actionLabel}
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  )}
                  <span className="text-stone-600 ml-4 font-serif text-sm">✦</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Controls: Pause / Play & Dismiss */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 pl-2 sm:pl-3 bg-stone-900 z-10 border-l border-stone-800">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? 'Resume ticker scroll' : 'Pause ticker scroll'}
              className="p-1 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss announcements ticker"
              className="p-1 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Notice Detail Modal */}
      {activeNoticeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="notice-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setActiveNoticeModal(null)}
        >
          <div
            className="bg-stone-900 border border-stone-700 max-w-lg w-full rounded-xl p-6 shadow-2xl text-stone-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close dialog"
              onClick={() => setActiveNoticeModal(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {activeNoticeModal.badge}
              </span>
              <span className="text-xs text-stone-400 uppercase tracking-widest font-mono">
                Official Institution Bulletin
              </span>
            </div>
            <h3 id="notice-dialog-title" className="text-lg font-serif font-semibold text-stone-100 mb-2">
              Official Academic Dispatch
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed mb-6">
              {activeNoticeModal.text}
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setActiveNoticeModal(null)}
                className="px-4 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-800 rounded-lg"
              >
                Close
              </button>
              {activeNoticeModal.actionLabel && (
                <a
                  href={activeNoticeModal.actionHref || '#'}
                  onClick={() => setActiveNoticeModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
                >
                  {activeNoticeModal.actionLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
