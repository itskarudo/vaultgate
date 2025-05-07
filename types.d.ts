import { Timestamp } from "@react-native-firebase/firestore";

export interface User {
  id: string;
  displayName: string;
  email: string;
}

export interface Organization {
  id: string;
  members: string[];
  name: string;
}

export interface OrgUser {
  id: string;
  displayName: string;
  role: "admin" | "member";
  allowedLocks: string[];
  pinnedLocks: string[];
  dismissedLogs: string[];
  createdAt: Date;
}

export interface Lock {
  id: string;
  name: string;
  open: boolean;
  allowedMembers: string[];
  serial: string;
}

export interface Invite {
  id: string;
  inviteeEmail: string;
  inviterDisplayName: string;
  inviterId: string;
  orgId: string;
  orgName: string;
  createdAt: Date;
}

export type Log = {
  id: string;
  lockId: string;
  lockName: string;
  timestamp: Timestamp;
} & (
  | {
      failed: false;
      userId: string;
      userDisplayName: string;
      method: "phone" | "fingerprint" | "rfid";
    }
  | {
      failed: true;
      method: "fingerprint" | "rfid";
    }
);
