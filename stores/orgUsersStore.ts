import { OrgUser } from "@/types";
import { create } from "zustand";

interface OrgUsersStore {
  orgUsers: OrgUser[];
  orgUser: OrgUser | null;
  actions: {
    setOrgUsers: (orgUsers: OrgUser[]) => void;
    setOrgUser: (orgUser: OrgUser | null) => void;
  };
}

const useOrgUsersStore = create<OrgUsersStore>((set) => ({
  orgUsers: [],
  orgUser: null,
  actions: {
    setOrgUsers: (orgUsers: OrgUser[]) => set({ orgUsers }),
    setOrgUser: (orgUser: OrgUser | null) => set({ orgUser }),
  },
}));

export const useOrgUsers = () => useOrgUsersStore((state) => state.orgUsers);
export const useOrgUser = () => useOrgUsersStore((state) => state.orgUser);
export const useOrgUsersActions = () =>
  useOrgUsersStore((state) => state.actions);
