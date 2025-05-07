import { View, Text, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import {
  addDoc,
  collection,
  getFirestore,
} from "@react-native-firebase/firestore";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useContext, useRef, useState } from "react";
import BottomSheetInput from "@/components/BottomSheetInput";
import { useCurrentOrg } from "@/stores/orgsStore";
import { authContext } from "@/contexts/authContext";
import { useRouter } from "expo-router";

const SERIAL_REGEX =
  /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    pressBehavior="close"
    opacity={0.4}
    disappearsOnIndex={-1}
    appearsOnIndex={0}
  />
);

const NewLock = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [name, setName] = useState("");
  const [isNameErrored, setIsNameErrored] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serial, setSerial] = useState("");

  const cameraRef = useRef<CameraView>(null);
  const sheetRef = useRef<BottomSheetModal>(null);

  const firestore = getFirestore();
  const currentOrg = useCurrentOrg();
  const router = useRouter();

  const { user } = useContext(authContext);

  const scannedHandler = async (scanned: { type: string; data: string }) => {
    if (sheetOpen) return;
    if (!SERIAL_REGEX.test(scanned.data)) return;

    setSheetOpen(true);
    setSerial(scanned.data);

    cameraRef.current?.pausePreview();
    sheetRef.current?.present();
  };

  const handleSubmit = async () => {
    if (!currentOrg || !user) return;

    if (name.trim().length < 3) {
      setIsNameErrored(true);
      return;
    }
    setIsLoading(true);
    try {
      const locksCollection = collection(
        firestore,
        "orgs",
        currentOrg?.id,
        "locks"
      );

      const lockData = {
        name: name.trim(),
        open: false,
        serial,
        allowedMembers: [user.id],
      };

      await addDoc(locksCollection, lockData);
      sheetRef.current?.dismiss();

      router.replace("/devices");
    } catch (error) {
      console.error("Error creating lock:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center gap-2 px-12">
        <Text className="text-lg font-poppins-semibold text-neutral-500 text-center">
          Camera permission is required to scan QR codes.
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-indigo-500 px-5 py-3 rounded-xl shadow-md mt-4 flex-row gap-2 items-center"
          onPress={requestPermission}
        >
          <FontAwesomeIcon icon={faCamera} size={14} color="#ffffff" />
          <Text className="text-white text-sm font-poppins-medium">
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      <CameraView
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scannedHandler}
        ref={cameraRef}
      >
        <View className="h-full"></View>

        <BottomSheetModal
          ref={sheetRef}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          backgroundStyle={{
            backgroundColor: "#f5f5f5",
          }}
          onDismiss={() => {
            setSheetOpen(false);
            cameraRef.current?.resumePreview();
            setSerial("");
          }}
        >
          <BottomSheetView className="px-10 pt-4 pb-16">
            <View className="flex-row justify-center items-center mb-6 gap-2">
              <Text>🏠</Text>
              <Text className="font-poppins-semibold">Choose a name</Text>
            </View>
            <BottomSheetInput
              label="Name"
              onChange={setName}
              isError={isNameErrored}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-indigo-500 rounded-2xl py-5 mt-6 disabled:bg-indigo-300"
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text className="text-white text-center text-sm font-poppins-semibold">
                Register Lock
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>
      </CameraView>
    </View>
  );
};

export default NewLock;
