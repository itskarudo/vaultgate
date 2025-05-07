import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useCurrentOrg } from "@/stores/orgsStore";
import NoCurrentOrg from "@/components/NoCurrentOrg";
import { useLogs } from "@/stores/logStore";
import FailedAttemptListItem from "@/components/FailedAttemptListItem";
import HistoryListItem from "@/components/HistoryListItem";

const HistoryPage = () => {
  const currentOrg = useCurrentOrg();

  const logs = useLogs();

  if (!currentOrg) return <NoCurrentOrg />;

  return (
    <ScrollView className="flex-1 px-6 py-16">
      <Text className="text-3xl font-poppins-bold mb-10">Your History</Text>
      <View className="mb-24">
        {logs.map((log) =>
          log.failed ? (
            <FailedAttemptListItem
              entry={log}
              key={log.id}
              onClear={() => {}}
            />
          ) : (
            <HistoryListItem entry={log} key={log.id} />
          )
        )}
      </View>
    </ScrollView>
  );
};

export default HistoryPage;
