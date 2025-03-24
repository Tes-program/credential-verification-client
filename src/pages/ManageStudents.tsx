// src/pages/ManageStudents.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Button,
  VStack,
  HStack,
  Badge,
  Icon,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Checkbox,
  Skeleton,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormHelperText,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Avatar,
  Alert,
  AlertIcon,
  Tag,
  TagLabel,
  AlertDescription,
  AlertTitle,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FaSearch,
  FaUserGraduate,
  FaChevronLeft,
  FaEllipsisV,
  FaCertificate,
  FaEnvelope,
  FaIdCard,
  FaFileImport,
  FaFilter,
  FaDownload,
  FaTrash,
  FaEdit,
  FaUserPlus,
  FaCheckCircle,
  FaInfoCircle,
  FaEye,
} from "react-icons/fa";
import { useWeb3Auth } from "../contexts/Web3Context";
import { institutionService } from "../services/api";

// Mock students data
const mockStudents = [
  {
    id: "ST001",
    firstName: "John",
    lastName: "Doe",
    studentId: "2022010001",
    email: "john.doe@example.com",
    program: "B.Sc. Information Technology",
    enrollmentYear: "2022",
    expectedGraduation: "2026",
    credentialsCount: 3,
    status: "active",
    lastActivity: "2025-02-15",
  },
  {
    id: "ST002",
    firstName: "Jane",
    lastName: "Smith",
    studentId: "2022010002",
    email: "jane.smith@example.com",
    program: "B.Sc. Computer Science",
    enrollmentYear: "2022",
    expectedGraduation: "2026",
    credentialsCount: 2,
    status: "active",
    lastActivity: "2025-03-10",
  },
  {
    id: "ST003",
    firstName: "Michael",
    lastName: "Johnson",
    studentId: "2021010015",
    email: "michael.johnson@example.com",
    program: "M.Sc. Data Science",
    enrollmentYear: "2021",
    expectedGraduation: "2023",
    credentialsCount: 4,
    status: "graduated",
    lastActivity: "2025-01-22",
  },
  {
    id: "ST004",
    firstName: "Emily",
    lastName: "Williams",
    studentId: "2022010025",
    email: "emily.williams@example.com",
    program: "B.Sc. Information Technology",
    enrollmentYear: "2022",
    expectedGraduation: "2026",
    credentialsCount: 1,
    status: "active",
    lastActivity: "2025-02-28",
  },
  {
    id: "ST005",
    firstName: "David",
    lastName: "Brown",
    studentId: "2023010008",
    email: "david.brown@example.com",
    program: "B.Sc. Computer Science",
    enrollmentYear: "2023",
    expectedGraduation: "2027",
    credentialsCount: 0,
    status: "active",
    lastActivity: "2025-03-15",
  },
  {
    id: "ST006",
    firstName: "Sarah",
    lastName: "Miller",
    studentId: "2020010032",
    email: "sarah.miller@example.com",
    program: "B.Sc. Software Engineering",
    enrollmentYear: "2020",
    expectedGraduation: "2024",
    credentialsCount: 5,
    status: "active",
    lastActivity: "2025-03-18",
  },
  {
    id: "ST007",
    firstName: "Robert",
    lastName: "Wilson",
    studentId: "2021010028",
    email: "robert.wilson@example.com",
    program: "M.Sc. Cybersecurity",
    enrollmentYear: "2021",
    expectedGraduation: "2023",
    credentialsCount: 3,
    status: "graduated",
    lastActivity: "2025-01-15",
  },
];

// Program options for filtering
const programOptions = [
  "All Programs",
  "B.Sc. Information Technology",
  "B.Sc. Computer Science",
  "B.Sc. Software Engineering",
  "M.Sc. Data Science",
  "M.Sc. Cybersecurity",
];

