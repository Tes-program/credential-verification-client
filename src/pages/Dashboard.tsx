// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  Icon,
  Divider,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  TabList,
  TabPanels,
  Tab,
  Tabs,
  TabPanel,
  Avatar,
  VStack,
  HStack,
  Skeleton,
  SkeletonCircle,
  Alert,
  AlertIcon,
  IconButton,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FaGraduationCap,
  FaUniversity,
  FaCertificate,
  FaUserGraduate,
  FaFileAlt,
  FaShareAlt,
  FaEye,
  FaEllipsisV,
  FaPlus,
  FaDownload,
  FaSearch,
  FaCalendarAlt,
  FaClock,
  FaLink,
  FaLock,
  FaShare,
} from "react-icons/fa";
import { useWeb3Auth } from "../contexts/Web3Context";

// Mock data for testing
const mockInstitutionStats = {
  issuedCredentials: 157,
  verifications: 89,
  pendingRequests: 2,
};

const mockStudentStats = {
  receivedCredentials: 5,
  sharedCredentials: 12,
  verifications: 8,
};

const mockInstitutionCredentials = [
  {
    id: "cred123",
    studentName: "John Doe",
    credentialType: "Bachelor of Science",
    issueDate: "2023-10-15",
    status: "active",
  },
  {
    id: "cred124",
    studentName: "Jane Smith",
    credentialType: "Master of Engineering",
    issueDate: "2023-10-10",
    status: "active",
  },
  {
    id: "cred125",
    studentName: "Robert Johnson",
    credentialType: "PhD in Computer Science",
    issueDate: "2023-09-28",
    status: "active",
  },
];

const mockStudentCredentials = [
  {
    id: "cred345",
    institution: "Babcock University",
    credentialType: "Bachelor of Science in Information Technology",
    issueDate: "2022-06-15",
    shared: 3,
  },
  {
    id: "cred346",
    institution: "Babcock University",
    credentialType: "Certificate in Web Development",
    issueDate: "2021-08-22",
    shared: 1,
  },
];

