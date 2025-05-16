import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Upload, Users, CreditCard, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Button from "@/components/Button";
import RadioButton from "@/components/RadioButton";
import SelectInput from "@/components/SelectInput";
import ProgressSteps from "@/components/ProgressSteps";
import colors from "@/constants/Colors";
import { useLoanStore } from "@/store/loan-store";
import { Guarantor } from "@/types/loan";

// Mock data for dropdowns
const maritalStatusOptions = [
  { label: "Single", value: "single" },
  { label: "Married", value: "married" },
  { label: "Divorced", value: "divorced" },
  { label: "Widowed", value: "widowed" },
];

const employmentStatusOptions = [
  { label: "Employed", value: "employed" },
  { label: "Self-Employed", value: "self-employed" },
  { label: "Unemployed", value: "unemployed" },
  { label: "Student", value: "student" },
  { label: "Retired", value: "retired" },
];

const relationshipOptions = [
  { label: "Family", value: "family" },
  { label: "Friend", value: "friend" },
  { label: "Colleague", value: "colleague" },
  { label: "Other", value: "other" },
];

const mobileMoneyProviders = [
  { label: "MTN Mobile Money", value: "mtn" },
  { label: "Vodafone Cash", value: "vodafone" },
  { label: "AirtelTigo Money", value: "airteltigo" },
];

const loanPurposeOptions = [
  { label: "Business Expansion", value: "business_expansion" },
  { label: "Inventory Purchase", value: "inventory" },
  { label: "Equipment Purchase", value: "equipment" },
  { label: "Working Capital", value: "working_capital" },
  { label: "Debt Consolidation", value: "debt_consolidation" },
  { label: "Other", value: "other" },
];

const loanDurationOptions = [
  { label: "30 Days", value: "30" },
  { label: "60 Days", value: "60" },
  { label: "90 Days", value: "90" },
  { label: "180 Days", value: "180" },
];

export interface LoanRequest {
  // Existing properties of LoanRequest
  accountDetails?: {
    mobileMoneyNumber: string;
    accountName: string;
    provider: string;
  };
  amount?: number;
  purpose?: string;
  duration?: number;
  guarantors?: Guarantor[];
  personalDetails?: {
    firstName?: string;
    lastName?: string;
    gender?: string;
    email?: string;
    maritalStatus?: string;
    employmentStatus?: string;
    idDocument?: string;
  };
}

