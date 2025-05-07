import { View, Text, TouchableOpacity } from "react-native";
import React, { forwardRef } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Organization } from "@/types";
import { useCurrentOrg, useOrgs, useOrgsActions } from "@/stores/orgsStore";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCog, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useCreateOrgSheetRef } from "@/stores/createOrgSheetStore";
import { useRouter } from "expo-router";

interface OrgSelectorSheetProps {
  onChange?: (index: number) => void;
}

const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    pressBehavior="close"
    opacity={0.4}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
  />
);

const OrgSelectorSheet = forwardRef<BottomSheet, OrgSelectorSheetProps>(
  ({ onChange }, ref) => {
    const createOrgSheetRef = useCreateOrgSheetRef();
    const router = useRouter();
    // const orgSettingsSheetRef = useRef<OrgSettingsSheetMethods>(null);

    const orgs = useOrgs();
    const currentOrg = useCurrentOrg();
    const { setCurrentOrg } = useOrgsActions();

    const renderListItem = ({ item }: { item: Organization }) => {
      const handleOpenSettings = () => {
        // @ts-ignore
        ref?.current?.close();
        // @ts-ignore
        router.push(`/org-settings/${item.id}`);
        // orgSettingsSheetRef.current?.present(item);
      };

      const pressHandler = () => {
        setCurrentOrg(() => item);
        // @ts-ignore
        ref?.current?.close();
      };
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          className="flex-row justify-between items-center px-6 py-5"
          onPress={pressHandler}
        >
          <View className="flex-row gap-2 items-center">
            <Text className="text-2xl">🏠</Text>
            <View>
              <Text className="font-poppins-medium text-sm">{item.name}</Text>
              <Text className="text-xs text-neutral-500 font-poppins-regular">
                {item.members.length} member{item.members.length !== 1 && "s"}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-2 items-center">
            {item.id === currentOrg?.id && (
              <View className="bg-neutral-100 px-2 py-1 rounded-full">
                <Text className="text-xs font-poppins-semibold text-neutral-600">
                  Current
                </Text>
              </View>
            )}
            <TouchableOpacity
              activeOpacity={0.5}
              className="py-2 pl-2"
              onPress={handleOpenSettings}
            >
              <FontAwesomeIcon icon={faCog} size={16} color="#737373" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <BottomSheet
        ref={ref}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        index={-1}
        onChange={onChange}
        backgroundStyle={{
          backgroundColor: "#f5f5f5",
        }}
      >
        <BottomSheetView className="px-10 pt-4 pb-12">
          <Text className="font-poppins-semibold mb-6 text-center">
            Organizations
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            className="flex-row gap-2 justify-center mb-4 items-center p-6 border-2 border-neutral-300 border-dashed rounded-xl"
            onPress={() => {
              // @ts-ignore
              ref?.current?.close();
              createOrgSheetRef?.current?.expand();
            }}
          >
            <FontAwesomeIcon icon={faPlus} size={16} color="#525252" />
            <Text className="font-poppins-medium text-sm text-neutral-600">
              Create a new organization
            </Text>
          </TouchableOpacity>
          <BottomSheetFlatList
            data={orgs}
            keyExtractor={(org) => org.id}
            renderItem={renderListItem}
            ItemSeparatorComponent={() => (
              <View className="w-full h-[1px] bg-neutral-100"></View>
            )}
            contentContainerClassName="bg-white rounded-xl"
          />
        </BottomSheetView>
        {/* <OrgSettingsSheet ref={orgSettingsSheetRef} /> */}
      </BottomSheet>
    );
  }
);

export default OrgSelectorSheet;
