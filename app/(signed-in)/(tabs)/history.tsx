import { View, Text, ScrollView } from "react-native";
import React, { useRef } from "react";
import { useCurrentOrg } from "@/stores/orgsStore";
import NoCurrentOrg from "@/components/NoCurrentOrg";
import { useLogs } from "@/stores/logStore";
import FailedAttemptListItem from "@/components/FailedAttemptListItem";
import HistoryListItem from "@/components/HistoryListItem";
import ClaimSheet, { ClaimSheetMethods } from "@/components/ClaimSheet";

const HistoryPage = () => {
  const currentOrg = useCurrentOrg();

  const logs = useLogs();

  const bottomSheetModalRef = useRef<ClaimSheetMethods>(null);

  const claimHandler = async (
    logId: string,
    lockData: string,
    method: "rfid" | "fingerprint"
  ) => {
    bottomSheetModalRef.current?.present(logId, lockData, method);
  };

  if (!currentOrg) return <NoCurrentOrg />;

  return (
    <ScrollView className="flex-1 px-6 py-16">
      <Text className="text-3xl font-poppins-bold mb-10">Your History</Text>
      <View className="mb-24">
        {logs.map((log) =>
          log.failed ? (
            <FailedAttemptListItem
              entry={log}
              claimHandler={claimHandler}
              key={log.id}
            />
          ) : (
            <HistoryListItem entry={log} key={log.id} />
          )
        )}
      </View>
      <ClaimSheet ref={bottomSheetModalRef} />
    </ScrollView>
  );
};

export default HistoryPage;
