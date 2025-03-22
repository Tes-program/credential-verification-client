// src/pages/IssueCredential.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Select,
  Textarea,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  useColorModeValue,
  Divider,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon,
  HStack,
  Badge,
  Switch,
  FormErrorMessage,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useSteps,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaCertificate,
  FaCheck,
  FaExclamationTriangle,
  FaUniversity,
  FaClipboard,
  FaCalendarAlt,
  FaIdCard,
} from "react-icons/fa";
import { useWeb3Auth } from "../contexts/Web3Context";

// Mock data for student lookup
const mockStudents = [
  {
    id: "ST001",
    name: "John Doe",
    email: "john.doe@example.com",
    studentId: "202201001",
  },
  {
    id: "ST002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    studentId: "202201002",
  },
  {
    id: "ST003",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    studentId: "202201003",
  },
];

// Mock credential types
const credentialTypes = [
  "Bachelor of Science",
  "Bachelor of Arts",
  "Master of Science",
  "Master of Arts",
  "PhD",
  "Certificate",
  "Diploma",
];

// Step definitions for the stepper
const steps = [
  { title: "Student Information", description: "Select the student" },
  { title: "Credential Details", description: "Enter credential info" },
  { title: "Review & Confirm", description: "Verify and issue" },
];

const IssueCredential: React.FC = () => {
  const { userRole, isAuthenticated, walletAddress } = useWeb3Auth();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<
    null | (typeof mockStudents)[0]
  >(null);
  const [activeStep, setActiveStep] = useState(0);
  const { activeStep: currentStep, setActiveStep: setStep } = useSteps({
    index: activeStep,
    count: steps.length,
  });

  // Form state
  const [formData, setFormData] = useState({
    credentialType: "",
    credentialName: "",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    hasExpiry: false,
    description: "",
    additionalFields: [
      { label: "GPA", value: "" },
      { label: "Major", value: "" },
    ],
  });

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle switch changes
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle additional field changes
  const handleAdditionalFieldChange = (
    index: number,
    field: "label" | "value",
    value: string
  ) => {
    setFormData((prev) => {
      const newFields = [...prev.additionalFields];
      newFields[index] = { ...newFields[index], [field]: value };
      return { ...prev, additionalFields: newFields };
    });
  };

  // Add new additional field
  const addAdditionalField = () => {
    setFormData((prev) => ({
      ...prev,
      additionalFields: [...prev.additionalFields, { label: "", value: "" }],
    }));
  };

  // Remove additional field
  const removeAdditionalField = (index: number) => {
    setFormData((prev) => {
      const newFields = [...prev.additionalFields];
      newFields.splice(index, 1);
      return { ...prev, additionalFields: newFields };
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate student selection
    if (!selectedStudent && activeStep === 0) {
      newErrors.student = "Please select a student";
    }

    // Validate credential details
    if (activeStep === 1) {
      if (!formData.credentialType) {
        newErrors.credentialType = "Credential type is required";
      }
      if (!formData.credentialName) {
        newErrors.credentialName = "Credential name is required";
      }
      if (!formData.issueDate) {
        newErrors.issueDate = "Issue date is required";
      }
      if (formData.hasExpiry && !formData.expiryDate) {
        newErrors.expiryDate =
          "Expiry date is required when credential has expiry";
      }

      // Validate additional fields
      formData.additionalFields.forEach((field, index) => {
        if (field.label && !field.value) {
          newErrors[
            `additionalValue-${index}`
          ] = `Value for ${field.label} is required`;
        }
        if (!field.label && field.value) {
          newErrors[`additionalLabel-${index}`] = "Label is required";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate between steps
  const nextStep = () => {
    if (validateForm()) {
      setActiveStep((prev) => prev + 1);
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setActiveStep((prev) => prev - 1);
    setStep((prev) => prev - 1);
  };

  // Handle student search
  const filteredStudents = searchTerm
    ? mockStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId.includes(searchTerm) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockStudents;

  // Handle student selection
  const handleSelectStudent = (student: (typeof mockStudents)[0]) => {
    setSelectedStudent(student);

    // Clear error if it exists
    if (errors.student) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.student;
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // In a real implementation, this would send the credential to the blockchain
      // For now, we'll simulate a success after a brief delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Credential Issued",
        description: `Successfully issued ${formData.credentialName} to ${selectedStudent?.name}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error issuing credential:", error);
      toast({
        title: "Error",
        description: "Failed to issue credential. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is authorized
  if (userRole !== "institution") {
    return (
      <Container maxW="container.md" py={10}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            Only institutions can issue credentials. If you believe this is an
            error, please contact support.
          </AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Box mb={8}>
        <Heading size="lg">Issue New Credential</Heading>
        <Text color="gray.500" mt={1}>
          Create and issue a new academic credential that will be securely
          stored on the blockchain.
        </Text>
      </Box>

      {/* Stepper */}
      <Stepper index={currentStep} mb={8} colorScheme="blue">
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink={0}>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <Box
        bg={cardBg}
        p={6}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="md"
      >
        {activeStep === 0 && (
          <VStack spacing={6} align="stretch">
            <Heading size="md" mb={4}>
              <Flex align="center">
                <Icon as={FaUserGraduate} mr={2} color="blue.500" />
                Student Information
              </Flex>
            </Heading>

            <FormControl isInvalid={!!errors.student}>
              <FormLabel>Search Student</FormLabel>
              <Input
                placeholder="Search by name, ID, or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FormHelperText>
                Enter the student's name, ID, or email to find them in the
                system.
              </FormHelperText>
              {errors.student && (
                <FormErrorMessage>{errors.student}</FormErrorMessage>
              )}
            </FormControl>

            <Box>
              <Text fontWeight="semibold" mb={2}>
                {filteredStudents.length}{" "}
                {filteredStudents.length === 1 ? "Result" : "Results"}
              </Text>
              <VStack spacing={3} align="stretch" maxH="300px" overflowY="auto">
                {filteredStudents.map((student) => (
                  <Box
                    key={student.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => handleSelectStudent(student)}
                    bg={
                      selectedStudent?.id === student.id ? "blue.50" : undefined
                    }
                    borderColor={
                      selectedStudent?.id === student.id
                        ? "blue.500"
                        : borderColor
                    }
                    _hover={{ bg: "blue.50" }}
                    transition="all 0.2s"
                  >
                    <Flex justify="space-between" align="center">
                      <Box>
                        <Text fontWeight="semibold">{student.name}</Text>
                        <Text fontSize="sm" color="gray.600">
                          ID: {student.studentId}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {student.email}
                        </Text>
                      </Box>
                      {selectedStudent?.id === student.id && (
                        <Icon as={FaCheck} color="green.500" />
                      )}
                    </Flex>
                  </Box>
                ))}

                {filteredStudents.length === 0 && (
                  <Alert status="info">
                    <AlertIcon />
                    No students found matching your search. Try a different
                    term.
                  </Alert>
                )}
              </VStack>
            </Box>

            <Flex justify="flex-end" mt={4}>
              <Button
                colorScheme="blue"
                onClick={nextStep}
                isDisabled={!selectedStudent}
              >
                Next: Credential Details
              </Button>
            </Flex>
          </VStack>
        )}

        {activeStep === 1 && (
          <VStack spacing={6} align="stretch">
            <Heading size="md" mb={4}>
              <Flex align="center">
                <Icon as={FaCertificate} mr={2} color="blue.500" />
                Credential Details
              </Flex>
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isRequired isInvalid={!!errors.credentialType}>
                <FormLabel>Credential Type</FormLabel>
                <Select
                  name="credentialType"
                  value={formData.credentialType}
                  onChange={handleChange}
                  placeholder="Select credential type"
                >
                  {credentialTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
                {errors.credentialType && (
                  <FormErrorMessage>{errors.credentialType}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.credentialName}>
                <FormLabel>Credential Name</FormLabel>
                <Input
                  name="credentialName"
                  value={formData.credentialName}
                  onChange={handleChange}
                  placeholder="e.g., Bachelor of Science in Computer Science"
                />
                {errors.credentialName && (
                  <FormErrorMessage>{errors.credentialName}</FormErrorMessage>
                )}
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isRequired isInvalid={!!errors.issueDate}>
                <FormLabel>Issue Date</FormLabel>
                <Input
                  name="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={handleChange}
                />
                {errors.issueDate && (
                  <FormErrorMessage>{errors.issueDate}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl>
                <Flex align="center" mb={2}>
                  <FormLabel mb={0}>Has Expiry Date</FormLabel>
                  <Switch
                    name="hasExpiry"
                    isChecked={formData.hasExpiry}
                    onChange={handleSwitchChange}
                    colorScheme="blue"
                  />
                </Flex>
                {formData.hasExpiry && (
                  <>
                    <Input
                      name="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      isInvalid={!!errors.expiryDate}
                      mt={2}
                    />
                    {errors.expiryDate && (
                      <FormErrorMessage>{errors.expiryDate}</FormErrorMessage>
                    )}
                  </>
                )}
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the credential"
                rows={3}
              />
            </FormControl>

            <Box>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="sm">Additional Information</Heading>
                <Button
                  size="sm"
                  onClick={addAdditionalField}
                  colorScheme="blue"
                  variant="outline"
                >
                  Add Field
                </Button>
              </Flex>

              <VStack spacing={4} align="stretch">
                {formData.additionalFields.map((field, index) => (
                  <SimpleGrid key={index} columns={3} spacing={2}>
                    <FormControl
                      isInvalid={!!errors[`additionalLabel-${index}`]}
                    >
                      <Input
                        placeholder="Field Label"
                        value={field.label}
                        onChange={(e) =>
                          handleAdditionalFieldChange(
                            index,
                            "label",
                            e.target.value
                          )
                        }
                      />
                      {errors[`additionalLabel-${index}`] && (
                        <FormErrorMessage>
                          {errors[`additionalLabel-${index}`]}
                        </FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl
                      isInvalid={!!errors[`additionalValue-${index}`]}
                    >
                      <Input
                        placeholder="Field Value"
                        value={field.value}
                        onChange={(e) =>
                          handleAdditionalFieldChange(
                            index,
                            "value",
                            e.target.value
                          )
                        }
                      />
                      {errors[`additionalValue-${index}`] && (
                        <FormErrorMessage>
                          {errors[`additionalValue-${index}`]}
                        </FormErrorMessage>
                      )}
                    </FormControl>

                    <Button
                      onClick={() => removeAdditionalField(index)}
                      colorScheme="red"
                      variant="ghost"
                      isDisabled={formData.additionalFields.length <= 2}
                    >
                      Remove
                    </Button>
                  </SimpleGrid>
                ))}
              </VStack>
            </Box>

            <Flex justify="space-between" mt={4}>
              <Button variant="outline" onClick={prevStep}>
                Back: Student Information
              </Button>
              <Button colorScheme="blue" onClick={nextStep}>
                Next: Review & Confirm
              </Button>
            </Flex>
          </VStack>
        )}

        {activeStep === 2 && (
          <VStack spacing={6} align="stretch">
            <Heading size="md" mb={4}>
              <Flex align="center">
                <Icon as={FaClipboard} mr={2} color="blue.500" />
                Review & Confirm
              </Flex>
            </Heading>

            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Ready to Issue</AlertTitle>
                <AlertDescription>
                  Please review the credential details before issuing. Once
                  issued on the blockchain, the credential cannot be modified.
                </AlertDescription>
              </Box>
            </Alert>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Card variant="outline">
                <CardBody>
                  <Heading size="sm" mb={4}>
                    <Flex align="center">
                      <Icon as={FaUserGraduate} mr={2} color="blue.500" />
                      Student Information
                    </Flex>
                  </Heading>

                  <VStack align="stretch" spacing={2}>
                    <Flex justify="space-between">
                      <Text fontWeight="semibold">Name:</Text>
                      <Text>{selectedStudent?.name}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text fontWeight="semibold">Student ID:</Text>
                      <Text>{selectedStudent?.studentId}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text fontWeight="semibold">Email:</Text>
                      <Text>{selectedStudent?.email}</Text>
                    </Flex>
                  </VStack>
                </CardBody>
              </Card>

              <Card variant="outline">
                <CardBody>
                  <Heading size="sm" mb={4}>
                    <Flex align="center">
                      <Icon as={FaCertificate} mr={2} color="blue.500" />
                      Credential Information
                    </Flex>
                  </Heading>

                  <VStack align="stretch" spacing={2}>
                    <Flex justify="space-between">
                      <Text fontWeight="semibold">Type:</Text>
                      <Text>{formData.credentialType}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text fontWeight="semibold">Name:</Text>
                      <Text>{formData.credentialName}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text fontWeight="semibold">Issue Date:</Text>
                      <Text>
                        {new Date(formData.issueDate).toLocaleDateString()}
                      </Text>
                    </Flex>
                    {formData.hasExpiry && (
                      <Flex justify="space-between">
                        <Text fontWeight="semibold">Expiry Date:</Text>
                        <Text>
                          {new Date(formData.expiryDate).toLocaleDateString()}
                        </Text>
                      </Flex>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            {formData.description && (
              <Box p={4} borderWidth="1px" borderRadius="md">
                <Text fontWeight="semibold" mb={2}>
                  Description:
                </Text>
                <Text>{formData.description}</Text>
              </Box>
            )}

            {formData.additionalFields.length > 0 && (
              <Box>
                <Heading size="sm" mb={4}>
                  Additional Information
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {formData.additionalFields.map(
                    (field, index) =>
                      field.label && (
                        <Flex
                          key={index}
                          justify="space-between"
                          p={2}
                          borderWidth="1px"
                          borderRadius="md"
                        >
                          <Text fontWeight="semibold">{field.label}:</Text>
                          <Text>{field.value}</Text>
                        </Flex>
                      )
                  )}
                </SimpleGrid>
              </Box>
            )}

            <Box p={4} bg="blue.50" borderRadius="md" mt={4}>
              <Heading size="sm" mb={2}>
                Blockchain Information
              </Heading>
              <Text fontSize="sm">
                This credential will be issued using the wallet address:{" "}
                {walletAddress ? (
                  <Badge colorScheme="blue">{`${walletAddress.substring(
                    0,
                    6
                  )}...${walletAddress.substring(
                    walletAddress.length - 4
                  )}`}</Badge>
                ) : (
                  "Loading..."
                )}
              </Text>
            </Box>

            <Flex justify="space-between" mt={4}>
              <Button variant="outline" onClick={prevStep}>
                Back: Credential Details
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={isLoading}
                loadingText="Issuing Credential"
              >
                Issue Credential
              </Button>
            </Flex>
          </VStack>
        )}
      </Box>
    </Container>
  );
};

export default IssueCredential;
