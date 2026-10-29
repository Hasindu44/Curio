import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar, { StatRow } from "../components/layout/Navbar";
import Mascot from "../components/common/Mascot";
import LeagueCrest from "../components/gamification/LeagueCrest";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import FormField from "../components/common/FormField";
import { errorMessage, fieldErrors } from "../api/client";
import { FlameIcon, GemIcon, HeartIcon, MedalIcon, TrophyIcon, XPIcon } from "../components/common/StatusIcons";
import { useAuth } from "../context/AuthContext";
import { deleteAccount, updateProfile } from "../api/users";

const badgeColors = [["#FF9F1C", "#D97A00"], ["#1CA8F0", "#1286C4"], ["#A46CF7", "#7F48D6"], ["#4CC417", "#3A9A0F"]];

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteBusy, setDeleteBusy] = useState(false);
  const closeDelete = useCallback(() => { setDeleting(false); setPassword(""); setDeleteError(""); }, []);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const close = useCallback(() => setEditing(false), []);
  if (!user) return null;
  const joined = user.joined ? new Date(user.joined).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : null;
  const metrics = [
    ["Day streak", user.streak || 0, FlameIcon],
    ["Total XP", (user.xp || 0).toLocaleString(), XPIcon],
    ["Lessons finished", user.completedLessons || 0, GemIcon],
    ["Hearts", `${user.hearts}/${user.maxHearts}`, HeartIcon],
  ];
  async function save(event) {
    event.preventDefault();
    if (name.trim().length < 2) { setErrors({ name: "Name must be at least 2 characters" }); return; }
    setSaving(true); setError(""); setErrors({});
    try { setUser(await updateProfile({ name: name.trim(), bio: bio.trim() })); setEditing(false); }
    catch (err) { setErrors(fieldErrors(err)); setError(errorMessage(err, "We couldn’t save your profile. Please try again.")); }
    finally { setSaving(false); }
  }
  async function confirmDelete() {
    if (!password) { setDeleteError("Enter your password to confirm."); return; }
    setDeleteBusy(true); setDeleteError("");
    try { await deleteAccount(password); logout(); navigate("/", { replace: true }); }
    catch (err) { setDeleteError(errorMessage(err, "We couldn’t delete your account. Please try again.")); setDeleteBusy(false); }
  }
  function handleLogout() { logout(); navigate("/login"); }
  return <div className="app-shell">
    <Navbar/>
    <main id="main-content" className="app-content">
      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-12">
        <div className="min-w-0">
          <section>
            <div className="relative flex h-48 items-end justify-center overflow-hidden rounded-[22px] bg-violet-soft sm:h-56">
              <svg className="absolute inset-0 h-full w-full text-violet/20" viewBox="0 0 700 220" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true"><circle cx="80" cy="190" r="120" stroke="currentColor" strokeWidth="26"/><circle cx="620" cy="40" r="70" fill="currentColor"/><path d="M470 160c40-60 90-60 130 0" stroke="currentColor" strokeWidth="14" strokeLinecap="round"/></svg>
              <div className="relative translate-y-4"><Mascot size={170}/></div>
              <button onClick={() => { setName(user.name); setBio(user.bio || ""); setError(""); setErrors({}); setEditing(true); }} className="secondary-button btn-sm absolute right-4 top-4" aria-label="Edit profile"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Zm10-13 3 3"/></svg>Edit</button>
            </div>
            <div className="mt-5 flex flex-wrap items-start justify-between gap-4 border-b-2 hairline pb-6">
              <div className="min-w-0">
                <h1 className="font-display text-[32px] font-extrabold leading-tight">{user.name}</h1>
                <p className="muted break-all text-sm font-bold">{user.email}</p>
                <p className="mt-3 max-w-lg text-[15px] font-semibold leading-relaxed">{user.bio || "A curious mind, taking it one idea at a time."}</p>
                <div className="muted mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-bold">{joined && <span>Joined {joined}</span>}<span>{Math.round((user.totalStudySeconds || 0) / 60)} minutes explored</span></div>
              </div>
              {user.league && <LeagueCrest league={user.league} size={64}/>}
            </div>
          </section>
          <section className="mt-7"><h2 className="font-display text-2xl font-extrabold">Statistics</h2><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{metrics.map(([label, value, Icon]) => <div className="panel flex items-center gap-3 px-4 py-3" key={label}><Icon size={28}/><div className="min-w-0"><p className="font-display text-xl font-extrabold leading-tight">{value}</p><p className="muted text-xs font-bold">{label}</p></div></div>)}</div></section>
          <section className="mt-8"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-display text-2xl font-extrabold"><TrophyIcon size={32}/>Achievements</h2><span className="eyebrow muted">{user.badges?.length || 0} earned</span></div>
            {user.badges?.length ? <div className="panel mt-3 divide-y-2 divide-[var(--line)]">{user.badges.map((badge, i) => { const [face, edge] = badgeColors[i % badgeColors.length]; return <div key={badge.id} className="flex items-center gap-4 p-4">
              <MedalIcon face={face} edge={edge} symbol={badge.icon || "★"} size={54}/>
              <div className="min-w-0 flex-1"><p className="font-display text-lg font-extrabold">{badge.label}</p><div className="mt-1.5 flex items-center gap-3"><div className="h-3 flex-1 rounded-full" style={{ background: face }}/><span className="muted text-xs font-extrabold">Unlocked</span></div></div>
            </div>; })}</div>
            : <div className="panel mt-3 flex items-center gap-4 p-5"><Mascot size={64} mood="thinking"/><div><p className="font-extrabold">Your first achievement is ahead.</p><Link to="/dashboard" className="mt-1 inline-block text-sm font-extrabold uppercase tracking-wider text-sky-dark dark:text-sky">Start learning</Link></div></div>}
          </section>
          <section className="mt-8" aria-labelledby="account-heading">
            <h2 id="account-heading" className="font-display text-2xl font-extrabold">Account</h2>
            <div className="panel mt-3 divide-y-2 divide-[var(--line)]">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-extrabold">Log out</p><p className="muted text-sm font-semibold">Sign out of Curio on this device.</p></div><button type="button" onClick={handleLogout} className="secondary-button btn-sm">Log out</button></div>
              <div className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-extrabold text-coral-dark dark:text-coral">Delete account</p><p className="muted text-sm font-semibold">Permanently remove your profile, progress and lesson history.</p></div><button type="button" onClick={() => setDeleting(true)} className="danger-button btn-sm">Delete account</button></div>
            </div>
          </section>
        </div>
        <aside className="grid gap-5 xl:sticky xl:top-6">
          <div className="hidden xl:block"><StatRow/></div>
          {user.league && <section className="panel p-5"><h2 className="font-display text-xl font-extrabold">Current league</h2><div className="mt-4 flex items-center gap-4"><LeagueCrest league={user.league} size={60} animated/><div><p className="font-display text-xl font-extrabold">{user.league.name}</p><p className="muted text-sm font-bold">{user.league.joined ? `${(user.league.points || 0).toLocaleString()} XP this week` : "Not ranked this week"}</p></div></div><Link to="/leaderboard" className="secondary-button btn-sm mt-5 w-full">View league</Link></section>}
          <section className="overflow-hidden rounded-[18px] bg-[#FF9F1C] p-5 text-white shadow-[0_4px_0_#D97A00]"><div className="flex items-center justify-between"><div><p className="font-display text-4xl font-extrabold">{user.streak || 0}</p><p className="text-sm font-extrabold uppercase tracking-wider">day streak</p></div><FlameIcon size={60}/></div><p className="mt-4 rounded-xl bg-white/20 px-3 py-2 text-sm font-bold">Longest streak: {user.longestStreak || user.streak || 0} days. Consistency is a superpower.</p></section>
        </aside>
      </div>
    </main>
    <AnimatePresence>{editing && <Modal title="Edit profile" onClose={close}><form onSubmit={save} className="grid gap-5"><FormField label="Display name" error={errors.name}><input maxLength={60} value={name} onChange={event => setName(event.target.value)}/></FormField><FormField label="A little about you" error={errors.bio} hint={`${bio.length}/180 characters`}><textarea maxLength={180} rows={4} value={bio} onChange={event => setBio(event.target.value)} className="field resize-none"/></FormField>{error && <p role="alert" className="text-sm font-bold text-coral-dark">{error}</p>}<button disabled={saving || name.trim().length < 2} className="primary-button w-full">{saving ? "Saving…" : "Save profile"}</button></form></Modal>}
      {deleting && <ConfirmDialog title="Delete your account?" confirmLabel="Delete my account" busy={deleteBusy} error={deleteError} onConfirm={confirmDelete} onCancel={closeDelete}>
        <p>This permanently deletes <strong>{user.email}</strong>, your XP, streak, badges and lesson history. This can’t be undone.</p>
        <FormField label="Enter your password to confirm" className="mt-4"><input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)}/></FormField>
      </ConfirmDialog>}
    </AnimatePresence>
  </div>;
}
