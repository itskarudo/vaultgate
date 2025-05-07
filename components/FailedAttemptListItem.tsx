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
  onClear: (entry: Log) => void | Promise<void>;
}

const FailedAttemptListItem = ({
  entry,
  onClear,
}: FailedAttemptListItemProps) => {
  const icon = useMemo(() => {
    switch (entry.method) {
      case "fingerprint":
        return fingerprint;
      case "rfid":
        return rfid;
    }
  }, []);

  const clearHandler = async () => {
    try {
      await onClear(entry);
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

  const renderCreateUserButton = (prog: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ rotateZ: `-${Math.floor(prog.value * 10)}deg` }],
      };
    });
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className="my-4 ml-2 pr-4"
        onPress={() => {}}
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

  return (
    <Swipeable
      rightThreshold={50}
      leftThreshold={50}
      renderRightActions={renderClearButton}
      renderLeftActions={renderCreateUserButton}
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
