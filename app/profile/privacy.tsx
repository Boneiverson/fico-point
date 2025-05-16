import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Header from "@/components/Header";
import colors from "@/constants/Colors";

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Privacy Policy" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last Updated: June 1, 2023</Text>
          
          <Text style={styles.paragraph}>
            At FastLoan, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
          </Text>
          
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect information that you provide directly to us, including:
          </Text>
          <Text style={styles.bulletPoint}>• Personal identification information (name, email address, phone number, etc.)</Text>
          <Text style={styles.bulletPoint}>• Financial information (income, employment details, bank account information)</Text>
          <Text style={styles.bulletPoint}>• Identification documents (ID card, proof of address)</Text>
          <Text style={styles.bulletPoint}>• Guarantor information (name, contact details, relationship)</Text>
          <Text style={styles.paragraph}>
            We also collect information automatically when you use our application, including:
          </Text>
          <Text style={styles.bulletPoint}>• Device information (device type, operating system, unique device identifiers)</Text>
          <Text style={styles.bulletPoint}>• Log information (access times, pages viewed, app crashes)</Text>
          <Text style={styles.bulletPoint}>• Location information (with your consent)</Text>
          
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the information we collect to:
          </Text>
          <Text style={styles.bulletPoint}>• Process and manage your loan applications</Text>
          <Text style={styles.bulletPoint}>• Verify your identity and assess your creditworthiness</Text>
          <Text style={styles.bulletPoint}>• Communicate with you about your account and loan status</Text>
          <Text style={styles.bulletPoint}>• Improve our services and develop new features</Text>
          <Text style={styles.bulletPoint}>• Detect and prevent fraud and other illegal activities</Text>
          <Text style={styles.bulletPoint}>• Comply with legal obligations</Text>
          
          <Text style={styles.sectionTitle}>3. Information Sharing and Disclosure</Text>
          <Text style={styles.paragraph}>
            We may share your information with:
          </Text>
          <Text style={styles.bulletPoint}>• Service providers who perform services on our behalf</Text>
          <Text style={styles.bulletPoint}>• Financial institutions and payment processors to facilitate transactions</Text>
          <Text style={styles.bulletPoint}>• Credit bureaus and reference agencies for credit checks</Text>
          <Text style={styles.bulletPoint}>• Legal authorities when required by law or to protect our rights</Text>
          <Text style={styles.paragraph}>
            We do not sell your personal information to third parties.
          </Text>
          
          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </Text>
          
          <Text style={styles.sectionTitle}>5. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </Text>
          
          <Text style={styles.sectionTitle}>6. Your Rights</Text>
          <Text style={styles.paragraph}>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </Text>
          <Text style={styles.bulletPoint}>• Access to your personal information</Text>
          <Text style={styles.bulletPoint}>• Correction of inaccurate or incomplete information</Text>
          <Text style={styles.bulletPoint}>• Deletion of your personal information</Text>
          <Text style={styles.bulletPoint}>• Restriction of processing of your personal information</Text>
          <Text style={styles.bulletPoint}>• Data portability</Text>
          <Text style={styles.paragraph}>
            To exercise these rights, please contact us using the information provided in the "Contact Us" section.
          </Text>
          
          <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete that information.
          </Text>
          
          <Text style={styles.sectionTitle}>8. Changes to This Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </Text>
          
          <Text style={styles.sectionTitle}>9. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>Email: privacy@fastloan.com</Text>
          <Text style={styles.contactInfo}>Phone: +233 30 123 4567</Text>
          <Text style={styles.contactInfo}>Address: 123 Independence Avenue, Accra, Ghana</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    fontStyle: "italic",
  },
  paragraph: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    marginLeft: 16,
    lineHeight: 20,
  },
  contactInfo: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    marginLeft: 16,
  },
});