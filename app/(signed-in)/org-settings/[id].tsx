import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { authContext } from "@/contexts/authContext";
import { OrgUser } from "@/types";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
} from "@react-native-firebase/firestore";
import { useOrgs } from "@/stores/orgsStore";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import InviteUserSheet from "@/components/InviteUserSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import MembersListItem from "@/components/MembersListItem";

const OrgSettings = () => {
  const { id } = useLocalSearchParams();
  const { user } = useContext(authContext);
  const [users, setUsers] = useState<OrgUser[]>([]);

  const firestore = getFirestore();

  const sheetRef = useRef<BottomSheetModal>(null);

  const orgs = useOrgs();
  const org = useMemo(() => orgs.find((l) => l.id === id), [orgs, id]);

  useEffect(() => {
    if (!id || !user || !org) return;

    const q = query(collection(firestore, "orgs", id as string, "users"));
    const unsub = onSnapshot(q, (snapshot) => {
      const usersData: OrgUser[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as OrgUser[];
      setUsers(usersData);
    });

    return unsub;
  }, []);

  const orgUser = useMemo(() => users.find((u) => u.id === user?.id), [users]);

  if (!org) return null;

  return (
    <ScrollView className="flex-1 px-6 pt-16">
      <Stack.Screen
        name="org-settings/[id]"
        options={{
          title: `${org.name} Settings`,
          headerShown: true,
          headerTitleStyle: {
            FontFamily: "Poppins_700Bold",
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      />
      <View className="flex-row justify-between items-center mb-10">
        <View className="flex-row gap-3 items-center">
          <Text className="text-3xl">🏠</Text>
          <Text className="text-3xl font-poppins-bold">{org.name}</Text>
        </View>
        {orgUser?.role === "admin" && (
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-indigo-500 text-white p-3 rounded-xl aspect-square shadow-md font-poppins-medium"
            onPress={() => sheetRef.current?.present()}
          >
            <FontAwesomeIcon icon={faUserPlus} size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <View>
        {users.map((u, i) => (
          <MembersListItem
            key={u.id}
            index={i}
            entry={u}
            org={org}
            admin={orgUser?.role === "admin"}
          />
        ))}
      </View>
      <InviteUserSheet org={org} ref={sheetRef} />
    </ScrollView>
  );
};

export default OrgSettings;
