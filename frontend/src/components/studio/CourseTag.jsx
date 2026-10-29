import { accents } from "../course/SkillNode";

// Small colored label showing which course a lesson belongs to.
export default function CourseTag({ course }) {
  if (!course) return <span className="muted text-sm font-bold">No course</span>;
  const color = accents[course.accent] ?? accents.teal;
  return <span className="inline-flex max-w-full items-center gap-2 text-sm font-extrabold">
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm text-white" style={{ background: color.face, boxShadow: `0 2px 0 ${color.edge}` }} aria-hidden="true">{course.icon}</span>
    <span className="truncate">{course.title}</span>
  </span>;
}
