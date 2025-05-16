import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar, DollarSign, Clock } from "lucide-react-native";
import colors from "@/constants/Colors";
import Card from "./Card";
import Button from "./Button";
import { LoanRequest } from "@/types/loan";

interface LoanCardProps {
  loan: LoanRequest;
  onViewDetails?: () => void;
  onMakePayment?: () => void;
}

const LoanCard: React.FC<LoanCardProps> = ({
  loan,
  onViewDetails,
  onMakePayment,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return colors.success;
      case "rejected":
        return colors.error;
      case "pending":
        return colors.warning;
      case "active":
        return colors.primary;
      case "completed":
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.amountContainer}>
          <Text style={styles.currency}>$</Text>
          <Text style={styles.amount}>{loan.amount.toLocaleString()}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(loan.status) + "20" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(loan.status) },
            ]}
          >
            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            Created: {formatDate(loan.createdAt)}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            Duration: {loan.duration} days
          </Text>
        </View>
        <View style={styles.infoItem}>
          <DollarSign size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            Purpose: {loan.purpose}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="View Details"
          variant="outline"
          size="small"
          onPress={onViewDetails || (() => {})}
          style={styles.button}
        />
        {loan.status === "active" && (
          <Button
            title="Make Payment"
            variant="primary"
            size="small"
            onPress={onMakePayment || (() => {})}
            style={styles.button}
          />
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  currency: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginTop: 4,
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginLeft: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    marginLeft: 8,
  },
});

export default LoanCard;