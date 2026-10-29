import Mascot from "../common/Mascot";
import { TrophyIcon } from "../common/StatusIcons";
import SkillNode, { accents } from "./SkillNode";

// Sine-wave offsets (px from the column centre) give the path its winding shape.
const offsets = [0, 48, 76, 48, 0, -48, -76, -48];
const ROW = 188;

export default function CourseJourney({ nodes, accent, dark = false }) {
  const allDone = nodes.every(node => node.status === "completed");
  const colors = accents[accent] || accents.teal;
  const trophyTop = nodes.length * ROW;
  return <div className="relative mx-auto max-w-[460px] pb-6 pt-16">
    <div className="relative" style={{ height: trophyTop + 110 }}>
      {nodes.map((node, index) => <div key={node.id} className="absolute -translate-x-1/2" style={{ left: `calc(50% + ${offsets[index % offsets.length]}px)`, top: index * ROW }}>
        <SkillNode node={node} accent={accent} index={index} dark={dark}/>
      </div>)}
      {nodes.length > 2 && <div className="pointer-events-none absolute hidden sm:block" style={{ left: "calc(50% - 190px)", top: ROW * 1.3 }}><Mascot size={120} mood="happy"/></div>}
      <div className="absolute flex -translate-x-1/2 flex-col items-center" style={{ left: `calc(50% + ${offsets[nodes.length % offsets.length]}px)`, top: trophyTop }}>
        <div className={`flex h-[66px] w-[72px] items-center justify-center rounded-[50%] ${allDone ? "anim-float" : ""}`} style={{ background: allDone ? "#FFF4D6" : (dark ? "#37464F" : "#E4E7EA"), boxShadow: `0 8px 0 ${allDone ? "#FFC21A" : (dark ? "#26343B" : "#C8CED3")}` }} aria-hidden="true">
          <TrophyIcon size={44} locked={!allDone}/>
        </div>
        <span className="muted mt-5 text-sm font-extrabold">{allDone ? "Unit complete!" : "Unit trophy"}</span>
      </div>
    </div>
    <div className="mx-auto flex max-w-sm items-center gap-4 rounded-2xl border-2 border-dashed hairline p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: colors.face }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
      </span>
      <div><p className="text-sm font-extrabold">One idea unlocks the next</p><p className="muted mt-0.5 text-xs font-semibold">Finish each lesson to open the next step.</p></div>
    </div>
  </div>;
}
