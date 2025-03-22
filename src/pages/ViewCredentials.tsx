// src/pages/ViewCredentials.tsx
import React, { useState, useEffect } from 'react';
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
  Divider,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Skeleton,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Tabs,
  TabList, 
  Tab,
  TabPanels,
  TabPanel,
  Tag,
  Stack,
  useToast,
  Image,
  AlertTitle,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaSearch,
  FaDownload,
  FaShare,
  FaEllipsisV,
  FaQrcode,
  FaEye,
  FaPrint,
  FaUniversity,
  FaCertificate,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaCheckCircle,
  FaFileAlt,
  FaInfoCircle,
} from 'react-icons/fa';
import { useWeb3Auth } from '../contexts/Web3Context';

// Mock credentials data
const mockCredentials = [
  {
    id: 'cred345',
    institution: 'Babcock University',
    credentialType: 'Bachelor of Science in Information Technology',
    issueDate: '2022-06-15',
    description: 'Bachelor degree awarded upon completion of a 4-year program',
    credentialHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    shared: 3,
    verified: 5,
    category: 'Degree',
    status: 'active',
    metadata: {
      GPA: '3.8',
      Major: 'Information Technology',
      Minor: 'Business Administration',
      Honors: 'Cum Laude',
      'Graduation Date': '2022-06-15',
    }
  },
  {
    id: 'cred346',
    institution: 'Babcock University',
    credentialType: 'Certificate in Web Development',
    issueDate: '2021-08-22',
    description: 'Professional certification in modern web development technologies',
    credentialHash: '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    shared: 1,
    verified: 2,
    category: 'Certificate',
    status: 'active',
    metadata: {
      'Completion Date': '2021-08-22',
      'Skills Acquired': 'HTML, CSS, JavaScript, React',
      'Course Duration': '120 hours',
    }
  },
  {
    id: 'cred347',
    institution: 'Babcock University',
    credentialType: 'Academic Excellence Award',
    issueDate: '2021-05-10',
    description: 'Award for outstanding academic performance in the field of Information Technology',
    credentialHash: '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    shared: 0,
    verified: 1,
    category: 'Award',
    status: 'active',
    metadata: {
      'Award Date': '2021-05-10',
      'Award Category': 'Academic Excellence',
      'Department': 'Information Technology',
    }
  },
  {
    id: 'cred348',
    institution: 'EdX',
    credentialType: 'Introduction to Artificial Intelligence',
    issueDate: '2020-11-18',
    description: 'Online course covering fundamentals of artificial intelligence and machine learning',
    credentialHash: '0xd3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    shared: 2,
    verified: 0,
    category: 'Certificate',
    status: 'active',
    metadata: {
      'Completion Date': '2020-11-18',
      'Course Provider': 'EdX',
      'Issued By': 'MIT',
      'Course Duration': '6 weeks',
    }
  },
  {
    id: 'cred349',
    institution: 'Coursera',
    credentialType: 'Blockchain Fundamentals',
    issueDate: '2023-01-25',
    description: 'Comprehensive introduction to blockchain technology and its applications',
    credentialHash: '0xa3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    shared: 0,
    verified: 0,
    category: 'Certificate',
    status: 'active',
    metadata: {
      'Completion Date': '2023-01-25',
      'Course Provider': 'Coursera',
      'Issued By': 'UC Berkeley',
      'Course Duration': '8 weeks',
    }
  },
];

