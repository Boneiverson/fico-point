import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import colors from "@/constants/Colors";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "outlined" | "elevated";
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = "default",
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case "outlined":
        return styles.outlined;
      case "elevated":
        return styles.elevated;
      default:
        return styles.default;
    }
  };

  return (
    <View style={[styles.card, getCardStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    backgroundColor: colors.white,
  },
  default: {
    backgroundColor: colors.white,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.divider,
  },
  elevated: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default Card;