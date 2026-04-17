'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Trash2, Plus, LogOut, Loader2, GripVertical, Lock, Mail, Eye, EyeOff, Package, AlertTriangle, Pencil, X, Check } from 'lucide-react';
import type { AddictionProgram } from '@/lib/programs';
import { fetchPrograms, createProgram, updateProgram, deleteProgram } from '@/lib/programs';
import { getLogoUrl } from '@/lib/assets';

const LOGO_URL = getLogoUrl();

// ─── Login Form ──────────────────────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: (token: string, email: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/.netlify/functions/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      onLogin(data.token, data.email);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#00373E] via-[#004a53] to-[#00373E] px-4">
      {/* Subtle decorative circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#ED7428]/5" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[#ED7428]/5" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
          {/* Logo + branding */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F7F6F4] shadow-inner">
              <Image
                src={LOGO_URL}
                alt="Hope Trust logo"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#00373E]">Welcome Back</h1>
            <p className="mt-1.5 text-sm text-[#486364]">Sign in to the Hope Trust admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#00373E]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 py-3 pl-10 pr-4 text-sm text-[#00373E] outline-none transition-all placeholder:text-gray-400 focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
                  placeholder="admin@hopetrustindia.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#00373E]">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 py-3 pl-10 pr-11 text-sm text-[#00373E] outline-none transition-all placeholder:text-gray-400 focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#00373E] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#00373E]/20 transition-all hover:bg-[#024a53] hover:shadow-xl hover:shadow-[#00373E]/25 active:scale-[0.98] disabled:opacity-60 disabled:shadow-none"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-white/40">
          Hope Trust India &middot; Admin Panel
        </p>
      </div>
    </div>
  );
}

// ─── Add Program Form ────────────────────────────────────────────────────────

