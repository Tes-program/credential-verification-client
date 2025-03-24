/* eslint-disable @typescript-eslint/no-explicit-any */
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
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
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
  VStack,
  HStack,
  Skeleton,
  SkeletonCircle,
  Alert,
  AlertIcon,
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
  FaSearch
} from "react-icons/fa";
import { useWeb3Auth } from "../contexts/Web3Context";
import { credentialService, institutionService } from "../services/api";

const Dashboard: React.FC = () => {
  const { user, userRole, isAuthenticated } = useWeb3Auth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>({
    stats: {},
    recentCredentials: [],
    recentActivity: []
  });
  const [error, setError] = useState<string | null>(null);
  
  // Colors
  // const cardBg = useColorModeValue("white", "gray.700");
  const statCardBg = useColorModeValue("blue.50", "blue.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch credentials with limit
        const credentialsResponse = await credentialService.getCredentials({
          limit: 5,
          sortBy: 'issueDate',
          sortOrder: 'desc'
        });
        
        let stats = {};
        
        // Fetch role-specific data
        if (userRole === 'institution') {
          // Get institution stats
          const studentsResponse = await institutionService.getStudents({
            limit: 1, // Just to get the total count
          });
          
          stats = {
            issuedCredentials: credentialsResponse.data.pagination.total || 0,
            verifications: credentialsResponse.data.credentials.reduce(
              (sum: number, cred: any) => sum + (cred.verifications || 0), 0
            ),
            students: studentsResponse.data.pagination.total || 0,
            pendingRequests: 0 // This would come from another endpoint in a real app
          };
        } else {
          // Get student stats
          stats = {
            receivedCredentials: credentialsResponse.data.pagination.total || 0,
            sharedCredentials: credentialsResponse.data.credentials.reduce(
              (sum: number, cred: any) => sum + (cred.shared || 0), 0
            ),
            verifications: credentialsResponse.data.credentials.reduce(
              (sum: number, cred: any) => sum + (cred.verifications || 0), 0
            )
          };
        }
        
        setDashboardData({
          stats,
          recentCredentials: credentialsResponse.data.credentials || [],
          recentActivity: [] // This would come from an activity endpoint in a real app
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, userRole]);

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

      {/* Error Display */}
      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

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
                    {dashboardData.stats.issuedCredentials || 0}
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
                  <StatNumber>{dashboardData.stats.verifications || 0}</StatNumber>
                  <StatHelpText>Total verifications</StatHelpText>
                </Box>
              </Flex>
            </Stat>

            <Stat bg={statCardBg} p={5} borderRadius="lg" boxShadow="md">
              <Flex align="center">
                <Box p={2} bg="orange.500" borderRadius="md" mr={3}>
                  <Icon as={FaUserGraduate} color="white" boxSize={5} />
                </Box>
                <Box>
                  <StatLabel>Students</StatLabel>
                  <StatNumber>
                    {dashboardData.stats.students || 0}
                  </StatNumber>
                  <StatHelpText>Enrolled students</StatHelpText>
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
                    {dashboardData.stats.receivedCredentials || 0}
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
                  <StatNumber>{dashboardData.stats.sharedCredentials || 0}</StatNumber>
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
                  <StatNumber>{dashboardData.stats.verifications || 0}</StatNumber>
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
                {dashboardData.recentCredentials.length > 0 ? (
                  <VStack spacing={4} align="stretch">
                    {dashboardData.recentCredentials.map((credential: any) => (
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
                                {credential.recipientName}
                              </Heading>
                              <Text color="gray.500" fontSize="sm">
                                {credential.credentialType}
                              </Text>
                              <Text fontSize="xs" mt={1}>
                                Issued:{" "}
                                {new Date(credential.issueDate).toLocaleDateString()}
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
                                  <MenuItem 
                                    icon={<Icon as={FaEye} />}
                                    as={RouterLink}
                                    to={`/credentials/${credential.id}`}
                                  >
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
                {dashboardData.recentCredentials.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {dashboardData.recentCredentials.map((credential: any) => (
                      <Card
                        key={credential.id}
                        variant="outline"
                        borderColor={borderColor}
                      >
                        <CardHeader pb={2}>
                          <Flex justify="space-between" align="center">
                            <Heading size="md">{credential.credentialName || credential.credentialType}</Heading>
                            <Menu>
                              <MenuButton as={Button} variant="ghost" size="sm">
                                <Icon as={FaEllipsisV} />
                              </MenuButton>
                              <MenuList>
                                <MenuItem 
                                  icon={<Icon as={FaEye} />}
                                  as={RouterLink}
                                  to={`/credentials/${credential.id}`}
                                >
                                  View Details
                                </MenuItem>
                                <MenuItem 
                                  icon={<Icon as={FaShareAlt} />}
                                  as={RouterLink}
                                  to={`/share/${credential.id}`}  
                                >
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
                                {credential.institution || "Issuing Institution"}
                              </Text>
                            </Flex>
                            <Flex justify="space-between">
                              <Text fontWeight="semibold" fontSize="sm">
                                Issue Date:
                              </Text>
                              <Text fontSize="sm">
                                {new Date(credential.issueDate).toLocaleDateString()}
                              </Text>
                            </Flex>
                            <Flex justify="space-between">
                              <Text fontWeight="semibold" fontSize="sm">
                                Shared:
                              </Text>
                              <Text fontSize="sm">
                                {credential.shared || 0} times
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
                
                {dashboardData.recentCredentials.length > 0 && (
                  <Flex justify="center" mt={6}>
                    <Button
                      variant="outline"
                      rightIcon={<Icon as={FaSearch} />}
                      as={RouterLink}
                      to="/credentials"
                    >
                      View All Credentials
                    </Button>
                  </Flex>
                )}
              </TabPanel>
              <TabPanel>
                <Alert status="info">
                  <AlertIcon />
                  Your shared credential history will appear here.
                </Alert>
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

              <Card
                as={RouterLink}
                to={dashboardData.recentCredentials.length > 0 
                  ? `/share/${dashboardData.recentCredentials[0].id}` 
                  : "/credentials"}
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