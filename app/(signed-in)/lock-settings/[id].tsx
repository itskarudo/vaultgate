import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { authContext } from "@/contexts/authContext";
import { OrgUser } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "@react-native-firebase/firestore";
import { useCurrentOrg } from "@/stores/orgsStore";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrashAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocks } from "@/stores/locksStore";
import AddMemberSheet from "@/components/AddMemberSheet";
import { useOrgUser, useOrgUsers } from "@/stores/orgUsersStore";
import LockMembersListItem from "@/components/LockMembersListItem";
import { merge } from "@/lib/merge";

const LockSettings = () => {
  const { id } = useLocalSearchParams();
  const { user } = useContext(authContext);
  const [allowedUsers, setAllowedUsers] = useState<OrgUser[]>([]);
  const currentOrg = useCurrentOrg();
  const orgUser = useOrgUser();

  const orgUsers = useOrgUsers();

  const firestore = getFirestore();

  const sheetRef = useRef<BottomSheetModal>(null);

  const locks = useLocks();
  const lock = useMemo(() => locks.find((l) => l.id === id), [locks, id]);

  useEffect(() => {
    if (!id || !user || !currentOrg || !lock) return;

    const q = query(
      collection(firestore, "orgs", currentOrg.id, "users"),
      where("allowedLocks", "array-contains", id)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const usersData: OrgUser[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as OrgUser[];

      setAllowedUsers(usersData);
    });

    return unsub;
  }, [currentOrg, user, lock]);

  const unallowedUsers = useMemo(
    () =>
      orgUsers.filter(
        (ou) =>
          !allowedUsers.some((au) => au.id === ou.id) && ou.role === "member"
      ),
    [orgUsers, allowedUsers]
  );

  const lockUsers = useMemo(
    () =>
      merge(
        allowedUsers,
        orgUsers.filter((ou) => ou.role === "admin"),
        (a, b) => a.id === b.id
      ),
    [allowedUsers, orgUsers]
  );

  const router = useRouter();

  const deleteHandler = async () => {
    if (!lock || !currentOrg) return;

    try {
      const lockRef = doc(firestore, "orgs", currentOrg.id, "locks", lock.id);
      await deleteDoc(lockRef);

      router.replace("/");
    } catch (error) {
      console.error("Error deleting lock:", error);
    }
  };

  if (!lock || !currentOrg) return null;

  return (
    <ScrollView className="flex-1 px-6 pt-16 h-full">
      <Stack.Screen
        name="org-settings/[id]"
        options={{
          title: `${lock.name} Settings`,
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
          <Text className="text-3xl font-poppins-bold">{lock.name}</Text>
        </View>
        {orgUser?.role === "admin" && (
          <View className="flex-row gap-4">
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-red-500 text-white p-3 rounded-xl aspect-square shadow-md font-poppins-medium"
              onPress={deleteHandler}
            >
              <FontAwesomeIcon icon={faTrashAlt} size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-indigo-500 text-white p-3 rounded-xl aspect-square shadow-md font-poppins-medium"
              onPress={() => {
                sheetRef.current?.present();
              }}
            >
              <FontAwesomeIcon icon={faUserPlus} size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View>
        {lockUsers.map((u, i) => (
          <LockMembersListItem
            key={u.id}
            index={i}
            entry={u}
            lock={lock}
            admin={orgUser?.role === "admin"}
          />
        ))}
      </View>
      <AddMemberSheet lock={lock} users={unallowedUsers} ref={sheetRef} />
    </ScrollView>
  );
};

export default LockSettings;