function AddProgramForm({
  onAdd,
  onCancel,
}: {
  onAdd: (program: Omit<AddictionProgram, 'id' | 'is_active' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [note, setNote] = useState('');
  const [cost, setCost] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onAdd({
        title,
        subtitle,
        description,
        features: featuresText
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
        note,
        cost,
        display_order: displayOrder,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-[#ED7428] to-[#F59E0B] px-6 py-4">
        <h3 className="text-lg font-bold text-white">Add New Program</h3>
        <p className="text-sm text-white/70">Fill in the details below to create a treatment package</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#00373E]">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2.5 text-sm outline-none transition-all focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
              placeholder="e.g. 30 Days Recovery Program"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#00373E]">
              Cost <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2.5 text-sm outline-none transition-all focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
              placeholder="e.g. INR 26,500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#00373E]">Subtitle</label>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2.5 text-sm outline-none transition-all focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
              placeholder="e.g. Who can benefit?"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#00373E]">Display Order</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2.5 text-sm outline-none transition-all focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[#00373E]">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2.5 text-sm outline-none transition-all focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
            placeholder="Program description paragraph(s)"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[#00373E]">
            Features <span className="text-xs text-gray-500">(one per line)</span>
          </label>
          <textarea
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2.5 text-sm outline-none transition-all focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
            placeholder={"2 weekly sessions by an addiction counsellor\n2 sessions with family\nEssential Step Work with a primary counsellor"}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[#00373E]">Note</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2.5 text-sm outline-none transition-all focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
            placeholder="e.g. Any psychometric tests required will be charged extra."
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex gap-3 border-t border-gray-100 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#ED7428] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#ED7428]/20 transition-all hover:bg-[#d4651f] active:scale-[0.98] disabled:opacity-60 disabled:shadow-none"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {loading ? 'Adding...' : 'Add Program'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-[#00373E] transition-all hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Program Card ────────────────────────────────────────────────────────────

function ProgramCard({
  program,
  token,
  onUpdate,
  onDelete,
}: {
  program: AddictionProgram;
  token: string;
  onUpdate: (p: AddictionProgram) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Form state for editing
  const [title, setTitle] = useState(program.title);
  const [subtitle, setSubtitle] = useState(program.subtitle);
  const [description, setDescription] = useState(program.description);
  const [featuresText, setFeaturesText] = useState(program.features.join('\n'));
  const [note, setNote] = useState(program.note);
  const [cost, setCost] = useState(program.cost);
  const [displayOrder, setDisplayOrder] = useState(program.display_order);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      const updated = await updateProgram(token, {
        id: program.id,
        title,
        subtitle,
        description,
        features: featuresText.split('\n').map(f => f.trim()).filter(Boolean),
        note,
        cost,
        display_order: displayOrder,
      });
      onUpdate(updated);
      setIsEditing(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setTitle(program.title);
    setSubtitle(program.subtitle);
    setDescription(program.description);
    setFeaturesText(program.features.join('\n'));
    setNote(program.note);
    setCost(program.cost);
    setDisplayOrder(program.display_order);
    setError('');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    onDelete(program.id);
  };

  if (isEditing) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#ED7428]/30 bg-white shadow-md ring-2 ring-[#ED7428]/10">
        <div className="bg-gradient-to-r from-[#ED7428] to-[#F59E0B] px-5 py-3">
          <h4 className="text-sm font-bold text-white">Edit Program</h4>
        </div>
        <div className="space-y-3 p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2 text-sm outline-none focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
              placeholder="Title"
            />
            <input
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2 text-sm outline-none focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
              placeholder="Cost (e.g. INR 26,500)"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2 text-sm outline-none focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
              placeholder="Subtitle"
            />
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2 text-sm outline-none focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
              placeholder="Display Order"
            />
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2 text-sm outline-none focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
            placeholder="Description"
          />
          <textarea
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2 text-sm outline-none focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
            placeholder="Features (one per line)"
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2 text-sm outline-none focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
            placeholder="Note"
          />

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              <AlertTriangle className="h-3 w-3" />
              {error}
            </div>
          )}

          <div className="flex gap-2 border-t border-gray-100 pt-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#ED7428] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#ED7428]/20 transition-all hover:bg-[#d4651f] active:scale-[0.98] disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-[#00373E] transition-all hover:bg-gray-50"
            >
              <X className="h-3 w-3" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg">
      {/* Orange accent top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#ED7428] to-[#F59E0B]" />

      <div className="p-5 sm:p-6">
        {/* Header row */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ED7428]/10 text-xs font-bold text-[#ED7428]">
              {program.display_order}
            </div>
            <h4 className="text-base font-bold text-[#00373E] sm:text-lg">{program.title}</h4>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1 rounded-xl bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-all hover:bg-[#ED7428]/10 hover:text-[#ED7428]"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              onBlur={() => setConfirmDelete(false)}
              className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all ${
                confirmDelete
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700'
                  : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600'
              } disabled:opacity-50`}
            >
              {deleting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
              {confirmDelete ? 'Confirm' : 'Delete'}
            </button>
          </div>
        </div>

        {program.subtitle && (
          <p className="mb-2 text-sm font-semibold text-[#00373E]/70">{program.subtitle}</p>
        )}

        {program.description && (
          <p className="mb-3 text-sm leading-relaxed text-gray-500 line-clamp-2">{program.description}</p>
        )}

        {program.features.length > 0 && (
          <ul className="mb-3 space-y-1.5 rounded-xl bg-[#F7F6F4] p-3">
            {program.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#ED7428]" />
                {f}
              </li>
            ))}
          </ul>
        )}

        {program.note && (
          <p className="mb-3 text-xs italic text-gray-400">{program.note}</p>
        )}

        {/* Cost badge */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Package Cost</span>
          <span className="rounded-lg bg-[#00373E] px-3 py-1 text-sm font-bold text-white">{program.cost}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard({ token, email, onLogout }: { token: string; email: string; onLogout: () => void }) {
  const [programs, setPrograms] = useState<AddictionProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');

  const loadPrograms = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchPrograms();
      setPrograms(data);
    } catch {
      setError('Failed to load programs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  const handleAdd = async (
    program: Omit<AddictionProgram, 'id' | 'is_active' | 'created_at' | 'updated_at'>
  ) => {
    await createProgram(token, program);
    setShowAddForm(false);
    await loadPrograms();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProgram(token, id);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError('Failed to delete program');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F4]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-[#00373E]/10 bg-[#00373E] shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Image src={LOGO_URL} alt="Hope Trust" width={28} height={28} className="object-contain" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Hope Trust Admin</h1>
              <p className="text-[11px] text-white/50">{email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        {/* Stats bar */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ED7428]/10">
                <Package className="h-5 w-5 text-[#ED7428]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#00373E]">{programs.length}</p>
                <p className="text-xs text-gray-500">Active Programs</p>
              </div>
            </div>
          </div>
          <div className="sm:col-span-2 flex items-center rounded-2xl bg-gradient-to-r from-[#00373E] to-[#024a53] p-5 shadow-sm">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">Addiction Programs</h2>
              <p className="text-sm text-white/60">
                Manage treatment packages shown on the Addiction Services page
              </p>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="ml-4 inline-flex items-center gap-2 rounded-xl bg-[#ED7428] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#ED7428]/20 transition-all hover:bg-[#d4651f] hover:shadow-xl active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                Add Program
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Add form */}
        {showAddForm && (
          <div className="mb-8">
            <AddProgramForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />
          </div>
        )}

        {/* Programs grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Loader2 className="h-6 w-6 animate-spin text-[#ED7428]" />
            </div>
            <p className="mt-3 text-sm text-gray-400">Loading programs...</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F6F4]">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-[#00373E]">No programs yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Click &quot;Add Program&quot; to create your first treatment package
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {programs.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                token={token}
                onUpdate={(updated) => {
                  setPrograms((prev) =>
                    prev.map((p) => (p.id === updated.id ? updated : p))
                  );
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white/50 py-4 text-center text-xs text-gray-400">
        Hope Trust India &middot; Admin Dashboard
      </footer>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  // Restore session from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_token');
    const savedEmail = sessionStorage.getItem('admin_email');
    if (saved && savedEmail) {
      setToken(saved);
      setEmail(savedEmail);
    }
  }, []);

  const handleLogin = (newToken: string, userEmail: string) => {
    setToken(newToken);
    setEmail(userEmail);
    sessionStorage.setItem('admin_token', newToken);
    sessionStorage.setItem('admin_email', userEmail);
  };

  const handleLogout = () => {
    setToken(null);
    setEmail('');
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_email');
  };

  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <Dashboard token={token} email={email} onLogout={handleLogout} />;
}
