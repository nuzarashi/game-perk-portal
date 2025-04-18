
export type Platform = "steam" | "epic" | "gog" | "amazon" | "humble" | "itch";
export type NotificationType = "free" | "sale" | "backlog";
export type GameStatus = "free" | "sale" | null;
export type PlatformStatus = "connected" | "available" | "coming_soon";

export interface PlatformInfo {
  id: Platform;
  name: string;
  color: string;
  status: PlatformStatus;
  connected: boolean;
}

export const PLATFORMS: PlatformInfo[] = [
  { id: "steam", name: "Steam", color: "bg-gaming-steam", status: "available", connected: false },
  { id: "epic", name: "Epic Games", color: "bg-gaming-epic", status: "available", connected: false },
  { id: "gog", name: "GOG", color: "bg-gaming-gog", status: "available", connected: false },
  { id: "amazon", name: "Amazon Games", color: "bg-gaming-amazon", status: "available", connected: false },
  { id: "humble", name: "Humble", color: "bg-gaming-humble", status: "coming_soon", connected: false },
  { id: "itch", name: "Itch.io", color: "bg-gaming-itch", status: "coming_soon", connected: false },
];
