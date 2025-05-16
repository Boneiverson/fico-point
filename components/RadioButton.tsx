import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "@/constants/Colors";

interface RadioButtonProps {
  label: string;
  value: string;
  selectedValue: string;
  onSelect: (value: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  value,
  selectedValue,
  onSelect,
}) => {
  const isSelected = value === selectedValue;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onSelect(value)}
      activeOpacity={0.7}
    >
      <View style={[styles.radio, isSelected && styles.radioSelected]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.text,
  },
});

export default RadioButton;