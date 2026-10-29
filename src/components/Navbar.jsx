import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HeartsDisplay from "./HeartsDisplay";
import StreakBadge from "./StreakBadge";
import XPBadge from "./XPBadge";
import GemBadge from "./GemBadge";
import { BrandLink } from "./Brand";
import ThemeToggle from "./ThemeToggle";

const links = [
  { to: "/dashboard", label: "Learn", icon: "learn" },
  { to: "/leaderboard", label: "Leagues", icon: "league" },
  { to: "/profile", label: "Profile", icon: "profile" },
];

function NavArt({ name }) {
  return <svg width="34" height="34" viewBox="0 0 36 36" fill="none" aria-hidden="true" className="nav-ico shrink-0">
    {name === "learn" && <>
      <path d="M6 17 18 7l12 10v13.5a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 6 30.5V17Z" fill="#E86A2C"/>
      <path d="M6 16 18 6l12 10v13.5a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 6 29.5V16Z" fill="#FF9147"/>
      <path d="M3.5 17.5 18 5.5l14.5 12" stroke="#E0403B" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="14" y="20" width="8" height="12" rx="3" fill="#FFD84D"/><circle cx="19.8" cy="26.5" r="1.1" fill="#C98000"/>
      <rect x="23" y="18" width="4" height="4" rx="1" fill="#BDEBFF"/><path d="M9 20v6" stroke="#fff" strokeOpacity=".4" strokeWidth="2" strokeLinecap="round"/>
    </>}
    {name === "league" && <>
      <path d="M18 5c4 2.4 8 3.2 12 3.2v10.4c0 8.6-5.6 13.6-12 16.4-6.4-2.8-12-7.8-12-16.4V8.2c4 0 8-.8 12-3.2Z" fill="#C98000" transform="translate(0 1.5)"/>
      <path d="M18 5c4 2.4 8 3.2 12 3.2v10.4c0 8.6-5.6 13.6-12 16.4-6.4-2.8-12-7.8-12-16.4V8.2c4 0 8-.8 12-3.2Z" fill="#FFC21A"/>
      <path d="M18 5c4 2.4 8 3.2 12 3.2v10.4c0 8.6-5.6 13.6-12 16.4V5Z" fill="#FFA800" fillOpacity=".55"/>
      <path d="m18 11 2.4 4.9 5.4.8-3.9 3.8.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.9-3.8 5.4-.8L18 11Z" fill="#fff"/>
    </>}
    {name === "profile" && <>
      <rect x="3" y="4.5" width="30" height="30" rx="11" fill="#7F48D6"/>
      <rect x="3" y="3" width="30" height="30" rx="11" fill="#B07CFF"/>
      <path d="M8.5 30c0-6.5 4-9.5 9.5-9.5s9.5 3 9.5 9.5" fill="#fff" fillOpacity=".95"/>
      <circle cx="18" cy="13.5" r="6.5" fill="#fff"/><path d="M8 9c1.5-3 4-4.5 7-5" stroke="#fff" strokeOpacity=".45" strokeWidth="2.2" strokeLinecap="round"/>
    </>}
  </svg>;
}

// Rendered at the top of each page's right rail on wide screens.
export function StatRow() {
  const { user } = useAuth();
  if (!user) return null;
  return <div className="flex items-center justify-between gap-1">
    <StreakBadge streak={user.streak || 0}/>
    <GemBadge gems={user.gems || 0}/>
    <XPBadge xp={user.xp || 0}/>
    <HeartsDisplay hearts={user.hearts} maxHearts={user.maxHearts}/>
  </div>;
}

export default function Navbar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  return <>
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-leaf focus:p-4 focus:text-white">Skip to content</a>
    <aside className="app-sidebar">
      <div className="mb-8 px-1 xl:px-3"><BrandLink size={42}/></div>
      <nav aria-label="Main navigation" className="grid gap-2">{links.map(link => <Link key={link.to} to={link.to} title={link.label} aria-current={pathname === link.to ? "page" : undefined} className={`nav-item ${pathname === link.to ? "is-active" : ""}`}><NavArt name={link.icon}/><span className="nav-label">{link.label}</span></Link>)}</nav>
      <div className="mt-auto grid gap-3">
        <ThemeToggle className="mx-auto xl:mx-3"/>
        <Link to="/profile" className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-[var(--surface-soft)]" title="Your profile">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet font-display text-lg font-extrabold text-white">{user?.name?.[0]?.toUpperCase() || "A"}</span>
          <span className="nav-label min-w-0"><span className="block truncate text-sm font-extrabold">{user?.name || "Learner"}</span><span className="muted block text-xs font-bold">{(user?.xp || 0).toLocaleString()} XP</span></span>
        </Link>
      </div>
    </aside>
    <header className="app-topbar">
      <div className="mx-auto flex min-h-[64px] max-w-[1080px] items-center justify-between gap-2 px-3 sm:px-6">
        <div className="md:hidden"><BrandLink size={34} wordClass="!text-[26px] max-[399px]:!hidden"/></div>
        <div className="flex items-center gap-0.5 sm:gap-2 md:ml-auto">
          {user && <><StreakBadge streak={user.streak || 0}/><span className="hidden min-[400px]:block"><GemBadge gems={user.gems || 0}/></span><span className="hidden sm:block"><XPBadge xp={user.xp || 0}/></span><HeartsDisplay hearts={user.hearts} maxHearts={user.maxHearts}/></>}
          <ThemeToggle className="ml-1 md:hidden"/>
        </div>
      </div>
    </header>
    <nav aria-label="Mobile navigation" className="app-bottomnav fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 px-4 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 md:hidden">
      {links.map(link => <Link key={link.to} to={link.to} aria-current={pathname === link.to ? "page" : undefined} className={`flex flex-col items-center gap-0.5 rounded-xl border-2 py-1 text-[11px] font-extrabold uppercase tracking-wider ${pathname === link.to ? "border-sky-light bg-sky-soft text-sky-dark dark:border-sky-dark dark:text-sky-light" : "muted border-transparent"}`}><NavArt name={link.icon}/>{link.label}</Link>)}
    </nav>
  </>;
}
