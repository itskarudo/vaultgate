import { Text, TouchableOpacity, View } from "react-native";
import avatar1 from "@/assets/images/avatar1.png";
import avatar2 from "@/assets/images/avatar2.png";
import avatar3 from "@/assets/images/avatar3.png";
import React, { forwardRef } from "react";
import { Image } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  arrayUnion,
  doc,
  getFirestore,
  updateDoc,
} from "@react-native-firebase/firestore";
import { Lock, OrgUser } from "@/types";
import { useCurrentOrg } from "@/stores/orgsStore";

const avatars = [avatar1, avatar2, avatar3];

const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    pressBehavior="close"
    opacity={0.4}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
  />
);

interface AddMemberSheetProps {
  lock: Lock;
  users: OrgUser[];
}

const AddMemberSheet = forwardRef<BottomSheetModal, AddMemberSheetProps>(
  ({ lock, users }, ref) => {
    const firestore = getFirestore();
    const currentOrg = useCurrentOrg();

    const renderListItem = ({
      item,
      index,
    }: {
      item: OrgUser;
      index: number;
    }) => {
      const pressHandler = async () => {
        if (!currentOrg) return;
        await updateDoc(
          doc(firestore, "orgs", currentOrg.id, "locks", lock.id),
          {
            allowedMembers: arrayUnion(item.id),
          }
        );

        await updateDoc(
          doc(firestore, "orgs", currentOrg.id, "users", item.id),
          {
            allowedLocks: arrayUnion(lock.id),
          }
        );
      };

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          className="flex-row justify-between items-center px-6 py-4 my-2 bg-white rounded-xl shadow-sm"
          onPress={pressHandler}
        >
          <View className="flex-row gap-2 items-center">
            <Image
              source={avatars[index % avatars.length]}
              className="size-12 mr-4"
              resizeMode="contain"
            />
            <View>
              <Text className="font-poppins-medium">{item.displayName}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing={false}
        snapPoints={["30%"]}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        index={0}
        backgroundStyle={{
          backgroundColor: "#f5f5f5",
        }}
      >
        <BottomSheetView className="px-10 pt-4 pb-16">
          <Text className="font-poppins-semibold mb-6 text-center">
            Add a member to {lock.name}
          </Text>

          {users.length === 0 ? (
            <Text className="text-sm font-poppins-semibold text-neutral-500 text-center">
              All users are allowed access to this lock.
            </Text>
          ) : (
            <BottomSheetFlatList
              data={users}
              keyExtractor={(u) => u.id}
              renderItem={renderListItem}
            />
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default AddMemberSheet;
