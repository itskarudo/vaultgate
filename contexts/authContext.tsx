import { User } from "@/types";
import { FirebaseAuthTypes, getAuth } from "@react-native-firebase/auth";
import {
  doc,
  getFirestore,
  onSnapshot,
} from "@react-native-firebase/firestore";
import { createContext, useEffect, useRef, useState } from "react";

interface AuthContextType {
  initialized: boolean;
  user: User | null;
}

export const authContext = createContext<AuthContextType>({
  initialized: false,
  user: null,
});

const AuthContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const firestore = getFirestore();
  const auth = getAuth();
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const userUnsubRef = useRef<(() => void) | null>(null);

  const onAuthStateChange = async (user: FirebaseAuthTypes.User | null) => {
    if (!user) {
      setUser(null);

      if (userUnsubRef.current) {
        userUnsubRef.current();
        userUnsubRef.current = null;
      }

      if (!initialized) setInitialized(true);
      return;
    }

    const userDoc = doc(firestore, "users", user.uid);
    const userUnsub = onSnapshot(userDoc, async (snapshot) => {
      if (snapshot.exists) {
        const data = { ...snapshot.data(), id: snapshot.id } as User;
        setUser(data);
      } else {
        setUser(null);
      }
    });

    userUnsubRef.current = userUnsub;
    setInitialized(true);
  };

  useEffect(() => {
    const sub = auth.onAuthStateChanged(onAuthStateChange);
    return () => {
      if (sub) {
        sub();
      }

      if (userUnsubRef.current) {
        userUnsubRef.current();
        userUnsubRef.current = null;
      }
    };
  }, []);

  return (
    <authContext.Provider
      value={{
        initialized,
        user,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