const Dashboard: React.FC = () => {
  const { user, userRole, isAuthenticated } = useWeb3Auth();
  const [isLoading, setIsLoading] = useState(true);
  const cardBg = useColorModeValue("white", "gray.700");
  const statCardBg = useColorModeValue("blue.50", "blue.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Generate welcome message based on time of day
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <Container maxW="container.xl" py={8}>
      {/* Header Section */}
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        mb={8}
      >
        <Box>
          <Heading size="lg">
            {getWelcomeMessage()}, {user?.name || "User"}
          </Heading>
          <Text color="gray.500" mt={1}>
            {userRole === "institution"
              ? "Manage and issue academic credentials"
              : "View and share your academic credentials"}
          </Text>
        </Box>

        {userRole === "institution" && (
          <Button
            leftIcon={<Icon as={FaPlus} />}
            colorScheme="blue"
            mt={{ base: 4, md: 0 }}
            as={RouterLink}
            to="/issue"
          >
            Issue New Credential
          </Button>
        )}
      </Flex>

      {/* Stats Section */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        {isLoading ? (
          // Loading skeletons for stats
          Array(3)
            .fill(0)
            .map((_, i) => (
              <Box
                key={i}
                p={5}
                shadow="md"
                borderWidth="1px"
                borderRadius="lg"
              >
                <Skeleton height="20px" width="120px" mb={2} />
                <Skeleton height="40px" width="80px" mb={2} />
                <Skeleton height="15px" width="140px" />
              </Box>
            ))
        ) : userRole === "institution" ? (
          // Institution Stats
          <>
            <Stat bg={statCardBg} p={5} borderRadius="lg" boxShadow="md">
              <Flex align="center">
                <Box p={2} bg="blue.500" borderRadius="md" mr={3}>
                  <Icon as={FaCertificate} color="white" boxSize={5} />
                </Box>
                <Box>
                  <StatLabel>Issued Credentials</StatLabel>
                  <StatNumber>
                    {mockInstitutionStats.issuedCredentials}
                  </StatNumber>
                  <StatHelpText>Total issued to date</StatHelpText>
                </Box>
              </Flex>
            </Stat>

            <Stat bg={statCardBg} p={5} borderRadius="lg" boxShadow="md">
              <Flex align="center">
                <Box p={2} bg="green.500" borderRadius="md" mr={3}>
                  <Icon as={FaEye} color="white" boxSize={5} />
                </Box>
                <Box>
                  <StatLabel>Credential Verifications</StatLabel>
                  <StatNumber>{mockInstitutionStats.verifications}</StatNumber>
                  <StatHelpText>Last 30 days</StatHelpText>
                </Box>
              </Flex>
            </Stat>

            <Stat bg={statCardBg} p={5} borderRadius="lg" boxShadow="md">
              <Flex align="center">
                <Box p={2} bg="orange.500" borderRadius="md" mr={3}>
                  <Icon as={FaFileAlt} color="white" boxSize={5} />
                </Box>
                <Box>
                  <StatLabel>Pending Requests</StatLabel>
                  <StatNumber>
                    {mockInstitutionStats.pendingRequests}
                  </StatNumber>
                  <StatHelpText>Requires attention</StatHelpText>
                </Box>
              </Flex>
            </Stat>
          </>
        ) : (
          // Student Stats
          <>
            <Stat bg={statCardBg} p={5} borderRadius="lg" boxShadow="md">
              <Flex align="center">
                <Box p={2} bg="blue.500" borderRadius="md" mr={3}>
                  <Icon as={FaGraduationCap} color="white" boxSize={5} />
                </Box>
                <Box>
                  <StatLabel>Your Credentials</StatLabel>
                  <StatNumber>
                    {mockStudentStats.receivedCredentials}
                  </StatNumber>
                  <StatHelpText>Total received</StatHelpText>
                </Box>
              </Flex>
            </Stat>

            <Stat bg={statCardBg} p={5} borderRadius="lg" boxShadow="md">
              <Flex align="center">
                <Box p={2} bg="green.500" borderRadius="md" mr={3}>
                  <Icon as={FaShareAlt} color="white" boxSize={5} />
                </Box>
                <Box>
                  <StatLabel>Shared Credentials</StatLabel>
                  <StatNumber>{mockStudentStats.sharedCredentials}</StatNumber>
                  <StatHelpText>With employers/others</StatHelpText>
                </Box>
              </Flex>
            </Stat>

            <Stat bg={statCardBg} p={5} borderRadius="lg" boxShadow="md">
              <Flex align="center">
                <Box p={2} bg="purple.500" borderRadius="md" mr={3}>
                  <Icon as={FaEye} color="white" boxSize={5} />
                </Box>
                <Box>
                  <StatLabel>Verifications</StatLabel>
                  <StatNumber>{mockStudentStats.verifications}</StatNumber>
                  <StatHelpText>Your credentials</StatHelpText>
                </Box>
              </Flex>
            </Stat>
          </>
        )}
      </SimpleGrid>

      {/* Main Content Section */}
      <Box mb={8}>
        {isLoading ? (
          // Loading skeleton for tabs
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Flex p={4} borderBottomWidth="1px">
              <Skeleton height="30px" width="120px" mr={4} />
              <Skeleton height="30px" width="120px" />
            </Flex>
            <Box p={6}>
              <VStack spacing={6} align="stretch">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Flex
                      key={i}
                      align="center"
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                    >
                      <SkeletonCircle size="10" mr={4} />
                      <Box flex="1">
                        <Skeleton height="20px" width="180px" mb={2} />
                        <Skeleton height="15px" width="140px" />
                      </Box>
                    </Flex>
                  ))}
              </VStack>
            </Box>
          </Box>
        ) : userRole === "institution" ? (
          // Institution Content
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>Recent Credentials</Tab>
              <Tab>Verification Activity</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0} pt={4}>
                {mockInstitutionCredentials.length > 0 ? (
                  <VStack spacing={4} align="stretch">
                    {mockInstitutionCredentials.map((credential) => (
                      <Card
                        key={credential.id}
                        direction="row"
                        overflow="hidden"
                        variant="outline"
                      >
                        <CardBody>
                          <Flex
                            direction={{ base: "column", md: "row" }}
                            justify="space-between"
                            align={{ base: "flex-start", md: "center" }}
                          >
                            <Box>
                              <Heading size="sm">
                                {credential.studentName}
                              </Heading>
                              <Text color="gray.500" fontSize="sm">
                                {credential.credentialType}
                              </Text>
                              <Text fontSize="xs" mt={1}>
                                Issued:{" "}
                                {new Date(
                                  credential.issueDate
                                ).toLocaleDateString()}
                              </Text>
                            </Box>
                            <HStack mt={{ base: 3, md: 0 }} spacing={2}>
                              <Badge colorScheme="green">
                                {credential.status}
                              </Badge>
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Icon as={FaEllipsisV} />
                                </MenuButton>
                                <MenuList>
                                  <MenuItem icon={<Icon as={FaEye} />}>
                                    View Details
                                  </MenuItem>
                                  <MenuItem icon={<Icon as={FaFileAlt} />}>
                                    View Certificate
                                  </MenuItem>
                                  <MenuItem icon={<Icon as={FaDownload} />}>
                                    Download
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </HStack>
                          </Flex>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                ) : (
                  <Alert status="info">
                    <AlertIcon />
                    No credentials have been issued yet.
                  </Alert>
                )}

                <Flex justify="center" mt={6}>
                  <Button
                    variant="outline"
                    rightIcon={<Icon as={FaSearch} />}
                    as={RouterLink}
                    to="/admin/credentials"
                  >
                    View All Credentials
                  </Button>
                </Flex>
              </TabPanel>

              <TabPanel>
                <Alert status="info">
                  <AlertIcon />
                  Verification activity reporting will be available soon.
                </Alert>
              </TabPanel>
            </TabPanels>
          </Tabs>
        ) : (
          // Student Content
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>Your Credentials</Tab>
              <Tab>Shared History</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0} pt={4}>
                {mockStudentCredentials.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {mockStudentCredentials.map((credential) => (
                      <Card
                        key={credential.id}
                        variant="outline"
                        borderColor={borderColor}
                      >
                        <CardHeader pb={2}>
                          <Flex justify="space-between" align="center">
                            <Heading size="md">
                              {credential.credentialType}
                            </Heading>
                            <Menu>
                              <MenuButton as={Button} variant="ghost" size="sm">
                                <Icon as={FaEllipsisV} />
                              </MenuButton>
                              <MenuList>
                                <MenuItem icon={<Icon as={FaEye} />}>
                                  View Details
                                </MenuItem>
                                <MenuItem icon={<Icon as={FaShareAlt} />}>
                                  Share
                                </MenuItem>
                                <MenuItem icon={<Icon as={FaDownload} />}>
                                  Download
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Flex>
                        </CardHeader>
                        <CardBody py={2}>
                          <VStack align="stretch" spacing={1}>
                            <Flex justify="space-between">
                              <Text fontWeight="semibold" fontSize="sm">
                                Institution:
                              </Text>
                              <Text fontSize="sm">
                                {credential.institution}
                              </Text>
                            </Flex>
                            <Flex justify="space-between">
                              <Text fontWeight="semibold" fontSize="sm">
                                Issue Date:
                              </Text>
                              <Text fontSize="sm">
                                {new Date(
                                  credential.issueDate
                                ).toLocaleDateString()}
                              </Text>
                            </Flex>
                            <Flex justify="space-between">
                              <Text fontWeight="semibold" fontSize="sm">
                                Shared:
                              </Text>
                              <Text fontSize="sm">
                                {credential.shared} times
                              </Text>
                            </Flex>
                          </VStack>
                        </CardBody>
                        <CardFooter pt={2}>
                          <Button
                            leftIcon={<Icon as={FaShareAlt} />}
                            colorScheme="blue"
                            size="sm"
                            width="full"
                            as={RouterLink}
                            to={`/share/${credential.id}`}
                          >
                            Share Credential
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Alert status="info">
                    <AlertIcon />
                    You haven't received any credentials yet.
                  </Alert>
                )}
              </TabPanel>
              <TabPanel>
                <Box>
                  <Flex justify="space-between" align="center" mb={4}>
                    <Heading size="sm">Recently Shared Credentials</Heading>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      as={RouterLink}
                      to="/shared-history"
                      rightIcon={<Icon as={FaSearch} />}
                    >
                      View All
                    </Button>
                  </Flex>

                  {isLoading ? (
                    <VStack spacing={4} align="stretch">
                      {Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} height="100px" borderRadius="md" />
                        ))}
                    </VStack>
                  ) : (
                    <VStack spacing={4} align="stretch">
                      {/* Sample shared credential items */}
                      <Box
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor={borderColor}
                      >
                        <Flex
                          justify="space-between"
                          align="center"
                          direction={{ base: "column", sm: "row" }}
                          gap={4}
                        >
                          <Box>
                            <Heading size="sm">
                              Bachelor of Science in Information Technology
                            </Heading>
                            <Text fontSize="sm" color="gray.500" mt={1}>
                              Shared with{" "}
                              <Badge colorScheme="blue">TechCorp Inc.</Badge>{" "}
                              via Email
                            </Text>
                            <HStack mt={2} spacing={4}>
                              <Text fontSize="xs" color="gray.500">
                                <Icon as={FaCalendarAlt} mr={1} />
                                Shared on: 2025-02-15
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                <Icon as={FaClock} mr={1} />
                                Expires: 2025-05-15
                              </Text>
                            </HStack>
                          </Box>
                          <HStack>
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
                                  View Details
                                </MenuItem>
                                <MenuItem icon={<Icon as={FaLink} />}>
                                  Copy Link
                                </MenuItem>
                                <MenuItem icon={<Icon as={FaCalendarAlt} />}>
                                  Extend Expiry
                                </MenuItem>
                                <MenuItem
                                  icon={<Icon as={FaLock} />}
                                  color="red.500"
                                >
                                  Revoke Access
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </HStack>
                        </Flex>
                      </Box>

                      <Box
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor={borderColor}
                      >
                        <Flex
                          justify="space-between"
                          align="center"
                          direction={{ base: "column", sm: "row" }}
                          gap={4}
                        >
                          <Box>
                            <Heading size="sm">
                              Certificate in Web Development
                            </Heading>
                            <Text fontSize="sm" color="gray.500" mt={1}>
                              Shared with{" "}
                              <Badge colorScheme="purple">
                                john.smith@example.com
                              </Badge>{" "}
                              via Link
                            </Text>
                            <HStack mt={2} spacing={4}>
                              <Text fontSize="xs" color="gray.500">
                                <Icon as={FaCalendarAlt} mr={1} />
                                Shared on: 2025-01-10
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                <Icon as={FaEye} mr={1} />
                                Viewed: 3 times
                              </Text>
                            </HStack>
                          </Box>
                          <HStack>
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
                                  View Details
                                </MenuItem>
                                <MenuItem icon={<Icon as={FaLink} />}>
                                  Copy Link
                                </MenuItem>
                                <MenuItem icon={<Icon as={FaCalendarAlt} />}>
                                  Add Expiry
                                </MenuItem>
                                <MenuItem
                                  icon={<Icon as={FaLock} />}
                                  color="red.500"
                                >
                                  Revoke Access
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </HStack>
                        </Flex>
                      </Box>

                      <Box
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor={borderColor}
                        opacity={0.7}
                      >
                        <Flex
                          justify="space-between"
                          align="center"
                          direction={{ base: "column", sm: "row" }}
                          gap={4}
                        >
                          <Box>
                            <Heading size="sm">
                              Bachelor of Science in Information Technology
                            </Heading>
                            <Text fontSize="sm" color="gray.500" mt={1}>
                              Shared with{" "}
                              <Badge colorScheme="blue">
                                Global University
                              </Badge>{" "}
                              via Email
                            </Text>
                            <HStack mt={2} spacing={4}>
                              <Text fontSize="xs" color="gray.500">
                                <Icon as={FaCalendarAlt} mr={1} />
                                Shared on: 2024-12-05
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                <Icon as={FaClock} mr={1} />
                                Expired: 2025-01-05
                              </Text>
                            </HStack>
                          </Box>
                          <HStack>
                            <Badge colorScheme="red">Expired</Badge>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<FaEllipsisV />}
                                variant="ghost"
                                size="sm"
                              />
                              <MenuList>
                                <MenuItem icon={<Icon as={FaEye} />}>
                                  View Details
                                </MenuItem>
                                <MenuItem icon={<Icon as={FaCalendarAlt} />}>
                                  Extend Expiry
                                </MenuItem>
                                <MenuItem icon={<Icon as={FaShare} />}>
                                  Share Again
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </HStack>
                        </Flex>
                      </Box>
                    </VStack>
                  )}

                  {/* Sharing Statistics */}
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={8}>
                    <Card>
                      <CardBody>
                        <Flex direction="column" align="center">
                          <Heading size="xl" color="blue.500" mb={2}>
                            5
                          </Heading>
                          <Text textAlign="center">Active Shares</Text>
                        </Flex>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody>
                        <Flex direction="column" align="center">
                          <Heading size="xl" color="green.500" mb={2}>
                            12
                          </Heading>
                          <Text textAlign="center">Total Views</Text>
                        </Flex>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody>
                        <Flex direction="column" align="center">
                          <Heading size="xl" color="purple.500" mb={2}>
                            3
                          </Heading>
                          <Text textAlign="center">Verified By Others</Text>
                        </Flex>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Box>

      {/* Quick Actions Section */}
      <Box>
        <Heading size="md" mb={4}>
          Quick Actions
        </Heading>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          {userRole === "institution" ? (
            <>
              <Card
                as={RouterLink}
                to="/issue"
                borderRadius="lg"
                _hover={{ transform: "translateY(-5px)", shadow: "md" }}
                transition="all 0.3s"
              >
                <CardBody>
                  <VStack spacing={3}>
                    <Icon as={FaCertificate} boxSize={8} color="blue.500" />
                    <Text fontWeight="semibold">Issue Credential</Text>
                  </VStack>
                </CardBody>
              </Card>

              <Card
                as={RouterLink}
                to="/students"
                borderRadius="lg"
                _hover={{ transform: "translateY(-5px)", shadow: "md" }}
                transition="all 0.3s"
              >
                <CardBody>
                  <VStack spacing={3}>
                    <Icon as={FaUserGraduate} boxSize={8} color="green.500" />
                    <Text fontWeight="semibold">Manage Students</Text>
                  </VStack>
                </CardBody>
              </Card>

              <Card
                as={RouterLink}
                to="/verify"
                borderRadius="lg"
                _hover={{ transform: "translateY(-5px)", shadow: "md" }}
                transition="all 0.3s"
              >
                <CardBody>
                  <VStack spacing={3}>
                    <Icon as={FaSearch} boxSize={8} color="purple.500" />
                    <Text fontWeight="semibold">Verify Credential</Text>
                  </VStack>
                </CardBody>
              </Card>

              <Card
                as={RouterLink}
                to="/profile"
                borderRadius="lg"
                _hover={{ transform: "translateY(-5px)", shadow: "md" }}
                transition="all 0.3s"
              >
                <CardBody>
                  <VStack spacing={3}>
                    <Icon as={FaUniversity} boxSize={8} color="orange.500" />
                    <Text fontWeight="semibold">Institution Profile</Text>
                  </VStack>
                </CardBody>
              </Card>
            </>
          ) : (
            <>
              <Card
                as={RouterLink}
                to="/credentials"
                borderRadius="lg"
                _hover={{ transform: "translateY(-5px)", shadow: "md" }}
                transition="all 0.3s"
              >
                <CardBody>
                  <VStack spacing={3}>
                    <Icon as={FaCertificate} boxSize={8} color="blue.500" />
                    <Text fontWeight="semibold">View Credentials</Text>
                  </VStack>
                </CardBody>
              </Card>

              {/* Updated card with link to first credential for sharing */}
              <Card
                as={RouterLink}
                to={
                  mockStudentCredentials.length > 0
                    ? `/share/${mockStudentCredentials[0].id}`
                    : "/dashboard"
                }
                borderRadius="lg"
                _hover={{ transform: "translateY(-5px)", shadow: "md" }}
                transition="all 0.3s"
              >
                <CardBody>
                  <VStack spacing={3}>
                    <Icon as={FaShareAlt} boxSize={8} color="green.500" />
                    <Text fontWeight="semibold">Share Credentials</Text>
                  </VStack>
                </CardBody>
              </Card>

              <Card
                as={RouterLink}
                to="/verify"
                borderRadius="lg"
                _hover={{ transform: "translateY(-5px)", shadow: "md" }}
                transition="all 0.3s"
              >
                <CardBody>
                  <VStack spacing={3}>
                    <Icon as={FaSearch} boxSize={8} color="purple.500" />
                    <Text fontWeight="semibold">Verify Credential</Text>
                  </VStack>
                </CardBody>
              </Card>

              <Card
                as={RouterLink}
                to="/profile"
                borderRadius="lg"
                _hover={{ transform: "translateY(-5px)", shadow: "md" }}
                transition="all 0.3s"
              >
                <CardBody>
                  <VStack spacing={3}>
                    <Icon as={FaUserGraduate} boxSize={8} color="orange.500" />
                    <Text fontWeight="semibold">Your Profile</Text>
                  </VStack>
                </CardBody>
              </Card>
            </>
          )}
        </SimpleGrid>
      </Box>
    </Container>
  );
};

export default Dashboard;
