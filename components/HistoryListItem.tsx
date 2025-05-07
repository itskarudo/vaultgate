import { View, Text, Image } from "react-native";
import fingerprint from "@/assets/images/fingerprint.png";
import rfid from "@/assets/images/rfid.png";
import phone from "@/assets/images/phone.png";
import { useMemo } from "react";
import { Log } from "@/types";

const dateOpts = {
  day: "2-digit" as const,
  month: "short" as const,
  year: "numeric" as const,
};
const timeOps = {
  hour: "2-digit" as const,
  minute: "2-digit" as const,
  second: "2-digit" as const,
  hour12: true,
};

const HistoryListItem = ({ entry }: { entry: Log }) => {
  if (entry.failed) return;

  const icon = useMemo(() => {
    switch (entry.method) {
      case "phone":
        return phone;
      case "fingerprint":
        return fingerprint;
      case "rfid":
        return rfid;
    }
  }, []);

  return (
    <View className="overflow-hidden flex flex-row justify-between items-center bg-white shadow-lg p-5 my-2 rounded-2xl">
      <View className="flex-row items-center">
        <Image source={icon} className="size-10 mr-5" resizeMode="contain" />
        <View>
          <Text className="font-poppins-medium">{entry.lockName}</Text>
          <Text className="font-poppins-medium text-sm text-gray-500">
            {entry.userDisplayName}
          </Text>
        </View>
      </View>
      <View className="items-center">
        <Text className="text-sm text-gray-500 font-poppins-medium">
          {entry.timestamp.toDate().toLocaleTimeString("en-US", timeOps)}
        </Text>
        <Text className="text-sm text-gray-500 font-poppins-medium">
          {entry.timestamp.toDate().toLocaleDateString("en-GB", dateOpts)}
        </Text>
      </View>
    </View>
  );
};

export default HistoryListItem;
