import { Text, ScrollView, View, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import { getAuth } from "@react-native-firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { authContext } from "@/contexts/authContext";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
} from "@react-native-firebase/firestore";
import { Fingerprint, RFID } from "@/types";
import UnlockMethodListItem from "@/components/UnlockMethodListItem";

const Account = () => {
  const auth = getAuth();
  const { user } = useContext(authContext);

  const [rfids, setRfids] = React.useState<RFID[]>([]);
  const [fingerprints, setFingerprints] = React.useState<Fingerprint[]>([]);

  const firestore = getFirestore();

  useEffect(() => {
    if (!user) return;
    const q = query(collection(firestore, "users", user.id, "rfids"));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedRfids: RFID[] = [];
      snapshot.forEach((doc) => {
        fetchedRfids.push({ ...doc.data(), id: doc.id } as RFID);
      });
      setRfids(fetchedRfids);
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(firestore, "users", user.id, "fingerprints"));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedFingerprints: Fingerprint[] = [];
      snapshot.forEach((doc) => {
        fetchedFingerprints.push({ ...doc.data(), id: doc.id } as Fingerprint);
      });
      setFingerprints(fetchedFingerprints);
    });
    return unsub;
  }, [user]);

  return (
    <ScrollView className="flex-1 px-6 pt-8">
      <View className="flex-row items-center gap-6 mb-8">
        <FontAwesomeIcon icon={faUserCircle} size={64} color="#4f46e5" />
        <View>
          <Text className="text-3xl font-poppins-bold">
            {user?.displayName}
          </Text>
          <Text className="font-poppins-regular text-sm">{user?.email}</Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-red-500 p-4 rounded-2xl"
        onPress={auth.signOut}
      >
        <Text className="text-white font-poppins-medium text-center">
          Sign Out
        </Text>
      </TouchableOpacity>
      {rfids.length > 0 && (
        <View>
          <Text className="text-2xl font-poppins-bold items-center mt-10 mb-5">
            RFID Cards
          </Text>
          {rfids.map((rfid, index) => (
            <UnlockMethodListItem key={index} type="rfid" entry={rfid} />
          ))}
        </View>
      )}
      {fingerprints.length > 0 && (
        <View>
          <Text className="text-2xl font-poppins-bold items-center mt-10 mb-5">
            Fingerprints
          </Text>
          {fingerprints.map((fp, index) => (
            <UnlockMethodListItem key={index} type="fingerprint" entry={fp} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Account;
