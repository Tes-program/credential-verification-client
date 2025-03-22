/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/Profile.tsx
import React, { useState, useRef } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  Avatar,
  Flex,
  Divider,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  Textarea,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  Alert,
  AlertIcon,
  FormHelperText,
  Icon,
  InputGroup,
  InputRightElement,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
} from "@chakra-ui/react";
import {
  FaUser,
  FaUniversity,
  FaLock,
  FaBell,
  FaEthereum,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaSave,
  FaIdCard,
  FaGraduationCap,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaMapMarkerAlt,
  FaCertificate,
} from "react-icons/fa";
import { useWeb3Auth } from "../contexts/Web3Context";
import { UserRole, isInstitution } from "../store/authStore";

// Mock user data
const mockInstitutionProfile = {
  name: "Babcock University",
  type: "University",
  country: "Nigeria",
  address: "121 University Road, Ilishan-Remo, Ogun State",
  website: "https://www.babcock.edu.ng",
  contactEmail: "info@babcock.edu.ng",
  contactPhone: "+234 123 456 7890",
  description:
    "Babcock University is a private Christian co-educational Nigerian university owned and operated by the Seventh-day Adventist Church in Nigeria.",
  logo: "https://example.com/logo.png",
  verificationStatus: "verified",
  yearEstablished: "1959",
};

const mockStudentProfile = {
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1998-05-15",
  gender: "Male",
  studentId: "2022010001",
  institution: "Babcock University",
  major: "Information Technology",
  graduationYear: "2025",
  email: "john.doe@example.com",
  phone: "+234 987 654 3210",
  address: "42 Student Housing, Campus Road",
  credentialsCount: 3,
};

