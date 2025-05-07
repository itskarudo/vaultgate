import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import LockListItem from "@/components/LockListItem";
import HistoryListItem from "@/components/HistoryListItem";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons/faCircleExclamation";
import FailedAttemptListItem from "@/components/FailedAttemptListItem";
import { useMemo } from "react";
import { useCurrentOrg } from "@/stores/orgsStore";
import { useLocks } from "@/stores/locksStore";
import NoCurrentOrg from "@/components/NoCurrentOrg";
import { useOrgUser } from "@/stores/orgUsersStore";
import { useLogs } from "@/stores/logStore";

const Stats = () => {
  const currentOrg = useCurrentOrg();

  const locks = useLocks();
  const orgUser = useOrgUser();

  const pinnedLocks = useMemo(
    () => locks.filter((lock) => orgUser?.pinnedLocks.includes(lock.id)),
    [locks, orgUser]
  );

  const logs = useLogs();

  const failedLogs = useMemo(() => logs.filter((h) => h.failed), [logs]);

  const successfulLogs = useMemo(() => {
    const result = [];
    for (const log of logs) {
      if (result.length === 3) break;
      if (!log.failed) {
        result.push(log);
      }
    }
    return result;
  }, [logs]);

  if (!currentOrg) return <NoCurrentOrg />;

  return (
    <ScrollView className="flex-1 px-6 pt-6">
      {failedLogs.length !== 0 && (
        <View className="mb-10">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row gap-3 items-center">
              <FontAwesomeIcon
                icon={faCircleExclamation}
                size={20}
                color="#ef4444"
              />
              <Text className="text-xl font-poppins-semibold items-center">
                Failed Attempts
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-red-500 px-4 py-2 rounded-xl shadow-md"
            >
              <Text className="text-white text-sm font-poppins-medium">
                Clear all
              </Text>
            </TouchableOpacity>
          </View>
          {failedLogs.map((entry) => (
            <FailedAttemptListItem
              entry={entry}
              onClear={(entry) => {
                // setHistory((prev) => prev.filter((h) => h.id !== entry.id));
              }}
              key={entry.id}
            />
          ))}
        </View>
      )}
      <View className="mb-10">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-poppins-semibold items-center">
            Your Locks
          </Text>
          <Link
            href="/devices"
            className="bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm shadow-md font-poppins-medium"
          >
            View all
          </Link>
        </View>
        {pinnedLocks.length === 0 ? (
          <View className="justify-center items-center py-4">
            <Text className="font-poppins-regular text-neutral-400">
              Pin a lock to show up here!
            </Text>
          </View>
        ) : (
          <>
            {pinnedLocks.map((lock) => (
              <LockListItem key={lock.id} lock={lock} />
            ))}
          </>
        )}
      </View>
      <View className="mb-28">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-poppins-semibold items-center">
            History
          </Text>
          <Link
            href="/history"
            className="bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm shadow-md font-poppins-medium"
          >
            View all
          </Link>
        </View>
        {successfulLogs.length === 0 ? (
          <View className="justify-center items-center py-4">
            <Text className="font-poppins-regular text-neutral-400">
              No history yet!
            </Text>
          </View>
        ) : (
          <>
            {successfulLogs.map((entry) => (
              <HistoryListItem entry={entry} key={entry.id} />
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default Stats;
