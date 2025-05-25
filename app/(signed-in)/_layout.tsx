import { Redirect, Stack } from "expo-router";
import React, { useContext, useEffect } from "react";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "@react-native-firebase/firestore";
import { useLocksActions } from "@/stores/locksStore";
import { useCurrentOrg, useOrgsActions } from "@/stores/orgsStore";
import { authContext } from "@/contexts/authContext";
import { Organization, OrgUser, Lock, Log } from "@/types";
import { useInvitesActions } from "@/stores/invitesStore";
import { useOrgUser, useOrgUsersActions } from "@/stores/orgUsersStore";
import { useLogActions } from "@/stores/logStore";

const Layout = () => {
  const { user } = useContext(authContext);
  const currentOrg = useCurrentOrg();
  const firestore = getFirestore();

  const orgUser = useOrgUser();

  const { setOrgs, setCurrentOrg } = useOrgsActions();
  const { setLocks } = useLocksActions();
  const { setOrgUsers, setOrgUser } = useOrgUsersActions();

  const { setLogs } = useLogActions();

  const { setInvites } = useInvitesActions();

  useEffect(() => {
    if (!user) {
      setOrgs([]);
      setCurrentOrg(() => null);
      return;
    }

    const orgsCollection = collection(firestore, "orgs");
    const q = query(
      orgsCollection,
      where("members", "array-contains", user.id)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        let fetchedOrgs: Organization[] = [];

        snapshot.forEach((doc) => {
          fetchedOrgs.push({ ...doc.data(), id: doc.id } as Organization);
        });

        setOrgs(fetchedOrgs);

        setCurrentOrg((prev) => {
          if (prev === null) return fetchedOrgs[0] || null;
          const org = fetchedOrgs.find((org) => org.id === prev.id);
          return org || fetchedOrgs[0] || null;
        });
      },
      (e) => {
        console.log("orgs failed", e);
      }
    );

    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user) {
      setOrgUser(null);
      return;
    }

    if (!currentOrg) return;
    const userDoc = doc(firestore, "orgs", currentOrg.id, "users", user.id);

    const unsub = onSnapshot(
      userDoc,
      (doc) => {
        const data = doc.data();
        if (!data) return;

        setOrgUser({ ...data, id: doc.id } as OrgUser);
      },
      (e) => {
        console.log("org user failed", e);
      }
    );

    return unsub;
  }, [user, currentOrg]);

  useEffect(() => {
    if (!currentOrg) {
      setOrgUsers([]);
      return;
    }

    const q = query(
      collection(firestore, "orgs", currentOrg.id as string, "users")
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const usersData: OrgUser[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as OrgUser[];

        setOrgUsers(usersData);
      },
      (e) => {
        console.log("org users failed", e);
      }
    );

    return unsub;
  }, [currentOrg]);

  useEffect(() => {
    if (!user) {
      setLocks([]);
      return;
    }

    if (!currentOrg || !orgUser) return;

    const q = query(
      collection(firestore, "orgs", currentOrg?.id, "locks"),

      orgUser.role === "member"
        ? where("allowedMembers", "array-contains", user.id)
        : undefined
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const locksList: Lock[] = [];

        snapshot.forEach((doc) => {
          locksList.push({ ...doc.data(), id: doc.id } as Lock);
        });

        setLocks(locksList);
      },
      (e) => {
        console.log("locks failed", e);
      }
    );

    return unsub;
  }, [user, currentOrg, orgUser]);

  useEffect(() => {
    if (!user) {
      setInvites([]);
      return;
    }

    const q = query(
      collection(firestore, "invites"),
      where("inviteeEmail", "==", user.email)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const invitesList: any[] = [];

        snapshot.forEach((doc) => {
          invitesList.push({ ...doc.data(), id: doc.id });
        });

        setInvites(invitesList);
      },
      (e) => {
        console.log("invites failed", e);
      }
    );

    return unsub;
  }, [user]);

  useEffect(() => {
    if (!currentOrg || !orgUser) return;

    if (
      !user ||
      (orgUser.role === "member" && orgUser.allowedLocks.length === 0)
    ) {
      setLogs([]);
      return;
    }

    const logsCollection = collection(firestore, "orgs", currentOrg.id, "logs");
    const q = query(
      logsCollection,
      orderBy("timestamp", "desc"),
      orgUser.role === "member"
        ? where("lockId", "in", orgUser.allowedLocks)
        : undefined
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot) return;
        const logsList: Log[] = [];

        snapshot.forEach((doc) => {
          logsList.push({ ...doc.data(), id: doc.id } as Log);
        });

        setLogs(logsList);
      },
      (e) => {
        console.log("invites failed", e);
      }
    );

    return unsub;
  }, [user, currentOrg, orgUser]);

  if (!user) return <Redirect href="/" />;

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="new-lock"
        options={{
          title: "Register Lock",
          headerShown: true,
          headerTitleStyle: {
            FontFamily: "Poppins_700Bold",
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      />
    </Stack>
  );
};

export default Layout;
