import { Invite } from "@/types";
import { create } from "zustand";

interface InvitesStore {
  invites: Invite[];
  actions: {
    setInvites: (invites: Invite[]) => void;
  };
}

const useInvitesStore = create<InvitesStore>((set) => ({
  invites: [],
  actions: {
    setInvites: (invites: Invite[]) => set({ invites }),
  },
}));

export const useInvites = () => useInvitesStore((state) => state.invites);
export const useInvitesActions = () =>
  useInvitesStore((state) => state.actions);