const Profile: React.FC = () => {
  const { user, userRole, walletAddress, isAuthenticated, logout } =
        useWeb3Auth() as { user: any; userRole: UserRole; walletAddress: string; isAuthenticated: boolean; logout: () => void };
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State for form data
  const [formData, setFormData] = useState(
    userRole === "institution" ? mockInstitutionProfile : mockStudentProfile
  );

  // State for account settings
  const [accountSettings, setAccountSettings] = useState({
    email:
      user?.email ||
      (userRole === "institution"
        ? mockInstitutionProfile.contactEmail
        : mockStudentProfile.email),
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    blockchainAlerts: true,
  });

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const highlightColor = useColorModeValue("blue.50", "blue.900");

  // Handle profile image upload
  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle input changes for profile data
  const handleProfileChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for account settings
  const handleSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setAccountSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form data if canceling edit
      setFormData(
        userRole === "institution" ? mockInstitutionProfile : mockStudentProfile
      );
    }
  };

  // Save profile changes
  const saveProfile = async () => {
    setIsSaving(true);

    try {
      // Simulate API call to save profile changes
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Profile updated",
        description: "Your profile information has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Save account settings
  const saveAccountSettings = async () => {
    // Validate password confirmation
    if (
      accountSettings.newPassword &&
      accountSettings.newPassword !== accountSettings.confirmPassword
    ) {
      toast({
        title: "Password mismatch",
        description: "New password and confirm password must match.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call to save account settings
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Settings updated",
        description: "Your account settings have been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Clear password fields
      setAccountSettings((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle logout confirmation
  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        mb={8}
      >
        <Heading size="lg">Profile & Settings</Heading>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={onOpen}
          mt={{ base: 4, md: 0 }}
        >
          Log Out
        </Button>
      </Flex>

      <Tabs colorScheme="blue" variant="enclosed">
        <TabList>
          <Tab>
            <Icon
              as={userRole === "institution" ? FaUniversity : FaUser}
              mr={2}
            />
            {userRole === "institution"
              ? "Institution Profile"
              : "Personal Profile"}
          </Tab>
          <Tab>
            <Icon as={FaLock} mr={2} />
            Account & Security
          </Tab>
          <Tab>
            <Icon as={FaEthereum} mr={2} />
            Blockchain Connection
          </Tab>
        </TabList>

        <TabPanels>
          {/* Profile Tab */}
          <TabPanel p={4}>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={6}
              alignItems="start"
            >
              {/* Profile Image Column */}
              <VStack
                spacing={4}
                align="center"
                bg={cardBg}
                p={6}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                boxShadow="sm"
              >
                <Avatar
                  size="2xl"
                  name={
                    isInstitution(userRole)
                      ? (formData as typeof mockInstitutionProfile).name
                      : `${(formData as typeof mockStudentProfile).firstName} ${
                          (formData as typeof mockStudentProfile).lastName
                        }`
                  }
                  src={user?.profileImage}
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                />

                <Button
                  leftIcon={<Icon as={FaEdit} />}
                  onClick={handleImageUpload}
                  size="sm"
                  width="full"
                >
                  Change Photo
                </Button>

                {userRole === "institution" && (
                  <Badge colorScheme="green" p={2} borderRadius="md">
                    <Flex align="center">
                      <Icon as={FaCheck} mr={1} />
                      Verified Institution
                    </Flex>
                  </Badge>
                )}

                <Divider />

                <VStack spacing={1} align="center" width="full">
                  <Heading size="md">
                    {userRole === "institution"
                      ? (formData as typeof mockInstitutionProfile).name
                      : `${(formData as typeof mockStudentProfile).firstName} ${
                          (formData as typeof mockStudentProfile).lastName
                        }`}
                  </Heading>
                  <Text color="gray.500">
                    {userRole === "institution"
                      ? (formData as typeof mockInstitutionProfile).type
                      : `Student at ${
                          (formData as typeof mockStudentProfile).institution
                        }`}
                  </Text>
                </VStack>

                {userRole === "student" && (
                  <VStack spacing={1} align="center" width="full">
                    <Flex align="center">
                      <Icon as={FaIdCard} color="blue.500" mr={2} />
                      <Text fontSize="sm">
                        {(formData as typeof mockStudentProfile).studentId}
                      </Text>
                    </Flex>
                    <Flex align="center">
                      <Icon as={FaGraduationCap} color="blue.500" mr={2} />
                      <Text fontSize="sm">
                        {(formData as typeof mockStudentProfile).major}
                      </Text>
                    </Flex>
                    <Flex align="center">
                      <Icon as={FaCertificate} color="blue.500" mr={2} />
                      <Text fontSize="sm">
                        {
                          (formData as typeof mockStudentProfile)
                            .credentialsCount
                        }{" "}
                        Credentials
                      </Text>
                    </Flex>
                  </VStack>
                )}
              </VStack>

              {/* Profile Details Column */}
              <Box
                bg={cardBg}
                p={6}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                boxShadow="sm"
                gridColumn={{ base: "1", md: "2 / span 2" }}
              >
                <Flex justify="space-between" align="center" mb={6}>
                  <Heading size="md">
                    {userRole === "institution"
                      ? "Institution Details"
                      : "Personal Information"}
                  </Heading>
                  <Button
                    leftIcon={<Icon as={isEditing ? FaSave : FaEdit} />}
                    colorScheme={isEditing ? "green" : "blue"}
                    size="sm"
                    onClick={isEditing ? saveProfile : toggleEdit}
                    isLoading={isSaving && isEditing}
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </Flex>

                {/* Institution Profile Form */}
                {userRole === "institution" && (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl>
                      <FormLabel>Institution Name</FormLabel>
                      <Input
                        name="name"
                        value={(formData as typeof mockInstitutionProfile).name}
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Institution Type</FormLabel>
                      <Select
                        name="type"
                        value={(formData as typeof mockInstitutionProfile).type}
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      >
                        <option value="University">University</option>
                        <option value="College">College</option>
                        <option value="TechnicalSchool">
                          Technical School
                        </option>
                        <option value="HighSchool">High School</option>
                        <option value="Other">Other</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Year Established</FormLabel>
                      <Input
                        name="yearEstablished"
                        value={
                          (formData as typeof mockInstitutionProfile)
                            .yearEstablished
                        }
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Country</FormLabel>
                      <Input
                        name="country"
                        value={
                          (formData as typeof mockInstitutionProfile).country
                        }
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>

                    <FormControl gridColumn={{ md: "1 / span 2" }}>
                      <FormLabel>Address</FormLabel>
                      <Textarea
                        name="address"
                        value={formData.address}
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Website</FormLabel>
                      <Input
                        name="website"
                        value={
                          (formData as typeof mockInstitutionProfile).website
                        }
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Contact Email</FormLabel>
                      <Input
                        name="contactEmail"
                        value={
                          userRole === "institution" && 'contactEmail' in formData
                            ? formData.contactEmail
                            : ""
                        }
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Contact Phone</FormLabel>
                      <Input
                        name="contactPhone"
                        value={
                          isInstitution(userRole)
                            ? (formData as typeof mockInstitutionProfile)
                                .contactPhone
                            : ""
                        }
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>

                    <FormControl gridColumn={{ md: "1 / span 2" }}>
                      <FormLabel>Institution Description</FormLabel>
                      <Textarea
                        name="description"
                        value={
                          "description" in formData ? formData.description : ""
                        }
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                        rows={4}
                      />
                    </FormControl>
                  </SimpleGrid>
                )}

                {/* Student Profile Form */}
                {userRole === "student" && (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        name="firstName"
                        value={
                          (formData as typeof mockStudentProfile).firstName
                        }
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        name="lastName"
                        value={(formData as typeof mockStudentProfile).lastName}
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Date of Birth</FormLabel>
                      <Input
                        name="dateOfBirth"
                        type="date"
                        value={
                          (formData as typeof mockStudentProfile).dateOfBirth
                        }
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        name="gender"
                        value={(formData as typeof mockStudentProfile).gender}
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="PreferNotToSay">
                          Prefer not to say
                        </option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input
                        name="email"
                        value={
                          isInstitution(userRole)
                            ? (formData as typeof mockInstitutionProfile)
                                .contactEmail
                            : (formData as typeof mockStudentProfile).email
                        }
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Phone</FormLabel>
                      <Input
                        name="phone"
                        value={isInstitution(userRole) ? (formData as typeof mockInstitutionProfile).contactPhone : (formData as typeof mockStudentProfile).phone}
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>

                    <FormControl gridColumn={{ md: "1 / span 2" }}>
                      <FormLabel>Address</FormLabel>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>

                    <Heading size="sm" gridColumn={{ md: "1 / span 2" }} mt={4}>
                      Academic Information
                    </Heading>
                    <Divider gridColumn={{ md: "1 / span 2" }} mb={2} />

                    <FormControl>
                      <FormLabel>Institution</FormLabel>
                      <Input
                        name="institution"
                        value={(formData as typeof mockStudentProfile).institution}
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Student ID</FormLabel>
                      <Input
                        name="studentId"
                        value={(formData as typeof mockStudentProfile).studentId}
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Major/Field of Study</FormLabel>
                      <Input
                        name="major"
                        value={(formData as typeof mockStudentProfile).major}
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Expected Graduation Year</FormLabel>
                      <Input
                        name="graduationYear"
                        value={(formData as typeof mockStudentProfile).graduationYear}
                        onChange={handleProfileChange}
                        isDisabled={!isEditing}
                      />
                    </FormControl>
                  </SimpleGrid>
                )}

                {isEditing && (
                  <Flex justify="space-between" mt={8}>
                    <Button variant="outline" onClick={toggleEdit}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="green"
                      onClick={saveProfile}
                      isLoading={isSaving}
                    >
                      Save Changes
                    </Button>
                  </Flex>
                )}
              </Box>
            </SimpleGrid>
          </TabPanel>

          {/* Account & Security Tab */}
          <TabPanel p={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* Email & Password */}
              <Box
                bg={cardBg}
                p={6}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                boxShadow="sm"
              >
                <Heading size="md" mb={6}>
                  <Flex align="center">
                    <Icon as={FaLock} mr={2} color="blue.500" />
                    Security Settings
                  </Flex>
                </Heading>

                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      name="email"
                      value={accountSettings.email}
                      onChange={handleSettingsChange}
                      type="email"
                    />
                    <FormHelperText>
                      This email is used for account notifications and recovery.
                    </FormHelperText>
                  </FormControl>

                  <Divider />

                  <Heading size="sm">Change Password</Heading>

                  <FormControl>
                    <FormLabel>Current Password</FormLabel>
                    <InputGroup>
                      <Input
                        name="currentPassword"
                        value={accountSettings.currentPassword}
                        onChange={handleSettingsChange}
                        type={showPassword ? "text" : "password"}
                      />
                      <InputRightElement width="3rem">
                        <Button
                          h="1.5rem"
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon as={showPassword ? FaEyeSlash : FaEye} />
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>New Password</FormLabel>
                    <Input
                      name="newPassword"
                      value={accountSettings.newPassword}
                      onChange={handleSettingsChange}
                      type={showPassword ? "text" : "password"}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Confirm New Password</FormLabel>
                    <Input
                      name="confirmPassword"
                      value={accountSettings.confirmPassword}
                      onChange={handleSettingsChange}
                      type={showPassword ? "text" : "password"}
                    />
                  </FormControl>

                  <Button
                    colorScheme="blue"
                    onClick={saveAccountSettings}
                    isLoading={isSaving}
                    isDisabled={
                      !accountSettings.currentPassword &&
                      !accountSettings.newPassword
                    }
                  >
                    Update Security Settings
                  </Button>
                </VStack>
              </Box>

              {/* Notification Preferences */}
              <Box
                bg={cardBg}
                p={6}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                boxShadow="sm"
              >
                <Heading size="md" mb={6}>
                  <Flex align="center">
                    <Icon as={FaBell} mr={2} color="blue.500" />
                    Notification Settings
                  </Flex>
                </Heading>

                <VStack spacing={6} align="stretch">
                  <FormControl display="flex" alignItems="center">
                    <Switch
                      id="emailNotifications"
                      name="emailNotifications"
                      isChecked={accountSettings.emailNotifications}
                      onChange={handleSettingsChange}
                      colorScheme="blue"
                      mr={3}
                    />
                    <FormLabel htmlFor="emailNotifications" mb="0">
                      Email Notifications
                    </FormLabel>
                  </FormControl>

                  <Text fontSize="sm" color="gray.500" pl={10}>
                    Receive emails about credential updates, verifications, and
                    system announcements.
                  </Text>

                  <FormControl display="flex" alignItems="center" mt={4}>
                    <Switch
                      id="blockchainAlerts"
                      name="blockchainAlerts"
                      isChecked={accountSettings.blockchainAlerts}
                      onChange={handleSettingsChange}
                      colorScheme="blue"
                      mr={3}
                    />
                    <FormLabel htmlFor="blockchainAlerts" mb="0">
                      Blockchain Transaction Alerts
                    </FormLabel>
                  </FormControl>

                  <Text fontSize="sm" color="gray.500" pl={10}>
                    Get notified when credentials are issued or verified on the
                    blockchain.
                  </Text>

                  <Divider my={4} />

                  <Heading size="sm">Data & Privacy</Heading>

                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    Your credentials are stored securely on the blockchain. Only
                    you control who can access them.
                  </Alert>

                  <Button variant="outline" colorScheme="red" mt={4}>
                    Request Data Export
                  </Button>
                </VStack>
              </Box>
            </SimpleGrid>
          </TabPanel>

          {/* Blockchain Connection Tab */}
          <TabPanel p={4}>
            <Box
              bg={cardBg}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              boxShadow="sm"
            >
              <Heading size="md" mb={6}>
                <Flex align="center">
                  <Icon as={FaEthereum} mr={2} color="blue.500" />
                  Blockchain Wallet Connection
                </Flex>
              </Heading>

              {walletAddress ? (
                <VStack align="stretch" spacing={6}>
                  <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    Your account is successfully connected to a blockchain
                    wallet.
                  </Alert>

                  <Box p={4} bg={highlightColor} borderRadius="md">
                    <Heading size="sm" mb={4}>
                      Connected Wallet
                    </Heading>
                    <Flex align="center">
                      <Icon as={FaEthereum} mr={2} boxSize={6} />
                      <Text fontFamily="mono" fontSize="md" fontWeight="bold">
                        {`${walletAddress.substring(
                          0,
                          8
                        )}...${walletAddress.substring(
                          walletAddress.length - 8
                        )}`}
                      </Text>
                    </Flex>
                  </Box>

                  <Divider />

                  <Heading size="sm">Connected Services</Heading>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box p={4} borderWidth="1px" borderRadius="md">
                      <Flex align="center" justify="space-between">
                        <Flex align="center">
                          <Icon as={FaCertificate} mr={2} color="green.500" />
                          <Text fontWeight="semibold">
                            Credential Verification
                          </Text>
                        </Flex>
                        <Badge colorScheme="green">Active</Badge>
                      </Flex>
                    </Box>

                    {userRole === "institution" && (
                      <Box p={4} borderWidth="1px" borderRadius="md">
                        <Flex align="center" justify="space-between">
                          <Flex align="center">
                            <Icon
                              as={FaGraduationCap}
                              mr={2}
                              color="green.500"
                            />
                            <Text fontWeight="semibold">
                              Credential Issuance
                            </Text>
                          </Flex>
                          <Badge colorScheme="green">Active</Badge>
                        </Flex>
                      </Box>
                    )}
                  </SimpleGrid>

                  <Text fontSize="sm" color="gray.500" mt={4}>
                    This wallet is used for all blockchain operations including
                    credential verification
                    {userRole === "institution"
                      ? " and issuance"
                      : " and management"}
                    .
                  </Text>

                  <Divider />

                  <Button colorScheme="red" variant="outline">
                    Disconnect Wallet
                  </Button>
                </VStack>
              ) : (
                <VStack align="stretch" spacing={6}>
                  <Alert status="warning" borderRadius="md">
                    <AlertIcon />
                    No blockchain wallet is currently connected to your account.
                  </Alert>

                  <Box
                    p={6}
                    borderWidth="1px"
                    borderRadius="md"
                    borderStyle="dashed"
                  >
                    <VStack spacing={4}>
                      <Icon as={FaEthereum} boxSize={12} color="gray.400" />
                      <Heading size="sm">Connect Your Wallet</Heading>
                      <Text textAlign="center" color="gray.500">
                        A connected wallet is required for credential
                        verification
                        {userRole === "institution"
                          ? " and issuance"
                          : " and management"}
                        .
                      </Text>
                      <Button colorScheme="blue">Connect Wallet</Button>
                    </VStack>
                  </Box>
                </VStack>
              )}
            </Box>

            <Box
              bg={cardBg}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              boxShadow="sm"
              mt={6}
            >
              <Heading size="md" mb={6}>
                Blockchain Activity
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <Card>
                  <CardBody>
                    <Flex direction="column" align="center">
                      <Heading size="4xl" color="blue.500" mb={2}>
                        {userRole === "institution" ? "157" : "5"}
                      </Heading>
                      <Text textAlign="center">
                        {userRole === "institution"
                          ? "Credentials Issued"
                          : "Credentials Received"}
                      </Text>
                    </Flex>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <Flex direction="column" align="center">
                      <Heading size="4xl" color="green.500" mb={2}>
                        {userRole === "institution" ? "89" : "12"}
                      </Heading>
                      <Text textAlign="center">
                        {userRole === "institution"
                          ? "Verification Requests"
                          : "Credential Shares"}
                      </Text>
                    </Flex>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <Flex direction="column" align="center">
                      <Heading size="4xl" color="purple.500" mb={2}>
                        {userRole === "institution" ? "32" : "8"}
                      </Heading>
                      <Text textAlign="center">Blockchain Transactions</Text>
                    </Flex>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Logout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to log out of your account?
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Profile;
