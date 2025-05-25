import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, Redirect } from "expo-router";
import Input from "@/components/Input";
import { useContext, useState } from "react";
import { getAuth } from "@react-native-firebase/auth";
import { authContext } from "@/contexts/authContext";
import { formatError } from "@/lib/formatError";

export default function Index() {
  const auth = getAuth();
  const { user } = useContext(authContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailErrored, setIsEmailErrored] = useState(false);
  const [isPasswordErrored, setIsPasswordErrored] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (user) return <Redirect href="/stats" />;

  const submitHandler = async () => {
    setIsEmailErrored(false);
    setIsPasswordErrored(false);
    setErrorMessage(null);

    if (email == "") {
      setIsEmailErrored(true);
    }
    if (password == "") {
      setIsPasswordErrored(true);
    }

    if (email == "" || password == "") return;

    setDisabled(true);

    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      setErrorMessage(formatError(e.message));
      switch (e.code) {
        case "auth/invalid-email":
        case "auth/user-not-found":
        case "auth/user-disabled": {
          setIsEmailErrored(true);
          break;
        }
        case "auth/wrong-password": {
          setIsPasswordErrored(true);
          break;
        }
        case "auth/invalid-credential": {
          setIsEmailErrored(true);
          setIsPasswordErrored(true);
          break;
        }
      }
    } finally {
      setDisabled(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="w-full h-full items-center">
        <View className="w-4/5 h-full justify-center">
          <Text className="mb-6 text-2xl text-neutral-700 font-poppins-semibold">
            Sign in to VaultGate
          </Text>
          {errorMessage && (
            <Text className="text-red-500 font-poppins-medium mb-6 text-sm">
              {errorMessage}
            </Text>
          )}
          <View className="w-full gap-8">
            <Input
              label="Email"
              keyboardType="email-address"
              onChange={setEmail}
              isError={isEmailErrored}
            />
            <Input
              label="Password"
              secureTextEntry
              onChange={setPassword}
              isError={isPasswordErrored}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-full bg-indigo-500 px-8 py-4 rounded-2xl shadow-lg disabled:bg-indigo-300"
              onPress={submitHandler}
              disabled={disabled}
            >
              <Text className="text-white font-poppins-medium text-center">
                Sign In
              </Text>
            </TouchableOpacity>
            <Link
              href="/signup"
              className="text-center underline font-poppins-regular"
            >
              Don't have an account?
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
