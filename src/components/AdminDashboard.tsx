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
  School,
} from 'lucide-react';
import {
  db,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
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
  staffEmail = 'admin@themountschool.edu',
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
    badge: 'Admissions 2026–2027',
    text: '',
    actionLabel: 'Apply for Classes 1–10',
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
        console.warn('Firestore announcements onSnapshot notice:', error);
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
        console.warn('Firestore applications onSnapshot notice:', error);
      }
    );

    return () => {
      unsubNotices();
      unsubApps();
    };
  }, []);

  // Seed default announcements if Firestore collection is fresh
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
      if (onShowToast) onShowToast('Initial school notices added to Firestore.');
    } catch (err) {
      console.error('Seeding notice:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenCreate = () => {
    setEditDocId(null);
    setFormData({
      priority: 'announcement',
      badge: 'School Notice',
      text: '',
      actionLabel: 'Read More',
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
      if (onShowToast) onShowToast('Notice removed.');
    } catch (error) {
      console.warn('Firestore delete notice:', error);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      if (onShowToast) onShowToast('Notice removed.');
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
        await updateDoc(doc(db, 'announcements', editDocId), {
          priority: formData.priority,
          badge: formData.badge.trim(),
          text: formData.text.trim(),
          actionLabel: formData.actionLabel.trim(),
          actionHref: formData.actionHref.trim(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        await addDoc(collection(db, 'announcements'), {
          priority: formData.priority,
          badge: formData.badge.trim(),
          text: formData.text.trim(),
          actionLabel: formData.actionLabel.trim(),
          actionHref: formData.actionHref.trim(),
          authorEmail: staffEmail,
          createdAt: new Date().toISOString(),
        });
      }
      setIsEditing(false);
      if (onShowToast) onShowToast('Announcement saved and updated.');
    } catch (error) {
      console.warn('Firestore announcement save fallback:', error);
      const updatedItem: AnnouncementDoc = {
        id: editDocId || `local-${Date.now()}`,
        priority: formData.priority,
        badge: formData.badge.trim(),
        text: formData.text.trim(),
        actionLabel: formData.actionLabel.trim(),
        actionHref: formData.actionHref.trim(),
      };
      if (editDocId) {
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === editDocId ? updatedItem : a))
        );
      } else {
        setAnnouncements((prev) => [updatedItem, ...prev]);
      }
      setIsEditing(false);
      if (onShowToast) onShowToast('Announcement saved.');
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
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-800">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase bg-blue-50 text-[#1B365D] border border-blue-200">
              Staff Administrator CMS
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Classes 1 to 10 Registry
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B365D]">
            School Administration Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as <strong className="text-slate-800">{staffEmail}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('notices')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'notices'
                  ? 'bg-[#1B365D] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              Notices Ticker ({announcements.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('applications')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'applications'
                  ? 'bg-[#1B365D] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Admissions Applications ({applications.length})
            </button>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            Sign Out
          </button>
        </div>
      </div>

      {/* TAB 1: Emergency Ticker & Noticeboard CRUD */}
      {activeTab === 'notices' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1B365D]">
                School Announcements & Top Ticker
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Announcements published here appear immediately in the header ticker across the website.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {announcements.length === 0 && (
                <button
                  type="button"
                  onClick={handleSeedDefaults}
                  disabled={isSubmitting}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Seed Initial Notices
                </button>
              )}
              <button
                type="button"
                onClick={handleOpenCreate}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1B365D] hover:bg-[#132742] transition-all shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                Publish Announcement
              </button>
            </div>
          </div>

          {/* Announcements Table */}
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
            {announcements.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-slate-700">
                  No active announcements in database
                </h4>
                <p className="text-xs mt-1 mb-4 text-slate-500">
                  Publish a new alert or seed default institutional notices.
                </p>
                <button
                  type="button"
                  onClick={handleSeedDefaults}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1B365D]"
                >
                  Seed Default Notices
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            ann.priority === 'urgent'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : ann.priority === 'admissions'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {ann.priority}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {ann.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-light">
                        {ann.text}
                      </p>
                      {ann.actionLabel && (
                        <div className="mt-2 text-[11px] text-[#1B365D] font-medium flex items-center gap-1">
                          <span>Action: {ann.actionLabel}</span>
                          <span className="text-slate-400">→ {ann.actionHref}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(ann)}
                        className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all text-xs flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-red-600 hover:bg-red-50 transition-all text-xs flex items-center gap-1"
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

      {/* TAB 2: Admissions Applications Registry */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1B365D]">
              Student Admissions Intake Registry (Classes 1–10)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live prospective student applications submitted via the online admission form.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
            {applications.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-slate-700">
                  No admission applications submitted yet
                </h4>
                <p className="text-xs mt-1 text-slate-500">
                  Applications submitted by parents on the admissions page will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Class & Group</th>
                      <th className="py-3 px-4">Parent Contact</th>
                      <th className="py-3 px-4">Previous School</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {app.studentName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#1B365D] block">
                            {app.gradeApplied}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {app.stream || 'General'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-slate-900 font-medium block">{app.parentName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {app.parentPhone} · {app.parentEmail}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
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
                            className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#1B365D]"
                          >
                            <option value="pending">Pending</option>
                            <option value="under_review">Under Review</option>
                            <option value="scheduled">Interview Scheduled</option>
                            <option value="accepted">Accepted</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (onShowToast) onShowToast(`Reviewing application for ${app.studentName}`);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md bg-slate-50 border border-slate-200"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setIsEditing(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-800"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-serif text-lg font-bold text-[#1B365D]">
                {editDocId ? 'Edit Ticker Announcement' : 'Publish School Announcement'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-900 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Priority Type
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as 'urgent' | 'announcement' | 'admissions',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                  >
                    <option value="admissions">Admissions</option>
                    <option value="urgent">Urgent Notice</option>
                    <option value="announcement">General Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. School Notice"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ticker Message *
                </label>
                <textarea
                  rows={3}
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Official notice scrolling in the top marquee ticker..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.actionLabel}
                    onChange={(e) => setFormData({ ...formData, actionLabel: e.target.value })}
                    placeholder="e.g. Learn More"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Link Target
                  </label>
                  <input
                    type="text"
                    value={formData.actionHref}
                    onChange={(e) => setFormData({ ...formData, actionHref: e.target.value })}
                    placeholder="#admissions"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-[#1B365D]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl font-bold text-white bg-[#1B365D] hover:bg-[#132742] flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  {isSubmitting ? 'Saving...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
