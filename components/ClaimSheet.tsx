import { Text, TouchableOpacity } from "react-native";
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import BottomSheetInput from "./BottomSheetInput";
import { authContext } from "@/contexts/authContext";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
  writeBatch,
} from "@react-native-firebase/firestore";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useCurrentOrg } from "@/stores/orgsStore";

const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    pressBehavior="close"
    opacity={0.4}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
  />
);

export interface ClaimSheetMethods {
  present: (
    logId: string,
    lockData: string,
    method: "rfid" | "fingerprint"
  ) => void;
}

const ClaimSheet = forwardRef<ClaimSheetMethods>((_, ref) => {
  const { user } = useContext(authContext);
  const [name, setName] = useState("");
  const [isNameErrored, setIsNameErrored] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [logId, setLogId] = useState<string | null>(null);
  const [lockData, setLockData] = useState<string | null>(null);
  const [method, setMethod] = useState<"rfid" | "fingerprint" | null>(null);

  const firestore = getFirestore();

  const bottomSheetRef = useRef<BottomSheetModalMethods>(null);

  useImperativeHandle(ref, () => ({
    present(lid, ld, m) {
      setLogId(lid);
      setLockData(ld);
      setMethod(m);
    },
  }));

  useEffect(() => {
    if (logId && lockData && method) {
      bottomSheetRef.current?.present();
    }
  }, [logId, lockData, method]);

  const currentOrg = useCurrentOrg();

  const handleSubmit = async () => {
    if (!user || !currentOrg || !logId) return;

    if (name.trim() === "") {
      setIsNameErrored(true);
      return;
    }

    setIsLoading(true);
    setIsNameErrored(false);

    try {
      if (method === "rfid") {
        const rfids = collection(firestore, "users", user.id, "rfids");

        await addDoc(rfids, {
          name: name.trim(),
          data: lockData,
        });

        await updateDoc(doc(firestore, "users", user.id), {
          rfids: arrayUnion(lockData),
        });
      } else {
        const fingerprints = collection(
          firestore,
          "users",
          user.id,
          "fingerprints"
        );

        await addDoc(fingerprints, {
          name: name.trim(),
          data: lockData,
        });

        await updateDoc(doc(firestore, "users", user.id), {
          fingerprints: arrayUnion(lockData),
        });
      }

      const q = query(
        collection(firestore, "orgs", currentOrg.id, "logs"),
        where("data", "==", lockData)
      );

      const logSnapshot = await getDocs(q);

      const batch = writeBatch(firestore);

      logSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      // @ts-ignore
      bottomSheetRef?.current?.close();
      setName("");
    } catch (e) {
      console.error("Error claiming login method: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
        onDismiss={() => {
          setLogId(null);
          setLockData(null);
          setMethod(null);
        }}
      >
        <BottomSheetView className="px-10 pt-4 pb-16">
          <Text className="font-poppins-semibold mb-6 text-center">
            Claim {method === "rfid" ? "RFID Card" : "Fingerprint"}
          </Text>
          <BottomSheetInput
            label="Name"
            onChange={setName}
            isError={isNameErrored}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-indigo-500 rounded-2xl py-5 mt-6 disabled:bg-indigo-300"
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text className="text-white text-center text-sm font-poppins-semibold">
              Claim
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
});

export default ClaimSheet;
