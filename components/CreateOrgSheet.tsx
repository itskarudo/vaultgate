import { Text, TouchableOpacity } from "react-native";
import React, { forwardRef, useContext, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import BottomSheetInput from "./BottomSheetInput";
import { authContext } from "@/contexts/authContext";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
} from "@react-native-firebase/firestore";

const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    pressBehavior="close"
    opacity={0.4}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
  />
);

const CreateOrgSheet = forwardRef<BottomSheet>((_, ref) => {
  const { user } = useContext(authContext);
  const [name, setName] = useState("");
  const [isNameErrored, setIsNameErrored] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const firestore = getFirestore();

  const handleSubmit = async () => {
    if (!user) return;

    if (name.trim() === "") {
      setIsNameErrored(true);
      return;
    }

    setIsLoading(true);
    setIsNameErrored(false);

    try {
      const org = await addDoc(collection(firestore, "orgs"), {
        name,
        members: [user.id],
      });

      const usersCollection = collection(firestore, "orgs", org.id, "users");

      await setDoc(doc(usersCollection, user.id), {
        displayName: user.displayName,
        role: "admin",
        allowedLocks: [],
        pinnedLocks: [],
        dismissedLogs: [],
        createdAt: new Date(),
      });

      // @ts-ignore
      ref?.current?.close();
      setName("");
    } catch (e) {
      console.error("Error creating organization: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BottomSheet
      ref={ref}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      index={-1}
      backgroundStyle={{
        backgroundColor: "#f5f5f5",
      }}
    >
      <BottomSheetView className="px-10 pt-4 pb-16">
        <Text className="font-poppins-semibold mb-6 text-center">
          New Organization
        </Text>
        <BottomSheetInput
          label="Name"
          value={name}
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
            Create Organization
          </Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default CreateOrgSheet;
