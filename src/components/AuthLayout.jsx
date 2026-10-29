import { Link } from "react-router-dom";
import { BrandLink } from "./Brand";
import ThemeToggle from "./ThemeToggle";
import Mascot from "./Mascot";

export default function AuthLayout({ children, switchTo }) {
  return <div className="page-surface flex min-h-screen flex-col">
    <header className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
      <BrandLink size={38} wordClass="!text-[28px] max-[359px]:!hidden"/>
      <div className="flex items-center gap-3"><ThemeToggle/>{switchTo && <Link to={switchTo.to} className="secondary-button btn-sm">{switchTo.label}</Link>}</div>
    </header>
    <main className="flex flex-1 items-start justify-center px-5 pb-16 pt-4 sm:pt-10">
      <section className="w-full max-w-[400px]">
        <Mascot size={96} className="mx-auto mb-2"/>
        {children}
      </section>
    </main>
  </div>;
}
