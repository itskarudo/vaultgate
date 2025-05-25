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
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Fingerprint, RFID } from "@/types";
import { deleteDoc, doc, getFirestore } from "@react-native-firebase/firestore";
import { useOrgUser } from "@/stores/orgUsersStore";

type UnlockMethodListItemProps =
  | {
      type: "rfid";
      entry: RFID;
    }
  | {
      type: "fingerprint";
      entry: Fingerprint;
    };

const UnlockMethodListItem = ({ type, entry }: UnlockMethodListItemProps) => {
  const icon = useMemo(() => {
    switch (type) {
      case "fingerprint":
        return fingerprint;
      case "rfid":
        return rfid;
    }
  }, []);

  const user = useOrgUser();
  const firestore = getFirestore();

  const clearHandler = async () => {
    if (!user) return;
    try {
      const docRef = doc(firestore, "users", user.id, type + "s", entry.id);
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

  return (
    <Swipeable
      rightThreshold={50}
      leftThreshold={50}
      renderRightActions={renderClearButton}
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
            <Text className="font-poppins-medium">{entry.name}</Text>
          </View>
        </View>
      </View>
    </Swipeable>
  );
};

export default UnlockMethodListItem;
