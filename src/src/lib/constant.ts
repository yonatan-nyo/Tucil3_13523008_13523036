import type { Direction } from "./types";

export const DIRECTIONS: Record<"UP" | "DOWN" | "LEFT" | "RIGHT", Direction> = {
  UP: "atas",
  DOWN: "bawah",
  LEFT: "kiri",
  RIGHT: "kanan",
};

export const pieceColors: Record<string, string> = {
  A: "bg-blue-500",
  B: "bg-purple-500",
  C: "bg-pink-500",
  D: "bg-indigo-500",
  E: "bg-teal-500",
  F: "bg-cyan-500",
  G: "bg-orange-500",
  H: "bg-lime-500",
  I: "bg-amber-500",
  J: "bg-emerald-500",
  L: "bg-rose-500",
  M: "bg-sky-500",
  N: "bg-violet-500",
  O: "bg-fuchsia-500",
};
