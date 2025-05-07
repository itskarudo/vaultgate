import { Organization } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OrgsStore {
  orgs: Organization[];
  currentOrg: Organization | null;
  actions: {
    setOrgs: (orgs: Organization[]) => void;
    setCurrentOrg: (
      fn: (prev: Organization | null) => Organization | null
    ) => void;
  };
}

const useOrgsStore = create(
  persist<OrgsStore>(
    (set) => ({
      orgs: [],
      currentOrg: null,
      actions: {
        setOrgs: (orgs: Organization[]) => set({ orgs }),
        setCurrentOrg: (
          fn: (prev: Organization | null) => Organization | null
        ) => set((state) => ({ currentOrg: fn(state.currentOrg) })),
      },
    }),
    {
      name: "orgs-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ currentOrg: state.currentOrg } as OrgsStore),
    }
  )
);

export const useOrgs = () => useOrgsStore((state) => state.orgs);
export const useCurrentOrg = () => useOrgsStore((state) => state.currentOrg);
export const useOrgsActions = () => useOrgsStore((state) => state.actions);