const ManageStudents: React.FC = () => {
  const { userRole } = useWeb3Auth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<typeof mockStudents>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("All Programs");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<
    (typeof mockStudents)[0] | null
  >(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal disclosures
  const addStudentModal = useDisclosure();
  const studentDetailsModal = useDisclosure();
  const bulkImportModal = useDisclosure();
  const issueCredentialModal = useDisclosure();

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const tableRowHoverBg = useColorModeValue("gray.50", "gray.600");
  const tableBg = useColorModeValue("gray.50", "gray.700");

  // Load students data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStudents(mockStudents);
      setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        
        const params = {
          page,
          limit,
          search: searchTerm,
          program: selectedProgram !== 'All Programs' ? selectedProgram : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          sortBy,
          sortOrder
        };
        
        const response = await institutionService.getStudents(params);
        
        setStudents(response.data.students);
        setTotalStudents(response.data.pagination.total);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast({
          title: 'Error fetching students',
          description: 'Could not load student data. Please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated && userRole === 'institution') {
      fetchStudents();
    }
  }, [isAuthenticated, userRole, page, limit, searchTerm, selectedProgram, statusFilter, sortBy, sortOrder]);
  
  // Add student function
  const addStudent = async (studentData) => {
    try {
      setIsLoading(true);
      const response = await institutionService.addStudent(studentData);
      
      toast({
        title: 'Student Added',
        description: 'The student has been successfully added.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Refresh student list
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: 'Error adding student',
        description: error.response?.data?.message || 'Failed to add student. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter students based on search, program, and status
  const filteredStudents = React.useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        student.studentId.includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProgram =
        selectedProgram === "All Programs" ||
        student.program === selectedProgram;

      const matchesStatus =
        statusFilter === "all" || student.status === statusFilter;

      return matchesSearch && matchesProgram && matchesStatus;
    });
  }, [students, searchTerm, selectedProgram, statusFilter]);

  // Handle checkbox selection
  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudents(filteredStudents.map((student) => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  // Handle student details view
  const viewStudentDetails = (student: (typeof mockStudents)[0]) => {
    setSelectedStudent(student);
    studentDetailsModal.onOpen();
  };

  // Handle issue credential to selected students
  const handleIssueCredential = () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No students selected",
        description:
          "Please select at least one student to issue a credential.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    issueCredentialModal.onOpen();
  };

  // Handle file import click
  const handleFileImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, we would process the CSV file here
      bulkImportModal.onOpen();
    }
  };

  // Check if institution user
  if (userRole !== "institution") {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <Heading size="md">Access Denied</Heading>
            <Text>
              Only institution accounts can access student management.
            </Text>
          </Box>
        </Alert>

        <Button
          as={RouterLink}
          to="/dashboard"
          mt={4}
          leftIcon={<Icon as={FaChevronLeft} />}
        >
          Return to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* Header */}
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        mb={6}
        gap={4}
      >
        <Box>
          <Heading size="lg">Student Management</Heading>
          <Text color="gray.500" mt={1}>
            Manage students and issue academic credentials
          </Text>
        </Box>

        <HStack>
          <Button
            as={RouterLink}
            to="/dashboard"
            leftIcon={<Icon as={FaChevronLeft} />}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </HStack>
      </Flex>

      {/* Action Buttons */}
      <Flex
        mb={6}
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <HStack>
          <Button
            leftIcon={<Icon as={FaUserPlus} />}
            colorScheme="blue"
            onClick={addStudentModal.onOpen}
          >
            Add Student
          </Button>

          <Button
            leftIcon={<Icon as={FaFileImport} />}
            onClick={handleFileImportClick}
          >
            Import CSV
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".csv"
            onChange={handleFileUpload}
          />
        </HStack>

        <HStack>
          {selectedStudents.length > 0 && (
            <Button
              leftIcon={<Icon as={FaCertificate} />}
              colorScheme="green"
              onClick={handleIssueCredential}
            >
              Issue Credential ({selectedStudents.length})
            </Button>
          )}

          <Button
            leftIcon={<Icon as={FaDownload} />}
            variant="outline"
            isDisabled={filteredStudents.length === 0}
          >
            Export List
          </Button>
        </HStack>
      </Flex>

      {/* Search and Filters */}
      <Flex
        direction={{ base: "column", md: "row" }}
        mb={6}
        gap={4}
        p={4}
        bg={cardBg}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="sm"
      >
        <InputGroup flex="3">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search by name, ID, or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Flex gap={4} flex="2" direction={{ base: "column", sm: "row" }}>
          <Select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            icon={<FaFilter />}
          >
            {programOptions.map((program) => (
              <option key={program} value={program}>
                {program}
              </option>
            ))}
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="graduated">Graduated</option>
            <option value="inactive">Inactive</option>
          </Select>
        </Flex>
      </Flex>

      {/* Students Table */}
      <Box
        bg={cardBg}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
        boxShadow="sm"
      >
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr bg={tableBg}>
                <Th width="50px">
                  <Checkbox
                    isChecked={
                      filteredStudents.length > 0 &&
                      selectedStudents.length === filteredStudents.length
                    }
                    onChange={handleSelectAllChange}
                    isDisabled={filteredStudents.length === 0}
                  />
                </Th>
                <Th>Student</Th>
                <Th>Program</Th>
                <Th>Enrollment</Th>
                <Th>Credentials</Th>
                <Th>Status</Th>
                <Th width="60px">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Tr key={i}>
                      <Td>
                        <Skeleton height="20px" width="20px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" width="40px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" width="60px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" width="40px" />
                      </Td>
                    </Tr>
                  ))
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <Tr
                    key={student.id}
                    _hover={{ bg: tableRowHoverBg }}
                    cursor="pointer"
                  >
                    <Td onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        isChecked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                      />
                    </Td>
                    <Td onClick={() => viewStudentDetails(student)}>
                      <Flex align="center">
                        <Avatar
                          size="sm"
                          name={`${student.firstName} ${student.lastName}`}
                          mr={3}
                        />
                        <Box>
                          <Text fontWeight="medium">
                            {student.firstName} {student.lastName}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {student.email}
                          </Text>
                        </Box>
                      </Flex>
                    </Td>
                    <Td onClick={() => viewStudentDetails(student)}>
                      {student.program}
                    </Td>
                    <Td onClick={() => viewStudentDetails(student)}>
                      <Text>{student.enrollmentYear}</Text>
                      <Text fontSize="sm" color="gray.500">
                        Grad: {student.expectedGraduation}
                      </Text>
                    </Td>
                    <Td onClick={() => viewStudentDetails(student)}>
                      <Badge
                        colorScheme={
                          student.credentialsCount > 0 ? "blue" : "gray"
                        }
                        borderRadius="full"
                        px={2}
                      >
                        {student.credentialsCount}
                      </Badge>
                    </Td>
                    <Td onClick={() => viewStudentDetails(student)}>
                      <Badge
                        colorScheme={
                          student.status === "active"
                            ? "green"
                            : student.status === "graduated"
                            ? "purple"
                            : "gray"
                        }
                      >
                        {student.status}
                      </Badge>
                    </Td>
                    <Td onClick={(e) => e.stopPropagation()}>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<FaEllipsisV />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem
                            icon={<Icon as={FaEye} />}
                            onClick={() => viewStudentDetails(student)}
                          >
                            View Details
                          </MenuItem>
                          <MenuItem
                            icon={<Icon as={FaCertificate} />}
                            as={RouterLink}
                            to={`/issue?studentId=${student.id}`}
                          >
                            Issue Credential
                          </MenuItem>
                          <MenuItem icon={<Icon as={FaEdit} />}>
                            Edit Details
                          </MenuItem>
                          <MenuItem icon={<Icon as={FaEnvelope} />}>
                            Send Email
                          </MenuItem>
                          <MenuItem
                            icon={<Icon as={FaTrash} />}
                            color="red.500"
                          >
                            Deactivate
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={6}>
                    <Icon
                      as={FaInfoCircle}
                      color="blue.500"
                      boxSize={5}
                      mb={3}
                    />
                    <Text fontWeight="medium">No students found</Text>
                    <Text fontSize="sm" color="gray.500">
                      {searchTerm ||
                      selectedProgram !== "All Programs" ||
                      statusFilter !== "all"
                        ? "Try adjusting your search filters"
                        : "Start by adding students to your institution"}
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* Stats Row */}
      {!isLoading && filteredStudents.length > 0 && (
        <Flex
          mt={6}
          justify="space-between"
          bg={cardBg}
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          direction={{ base: "column", md: "row" }}
          align="center"
          gap={4}
        >
          <HStack>
            <Text color="gray.500">Total Students:</Text>
            <Text fontWeight="bold">{students.length}</Text>
          </HStack>

          <HStack>
            <Text color="gray.500">Active:</Text>
            <Text fontWeight="bold">
              {students.filter((s) => s.status === "active").length}
            </Text>
          </HStack>

          <HStack>
            <Text color="gray.500">Graduated:</Text>
            <Text fontWeight="bold">
              {students.filter((s) => s.status === "graduated").length}
            </Text>
          </HStack>

          <HStack>
            <Text color="gray.500">Displayed:</Text>
            <Text fontWeight="bold">{filteredStudents.length}</Text>
          </HStack>

          <HStack>
            <Text color="gray.500">Selected:</Text>
            <Text fontWeight="bold">{selectedStudents.length}</Text>
          </HStack>
        </Flex>
      )}

      {/* Add Student Modal */}
      <Modal
        isOpen={addStudentModal.isOpen}
        onClose={addStudentModal.onClose}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              <Icon as={FaUserPlus} mr={2} color="blue.500" />
              Add New Student
            </Flex>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input placeholder="First name" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input placeholder="Last name" />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email Address</FormLabel>
                  <Input type="email" placeholder="student@example.com" />
                  <FormHelperText>
                    The student will receive an invitation at this email
                  </FormHelperText>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Student ID</FormLabel>
                  <Input placeholder="e.g., 2022010001" />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Program</FormLabel>
                  <Select placeholder="Select program">
                    {programOptions
                      .filter((p) => p !== "All Programs")
                      .map((program) => (
                        <option key={program} value={program}>
                          {program}
                        </option>
                      ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Enrollment Year</FormLabel>
                  <Input placeholder="e.g., 2023" />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Expected Graduation Year</FormLabel>
                <Input placeholder="e.g., 2027" />
              </FormControl>

              <Alert status="info" borderRadius="md">
                <AlertIcon />
                The student will receive an email invitation to create their
                account on the platform.
              </Alert>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={addStudentModal.onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Add Student</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Student Details Modal */}
      <Modal
        isOpen={studentDetailsModal.isOpen}
        onClose={studentDetailsModal.onClose}
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              <Icon as={FaUserGraduate} mr={2} color="blue.500" />
              Student Details
            </Flex>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {selectedStudent && (
              <VStack spacing={6} align="stretch">
                <Flex
                  direction={{ base: "column", md: "row" }}
                  align="center"
                  gap={6}
                  pb={4}
                  borderBottomWidth="1px"
                  borderColor={borderColor}
                >
                  <Avatar
                    size="xl"
                    name={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                  />

                  <Box flex="1">
                    <Heading size="md">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </Heading>
                    <Badge
                      colorScheme={
                        selectedStudent.status === "active"
                          ? "green"
                          : selectedStudent.status === "graduated"
                          ? "purple"
                          : "gray"
                      }
                      mt={1}
                    >
                      {selectedStudent.status}
                    </Badge>
                    <Text mt={2}>{selectedStudent.program}</Text>
                    <HStack mt={2}>
                      <Icon as={FaIdCard} color="blue.500" />
                      <Text>{selectedStudent.studentId}</Text>
                    </HStack>
                    <HStack mt={1}>
                      <Icon as={FaEnvelope} color="blue.500" />
                      <Text>{selectedStudent.email}</Text>
                    </HStack>
                  </Box>
                </Flex>

                <Tabs colorScheme="blue" variant="enclosed">
                  <TabList>
                    <Tab>Details</Tab>
                    <Tab>Credentials ({selectedStudent.credentialsCount})</Tab>
                    <Tab>Activity</Tab>
                  </TabList>

                  <TabPanels>
                    {/* Details Tab */}
                    <TabPanel px={0}>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <VStack align="start" spacing={3}>
                          <Heading size="sm">Academic Information</Heading>

                          <Box width="100%">
                            <Text
                              fontWeight="medium"
                              fontSize="sm"
                              color="gray.500"
                            >
                              Program
                            </Text>
                            <Text>{selectedStudent.program}</Text>
                          </Box>

                          <Box width="100%">
                            <Text
                              fontWeight="medium"
                              fontSize="sm"
                              color="gray.500"
                            >
                              Enrollment Year
                            </Text>
                            <Text>{selectedStudent.enrollmentYear}</Text>
                          </Box>

                          <Box width="100%">
                            <Text
                              fontWeight="medium"
                              fontSize="sm"
                              color="gray.500"
                            >
                              Expected Graduation
                            </Text>
                            <Text>{selectedStudent.expectedGraduation}</Text>
                          </Box>

                          <Box width="100%">
                            <Text
                              fontWeight="medium"
                              fontSize="sm"
                              color="gray.500"
                            >
                              Student ID
                            </Text>
                            <Text>{selectedStudent.studentId}</Text>
                          </Box>
                        </VStack>

                        <VStack align="start" spacing={3}>
                          <Heading size="sm">System Information</Heading>

                          <Box width="100%">
                            <Text
                              fontWeight="medium"
                              fontSize="sm"
                              color="gray.500"
                            >
                              Account Status
                            </Text>
                            <Badge
                              colorScheme={
                                selectedStudent.status === "active"
                                  ? "green"
                                  : selectedStudent.status === "graduated"
                                  ? "purple"
                                  : "gray"
                              }
                            >
                              {selectedStudent.status}
                            </Badge>
                          </Box>

                          <Box width="100%">
                            <Text
                              fontWeight="medium"
                              fontSize="sm"
                              color="gray.500"
                            >
                              Last Activity
                            </Text>
                            <Text>
                              {new Date(
                                selectedStudent.lastActivity
                              ).toLocaleDateString()}
                            </Text>
                          </Box>

                          <Box width="100%">
                            <Text
                              fontWeight="medium"
                              fontSize="sm"
                              color="gray.500"
                            >
                              Credentials Issued
                            </Text>
                            <Text>{selectedStudent.credentialsCount}</Text>
                          </Box>

                          <Box width="100%">
                            <Text
                              fontWeight="medium"
                              fontSize="sm"
                              color="gray.500"
                            >
                              Internal ID
                            </Text>
                            <Text fontSize="sm" fontFamily="mono">
                              {selectedStudent.id}
                            </Text>
                          </Box>
                        </VStack>
                      </SimpleGrid>

                      <Flex justify="flex-end" mt={6} gap={3}>
                        <Button
                          leftIcon={<Icon as={FaEdit} />}
                          variant="outline"
                        >
                          Edit Details
                        </Button>
                        <Button
                          leftIcon={<Icon as={FaCertificate} />}
                          colorScheme="blue"
                          as={RouterLink}
                          to={`/issue?studentId=${selectedStudent.id}`}
                          onClick={studentDetailsModal.onClose}
                        >
                          Issue Credential
                        </Button>
                      </Flex>
                    </TabPanel>

                    {/* Credentials Tab */}
                    <TabPanel px={0}>
                      {selectedStudent.credentialsCount > 0 ? (
                        <VStack align="stretch" spacing={4}>
                          {[...Array(selectedStudent.credentialsCount)].map(
                            (_, i) => (
                              <Box
                                key={i}
                                p={4}
                                borderWidth="1px"
                                borderRadius="md"
                                position="relative"
                              >
                                <Flex
                                  direction={{ base: "column", md: "row" }}
                                  justify="space-between"
                                >
                                  <Box>
                                    <Flex align="center" mb={2}>
                                      <Icon
                                        as={FaCertificate}
                                        color="blue.500"
                                        mr={2}
                                      />
                                      <Heading size="sm">
                                        {i === 0
                                          ? "Bachelor of Science in Information Technology"
                                          : i === 1
                                          ? "Certificate in Web Development"
                                          : "Award for Academic Excellence"}
                                      </Heading>
                                    </Flex>
                                    <Text fontSize="sm" color="gray.600">
                                      Issued on:{" "}
                                      {new Date(
                                        Date.now() -
                                          i * 30 * 24 * 60 * 60 * 1000
                                      ).toLocaleDateString()}
                                    </Text>
                                  </Box>
                                  <HStack mt={{ base: 2, md: 0 }}>
                                    <Badge colorScheme="green">Active</Badge>
                                    <Menu>
                                      <MenuButton
                                        as={IconButton}
                                        icon={<FaEllipsisV />}
                                        variant="ghost"
                                        size="sm"
                                      />
                                      <MenuList>
                                        <MenuItem icon={<Icon as={FaEye} />}>
                                          View Certificate
                                        </MenuItem>
                                        <MenuItem
                                          icon={<Icon as={FaDownload} />}
                                        >
                                          Download
                                        </MenuItem>
                                        <MenuItem icon={<Icon as={FaEdit} />}>
                                          Edit
                                        </MenuItem>
                                        <MenuItem
                                          icon={<Icon as={FaTrash} />}
                                          color="red.500"
                                        >
                                          Revoke
                                        </MenuItem>
                                      </MenuList>
                                    </Menu>
                                  </HStack>
                                </Flex>
                              </Box>
                            )
                          )}
                        </VStack>
                      ) : (
                        <Box
                          p={6}
                          textAlign="center"
                          borderWidth="1px"
                          borderRadius="md"
                          borderStyle="dashed"
                        >
                          <Icon
                            as={FaCertificate}
                            boxSize={10}
                            color="gray.400"
                            mb={3}
                          />
                          <Heading size="md" mb={2}>
                            No Credentials Issued
                          </Heading>
                          <Text color="gray.500" mb={4}>
                            This student hasn't been issued any credentials yet.
                          </Text>
                          <Button
                            colorScheme="blue"
                            leftIcon={<Icon as={FaCertificate} />}
                            as={RouterLink}
                            to={`/issue?studentId=${selectedStudent.id}`}
                            onClick={studentDetailsModal.onClose}
                          >
                            Issue First Credential
                          </Button>
                        </Box>
                      )}
                    </TabPanel>

                    {/* Activity Tab */}
                    <TabPanel px={0}>
                      <VStack align="stretch" spacing={4}>
                        <Box p={4} borderWidth="1px" borderRadius="md">
                          <Flex align="center">
                            <Icon as={FaCheckCircle} color="green.500" mr={3} />
                            <Box>
                              <Text>Logged into the platform</Text>
                              <Text fontSize="sm" color="gray.500">
                                {new Date(
                                  selectedStudent.lastActivity
                                ).toLocaleString()}
                              </Text>
                            </Box>
                          </Flex>
                        </Box>

                        {selectedStudent.credentialsCount > 0 && (
                          <Box p={4} borderWidth="1px" borderRadius="md">
                            <Flex align="center">
                              <Icon
                                as={FaCertificate}
                                color="blue.500"
                                mr={3}
                              />
                              <Box>
                                <Text>Received a new credential</Text>
                                <Text fontSize="sm" color="gray.500">
                                  {new Date(
                                    Date.now() - 5 * 24 * 60 * 60 * 1000
                                  ).toLocaleString()}
                                </Text>
                              </Box>
                            </Flex>
                          </Box>
                        )}

                        <Box p={4} borderWidth="1px" borderRadius="md">
                          <Flex align="center">
                            <Icon
                              as={FaUserGraduate}
                              color="purple.500"
                              mr={3}
                            />
                            <Box>
                              <Text>Account created</Text>
                              <Text fontSize="sm" color="gray.500">
                                {new Date(
                                  Date.now() - 120 * 24 * 60 * 60 * 1000
                                ).toLocaleString()}
                              </Text>
                            </Box>
                          </Flex>
                        </Box>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" onClick={studentDetailsModal.onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Bulk Import Modal */}
      <Modal isOpen={bulkImportModal.isOpen} onClose={bulkImportModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Import Students</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Alert status="info" mb={4} borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>CSV File Detected</AlertTitle>
                <AlertDescription>
                  We've detected a CSV file with student records. Would you like
                  to proceed with importing?
                </AlertDescription>
              </Box>
            </Alert>

            <VStack align="stretch" spacing={3}>
              <Flex justify="space-between">
                <Text>Total records detected:</Text>
                <Badge colorScheme="blue" px={2}>
                  24
                </Badge>
              </Flex>

              <Flex justify="space-between">
                <Text>New students to add:</Text>
                <Badge colorScheme="green" px={2}>
                  20
                </Badge>
              </Flex>

              <Flex justify="space-between">
                <Text>Existing records to update:</Text>
                <Badge colorScheme="orange" px={2}>
                  4
                </Badge>
              </Flex>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={bulkImportModal.onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Import Students</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Issue Credential Modal */}
      <Modal
        isOpen={issueCredentialModal.isOpen}
        onClose={issueCredentialModal.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Issue Credentials</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <Text>
                You are about to issue credentials to {selectedStudents.length}{" "}
                selected students.
              </Text>

              <HStack flexWrap="wrap" spacing={2}>
                {selectedStudents.slice(0, 5).map((id) => {
                  const student = students.find((s) => s.id === id);
                  return student ? (
                    <Tag key={id} colorScheme="blue" borderRadius="full">
                      <TagLabel>
                        {student.firstName} {student.lastName}
                      </TagLabel>
                    </Tag>
                  ) : null;
                })}
                {selectedStudents.length > 5 && (
                  <Tag colorScheme="blue" borderRadius="full">
                    <TagLabel>+{selectedStudents.length - 5} more</TagLabel>
                  </Tag>
                )}
              </HStack>

              <Alert status="info" borderRadius="md">
                <AlertIcon />
                Would you like to issue individual credentials or use a batch
                process?
              </Alert>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={issueCredentialModal.onClose}
            >
              Cancel
            </Button>
            <Button
              as={RouterLink}
              to="/issue"
              colorScheme="blue"
              onClick={issueCredentialModal.onClose}
            >
              Continue to Issuance
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ManageStudents;
