import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { BrandLink } from "./Brand";
import CourseSelector from "./CourseSelector";
import Mascot from "./Mascot";
import ThemeToggle from "./ThemeToggle";

export default function FirstRunExperience({ courses, onComplete }) {
  const reduced = useReducedMotion();
  const [selection, setSelection] = useState(null);
  useEffect(() => {
    if (!selection) return;
    const timer = setTimeout(() => onComplete(selection.course, selection.answers), reduced ? 0 : 1900);
    return () => clearTimeout(timer);
  }, [selection, reduced, onComplete]);
  return <div className="page-surface min-h-screen">
    <header className="border-b-2 hairline"><div className="mx-auto flex h-20 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8"><BrandLink size={38} wordClass="!text-[28px]"/><div className="flex items-center gap-4"><span className="eyebrow muted hidden sm:block">Let’s build your path</span><ThemeToggle/></div></div></header>
    <main className="mx-auto max-w-5xl px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
      {selection ? <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .2 }} className="flex min-h-[65vh] flex-col items-center justify-center text-center" role="status"><Mascot size={140} mood="excited" className="animate-bob"/><p className="eyebrow mt-6 text-leaf-dark dark:text-leaf">A fresh chapter</p><h1 className="mt-2 font-display text-3xl font-extrabold">Opening your {selection.course.title} path…</h1><p className="muted mt-2 font-semibold">Your goal. Your pace. Let’s make it click.</p></motion.section>
      : <CourseSelector courses={courses} profiles={{}} embedded onChoose={(course,answers)=>setSelection({course,answers})}/>}
    </main>
  </div>;
}
