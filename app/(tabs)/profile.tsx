import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  Phone,
  TrendingUp,
  History,
  HelpCircle,
  MessageSquare,
  FileText,
  Shield,
  LogOut,
  User,
} from "lucide-react-native";
import Card from "@/components/Card";
import Button from "@/components/Button";
import colors from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleCurrentLoans = () => {
    router.push("/profile/current-loans");
  };

  const handleLoanHistory = () => {
    router.push("/profile/loan-history");
  };

  const handleFaq = () => {
    router.push("/profile/faq");
  };

  const handleSupport = () => {
    router.push("/profile/support");
  };

  const handleTerms = () => {
    router.push("/profile/terms");
  };

  const handlePrivacy = () => {
    router.push("/profile/privacy");
  };

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              {user?.profileImage ? (
                <Image
                  source={{ uri: user.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <User size={24} color={colors.white} />
                </View>
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.firstName} {user?.lastName}
              </Text>
              <View style={styles.phoneContainer}>
                <Phone size={14} color={colors.textSecondary} />
                <Text style={styles.phoneNumber}>{user?.phoneNumber}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Management</Text>
          <Card variant="outlined" style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleCurrentLoans}
            >
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.menuItemIcon, { backgroundColor: colors.primaryLight }]}
                >
                  <TrendingUp size={20} color={colors.primary} />
                </View>
                <Text style={styles.menuItemText}>Current Loans</Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLoanHistory}
            >
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.menuItemIcon, { backgroundColor: colors.secondary }]}
                >
                  <History size={20} color={colors.primary} />
                </View>
                <Text style={styles.menuItemText}>Loan History</Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <Card variant="outlined" style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={handleFaq}>
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.menuItemIcon, { backgroundColor: "#FFF9C4" }]}
                >
                  <HelpCircle size={20} color="#FBC02D" />
                </View>
                <Text style={styles.menuItemText}>FAQ</Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleSupport}>
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.menuItemIcon, { backgroundColor: "#E1F5FE" }]}
                >
                  <MessageSquare size={20} color="#039BE5" />
                </View>
                <Text style={styles.menuItemText}>Contact Support</Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal Information</Text>
          <Card variant="outlined" style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={handleTerms}>
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.menuItemIcon, { backgroundColor: "#E8EAF6" }]}
                >
                  <FileText size={20} color="#3949AB" />
                </View>
                <Text style={styles.menuItemText}>Terms of Service</Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={handlePrivacy}>
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.menuItemIcon, { backgroundColor: "#E0F2F1" }]}
                >
                  <Shield size={20} color="#00897B" />
                </View>
                <Text style={styles.menuItemText}>Privacy Policy</Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.logoutButtonContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            icon={<LogOut size={20} color={colors.white} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneNumber: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  menuCard: {
    padding: 0,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: 16,
  },
  logoutButtonContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
});