import { View, Text, Image, TouchableOpacity } from "react-native";
import fingerprint from "@/assets/images/fingerprint.png";
import rfid from "@/assets/images/rfid.png";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons/faCircleExclamation";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons/faTrashAlt";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Log } from "@/types";
import { deleteDoc, doc, getFirestore } from "@react-native-firebase/firestore";
import { useCurrentOrg } from "@/stores/orgsStore";
import { useOrgUser } from "@/stores/orgUsersStore";

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

interface FailedAttemptListItemProps {
  entry: Log;
  claimHandler: (
    lockId: string,
    lockData: string,
    method: "rfid" | "fingerprint"
  ) => void;
}

const FailedAttemptListItem = ({
  entry,
  claimHandler,
}: FailedAttemptListItemProps) => {
  const icon = useMemo(() => {
    switch (entry.method) {
      case "fingerprint":
        return fingerprint;
      case "rfid":
        return rfid;
    }
  }, []);

  const user = useOrgUser();
  const org = useCurrentOrg();
  const firestore = getFirestore();

  const clearHandler = async () => {
    if (!org) return;
    try {
      const docRef = doc(firestore, "orgs", org.id, "logs", entry.id);
      await deleteDoc(docRef);
    } catch (e) {
      console.log("huh");
    }
  };

  const renderClearButton = (prog: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ rotateZ: `${Math.floor(prog.value * 10)}deg` }],
      };
    });
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className="my-4 mr-2 pl-4"
        onPress={clearHandler}
      >
        <Animated.View
          className="bg-red-500 rounded-2xl aspect-square size-full p-5 justify-center items-center"
          style={styleAnimation}
        >
          <FontAwesomeIcon icon={faTrashAlt} size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderClaimButton = (prog: SharedValue<number>) => {
    if (entry.method === "phone") return;
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ rotateZ: `-${Math.floor(prog.value * 10)}deg` }],
      };
    });
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className="my-4 ml-2 pr-4"
        onPress={() => claimHandler(entry.id, entry.data, entry.method)}
      >
        <Animated.View
          className="bg-indigo-500 rounded-2xl aspect-square size-full p-5 justify-center items-center"
          style={styleAnimation}
        >
          <FontAwesomeIcon icon={faUserPlus} size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  if (entry.method === "phone") return;

  return (
    <Swipeable
      rightThreshold={50}
      leftThreshold={50}
      renderRightActions={renderClearButton}
      renderLeftActions={renderClaimButton}
      containerStyle={{ overflow: "visible" }}
    >
      <View className="relative overflow-hidden flex flex-row justify-between items-center bg-white shadow-lg p-5 my-2 rounded-2xl">
        <View className="flex-row items-center">
          <View className="absolute z-10 bottom-0 left-8">
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size={16}
              color="#f87171"
            />
          </View>
          <Image source={icon} className="size-10 mr-5" resizeMode="contain" />
          <View>
            <Text className="font-poppins-medium">{entry.lockName}</Text>
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
    </Swipeable>
  );
};

export default FailedAttemptListItem;
