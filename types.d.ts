import { Timestamp } from "@react-native-firebase/firestore";

export interface User {
  id: string;
  displayName: string;
  email: string;
}

export interface RFID {
  id: string;
  name: string;
  data: string;
}

export interface Fingerprint {
  id: string;
  name: string;
  data: string;
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
      method: "fingerprint" | "rfid";
      data: string;
    }
  | {
      failed: false;
      userId: string;
      userDisplayName: string;
      method: "phone";
    }
  | {
      failed: true;
      method: "fingerprint" | "rfid";
      data: string;
    }
);
