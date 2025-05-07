import { Button, ScrollView } from "react-native";
import React from "react";
import { getAuth } from "@react-native-firebase/auth";

const Account = () => {
  const auth = getAuth();
  return (
    <ScrollView className="flex-1 px-6 pt-16">
      <Button title="signout" onPress={auth.signOut} />
    </ScrollView>
  );
};

export default Account;
