import { Log } from "@/types";
import { create } from "zustand";

interface LogStore {
  logs: Log[];
  actions: {
    setLogs: (logs: Log[]) => void;
  };
}

const useLogStore = create<LogStore>((set) => ({
  logs: [],
  actions: {
    setLogs: (logs) => set({ logs }),
  },
}));

export const useLogs = () => useLogStore((state) => state.logs);
export const useLogActions = () => useLogStore((state) => state.actions);
