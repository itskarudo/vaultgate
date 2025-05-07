import { View, Text, ScrollView } from "react-native";
import React from "react";
import LockListItem from "@/components/LockListItem";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "expo-router";
import { useLocks } from "@/stores/locksStore";
import { useCurrentOrg } from "@/stores/orgsStore";
import NoCurrentOrg from "@/components/NoCurrentOrg";
import { useOrgUser } from "@/stores/orgUsersStore";

const Devices = () => {
  const locks = useLocks();

  const currentOrg = useCurrentOrg();
  const orgUser = useOrgUser();

  if (!currentOrg) return <NoCurrentOrg />;

  return (
    <ScrollView className="flex-1 px-6 pt-16">
      <View className="flex-row justify-between items-center mb-10">
        <Text className="text-3xl font-poppins-bold">Your Locks</Text>
        {orgUser?.role === "admin" && (
          <Link
            href="/new-lock"
            className="bg-indigo-500 text-white p-3 rounded-xl aspect-square shadow-md font-poppins-medium"
          >
            <FontAwesomeIcon icon={faPlus} size={20} color="white" />
          </Link>
        )}
      </View>
      {locks.length === 0 ? (
        <View className="justify-center items-center py-4">
          <Text className="font-poppins-regular text-neutral-400">
            You have no locks yet.
          </Text>
        </View>
      ) : (
        <>
          {locks.map((lock) => (
            <LockListItem key={lock.id} lock={lock} />
          ))}
        </>
      )}
    </ScrollView>
  );
};

export default Devices;
