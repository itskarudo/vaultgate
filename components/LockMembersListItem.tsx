import { View, Text, Image, TouchableOpacity } from "react-native";
import avatar1 from "@/assets/images/avatar1.png";
import avatar2 from "@/assets/images/avatar2.png";
import avatar3 from "@/assets/images/avatar3.png";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { Lock, OrgUser } from "@/types";
import {
  faBan,
  faCrown,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import {
  arrayRemove,
  deleteDoc,
  doc,
  getFirestore,
  updateDoc,
} from "@react-native-firebase/firestore";
import React, { forwardRef, useContext, useRef } from "react";
import { authContext } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { useCurrentOrg } from "@/stores/orgsStore";

interface MembersListItemProps {
  lock: Lock;
  entry: OrgUser;
  index: number;
  admin: boolean;
}

const avatars = [avatar1, avatar2, avatar3];

interface WrapperProps {
  admin: boolean;
  entry: OrgUser;
  rightRenderer: (prog: SharedValue<number>) => React.JSX.Element;
}

const Wrapper = forwardRef<
  SwipeableMethods,
  React.PropsWithChildren<WrapperProps>
>(({ admin, rightRenderer, children, entry }, ref) => {
  if (admin && entry.role === "member") {
    return (
      <Swipeable
        ref={ref}
        rightThreshold={50}
        renderRightActions={rightRenderer}
        containerStyle={{ overflow: "visible" }}
      >
        {children}
      </Swipeable>
    );
  } else {
    return <View>{children}</View>;
  }
});

const LockMembersListItem = ({
  lock,
  index,
  entry,
  admin,
}: MembersListItemProps) => {
  const { user } = useContext(authContext);

  const currentOrg = useCurrentOrg();
  const firestore = getFirestore();

  const router = useRouter();

  const ref = useRef<SwipeableMethods>(null);

  const kickHandler = async () => {
    if (!user || !currentOrg) return;

    const userDoc = doc(firestore, "orgs", currentOrg.id, "users", entry.id);
    await updateDoc(userDoc, {
      allowedLocks: arrayRemove(lock.id),
    });

    const lockDoc = doc(firestore, "orgs", currentOrg.id, "locks", lock.id);
    await updateDoc(lockDoc, {
      allowedMembers: arrayRemove(entry.id),
    });

    ref.current?.close?.();

    if (entry.id === user.id) {
      router.back();
    }
  };

  const renderKickButton = (prog: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ rotateZ: `${Math.floor(prog.value * 10)}deg` }],
      };
    });
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className="my-4 mr-2 pl-4"
        onPress={kickHandler}
      >
        <Animated.View
          className="bg-red-500 rounded-2xl aspect-square size-full p-5 justify-center items-center"
          style={styleAnimation}
        >
          <FontAwesomeIcon
            icon={user?.id === entry.id ? faRightFromBracket : faBan}
            size={24}
            color="white"
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Wrapper
      ref={ref}
      admin={admin}
      rightRenderer={renderKickButton}
      entry={entry}
    >
      <View className="relative overflow-hidden flex flex-row justify-between items-center bg-white shadow-lg px-5 py-3 my-2 rounded-2xl">
        <View className="flex-row items-center">
          <Image
            source={avatars[index % avatars.length]}
            className="size-14 mr-5"
            resizeMode="contain"
          />
          <View>
            <Text className="font-poppins-medium">
              {entry.displayName}
              {entry.id === user?.id && " (You)"}
            </Text>
          </View>
        </View>
        {entry.role === "admin" && (
          <View className="items-center">
            <FontAwesomeIcon icon={faCrown} size={20} color="#eab308" />
          </View>
        )}
      </View>
    </Wrapper>
  );
};

export default LockMembersListItem;
