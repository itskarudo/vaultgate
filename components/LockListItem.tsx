import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { faLockOpen } from "@fortawesome/free-solid-svg-icons/faLockOpen";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  View,
  Image,
  Text,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import lockImg from "@/assets/images/lock.png";
import { useCallback, useContext, useEffect, useRef } from "react";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from "@react-native-firebase/firestore";
import { useCurrentOrg } from "@/stores/orgsStore";
import { Lock, Log } from "@/types";
import { authContext } from "@/contexts/authContext";
import {
  faThumbtack,
  faThumbtackSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";
import { useOrgUser } from "@/stores/orgUsersStore";

interface LockListItemProps {
  lock: Lock;
}

const LockListItem = ({ lock }: LockListItemProps) => {
  const firestore = getFirestore();
  const currentOrg = useCurrentOrg();

  const ref = useRef<SwipeableMethods>(null);

  const { user } = useContext(authContext);
  const orgUser = useOrgUser();

  const switchPinState = useCallback(
    async (lock: Lock, pinned: boolean) => {
      if (!user || !currentOrg) return;
      const docRef = doc(firestore, "orgs", currentOrg.id, "users", user.id);
      try {
        await updateDoc(docRef, {
          pinnedLocks: pinned ? arrayRemove(lock.id) : arrayUnion(lock.id),
        });
        ref.current?.close();
      } catch (e) {
        console.log("fuck sake");
      }
    },
    [currentOrg]
  );

  const renderPinButton = useCallback(
    (prog: SharedValue<number>) => {
      if (!orgUser) return null;

      const isPinned = orgUser.pinnedLocks.includes(lock.id);

      const styleAnimation = useAnimatedStyle(() => {
        return {
          transform: [{ rotateZ: `${Math.floor(prog.value * 10)}deg` }],
        };
      });

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          className="my-4 mr-2 pl-4"
          onPress={() => switchPinState(lock, isPinned)}
        >
          <Animated.View
            className="bg-indigo-500 rounded-2xl aspect-square size-full p-5 justify-center items-center"
            style={styleAnimation}
          >
            <FontAwesomeIcon
              icon={isPinned ? faThumbtackSlash : faThumbtack}
              size={isPinned ? 30 : 24}
              color="white"
            />
          </Animated.View>
        </TouchableOpacity>
      );
    },
    [lock, orgUser]
  );

  const unlockIconTranslateY = useSharedValue(lock.open ? 0 : -50);

  const lockedIconTranslateY = useDerivedValue(() => {
    return unlockIconTranslateY.value + 50;
  });

  const pressHandler = async () => {
    if (!currentOrg || !user) return;

    const lockRef = doc(firestore, "orgs", currentOrg?.id, "locks", lock.id);

    const newDoc = { ...lock, open: !lock.open };
    await setDoc(lockRef, newDoc, { merge: true });

    if (!lock.open) {
      // it's open now after the press, send log
      await addDoc(collection(firestore, "orgs", currentOrg.id, "logs"), {
        failed: false,
        lockId: lock.id,
        lockName: lock.name,
        method: "phone",
        timestamp: new Date(),
        userId: user.id,
        userDisplayName: user.displayName,
      });
    }
  };

  useEffect(() => {
    unlockIconTranslateY.value = withSpring(lock.open ? 0 : -50);
  }, [lock.open]);

  const router = useRouter();

  return (
    <Swipeable
      rightThreshold={50}
      leftThreshold={50}
      renderRightActions={renderPinButton}
      containerStyle={{ overflow: "visible" }}
      ref={ref}
    >
      <TouchableHighlight
        onPress={pressHandler}
        onLongPress={() => {
          router.push(`lock-settings/${lock.id}`);
        }}
        className="my-2 rounded-2xl bg-white shadow-lg"
        underlayColor="#f8f8f8"
      >
        <View className="overflow-hidden  flex flex-row justify-between items-center p-5">
          <View className="flex-row items-center">
            <Image
              source={lockImg}
              className="size-10 mr-5"
              resizeMode="contain"
            />
            <Text className="font-poppins-medium text-md">{lock.name}</Text>
          </View>
          <Animated.View
            className="absolute right-5"
            style={{
              top: "70%",
              transform: [{ translateY: unlockIconTranslateY }],
            }}
          >
            <FontAwesomeIcon icon={faLockOpen} size={20} color="#6366f1" />
          </Animated.View>
          <Animated.View
            className="absolute right-5"
            style={{
              top: "70%",
              transform: [{ translateY: lockedIconTranslateY }],
            }}
          >
            <FontAwesomeIcon icon={faLock} size={20} color="#f87171" />
          </Animated.View>
        </View>
      </TouchableHighlight>
    </Swipeable>
  );
};

export default LockListItem;
