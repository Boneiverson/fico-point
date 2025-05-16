import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import colors from "@/constants/Colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "text" | "danger";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = "left",
}) => {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = {};

    switch (variant) {
      case "primary":
        buttonStyle = {
          backgroundColor: colors.primary,
        };
        break;
      case "secondary":
        buttonStyle = {
          backgroundColor: colors.secondary,
        };
        break;
      case "outline":
        buttonStyle = {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.primary,
        };
        break;
      case "text":
        buttonStyle = {
          backgroundColor: "transparent",
        };
        break;
      case "danger":
        buttonStyle = {
          backgroundColor: colors.error,
        };
        break;
    }

    return buttonStyle;
  };

  const getTextStyle = () => {
    let style: TextStyle = {};

    switch (variant) {
      case "primary":
        style = {
          color: colors.white,
        };
        break;
      case "secondary":
        style = {
          color: colors.primary,
        };
        break;
      case "outline":
        style = {
          color: colors.primary,
        };
        break;
      case "text":
        style = {
          color: colors.primary,
        };
        break;
      case "danger":
        style = {
          color: colors.white,
        };
        break;
    }

    return style;
  };

  const getSizeStyle = () => {
    let sizeStyle: ViewStyle = {};

    switch (size) {
      case "small":
        sizeStyle = {
          paddingVertical: 8,
          paddingHorizontal: 16,
        };
        break;
      case "medium":
        sizeStyle = {
          paddingVertical: 12,
          paddingHorizontal: 24,
        };
        break;
      case "large":
        sizeStyle = {
          paddingVertical: 16,
          paddingHorizontal: 32,
        };
        break;
    }

    return sizeStyle;
  };

  const getTextSizeStyle = () => {
    let textSizeStyle: TextStyle = {};

    switch (size) {
      case "small":
        textSizeStyle = {
          fontSize: 14,
        };
        break;
      case "medium":
        textSizeStyle = {
          fontSize: 16,
        };
        break;
      case "large":
        textSizeStyle = {
          fontSize: 18,
        };
        break;
    }

    return textSizeStyle;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" || variant === "text" ? colors.primary : colors.white}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          <Text
            style={[
              styles.text,
              getTextStyle(),
              getTextSizeStyle(),
              icon ? (iconPosition === "left" ? styles.textWithLeftIcon : styles.textWithRightIcon) : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  textWithLeftIcon: {
    marginLeft: 8,
  },
  textWithRightIcon: {
    marginRight: 8,
  },
});

export default Button;