import { Text, ScrollView, View } from "react-native";
import React from "react";
import { useInvites } from "@/stores/invitesStore";
import InviteListItem from "@/components/InviteListItem";

const Invites = () => {
  const invites = useInvites();

  return (
    <ScrollView className="flex-1 px-6 pt-16">
      <Text className="text-3xl font-poppins-bold mb-10">Invites</Text>
      {invites.length === 0 ? (
        <View className="justify-center items-center py-4">
          <Text className="font-poppins-regular text-neutral-400">
            You have no invites.
          </Text>
        </View>
      ) : (
        <View>
          {invites.map((invite) => (
            <InviteListItem key={invite.id} entry={invite} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Invites;
