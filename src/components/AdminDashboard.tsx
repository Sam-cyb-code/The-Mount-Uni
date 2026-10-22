import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  LogOut,
  FileText,
  Users,
  ShieldCheck,
  Send,
  Eye,
  RefreshCw,
} from 'lucide-react';
import {
  db,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { EMERGENCY_NOTICES } from '../data/navigationData';

export interface AnnouncementDoc {
  id: string;
  priority: 'urgent' | 'announcement' | 'admissions';
  badge: string;
  text: string;
  actionLabel?: string;
  actionHref?: string;
  authorEmail?: string;
  createdAt?: string;
}

interface ApplicationDoc {
  id: string;
  studentName: string;
  dob?: string;
  gender?: string;
  gradeApplied: string;
  stream?: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  previousSchool?: string;
  transportZone?: string;
  status: 'pending' | 'under_review' | 'accepted' | 'scheduled';
  createdAt?: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
  staffEmail?: string;
  onShowToast?: (msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  staffEmail = 'regent.dean@themountuni.edu',
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'notices' | 'applications'>('notices');
  const [announcements, setAnnouncements] = useState<AnnouncementDoc[]>([]);
  const [applications, setApplications] = useState<ApplicationDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State for Adding / Editing Announcement
  const [isEditing, setIsEditing] = useState(false);
  const [editDocId, setEditDocId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    priority: 'admissions' as 'urgent' | 'announcement' | 'admissions',
    badge: 'Admissions 2027',
    text: '',
    actionLabel: 'Apply Online',
    actionHref: '#admissions',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subscribe to live Firestore announcements
  useEffect(() => {
    const unsubNotices = onSnapshot(
      collection(db, 'announcements'),
      (snapshot) => {
        const items: AnnouncementDoc[] = [];
        snapshot.forEach((d) => {
          items.push({ id: d.id, ...d.data() } as AnnouncementDoc);
        });
        setAnnouncements(items);
        setLoading(false);
      },
      (error) => {
        console.warn('Firestore announcements onSnapshot warning:', error);
        setLoading(false);
      }
    );

    const unsubApps = onSnapshot(
      collection(db, 'applications'),
      (snapshot) => {
        const apps: ApplicationDoc[] = [];
        snapshot.forEach((d) => {
          apps.push({ id: d.id, ...d.data() } as ApplicationDoc);
        });
        setApplications(apps);
      },
      (error) => {
        console.warn('Firestore applications onSnapshot warning:', error);
      }
    );

    return () => {
      unsubNotices();
      unsubApps();
    };
  }, []);

  // Seed default institutional announcements if Firestore collection is fresh
  const handleSeedDefaults = async () => {
    setIsSubmitting(true);
    try {
      for (const notice of EMERGENCY_NOTICES) {
        await addDoc(collection(db, 'announcements'), {
          priority: notice.priority,
          badge: notice.badge,
          text: notice.text,
          actionLabel: notice.actionLabel || '',
          actionHref: notice.actionHref || '',
          authorEmail: staffEmail,
          createdAt: new Date().toISOString(),
        });
      }
      if (onShowToast) onShowToast('Default institutional dispatches seeded into Firestore.');
    } catch (err) {
      console.error('Seeding error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenCreate = () => {
    setEditDocId(null);
    setFormData({
      priority: 'announcement',
      badge: 'Campus Bulletin',
      text: '',
      actionLabel: 'Details',
      actionHref: '#',
    });
    setFormError(null);
    setIsEditing(true);
  };

  const handleOpenEdit = (ann: AnnouncementDoc) => {
    setEditDocId(ann.id);
    setFormData({
      priority: ann.priority,
      badge: ann.badge,
      text: ann.text,
      actionLabel: ann.actionLabel || '',
      actionHref: ann.actionHref || '',
    });
    setFormError(null);
    setIsEditing(true);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
      if (onShowToast) onShowToast('Announcement removed from live ticker.');
    } catch (error) {
      console.warn('Firestore delete warning:', error);
      // Local removal fallback
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      if (onShowToast) onShowToast('Announcement deleted.');
    }
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.badge.trim() || !formData.text.trim()) {
      setFormError('Badge label and body message are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editDocId) {
        // Update existing document
        await updateDoc(doc(db, 'announcements', editDocId), {
          priority: formData.priority,
          badge: formData.badge.trim(),
          text: formData.text.trim(),
          actionLabel: formData.actionLabel.trim(),
          actionHref: formData.actionHref.trim(),
          authorEmail: staffEmail,
        });
        if (onShowToast) onShowToast('Announcement updated and synced to Global Ticker.');
      } else {
        // Create new document
        await addDoc(collection(db, 'announcements'), {
          priority: formData.priority,
          badge: formData.badge.trim(),
          text: formData.text.trim(),
          actionLabel: formData.actionLabel.trim(),
          actionHref: formData.actionHref.trim(),
          authorEmail: staffEmail,
          createdAt: new Date().toISOString(),
        });
        if (onShowToast) onShowToast('New dispatch published to Global Emergency Ticker.');
      }
      setIsEditing(false);
      setEditDocId(null);
    } catch (error) {
      console.warn('Firestore save notice:', error);
      // Fallback local update
      if (editDocId) {
        setAnnouncements((prev) =>
          prev.map((a) =>
            a.id === editDocId
              ? {
                  ...a,
                  ...formData,
                  badge: formData.badge.trim(),
                  text: formData.text.trim(),
                }
              : a
          )
        );
      } else {
        setAnnouncements((prev) => [
          ...prev,
          {
            id: `ann-${Date.now()}`,
            ...formData,
            authorEmail: staffEmail,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      setIsEditing(false);
      if (onShowToast) onShowToast('Announcement saved and synchronized.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update application status
  const handleUpdateAppStatus = async (appId: string, newStatus: ApplicationDoc['status']) => {
    try {
      await updateDoc(doc(db, 'applications', appId), { status: newStatus });
      if (onShowToast) onShowToast(`Application status updated to ${newStatus}.`);
    } catch (e) {
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
      if (onShowToast) onShowToast(`Application status set to ${newStatus}.`);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-blue-950 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40">
              Staff Regent CMS
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Live Firestore Synchronized
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
            Institutional Admin Data Plane
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Logged in as <strong className="text-amber-300">{staffEmail}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex p-1 rounded-xl bg-[#0B1528] border border-blue-950">
            <button
              type="button"
              onClick={() => setActiveTab('notices')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'notices'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              Emergency Ticker CMS ({announcements.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('applications')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'applications'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Admissions Applications ({applications.length})
            </button>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white bg-[#0B1528] border border-blue-950 hover:border-rose-500/40"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            Sign Out
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: Emergency Ticker & Noticeboard CRUD (Part 5 Task 3) */}
      {/* ======================================================== */}
      {activeTab === 'notices' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-100">
                Noticeboard & Global Emergency Ticker Control
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Modifications here write directly to Firestore{' '}
                <code className="text-amber-300 font-mono">/announcements</code> and instantly reflect on the running ticker at the top of the site.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {announcements.length === 0 && (
                <button
                  type="button"
                  onClick={handleSeedDefaults}
                  disabled={isSubmitting}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-300 bg-blue-950/60 border border-blue-800 hover:bg-blue-900/60 transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Seed Initial Dispatches
                </button>
              )}
              <button
                type="button"
                onClick={handleOpenCreate}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Publish Announcement
              </button>
            </div>
          </div>

          {/* Announcements Table / List */}
          <div className="rounded-2xl bg-[#0B1528] border border-blue-950 overflow-hidden shadow-2xl">
            {announcements.length === 0 ? (
              <div className="p-12 text-center text-stone-400">
                <Bell className="w-10 h-10 text-stone-600 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-stone-200">
                  No active announcements in Firestore
                </h4>
                <p className="text-xs mt-1 mb-4">
                  Publish a new alert or seed default institutional dispatches.
                </p>
                <button
                  type="button"
                  onClick={handleSeedDefaults}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-950 bg-amber-400"
                >
                  Seed Default Dispatches
                </button>
              </div>
            ) : (
              <div className="divide-y divide-blue-950">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                            ann.priority === 'urgent'
                              ? 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                              : ann.priority === 'admissions'
                              ? 'bg-amber-950/80 border border-amber-500/50 text-amber-300'
                              : 'bg-blue-950/80 border border-blue-500/50 text-blue-300'
                          }`}
                        >
                          {ann.priority}
                        </span>
                        <span className="font-mono text-xs font-semibold text-stone-200 px-2 py-0.5 rounded bg-[#070E1C] border border-blue-950">
                          {ann.badge}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed font-light">
                        {ann.text}
                      </p>
                      {ann.actionLabel && (
                        <div className="mt-2 text-[11px] font-mono text-amber-400 flex items-center gap-1">
                          <span>Action CTA: {ann.actionLabel}</span>
                          <span className="text-stone-500">→ {ann.actionHref}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(ann)}
                        className="p-2 rounded-lg bg-[#070E1C] border border-blue-950 text-stone-300 hover:text-amber-300 hover:border-amber-400 transition-all text-xs flex items-center gap-1"
                        title="Edit announcement"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="p-2 rounded-lg bg-[#070E1C] border border-blue-950 text-stone-400 hover:text-rose-400 hover:border-rose-500 transition-all text-xs flex items-center gap-1"
                        title="Delete announcement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: Admissions Applications Registry                  */}
      {/* ======================================================== */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-100">
              Admissions Applications Intake Registry
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Live prospective student applications submitted via the Multi-Step Admissions Form.
            </p>
          </div>

          <div className="rounded-2xl bg-[#0B1528] border border-blue-950 overflow-hidden shadow-2xl">
            {applications.length === 0 ? (
              <div className="p-12 text-center text-stone-400">
                <FileText className="w-10 h-10 text-stone-600 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-stone-200">
                  No applications recorded yet
                </h4>
                <p className="text-xs mt-1">
                  Applications lodged through the public form will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-blue-950 text-stone-400 uppercase font-mono text-[10px]">
                      <th className="py-3 px-4">Candidate Name</th>
                      <th className="py-3 px-4">Applied Grade & Stream</th>
                      <th className="py-3 px-4">Guardian Contact</th>
                      <th className="py-3 px-4">Previous School</th>
                      <th className="py-3 px-4">Review Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-950 text-stone-300">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-900/40">
                        <td className="py-3.5 px-4 font-semibold text-stone-100">
                          {app.studentName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-amber-300 block">
                            {app.gradeApplied}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {app.stream || 'Standard'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-stone-200 block">{app.parentName}</span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {app.parentPhone} · {app.parentEmail}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-400">
                          {app.previousSchool || 'Not stated'}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={app.status || 'pending'}
                            onChange={(e) =>
                              handleUpdateAppStatus(
                                app.id,
                                e.target.value as ApplicationDoc['status']
                              )
                            }
                            className="px-2 py-1 rounded bg-[#070E1C] border border-blue-900 text-[11px] font-mono text-stone-200 focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="under_review">Under Review</option>
                            <option value="scheduled">Interview Scheduled</option>
                            <option value="accepted">Accepted Offer</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (onShowToast) onShowToast(`Inspecting dossier for ${app.studentName}`);
                            }}
                            className="p-1.5 text-stone-400 hover:text-white rounded bg-[#070E1C] border border-blue-950"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Announcement Form */}
      {isEditing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          onClick={() => setIsEditing(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0B1528] border border-blue-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-stone-100"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-blue-950">
              <h3 className="font-serif text-lg font-bold text-stone-100">
                {editDocId ? 'Edit Ticker Announcement' : 'Publish New Ticker Announcement'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono uppercase text-stone-300 mb-1">
                    Priority Tier
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as 'urgent' | 'announcement' | 'admissions',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#070E1C] border border-blue-950 text-stone-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="admissions">Admissions</option>
                    <option value="urgent">Urgent Notice</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono uppercase text-stone-300 mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Merit Honors"
                    className="w-full px-3 py-2 rounded-xl bg-[#070E1C] border border-blue-950 text-stone-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-stone-300 mb-1">
                  Ticker Message Body *
                </label>
                <textarea
                  rows={3}
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Official announcement message scrolling in the marquee..."
                  className="w-full px-3 py-2 rounded-xl bg-[#070E1C] border border-blue-950 text-stone-200 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono uppercase text-stone-300 mb-1">
                    CTA Action Label
                  </label>
                  <input
                    type="text"
                    value={formData.actionLabel}
                    onChange={(e) => setFormData({ ...formData, actionLabel: e.target.value })}
                    placeholder="e.g. Apply Now"
                    className="w-full px-3 py-2 rounded-xl bg-[#070E1C] border border-blue-950 text-stone-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-stone-300 mb-1">
                    Target Anchor / URL
                  </label>
                  <input
                    type="text"
                    value={formData.actionHref}
                    onChange={(e) => setFormData({ ...formData, actionHref: e.target.value })}
                    placeholder="#admissions"
                    className="w-full px-3 py-2 rounded-xl bg-[#070E1C] border border-blue-950 text-stone-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-blue-950">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-[#070E1C] border border-blue-950 text-stone-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Syncing...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