export default function LoanRequestScreen() {
  const router = useRouter();
  const { 
    createLoanRequest, 
    currentLoanRequest, 
    updateCurrentLoanRequest, 
    addGuarantor, 
    removeGuarantor, 
    isLoading,
    error: loanError
  } = useLoanStore();
  
  const [step, setStep] = useState(0);
  const steps = ["Personal", "Guarantor", "Account"];
  
  // Personal Details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [idDocument, setIdDocument] = useState("");
  
  // Guarantor Details
  const [guarantorName, setGuarantorName] = useState("");
  const [guarantorPhone, setGuarantorPhone] = useState("");
  const [guarantorEmail, setGuarantorEmail] = useState("");
  const [guarantorRelationship, setGuarantorRelationship] = useState("");
  
  // Account Details
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [provider, setProvider] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [loanDuration, setLoanDuration] = useState("30");
  
  // Errors
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    gender?: string;
    email?: string;
    maritalStatus?: string;
    employmentStatus?: string;
    idDocument?: string;
    guarantorName?: string;
    guarantorPhone?: string;
    guarantorRelationship?: string;
    mobileMoneyNumber?: string;
    accountName?: string;
    provider?: string;
    loanAmount?: string;
    loanPurpose?: string;
  }>({});

  // Initialize with current loan request data if available
  React.useEffect(() => {
    if (currentLoanRequest) {
      // Personal details
      if (currentLoanRequest?.personalDetails) {
        if (currentLoanRequest.personalDetails) {
          // Set personal details from current loan request
          const personalDetails = currentLoanRequest.personalDetails as {
            firstName?: string;
            lastName?: string;
            gender?: string;
            email?: string;
            maritalStatus?: string;
            employmentStatus?: string;
            idDocument?: string;
          };
          setFirstName(personalDetails.firstName || "");
          setLastName(personalDetails.lastName || "");
          setGender(personalDetails.gender || "");
          setEmail(personalDetails.email || "");
          setMaritalStatus(personalDetails.maritalStatus || "");
          setEmploymentStatus(personalDetails.employmentStatus || "");
          setIdDocument(personalDetails.idDocument || "");
        }
      }
      
      // Account details
      if (currentLoanRequest.accountDetails) {
        setMobileMoneyNumber(currentLoanRequest.accountDetails.mobileMoneyNumber || "");
        setAccountName(currentLoanRequest.accountDetails.accountName || "");
        setProvider(currentLoanRequest.accountDetails.provider || "");
      }
      
      // Loan details
      setLoanAmount(currentLoanRequest.amount?.toString() || "");
      setLoanPurpose(currentLoanRequest.purpose || "");
      setLoanDuration(currentLoanRequest.duration?.toString() || "30");
    }
  }, [currentLoanRequest]);

  const validatePersonalDetails = () => {
    const newErrors: any = {};
    
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!maritalStatus) newErrors.maritalStatus = "Marital status is required";
    if (!employmentStatus) newErrors.employmentStatus = "Employment status is required";
    if (!idDocument) newErrors.idDocument = "ID document is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateGuarantorDetails = () => {
    // Skip validation if we already have guarantors
    if (currentLoanRequest?.guarantors && currentLoanRequest.guarantors.length > 0) {
      return true;
    }
    
    const newErrors: any = {};
    
    if (!guarantorName) newErrors.guarantorName = "Guarantor name is required";
    if (!guarantorPhone) newErrors.guarantorPhone = "Guarantor phone is required";
    if (!guarantorRelationship) newErrors.guarantorRelationship = "Relationship is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAccountDetails = () => {
    const newErrors: any = {};
    
    if (!mobileMoneyNumber) newErrors.mobileMoneyNumber = "Mobile money number is required";
    if (!accountName) newErrors.accountName = "Account name is required";
    if (!provider) newErrors.provider = "Provider is required";
    
    if (!loanAmount) {
      newErrors.loanAmount = "Loan amount is required";
    } else if (isNaN(Number(loanAmount)) || Number(loanAmount) <= 0) {
      newErrors.loanAmount = "Please enter a valid amount";
    }
    
    if (!loanPurpose) newErrors.loanPurpose = "Loan purpose is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && validatePersonalDetails()) {
      setStep(step + 1);
    } else if (step === 1 && validateGuarantorDetails()) {
      setStep(step + 1);
    } else if (step === 2 && validateAccountDetails()) {
      handleSubmit();
    }
  };
  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleAddGuarantor = () => {
    if (!guarantorName || !guarantorPhone || !guarantorRelationship) {
      setErrors({
        ...errors,
        guarantorName: !guarantorName ? "Guarantor name is required" : undefined,
        guarantorPhone: !guarantorPhone ? "Guarantor phone is required" : undefined,
        guarantorRelationship: !guarantorRelationship ? "Relationship is required" : undefined,
      });
      return;
    }
    
    const newGuarantor: Guarantor = {
      id: `guarantor-${Date.now()}`,
      fullName: guarantorName,
      phoneNumber: guarantorPhone,
      email: guarantorEmail,
      relationship: guarantorRelationship,
    };
    
    addGuarantor(newGuarantor);
    
    // Clear form
    setGuarantorName("");
    setGuarantorPhone("");
    setGuarantorEmail("");
    setGuarantorRelationship("");
    setErrors({});
  };

  const handleRemoveGuarantor = (guarantorId: string) => {
    removeGuarantor(guarantorId);
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant permission to access your photos");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      setIdDocument(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (validateAccountDetails()) {
      // Save account details and loan details
      updateCurrentLoanRequest({
        accountDetails: {
          mobileMoneyNumber,
          accountName,
          provider,
        },
        amount: Number(loanAmount),
        purpose: loanPurpose,
        duration: Number(loanDuration),
      });
      
      // Submit loan request
      try {
        console.log("Submitting loan request...");
        await createLoanRequest({
          ...currentLoanRequest,
          accountDetails: {
            mobileMoneyNumber,
            accountName,
            provider,
          },
          amount: Number(loanAmount),
          purpose: loanPurpose,
          duration: Number(loanDuration),
        });
        
        Alert.alert(
          "Loan Request Submitted",
          "Your loan request has been submitted successfully. We will review it and get back to you soon.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(tabs)"),
            },
          ]
        );
      } catch (error) {
        console.error("Error submitting loan request:", error);
        Alert.alert("Error", "Failed to submit loan request. Please try again.");
      }
    }
  };

  const renderPersonalDetailsForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.nameRow}>
        <Input
          label="First Name"
          placeholder="Enter first name"
          value={firstName}
          onChangeText={setFirstName}
          error={errors.firstName}
          containerStyle={styles.nameInput}
        />
        <Input
          label="Last Name"
          placeholder="Enter last name"
          value={lastName}
          onChangeText={setLastName}
          error={errors.lastName}
          containerStyle={styles.nameInput}
        />
      </View>

      <Text style={styles.label}>Gender</Text>
      <View style={styles.radioGroup}>
        <RadioButton
          label="Male"
          value="male"
          selectedValue={gender}
          onSelect={setGender}
        />
        <RadioButton
          label="Female"
          value="female"
          selectedValue={gender}
          onSelect={setGender}
        />
      </View>
      {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

      <Input
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />

      <SelectInput
        label="Marital Status"
        placeholder="Select marital status"
        options={maritalStatusOptions}
        value={maritalStatus}
        onChange={setMaritalStatus}
        error={errors.maritalStatus}
      />

      <SelectInput
        label="Employment Status"
        placeholder="Select employment status"
        options={employmentStatusOptions}
        value={employmentStatus}
        onChange={setEmploymentStatus}
        error={errors.employmentStatus}
      />

      <Text style={styles.label}>Upload ID</Text>
      <TouchableOpacity
        style={[styles.uploadButton, idDocument ? styles.uploadButtonWithImage : null]}
        onPress={handlePickImage}
      >
        <Upload size={20} color={colors.textSecondary} />
        <Text style={styles.uploadButtonText}>
          {idDocument ? "ID Uploaded" : "Upload ID"}
        </Text>
      </TouchableOpacity>
      {errors.idDocument && <Text style={styles.errorText}>{errors.idDocument}</Text>}
    </View>
  );

  const renderGuarantorForm = () => (
    <View style={styles.formContainer}>
      {currentLoanRequest?.guarantors && currentLoanRequest.guarantors.length > 0 && (
        <View style={styles.guarantorsList}>
          {currentLoanRequest.guarantors.map((guarantor, index) => (
            <View key={guarantor.id} style={styles.guarantorCard}>
              <View style={styles.guarantorCardHeader}>
                <Text style={styles.guarantorCardTitle}>Guarantor {index + 1}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveGuarantor(guarantor.id)}
                  style={styles.removeGuarantorButton}
                >
                  <Trash2 size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
              <Text style={styles.guarantorCardText}>
                <Text style={styles.guarantorCardLabel}>Name: </Text>
                {guarantor.fullName}
              </Text>
              <Text style={styles.guarantorCardText}>
                <Text style={styles.guarantorCardLabel}>Phone: </Text>
                {guarantor.phoneNumber}
              </Text>
              {guarantor.email && (
                <Text style={styles.guarantorCardText}>
                  <Text style={styles.guarantorCardLabel}>Email: </Text>
                  {guarantor.email}
                </Text>
              )}
              <Text style={styles.guarantorCardText}>
                <Text style={styles.guarantorCardLabel}>Relationship: </Text>
                {guarantor.relationship}
              </Text>
            </View>
          ))}
        </View>
      )}

      {(currentLoanRequest?.guarantors?.length || 0) < 2 && (
        <>
          <Text style={styles.sectionTitle}>
            {currentLoanRequest?.guarantors?.length ? "Add Another Guarantor" : "Add Guarantor"}
          </Text>
          
          <Input
            label="Full Name"
            placeholder="Enter guarantor's full name"
            value={guarantorName}
            onChangeText={setGuarantorName}
            error={errors.guarantorName}
          />

          <Input
            label="Phone Number"
            placeholder="Enter guarantor's phone number"
            value={guarantorPhone}
            onChangeText={setGuarantorPhone}
            keyboardType="phone-pad"
            error={errors.guarantorPhone}
          />

          <Input
            label="Email (Optional)"
            placeholder="Enter guarantor's email"
            value={guarantorEmail}
            onChangeText={setGuarantorEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <SelectInput
            label="Relationship"
            placeholder="Select relationship"
            options={relationshipOptions}
            value={guarantorRelationship}
            onChange={setGuarantorRelationship}
            error={errors.guarantorRelationship}
          />

          <Button
            title="Add Guarantor"
            onPress={handleAddGuarantor}
            variant="outline"
            icon={<Plus size={16} color={colors.primary} />}
            style={styles.addGuarantorButton}
          />
        </>
      )}
    </View>
  );

  const renderAccountDetailsForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Account Details</Text>
      
      <Input
        label="Mobile Money Number"
        placeholder="Enter mobile money number"
        value={mobileMoneyNumber}
        onChangeText={setMobileMoneyNumber}
        keyboardType="phone-pad"
        error={errors.mobileMoneyNumber}
      />

      <Input
        label="Account Name"
        placeholder="Enter account name"
        value={accountName}
        onChangeText={setAccountName}
        error={errors.accountName}
      />

      <SelectInput
        label="Mobile Money Provider"
        placeholder="Select provider"
        options={mobileMoneyProviders}
        value={provider}
        onChange={setProvider}
        error={errors.provider}
      />

      <Text style={styles.sectionTitle}>Loan Details</Text>
      
      <Input
        label="Loan Amount (₵)"
        placeholder="Enter amount between ₵100 - ₵5000"
        value={loanAmount}
        onChangeText={setLoanAmount}
        keyboardType="numeric"
        error={errors.loanAmount}
      />

      <SelectInput
        label="Loan Purpose"
        placeholder="Select purpose"
        options={loanPurposeOptions}
        value={loanPurpose}
        onChange={setLoanPurpose}
        error={errors.loanPurpose}
      />

      <SelectInput
        label="Loan Duration (Days)"
        placeholder="Select duration"
        options={loanDurationOptions}
        value={loanDuration}
        onChange={setLoanDuration}
      />

      <View style={styles.loanSummary}>
        <Text style={styles.loanSummaryTitle}>Loan Summary</Text>
        <View style={styles.loanSummaryRow}>
          <Text style={styles.loanSummaryLabel}>Principal Amount:</Text>
          <Text style={styles.loanSummaryValue}>
            ₵{loanAmount ? Number(loanAmount).toLocaleString() : "0"}
          </Text>
        </View>
        <View style={styles.loanSummaryRow}>
          <Text style={styles.loanSummaryLabel}>Interest Rate:</Text>
          <Text style={styles.loanSummaryValue}>10%</Text>
        </View>
        <View style={styles.loanSummaryRow}>
          <Text style={styles.loanSummaryLabel}>Duration:</Text>
          <Text style={styles.loanSummaryValue}>{loanDuration} days</Text>
        </View>
        <View style={styles.loanSummaryRow}>
          <Text style={styles.loanSummaryLabel}>Total Repayment:</Text>
          <Text style={styles.loanSummaryValue}>
            ₵
            {loanAmount
              ? (Number(loanAmount) * 1.1).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Loan Request" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <ProgressSteps steps={steps} currentStep={step} />
            
            <Text style={styles.title}>
              {step === 0
                ? "Personal Details"
                : step === 1
                ? "Guarantor Details"
                : "Account Details"}
            </Text>
            
            {loanError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorContainerText}>{loanError}</Text>
              </View>
            )}
            
            {step === 0 && renderPersonalDetailsForm()}
            {step === 1 && renderGuarantorForm()}
            {step === 2 && renderAccountDetailsForm()}
            
            <View style={styles.buttonContainer}>
              <Button
                title="Previous"
                onPress={handlePrevious}
                variant="outline"
                style={styles.button}
                icon={<ChevronLeft size={16} color={colors.primary} />}
                iconPosition="left"
              />
              
              {step < 2 ? (
                <Button
                  title="Next"
                  onPress={handleNext}
                  variant="primary"
                  style={styles.button}
                  icon={<ChevronRight size={16} color={colors.white} />}
                  iconPosition="right"
                />
              ) : (
                <Button
                  title="Submit"
                  onPress={handleSubmit}
                  variant="primary"
                  style={styles.button}
                  loading={isLoading}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: colors.error + "20",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorContainerText: {
    color: colors.error,
    fontSize: 14,
  },
  formContainer: {
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameInput: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: colors.text,
  },
  radioGroup: {
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  uploadButtonWithImage: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  guarantorsList: {
    marginBottom: 24,
  },
  guarantorCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  guarantorCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  guarantorCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  removeGuarantorButton: {
    padding: 4,
  },
  guarantorCardText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  guarantorCardLabel: {
    fontWeight: "500",
  },
  addGuarantorButton: {
    marginTop: 8,
  },
  loanSummary: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  loanSummaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  loanSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  loanSummaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loanSummaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
});