import { useRef, useState } from "react";

type Phase = "idle" | "exit-up" | "exit-right";

interface UseSwipeCardOptions {
  onNext: () => void;
  onSave: () => void;
  thresholdUp?: number;
  thresholdRight?: number;
}

// gestes : swipe haut = carte suivante, swipe droite = sauvegarde
export function useSwipeCard({
  onNext,
  onSave,
  thresholdUp = 70,
  thresholdRight = 90,
}: UseSwipeCardOptions) {
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [phase, setPhase] = useState<Phase>("idle");
  const start = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ x: 0, y: 0, active: false });

  function commit(direction: "up" | "right") {
    if (direction === "right") onSave();
    setPhase(direction === "right" ? "exit-right" : "exit-up");
    setTimeout(() => {
      onNext();
      setPhase("idle");
      setDrag({ x: 0, y: 0, active: false });
    }, 220);
  }

  const bind = {
    onPointerDown: (e: React.PointerEvent) => {
      start.current = { x: e.clientX, y: e.clientY };
      const next = { x: 0, y: 0, active: true };
      dragRef.current = next;
      setDrag(next);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!dragRef.current.active) return;
      const rawX = e.clientX - start.current.x;
      const rawY = e.clientY - start.current.y;
      const next = { x: Math.max(0, rawX), y: Math.min(0, rawY), active: true };
      dragRef.current = next;
      setDrag(next);
    },
    onPointerUp: () => {
      const d = dragRef.current;
      if (!d.active) return;
      if (d.y < -thresholdUp) commit("up");
      else if (d.x > thresholdRight) commit("right");
      else {
        dragRef.current = { x: 0, y: 0, active: false };
        setDrag(dragRef.current);
      }
    },
  };

  let transform = `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 22}deg)`;
  if (phase === "exit-up") transform = "translate(0, -620px) rotate(0deg)";
  if (phase === "exit-right") transform = "translate(520px, -40px) rotate(18deg)";

  return {
    bind,
    transform,
    isDragging: drag.active,
    showKeepHint: drag.x > 40 && phase === "idle",
    showNextHint: drag.y < -40 && phase === "idle",
    triggerNext: () => commit("up"),
    triggerSave: () => commit("right"),
  };
}
