import { useEffect, useRef } from "react";

export function GridScan() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.dataset.active = "true";
  }, []);

  return (
    <div ref={ref} className="grid-scan" data-active="false" aria-hidden="true">
      <span className="grid-scan__plane" />
      <span className="grid-scan__band" />
    </div>
  );
}
