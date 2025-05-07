import { View, Text, Image, TouchableOpacity } from "react-native";
import inviteImg from "@/assets/images/invite.png";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Invite } from "@/types";
import { faCheck, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from "@react-native-firebase/firestore";
import { useContext } from "react";
import { authContext } from "@/contexts/authContext";

interface InviteListItemProps {
  entry: Invite;
}

const InviteListItem = ({ entry }: InviteListItemProps) => {
  const { user } = useContext(authContext);

  const firestore = getFirestore();

  const dismissHandler = async () => {
    const inviteDoc = doc(firestore, "invites", entry.id);
    try {
      await deleteDoc(inviteDoc);
    } catch (e) {
      console.log("wut");
    }
  };

  const acceptHandler = async () => {
    if (!user) return;

    const orgDoc = doc(firestore, "orgs", entry.orgId);

    await updateDoc(orgDoc, {
      members: arrayUnion(user.id),
    });

    const usersCollection = collection(firestore, "orgs", entry.orgId, "users");

    await setDoc(doc(usersCollection, user.id), {
      displayName: user.displayName,
      role: "member",
      allowedLocks: [],
      pinnedLocks: [],
      dismissedLogs: [],
      createdAt: new Date(),
    });

    await dismissHandler();
  };

  const renderDismissButton = (prog: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ rotateZ: `${Math.floor(prog.value * 10)}deg` }],
      };
    });
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className="my-4 mr-2 pl-4"
        onPress={dismissHandler}
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

  const renderAcceptButton = (prog: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ rotateZ: `-${Math.floor(prog.value * 10)}deg` }],
      };
    });
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className="my-4 ml-2 pr-4"
        onPress={acceptHandler}
      >
        <Animated.View
          className="bg-indigo-500 rounded-2xl aspect-square size-full p-5 justify-center items-center"
          style={styleAnimation}
        >
          <FontAwesomeIcon icon={faCheck} size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      rightThreshold={50}
      leftThreshold={50}
      renderRightActions={renderDismissButton}
      renderLeftActions={renderAcceptButton}
      containerStyle={{ overflow: "visible" }}
    >
      <View className="relative overflow-hidden flex flex-row justify-between items-center bg-white shadow-lg p-5 my-2 rounded-2xl">
        <View className="flex-row items-center">
          <Image
            source={inviteImg}
            className="size-10 mr-5"
            resizeMode="contain"
          />
          <View>
            <Text className="font-poppins-medium">{entry.orgName}</Text>
          </View>
        </View>
        <View className="items-center">
          <Text className="text-sm text-gray-500 font-poppins-medium">
            invited by
          </Text>
          <Text className="text-sm text-gray-500 font-poppins-medium">
            {entry.inviterDisplayName}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
};

export default InviteListItem;
