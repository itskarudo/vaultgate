import { View, Text, TextInput, KeyboardTypeOptions } from "react-native";
import React from "react";
import { cn } from "@/lib/cn";

interface Props {
  label: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  value?: string;
  onChange?: (text: string) => void;
  isError?: boolean;
}

const Input = ({
  label,
  secureTextEntry,
  keyboardType,
  value,
  onChange,
  isError,
}: Props) => {
  return (
    <View className="w-full">
      <Text className="text-neutral-500 font-poppins-medium text-sm mb-2">
        {label}
      </Text>
      <View className="relative w-full shadow-sm">
        <TextInput
          className={cn(
            "w-full h-13 rounded-2xl pr-4 font-poppins-regular py-4 bg-neutral-100 pl-5 border-2",
            isError
              ? "border-red-300"
              : "border-neutral-100 focus:border-indigo-500 "
          )}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onChangeText={onChange}
          value={value}
        />
      </View>
    </View>
  );
};

export default Input;
