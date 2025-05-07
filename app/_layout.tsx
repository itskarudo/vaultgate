import "expo-dev-client";
import "./global.css";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useContext, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthContextProvider, { authContext } from "@/contexts/authContext";

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const { initialized } = useContext(authContext);

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (!loaded && !error) return;
    if (!initialized) return;

    SplashScreen.hide();
  }, [loaded, error, initialized]);

  return (
    <Stack>
      <Stack.Screen
        name="(signed-in)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default function LayoutWrapper() {
  return (
    <GestureHandlerRootView>
      <AuthContextProvider>
        <BottomSheetModalProvider>
          <RootLayout />
        </BottomSheetModalProvider>
      </AuthContextProvider>
    </GestureHandlerRootView>
  );
}
