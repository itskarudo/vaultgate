import { Tabs } from "expo-router";
import React, { useContext, useRef, useState } from "react";
import { authContext } from "@/contexts/authContext";
import { useCurrentOrg } from "@/stores/orgsStore";
import { faChartLine } from "@fortawesome/free-solid-svg-icons/faChartLine";
import OrgSelectorSheet from "@/components/OrgSelectorSheet";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons/faClockRotateLeft";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
import { Text, View, TouchableOpacity } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import CreateOrgSheet from "@/components/CreateOrgSheet";
import { useCreateOrgSheetRef } from "@/stores/createOrgSheetStore";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useInvites } from "@/stores/invitesStore";

interface BarIconProps {
  focused: boolean;
  icon: IconDefinition;
}

const BarIcon: React.FC<React.PropsWithChildren<BarIconProps>> = ({
  focused,
  icon,
  children,
}) => {
  return (
    <View className="relative size-full flex justify-center items-center mt-6">
      {children}
      <FontAwesomeIcon
        icon={icon}
        color={focused ? "#6366f1" : "#aaa"}
        size={20}
      />
    </View>
  );
};

const SignedInLayout = () => {
  const { user } = useContext(authContext);
  const currentOrg = useCurrentOrg();

  const [orgsOpen, setOrgsOpen] = useState(false);
  const orgSelectorSheetRef = useRef<BottomSheet>(null);

  const createOrgSheetRef = useCreateOrgSheetRef();

  const invites = useInvites();

  const handleToggle = () => {
    if (orgsOpen) orgSelectorSheetRef.current?.close();
    else orgSelectorSheetRef.current?.expand();
  };

  return (
    <View className="h-full">
      <View className="flex-row mx-6 my-3 items-center justify-between">
        <Text className="text-lg font-poppins-bold">
          Welcome, {user?.displayName}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          className="py-4 flex-row gap-2 items-center"
          onPress={handleToggle}
        >
          <View className="flex-row">
            <Text className="mr-2">🏠</Text>
            <Text className="font-poppins-medium text-sm">
              {currentOrg?.name || "Select..."}
            </Text>
          </View>
          <FontAwesomeIcon icon={faCaretDown} size={12} />
        </TouchableOpacity>
      </View>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 60,
            borderRadius: 30,
            marginHorizontal: 15,
            marginBottom: 20,
          },
        }}
      >
        <Tabs.Screen
          name="stats"
          options={{
            title: "Statistics",
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <BarIcon focused={focused} icon={faChartLine} />
            ),
          }}
        />
        <Tabs.Screen
          name="devices"
          options={{
            title: "Devices",
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <BarIcon focused={focused} icon={faLock} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <BarIcon focused={focused} icon={faClockRotateLeft} />
            ),
          }}
        />
        <Tabs.Screen
          name="invites"
          options={{
            title: "Invites",
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <BarIcon focused={focused} icon={faBell}>
                {invites.length !== 0 && (
                  <View className="absolute top-0 left-0 z-10 rounded-full bg-red-400 w-3 h-3"></View>
                )}
              </BarIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <BarIcon focused={focused} icon={faUser} />
            ),
          }}
        />
      </Tabs>
      <OrgSelectorSheet
        ref={orgSelectorSheetRef}
        onChange={(index) => {
          setOrgsOpen(index !== -1);
        }}
      />
      <CreateOrgSheet ref={createOrgSheetRef} />
    </View>
  );
};

export default SignedInLayout;
