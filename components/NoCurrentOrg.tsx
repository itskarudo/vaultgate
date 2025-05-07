import { useCreateOrgSheetRef } from "@/stores/createOrgSheetStore";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Text, TouchableOpacity, View } from "react-native";

const NoCurrentOrg = () => {
  const createOrgSheetRef = useCreateOrgSheetRef();

  return (
    <View className="flex-1 justify-center items-center gap-2">
      <Text className="text-xl font-poppins-semibold text-neutral-500">
        No current organization
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-indigo-500 px-5 py-3 rounded-xl shadow-md mt-4 flex-row gap-2 items-center"
        onPress={() => createOrgSheetRef?.current?.expand()}
      >
        <FontAwesomeIcon icon={faCirclePlus} size={14} color="#ffffff" />
        <Text className="text-white text-sm font-poppins-medium">Create</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoCurrentOrg;
