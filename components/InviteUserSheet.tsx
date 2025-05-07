import { Text, TouchableOpacity } from "react-native";
import React, { forwardRef, useContext, useState } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import BottomSheetInput from "./BottomSheetInput";
import { authContext } from "@/contexts/authContext";
import {
  addDoc,
  collection,
  getFirestore,
} from "@react-native-firebase/firestore";
import { Organization } from "@/types";

const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    pressBehavior="close"
    opacity={0.4}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
  />
);

interface InviteUserSheetProps {
  org: Organization;
}

const InviteUserSheet = forwardRef<BottomSheetModal, InviteUserSheetProps>(
  ({ org }, ref) => {
    const { user } = useContext(authContext);
    const [email, setEmail] = useState("");
    const [isEmailErrored, setIsEmailErrored] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const firestore = getFirestore();

    const handleSubmit = async () => {
      if (!user) return;

      if (email.trim() === "" || email === user.email) {
        setIsEmailErrored(true);
        return;
      }

      setIsLoading(true);
      setIsEmailErrored(false);

      try {
        await addDoc(collection(firestore, "invites"), {
          inviterId: user.id,
          inviterDisplayName: user.displayName,
          inviteeEmail: email,
          orgId: org.id,
          orgName: org.name,
          createdAt: new Date(),
        });

        // @ts-ignore
        ref?.current?.close();
        setEmail("");
      } catch (e) {
        console.error("Error creating organization: ", e);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <BottomSheetModal
        ref={ref}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: "#f5f5f5",
        }}
      >
        <BottomSheetView className="px-10 pt-4 pb-16">
          <Text className="font-poppins-semibold mb-6 text-center">
            Invite User to {org.name}
          </Text>
          <BottomSheetInput
            label="Email"
            onChange={setEmail}
            isError={isEmailErrored}
            keyboardType="email-address"
          />
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-indigo-500 rounded-2xl py-5 mt-6 disabled:bg-indigo-300"
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text className="text-white text-center text-sm font-poppins-semibold">
              Invite User
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default InviteUserSheet;
