import { create } from "zustand";
import { Lock } from "@/types";

interface LocksStore {
  locks: Lock[];
  pinnedIds: string[];
  actions: {
    setLocks: (locks: Lock[]) => void;
  };
}

const useLocksStore = create<LocksStore>((set) => ({
  locks: [],
  pinnedIds: [],
  actions: {
    setLocks: (locks: Lock[]) => set({ locks }),
  },
}));

export const useLocks = () => useLocksStore((state) => state.locks);
export const useLocksActions = () => useLocksStore((state) => state.actions);
