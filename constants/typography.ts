import { StyleSheet } from "react-native";
import colors from "@/constants/Colors";

export default StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  h3: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 6,
  },
  h4: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    color: colors.text,
  },
  bodySmall: {
    fontSize: 14,
    color: colors.text,
  },
  caption: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
  },
  link: {
    fontSize: 16,
    color: colors.primary,
    textDecorationLine: "none",
  },
});