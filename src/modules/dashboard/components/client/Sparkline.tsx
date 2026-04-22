"use client";

import { cn } from "@/lib/utils";

type Props = {
  data: readonly number[];
  width?: number;
  height?: number;
  className?: string;
  strokeClassName?: string;
  fillClassName?: string;
};

export default function Sparkline({
  data,
  width = 120,
  height = 32,
  className,
  strokeClassName = "stroke-sidebar-selected",
  fillClassName = "fill-sidebar-selected/10",
}: Props) {
  if (!data || data.length === 0) {
    return (
      <svg
        width={width}
        height={height}
        className={cn("block", className)}
        aria-hidden
      />
    );
  }

  const max = Math.max(...data, 0);
  const min = Math.min(...data, 0);
  const span = max - min || 1;

  const stepX = data.length > 1 ? width / (data.length - 1) : width;

  const points = data.map((value, index) => {
    const x = index * stepX;
    const y = height - ((value - min) / span) * height;
    return [x, Number.isFinite(y) ? y : height] as const;
  });

  const pathD =
    "M " + points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" L ");

  const areaD = `${pathD} L ${width.toFixed(2)},${height} L 0,${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("block overflow-visible", className)}
      aria-hidden
    >
      <path d={areaD} className={cn("stroke-none", fillClassName)} />
      <path
        d={pathD}
        className={cn("fill-none", strokeClassName)}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
