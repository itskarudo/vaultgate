import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { createRef } from "react";
import { create } from "zustand";

interface CreateOrgSheetStore {
  ref: React.RefObject<BottomSheetMethods> | null;
}

const useCreateOrgSheetStore = create<CreateOrgSheetStore>((set) => ({
  ref: createRef<BottomSheetMethods>(),
}));

export const useCreateOrgSheetRef = () =>
  useCreateOrgSheetStore((state) => state.ref);