const ViewCredentials: React.FC = () => {
  const { user, userRole } = useWeb3Auth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentials] = useState<typeof mockCredentials>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('issueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [selectedCredential, setSelectedCredential] = useState<(typeof mockCredentials)[0] | null>(null);
  const detailsModal = useDisclosure();
  
  // Colors
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const badgeBg = useColorModeValue('blue.50', 'blue.900');
  
  // Load credentials
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call to fetch credentials
    setTimeout(() => {
      setCredentials(mockCredentials);
      setIsLoading(false);
    }, 1500);
  }, []);
  
  // Filter and sort credentials
  const filteredAndSortedCredentials = React.useMemo(() => {
    // First filter
    let result = credentials.filter(cred => {
      const matchesSearch = 
        cred.credentialType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.description.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCategory = 
        filterCategory === '' || cred.category === filterCategory;
        
      return matchesSearch && matchesCategory;
    });
    
    // Then sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'issueDate') {
        return sortOrder === 'asc' 
          ? new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime() 
          : new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
      }
      
      if (sortBy === 'institution') {
        return sortOrder === 'asc'
          ? a.institution.localeCompare(b.institution)
          : b.institution.localeCompare(a.institution);
      }
      
      if (sortBy === 'type') {
        return sortOrder === 'asc'
          ? a.credentialType.localeCompare(b.credentialType)
          : b.credentialType.localeCompare(a.credentialType);
      }
      
      if (sortBy === 'shared') {
        return sortOrder === 'asc'
          ? a.shared - b.shared
          : b.shared - a.shared;
      }
      
      return 0;
    });
    
    return result;
  }, [credentials, searchTerm, filterCategory, sortBy, sortOrder]);
  
  // Get unique categories for filter
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(credentials.map(cred => cred.category));
    return Array.from(uniqueCategories);
  }, [credentials]);
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  // View credential details
  const viewCredentialDetails = (credential: typeof mockCredentials[0]) => {
    setSelectedCredential(credential);
    detailsModal.onOpen();
  };
  
  // Handle credential download
  const downloadCredential = (id: string) => {
    toast({
      title: "Downloading credential",
      description: "Your credential is being downloaded as a PDF.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Get credential category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Degree':
        return 'blue';
      case 'Certificate':
        return 'green';
      case 'Award':
        return 'purple';
      default:
        return 'gray';
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      {/* Header */}
      <Flex 
        justify="space-between" 
        align={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        mb={6}
        gap={4}
      >
        <Box>
          <Heading size="lg">Your Academic Credentials</Heading>
          <Text color="gray.500" mt={1}>
            View, share, and manage all your academic credentials
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
      
      {/* Search and Filters */}
      <Flex 
        direction={{ base: 'column', md: 'row' }}
        mb={6}
        gap={4}
        p={4}
        bg={cardBg}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="sm"
      >
        <InputGroup flex="2">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.400" />
          </InputLeftElement>
          <Input 
            placeholder="Search credentials by name, institution, etc." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        
        <Flex gap={4} flex="1" direction={{ base: 'column', sm: 'row' }}>
          <Select 
            placeholder="Filter by category" 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            icon={<FaFilter />}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
          
          <Flex>
            <Select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              borderRightRadius={0}
            >
              <option value="issueDate">Issue Date</option>
              <option value="institution">Institution</option>
              <option value="type">Credential Type</option>
              <option value="shared">Times Shared</option>
            </Select>
            <Button 
              onClick={toggleSortOrder} 
              borderLeftRadius={0}
              px={3}
            >
              <Icon 
                as={sortOrder === 'asc' ? FaSortAmountUp : FaSortAmountDown} 
                color="gray.600"
              />
            </Button>
          </Flex>
        </Flex>
      </Flex>
      
      {/* Credentials Grid */}
      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <Skeleton key={i} height="250px" borderRadius="lg" />
          ))}
        </SimpleGrid>
      ) : filteredAndSortedCredentials.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredAndSortedCredentials.map(credential => (
            <Card 
              key={credential.id} 
              borderWidth="1px" 
              borderRadius="lg" 
              overflow="hidden"
              variant="outline"
              transition="all 0.2s"
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            >
              <CardHeader pb={2}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Badge 
                    colorScheme={getCategoryColor(credential.category)}
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {credential.category}
                  </Badge>
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
                        onClick={() => viewCredentialDetails(credential)}
                      >
                        View Details
                      </MenuItem>
                      <MenuItem 
                        icon={<Icon as={FaShare} />}
                        as={RouterLink}
                        to={`/share/${credential.id}`}
                      >
                        Share Credential
                      </MenuItem>
                      <MenuItem 
                        icon={<Icon as={FaDownload} />}
                        onClick={() => downloadCredential(credential.id)}
                      >
                        Download PDF
                      </MenuItem>
                      <MenuItem icon={<Icon as={FaPrint} />}>
                        Print
                      </MenuItem>
                      <MenuItem icon={<Icon as={FaQrcode} />}>
                        Generate QR Code
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              </CardHeader>
              
              <CardBody pt={0}>
                <Flex direction="column" h="100%">
                  <Flex align="center" mb={3}>
                    <Icon as={FaUniversity} color="blue.500" mr={2} />
                    <Text fontWeight="medium" fontSize="sm" color="gray.600">
                      {credential.institution}
                    </Text>
                  </Flex>
                  
                  <Heading size="md" mb={2}>{credential.credentialType}</Heading>
                  
                  <Text fontSize="sm" color="gray.600" noOfLines={2} mb={4}>
                    {credential.description}
                  </Text>
                  
                  <Flex align="center" mt="auto">
                    <Icon as={FaCalendarAlt} color="blue.500" mr={2} />
                    <Text fontSize="sm">
                      Issued: {new Date(credential.issueDate).toLocaleDateString()}
                    </Text>
                  </Flex>
                </Flex>
              </CardBody>
              
              <Divider />
              
              <CardFooter pt={3}>
                <Flex w="100%" justifyContent="space-between">
                  <HStack>
                    <Tag size="sm" colorScheme="blue" variant="subtle">
                      <Icon as={FaShare} mr={1} />
                      {credential.shared} Shares
                    </Tag>
                    <Tag size="sm" colorScheme="green" variant="subtle">
                      <Icon as={FaCheckCircle} mr={1} />
                      {credential.verified} Verifications
                    </Tag>
                  </HStack>
                  
                  <Button
                    size="sm"
                    rightIcon={<Icon as={FaShare} />}
                    colorScheme="blue"
                    as={RouterLink}
                    to={`/share/${credential.id}`}
                  >
                    Share
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          p={10} 
          bg={cardBg} 
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Icon as={FaFileAlt} boxSize={16} color="gray.400" mb={4} />
          <Heading size="md" mb={2}>No Credentials Found</Heading>
          <Text color="gray.500" textAlign="center" mb={6}>
            {searchTerm || filterCategory 
              ? "No credentials match your search criteria. Try adjusting your filters."
              : "You don't have any credentials yet."}
          </Text>
          {searchTerm || filterCategory ? (
            <Button 
              leftIcon={<Icon as={FaFilter} />}
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('');
              }}
            >
              Clear Filters
            </Button>
          ) : (
            <Button 
              as={RouterLink} 
              to="/dashboard" 
              leftIcon={<Icon as={FaChevronLeft} />}
            >
              Return to Dashboard
            </Button>
          )}
        </Flex>
      )}
      
      {/* Credentials Stats */}
      {!isLoading && filteredAndSortedCredentials.length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={8}>
          <Card>
            <CardBody>
              <Flex direction="column" align="center">
                <Heading size="2xl" color="blue.500" mb={2}>
                  {credentials.length}
                </Heading>
                <Text textAlign="center">
                  Total Credentials
                </Text>
              </Flex>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Flex direction="column" align="center">
                <Heading size="2xl" color="green.500" mb={2}>
                  {credentials.reduce((total, cred) => total + cred.shared, 0)}
                </Heading>
                <Text textAlign="center">
                  Total Shares
                </Text>
              </Flex>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Flex direction="column" align="center">
                <Heading size="2xl" color="purple.500" mb={2}>
                  {credentials.reduce((total, cred) => total + cred.verified, 0)}
                </Heading>
                <Text textAlign="center">
                  Total Verifications
                </Text>
              </Flex>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}
      
      {/* Credential Details Modal */}
      <Modal 
        isOpen={detailsModal.isOpen} 
        onClose={detailsModal.onClose}
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              <Icon as={FaCertificate} mr={2} color="blue.500" />
              Credential Details
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            {selectedCredential && (
              <VStack spacing={6} align="stretch">
                {/* Institution and logo */}
                <Flex 
                  align="center" 
                  justify="center" 
                  direction="column"
                  bg={badgeBg}
                  py={6}
                  borderRadius="md"
                >
                  <Icon as={FaUniversity} boxSize={16} color="blue.500" mb={4} />
                  <Heading size="md" textAlign="center">{selectedCredential.institution}</Heading>
                </Flex>
                
                {/* Certificate details */}
                <Box>
                  <Heading size="lg" textAlign="center" mb={2}>
                    {selectedCredential.credentialType}
                  </Heading>
                  <Text textAlign="center" color="gray.600" mb={4}>
                    {selectedCredential.description}
                  </Text>
                </Box>
                
                <Divider />
                
                {/* Tabs for details */}
                <Tabs colorScheme="blue" variant="enclosed">
                  <TabList>
                    <Tab>Details</Tab>
                    <Tab>Blockchain</Tab>
                    <Tab>History</Tab>
                  </TabList>
                  
                  <TabPanels>
                    {/* Details Tab */}
                    <TabPanel px={0}>
                      <VStack align="stretch" spacing={4}>
                        <Flex justify="space-between">
                          <Text fontWeight="semibold">Issue Date:</Text>
                          <Text>{new Date(selectedCredential.issueDate).toLocaleDateString()}</Text>
                        </Flex>
                        
                        <Flex justify="space-between">
                          <Text fontWeight="semibold">Status:</Text>
                          <Badge colorScheme="green">{selectedCredential.status}</Badge>
                        </Flex>
                        
                        <Flex justify="space-between">
                          <Text fontWeight="semibold">Category:</Text>
                          <Badge colorScheme={getCategoryColor(selectedCredential.category)}>
                            {selectedCredential.category}
                          </Badge>
                        </Flex>
                        
                        <Divider />
                        
                        <Heading size="sm" mb={2}>Credential Metadata</Heading>
                        
                        {Object.entries(selectedCredential.metadata).map(([key, value]) => (
                          <Flex key={key} justify="space-between">
                            <Text fontWeight="semibold">{key}:</Text>
                            <Text>{value}</Text>
                          </Flex>
                        ))}
                      </VStack>
                    </TabPanel>
                    
                    {/* Blockchain Tab */}
                    <TabPanel px={0}>
                      <VStack align="stretch" spacing={4}>
                        <Heading size="sm" mb={2}>Blockchain Information</Heading>
                        
                        <Flex justify="space-between">
                          <Text fontWeight="semibold">Credential Hash:</Text>
                          <Text fontSize="sm" fontFamily="mono">
                            {selectedCredential.credentialHash.substring(0, 20)}...
                          </Text>
                        </Flex>
                        
                        <Flex justify="space-between">
                          <Text fontWeight="semibold">Blockchain:</Text>
                          <Text>Ethereum</Text>
                        </Flex>
                        
                        <Flex justify="space-between">
                          <Text fontWeight="semibold">Timestamp:</Text>
                          <Text>{new Date(selectedCredential.issueDate).toLocaleString()}</Text>
                        </Flex>
                        
                        <Alert status="info" borderRadius="md">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Immutable Record</AlertTitle>
                            <Text fontSize="sm">
                              This credential has been securely stored on the blockchain and cannot be altered.
                            </Text>
                          </Box>
                        </Alert>
                      </VStack>
                    </TabPanel>
                    
                    {/* History Tab */}
                    <TabPanel px={0}>
                      <VStack align="stretch" spacing={4}>
                        <Heading size="sm" mb={2}>Sharing & Verification History</Heading>
                        
                        <Flex justify="space-between">
                          <Text fontWeight="semibold">Times Shared:</Text>
                          <Text>{selectedCredential.shared}</Text>
                        </Flex>
                        
                        <Flex justify="space-between">
                          <Text fontWeight="semibold">Times Verified:</Text>
                          <Text>{selectedCredential.verified}</Text>
                        </Flex>
                        
                        <Divider />
                        
                        <Heading size="sm" mb={2}>Recent Activity</Heading>
                        
                        {selectedCredential.shared > 0 || selectedCredential.verified > 0 ? (
                          <VStack align="stretch" spacing={3}>
                            {selectedCredential.shared > 0 && (
                              <Box p={3} borderWidth="1px" borderRadius="md">
                                <Flex align="center">
                                  <Icon as={FaShare} color="blue.500" mr={2} />
                                  <Text>
                                    Shared with <Badge colorScheme="blue">TechCorp Inc.</Badge>
                                  </Text>
                                  <Text fontSize="sm" ml="auto" color="gray.500">
                                    2023-05-15
                                  </Text>
                                </Flex>
                              </Box>
                            )}
                            
                            {selectedCredential.verified > 0 && (
                              <Box p={3} borderWidth="1px" borderRadius="md">
                                <Flex align="center">
                                  <Icon as={FaCheckCircle} color="green.500" mr={2} />
                                  <Text>
                                    Verified by <Badge colorScheme="green">Global Verify</Badge>
                                  </Text>
                                  <Text fontSize="sm" ml="auto" color="gray.500">
                                    2023-06-20
                                  </Text>
                                </Flex>
                              </Box>
                            )}
                          </VStack>
                        ) : (
                          <Text color="gray.500">No recent activity for this credential.</Text>
                        )}
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </VStack>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={detailsModal.onClose}>
              Close
            </Button>
            {selectedCredential && (
              <Button 
                colorScheme="blue" 
                leftIcon={<Icon as={FaShare} />}
                as={RouterLink}
                to={`/share/${selectedCredential.id}`}
                onClick={detailsModal.onClose}
              >
                Share Credential
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ViewCredentials;