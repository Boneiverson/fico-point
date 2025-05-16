import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "@/constants/Colors";

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, currentStep }) => {
  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <View style={styles.stepContainer}>
                <View
                  style={[
                    styles.stepCircle,
                    isActive ? styles.activeStepCircle : {},
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumber,
                      isActive ? styles.activeStepNumber : {},
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isActive ? styles.activeStepLabel : {},
                  ]}
                >
                  {step}
                </Text>
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.stepLine,
                    index < currentStep ? styles.activeStepLine : {},
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepContainer: {
    alignItems: "center",
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  activeStepCircle: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  activeStepNumber: {
    color: colors.white,
  },
  stepLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  activeStepLabel: {
    color: colors.text,
    fontWeight: "500",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.divider,
    marginHorizontal: 4,
  },
  activeStepLine: {
    backgroundColor: colors.primary,
  },
});

export default ProgressSteps;