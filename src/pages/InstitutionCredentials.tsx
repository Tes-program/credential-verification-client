// src/pages/InstitutionCredentials.tsx
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
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Alert,
  AlertIcon,
  AlertTitle,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Link,
  Switch,
  FormControl,
  FormLabel,
  Checkbox,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaSearch,
  FaCertificate,
  FaChevronLeft,
  FaEllipsisV,
  FaCalendarAlt,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaDownload,
  FaEye,
  FaUniversity,
  FaUserGraduate,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaPlus,
  FaFileExport,
  FaCheck,
  FaInfoCircle,
  FaHistory,
  FaPrint,
  FaQrcode,
  FaShare,
  FaExternalLinkAlt,
  FaRegClock,
} from 'react-icons/fa';
import { useWeb3Auth } from '../contexts/Web3Context';

// Mock credential data
const mockCredentials = [
  {
    id: 'cred001',
    credentialType: 'Bachelor of Science in Information Technology',
    recipientName: 'John Doe',
    recipientId: 'ST001',
    issueDate: '2023-05-15',
    status: 'active',
    verifications: 5,
    lastVerified: '2025-03-10',
    blockchainHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    category: 'Degree',
    metadata: {
      'GPA': '3.8',
      'Major': 'Information Technology',
      'Minor': 'Business Administration',
      'Honors': 'Cum Laude'
    }
  },
  {
    id: 'cred002',
    credentialType: 'Master of Science in Data Science',
    recipientName: 'Jane Smith',
    recipientId: 'ST002',
    issueDate: '2023-06-20',
    status: 'active',
    verifications: 3,
    lastVerified: '2025-02-25',
    blockchainHash: '0x3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    category: 'Degree',
    metadata: {
      'GPA': '4.0',
      'Thesis': 'Machine Learning Applications in Healthcare',
      'Department': 'Computer Science'
    }
  },
  {
    id: 'cred003',
    credentialType: 'Certificate in Web Development',
    recipientName: 'Michael Johnson',
    recipientId: 'ST003',
    issueDate: '2023-08-10',
    status: 'active',
    verifications: 2,
    lastVerified: '2025-01-18',
    blockchainHash: '0x01e0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    category: 'Certificate',
    metadata: {
      'Completion Date': '2023-08-10',
      'Skills': 'HTML, CSS, JavaScript, React',
      'Grade': 'A'
    }
  },
  {
    id: 'cred004',
    credentialType: 'Bachelor of Science in Computer Science',
    recipientName: 'Emily Williams',
    recipientId: 'ST004',
    issueDate: '2023-05-15',
    status: 'revoked',
    verifications: 1,
    lastVerified: '2024-12-05',
    blockchainHash: '0x2c0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    revokedDate: '2024-12-10',
    revokedReason: 'Administrative error',
    category: 'Degree',
    metadata: {
      'GPA': '3.5',
      'Major': 'Computer Science',
      'Department': 'Computer Science'
    }
  },
  {
    id: 'cred005',
    credentialType: 'Certificate in Cybersecurity',
    recipientName: 'David Brown',
    recipientId: 'ST005',
    issueDate: '2024-01-25',
    status: 'active',
    verifications: 0,
    blockchainHash: '0x4d0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    category: 'Certificate',
    metadata: {
      'Completion Date': '2024-01-25',
      'Skills': 'Network Security, Ethical Hacking, Security Auditing',
      'Grade': 'A'
    }
  },
  {
    id: 'cred006',
    credentialType: 'Academic Excellence Award',
    recipientName: 'Sarah Miller',
    recipientId: 'ST006',
    issueDate: '2023-11-10',
    status: 'active',
    verifications: 1,
    lastVerified: '2025-02-05',
    blockchainHash: '0x5e0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    category: 'Award',
    metadata: {
      'Award Date': '2023-11-10',
      'Achievement': 'Top student in Software Engineering department',
      'Academic Year': '2023'
    }
  },
  {
    id: 'cred007',
    credentialType: 'Bachelor of Science in Software Engineering',
    recipientName: 'Robert Wilson',
    recipientId: 'ST007',
    issueDate: '2023-05-15',
    expiryDate: '2033-05-15',
    status: 'active',
    verifications: 2,
    lastVerified: '2025-01-30',
    blockchainHash: '0x6f0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    category: 'Degree',
    metadata: {
      'GPA': '3.7',
      'Major': 'Software Engineering',
      'Minor': 'Project Management',
      'Department': 'Engineering'
    }
  },
];

// Credential categories for filtering
const credentialCategories = ['All Categories', 'Degree', 'Certificate', 'Award'];

const InstitutionCredentials: React.FC = () => {
  const { userRole } = useWeb3Auth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentials] = useState<typeof mockCredentials>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('issueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCredential, setSelectedCredential] = useState<typeof mockCredentials[0] | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modal disclosures
  const detailsModal = useDisclosure();
  const verificationHistoryModal = useDisclosure();
  const exportModal = useDisclosure();
  
  // Colors
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const highlightColor = useColorModeValue('blue.50', 'blue.900');
  const tableBg = useColorModeValue('gray.50', 'gray.700')
  
  // Load credentials data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
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
        cred.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.recipientId.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCategory = 
        categoryFilter === 'All Categories' || cred.category === categoryFilter;
        
      const matchesStatus = 
        statusFilter === 'all' || cred.status === statusFilter;
        
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    // Then sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'issueDate') {
        return sortOrder === 'asc' 
          ? new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime() 
          : new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
      }
      
      if (sortBy === 'recipient') {
        return sortOrder === 'asc'
          ? a.recipientName.localeCompare(b.recipientName)
          : b.recipientName.localeCompare(a.recipientName);
      }
      
      if (sortBy === 'type') {
        return sortOrder === 'asc'
          ? a.credentialType.localeCompare(b.credentialType)
          : b.credentialType.localeCompare(a.credentialType);
      }
      
      if (sortBy === 'verifications') {
        return sortOrder === 'asc'
          ? a.verifications - b.verifications
          : b.verifications - a.verifications;
      }
      
      return 0;
    });
    
    return result;
  }, [credentials, searchTerm, categoryFilter, statusFilter, sortBy, sortOrder]);
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  // View credential details
  const viewCredentialDetails = (credential: typeof mockCredentials[0]) => {
    setSelectedCredential(credential);
    detailsModal.onOpen();
  };
  
  // View verification history
  const viewVerificationHistory = (credential: typeof mockCredentials[0]) => {
    setSelectedCredential(credential);
    verificationHistoryModal.onOpen();
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
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'revoked':
        return 'red';
      case 'expired':
        return 'orange';
      default:
        return 'gray';
    }
  };
  
  // Get category badge color
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
  
  // Check if institution user
  if (userRole !== 'institution') {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <Heading size="md">Access Denied</Heading>
            <Text>Only institution accounts can access credential management.</Text>
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
        align={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        mb={6}
        gap={4}
      >
        <Box>
          <Heading size="lg">Institution Credentials</Heading>
          <Text color="gray.500" mt={1}>
            Manage all credentials issued by your institution
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
        direction={{ base: 'column', md: 'row' }}
        gap={4}
      >
        <HStack>
          <Button 
            leftIcon={<Icon as={FaPlus} />} 
            colorScheme="blue"
            as={RouterLink}
            to="/issue"
          >
            Issue New Credential
          </Button>
          
          <Button 
            leftIcon={<Icon as={FaFileExport} />} 
            onClick={exportModal.onOpen}
            isDisabled={credentials.length === 0}
          >
            Export Data
          </Button>
        </HStack>
        
        <HStack>
          <Flex borderWidth="1px" borderRadius="md" overflow="hidden">
            <Button 
              leftIcon={<Icon as={viewMode === 'grid' ? FaCheck : undefined} />}
              borderRadius="0"
              borderRightWidth="1px"
              variant={viewMode === 'grid' ? 'solid' : 'outline'}
              colorScheme={viewMode === 'grid' ? 'blue' : 'gray'}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button 
              leftIcon={<Icon as={viewMode === 'list' ? FaCheck : undefined} />}
              borderRadius="0"
              variant={viewMode === 'list' ? 'solid' : 'outline'}
              colorScheme={viewMode === 'list' ? 'blue' : 'gray'}
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </Flex>
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
        <InputGroup flex="3">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.400" />
          </InputLeftElement>
          <Input 
            placeholder="Search by credential type, recipient name, or ID" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        
        <Flex gap={4} flex="2" direction={{ base: 'column', sm: 'row' }}>
          <Select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            icon={<FaFilter />}
          >
            {credentialCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
          
          <Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
            <option value="expired">Expired</option>
          </Select>
          
          <Flex>
            <Select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              borderRightRadius={0}
            >
              <option value="issueDate">Issue Date</option>
              <option value="recipient">Recipient</option>
              <option value="type">Credential Type</option>
              <option value="verifications">Verifications</option>
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
      
      {/* Stats Section */}
      {!isLoading && (
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={6}>
          <Stat
            p={4}
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="sm"
          >
            <Flex align="center">
              <Box
                p={2}
                borderRadius="md"
                bg="blue.500"
                color="white"
                mr={3}
              >
                <Icon as={FaCertificate} boxSize={5} />
              </Box>
              <Box>
                <StatLabel>Total Credentials</StatLabel>
                <StatNumber>{credentials.length}</StatNumber>
                <StatHelpText>All time</StatHelpText>
              </Box>
            </Flex>
          </Stat>
          
          <Stat
            p={4}
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="sm"
          >
            <Flex align="center">
              <Box
                p={2}
                borderRadius="md"
                bg="green.500"
                color="white"
                mr={3}
              >
                <Icon as={FaCheckCircle} boxSize={5} />
              </Box>
              <Box>
                <StatLabel>Active Credentials</StatLabel>
                <StatNumber>{credentials.filter(c => c.status === 'active').length}</StatNumber>
                <StatHelpText>Currently valid</StatHelpText>
              </Box>
            </Flex>
          </Stat>
          
          <Stat
            p={4}
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="sm"
          >
            <Flex align="center">
              <Box
                p={2}
                borderRadius="md"
                bg="purple.500"
                color="white"
                mr={3}
              >
                <Icon as={FaUserGraduate} boxSize={5} />
              </Box>
              <Box>
                <StatLabel>Recipients</StatLabel>
                <StatNumber>
                  {new Set(credentials.map(c => c.recipientId)).size}
                </StatNumber>
                <StatHelpText>Unique students</StatHelpText>
              </Box>
            </Flex>
          </Stat>
          
          <Stat
            p={4}
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="sm"
          >
            <Flex align="center">
              <Box
                p={2}
                borderRadius="md"
                bg="orange.500"
                color="white"
                mr={3}
              >
                <Icon as={FaEye} boxSize={5} />
              </Box>
              <Box>
                <StatLabel>Verifications</StatLabel>
                <StatNumber>
                  {credentials.reduce((sum, cred) => sum + cred.verifications, 0)}
                </StatNumber>
                <StatHelpText>Total verifications</StatHelpText>
              </Box>
            </Flex>
          </Stat>
        </SimpleGrid>
      )}
      
      {/* Credentials Display (Grid View) */}
      {viewMode === 'grid' && (
        isLoading ? (
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
                          icon={<Icon as={FaHistory} />}
                          onClick={() => viewVerificationHistory(credential)}
                          isDisabled={credential.verifications === 0}
                        >
                          Verification History
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
                        <MenuItem icon={<Icon as={FaShare} />}>
                          Share Link
                        </MenuItem>
                        {credential.status === 'active' ? (
                          <MenuItem icon={<Icon as={FaExclamationCircle} />} color="red.500">
                            Revoke Credential
                          </MenuItem>
                        ) : (
                          <MenuItem icon={<Icon as={FaCheckCircle} />} color="green.500">
                            Reactivate Credential
                          </MenuItem>
                        )}
                      </MenuList>
                    </Menu>
                  </Flex>
                </CardHeader>
                
                <CardBody pt={0}>
                  <Flex direction="column" h="100%">
                    <Heading size="md" mb={2}>{credential.credentialType}</Heading>
                    
                    <Flex align="center" mb={3}>
                      <Icon as={FaUserGraduate} color="blue.500" mr={2} />
                      <Text fontWeight="medium" fontSize="sm">
                        {credential.recipientName}
                      </Text>
                    </Flex>
                    
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      ID: {credential.recipientId}
                    </Text>
                    
                    <Flex align="center" mt="auto">
                      <Icon as={FaCalendarAlt} color="blue.500" mr={2} />
                      <Text fontSize="sm">
                        Issued: {new Date(credential.issueDate).toLocaleDateString()}
                      </Text>
                    </Flex>
                    
                    {credential.expiryDate && (
                      <Flex align="center" mt={1}>
                        <Icon as={FaRegClock} color="orange.500" mr={2} />
                        <Text fontSize="sm">
                          Expires: {new Date(credential.expiryDate).toLocaleDateString()}
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </CardBody>
                
                <Divider />
                
                <CardFooter pt={3}>
                  <Flex w="100%" justifyContent="space-between" align="center">
                    <Badge 
                      colorScheme={getStatusColor(credential.status)}
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      {credential.status.charAt(0).toUpperCase() + credential.status.slice(1)}
                    </Badge>
                    
                    <HStack>
                      <Icon as={FaEye} color="gray.500" />
                      <Text fontSize="sm" color="gray.600">
                        {credential.verifications} verifications
                      </Text>
                    </HStack>
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
            <Icon as={FaInfoCircle} boxSize={16} color="gray.400" mb={4} />
            <Heading size="md" mb={2}>No Credentials Found</Heading>
            <Text color="gray.500" textAlign="center" mb={6}>
              {searchTerm || categoryFilter !== 'All Categories' || statusFilter !== 'all' 
                ? "No credentials match your search criteria. Try adjusting your filters."
                : "You haven't issued any credentials yet."}
            </Text>
            {searchTerm || categoryFilter !== 'All Categories' || statusFilter !== 'all' ? (
              <Button 
                leftIcon={<Icon as={FaFilter} />}
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('All Categories');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button 
                as={RouterLink} 
                to="/issue" 
                leftIcon={<Icon as={FaPlus} />}
                colorScheme="blue"
              >
                Issue First Credential
              </Button>
            )}
          </Flex>
        )
      )}
      
      {/* Credentials Display (List View) */}
      {viewMode === 'list' && (
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
                  <Th>Credential Type</Th>
                  <Th>Recipient</Th>
                  <Th>Issue Date</Th>
                  <Th>Status</Th>
                  <Th>Verifications</Th>
                  <Th width="60px">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <Tr key={i}>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" width="60px" /></Td>
                      <Td><Skeleton height="20px" width="40px" /></Td>
                      <Td><Skeleton height="20px" width="40px" /></Td>
                    </Tr>
                  ))
                ) : filteredAndSortedCredentials.length > 0 ? (
                  filteredAndSortedCredentials.map(credential => (
                    <Tr 
                      key={credential.id} 
                      _hover={{ bg: tableBg }}
                      cursor="pointer"
                    >
                      <Td onClick={() => viewCredentialDetails(credential)}>
                        <Flex align="center">
                          <Badge 
                            colorScheme={getCategoryColor(credential.category)}
                            mr={2}
                          >
                            {credential.category}
                          </Badge>
                          <Text fontWeight="medium">{credential.credentialType}</Text>
                        </Flex>
                      </Td>
                      <Td onClick={() => viewCredentialDetails(credential)}>
                        <Flex direction="column">
                          <Text>{credential.recipientName}</Text>
                          <Text fontSize="sm" color="gray.500">ID: {credential.recipientId}</Text>
                        </Flex>
                      </Td>
                      <Td onClick={() => viewCredentialDetails(credential)}>
                        {new Date(credential.issueDate).toLocaleDateString()}
                        {credential.expiryDate && (
                          <Text fontSize="xs" color="gray.500">
                            Expires: {new Date(credential.expiryDate).toLocaleDateString()}
                          </Text>
                        )}
                      </Td>
                      <Td onClick={() => viewCredentialDetails(credential)}>
                        <Badge colorScheme={getStatusColor(credential.status)}>
                          {credential.status.charAt(0).toUpperCase() + credential.status.slice(1)}
                        </Badge>
                      </Td>
                      <Td onClick={() => viewCredentialDetails(credential)}>
                        <Text>{credential.verifications}</Text>
                        {credential.lastVerified && (
                          <Text fontSize="xs" color="gray.500">
                            Last: {new Date(credential.lastVerified).toLocaleDateString()}
                          </Text>
                        )}
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
                              onClick={() => viewCredentialDetails(credential)}
                            >
                              View Details
                            </MenuItem>
                            <MenuItem 
                              icon={<Icon as={FaHistory} />}
                              onClick={() => viewVerificationHistory(credential)}
                              isDisabled={credential.verifications === 0}
                            >
                              Verification History
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
                            <MenuItem icon={<Icon as={FaShare} />}>
                              Share Link
                            </MenuItem>
                            {credential.status === 'active' ? (
                              <MenuItem icon={<Icon as={FaExclamationCircle} />} color="red.500">
                                Revoke Credential
                              </MenuItem>
                            ) : (
                              <MenuItem icon={<Icon as={FaCheckCircle} />} color="green.500">
                                Reactivate Credential
                              </MenuItem>
                            )}
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={6} textAlign="center" py={6}>
                      <Icon as={FaInfoCircle} color="blue.500" boxSize={5} mb={3} />
                      <Text fontWeight="medium">No credentials found</Text>
                      <Text fontSize="sm" color="gray.500">
                        {searchTerm || categoryFilter !== 'All Categories' || statusFilter !== 'all'
                          ? "Try adjusting your search filters"
                          : "Start by issuing credentials to your students"}
                      </Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
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
                <Flex 
                  direction={{ base: 'column', md: 'row' }}
                  align="center"
                  gap={6}
                  pb={4}
                  borderBottomWidth="1px"
                  borderColor={borderColor}
                >
                  <Box 
                    p={4} 
                    borderRadius="full" 
                    bg={highlightColor} 
                    color="blue.500"
                  >
                    <Icon as={FaCertificate} boxSize={12} />
                  </Box>
                  
                  <Box flex="1">
                    <Heading size="md">
                      {selectedCredential.credentialType}
                    </Heading>
                    <Badge 
                      colorScheme={getCategoryColor(selectedCredential.category)}
                      mt={1}
                    >
                      {selectedCredential.category}
                    </Badge>
                    <HStack mt={3}>
                      <Badge 
                        colorScheme={getStatusColor(selectedCredential.status)}
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {selectedCredential.status.charAt(0).toUpperCase() + selectedCredential.status.slice(1)}
                      </Badge>
                      
                      {selectedCredential.status === 'revoked' && (
                        <Badge colorScheme="red" variant="outline">
                          Revoked: {selectedCredential.revokedDate ? new Date(selectedCredential.revokedDate).toLocaleDateString() : 'N/A'}
                        </Badge>
                      )}
                    </HStack>
                  </Box>
                </Flex>
                
                <Tabs colorScheme="blue" variant="enclosed">
                  <TabList>
                    <Tab>Details</Tab>
                    <Tab>Blockchain</Tab>
                    <Tab>Verification</Tab>
                  </TabList>
                  
                  <TabPanels>
                    {/* Details Tab */}
                    <TabPanel px={0}>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <VStack align="start" spacing={3}>
                          <Heading size="sm">Credential Information</Heading>
                          
                          <Box width="100%">
                            <Text fontWeight="medium" fontSize="sm" color="gray.500">Issue Date</Text>
                            <Text>{new Date(selectedCredential.issueDate).toLocaleDateString()}</Text>
                          </Box>
                          
                          {selectedCredential.expiryDate && (
                            <Box width="100%">
                              <Text fontWeight="medium" fontSize="sm" color="gray.500">Expiry Date</Text>
                              <Text>{new Date(selectedCredential.expiryDate).toLocaleDateString()}</Text>
                            </Box>
                          )}
                          
                          {selectedCredential.status === 'revoked' && (
                            <>
                              <Box width="100%">
                                <Text fontWeight="medium" fontSize="sm" color="gray.500">Revoke Date</Text>
                                <Text>{selectedCredential.revokedDate ? new Date(selectedCredential.revokedDate).toLocaleDateString() : 'N/A'}</Text>
                              </Box>
                              <Box width="100%">
                                <Text fontWeight="medium" fontSize="sm" color="gray.500">Revoke Reason</Text>
                                <Text>{selectedCredential.revokedReason}</Text>
                              </Box>
                            </>
                          )}
                          
                          <Box width="100%">
                            <Text fontWeight="medium" fontSize="sm" color="gray.500">Credential ID</Text>
                            <Text fontSize="sm" fontFamily="mono">{selectedCredential.id}</Text>
                          </Box>
                        </VStack>
                        
                        <VStack align="start" spacing={3}>
                          <Heading size="sm">Recipient Information</Heading>
                          
                          <Box width="100%">
                            <Text fontWeight="medium" fontSize="sm" color="gray.500">Name</Text>
                            <Text>{selectedCredential.recipientName}</Text>
                          </Box>
                          
                          <Box width="100%">
                            <Text fontWeight="medium" fontSize="sm" color="gray.500">Student ID</Text>
                            <Text>{selectedCredential.recipientId}</Text>
                          </Box>
                          
                          <Box width="100%">
                            <Text fontWeight="medium" fontSize="sm" color="gray.500">Verifications</Text>
                            <Text>{selectedCredential.verifications}</Text>
                          </Box>
                          
                          {selectedCredential.lastVerified && (
                            <Box width="100%">
                              <Text fontWeight="medium" fontSize="sm" color="gray.500">Last Verified</Text>
                              <Text>{new Date(selectedCredential.lastVerified).toLocaleDateString()}</Text>
                            </Box>
                          )}
                        </VStack>
                      </SimpleGrid>
                      
                      <Divider my={6} />
                      
                      <Heading size="sm" mb={4}>Credential Metadata</Heading>
                      
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {Object.entries(selectedCredential.metadata).map(([key, value]) => (
                          <Box 
                            key={key} 
                            p={3} 
                            borderWidth="1px" 
                            borderRadius="md"
                          >
                            <Text fontWeight="medium" fontSize="sm" color="gray.500">{key}</Text>
                            <Text>{value}</Text>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </TabPanel>
                    
                    {/* Blockchain Tab */}
                    <TabPanel px={0}>
                      <VStack align="stretch" spacing={4}>
                        <Heading size="sm" mb={2}>Blockchain Information</Heading>
                        
                        <Flex justify="space-between">
                          <Text fontWeight="medium">Transaction Hash:</Text>
                          <Text fontSize="sm" fontFamily="mono">
                            {selectedCredential.blockchainHash}
                          </Text>
                        </Flex>
                        
                        <Flex justify="space-between">
                          <Text fontWeight="medium">Blockchain:</Text>
                          <Text>Ethereum</Text>
                        </Flex>
                        
                        <Flex justify="space-between">
                          <Text fontWeight="medium">Timestamp:</Text>
                          <Text>{new Date(selectedCredential.issueDate).toLocaleString()}</Text>
                        </Flex>
                        
                        <Box 
                          p={4} 
                          borderWidth="1px" 
                          borderRadius="md" 
                          bg={tableBg}
                        >
                          <Heading size="sm" mb={3}>Verification Link</Heading>
                          <Input 
                            value={`https://verify.example.com/${selectedCredential.blockchainHash}`} 
                            isReadOnly 
                            mb={2}
                          />
                          <Link color="blue.500" fontSize="sm" isExternal>
                            <Flex align="center">
                              <Text>View on Blockchain Explorer</Text>
                              <Icon as={FaExternalLinkAlt} ml={1} boxSize={3} />
                            </Flex>
                          </Link>
                        </Box>
                        
                        <Alert status="info" borderRadius="md">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Immutable Record</AlertTitle>
                            <Text fontSize="sm">
                              This credential has been securely stored on the blockchain and cannot be altered.
                              {selectedCredential.status === 'revoked' 
                                ? ' The revocation status is also recorded on the blockchain.'
                                : ' If needed, you can revoke this credential, which will update its status on the blockchain.'}
                            </Text>
                          </Box>
                        </Alert>
                      </VStack>
                    </TabPanel>
                    
                    {/* Verification Tab */}
                    <TabPanel px={0}>
                      <VStack align="stretch" spacing={4}>
                        <Heading size="sm" mb={2}>Verification Settings</Heading>
                        
                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="public-verification" mb="0">
                            Allow Public Verification
                          </FormLabel>
                          <Switch id="public-verification" isChecked={true} colorScheme="blue" />
                        </FormControl>
                        
                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="record-verifications" mb="0">
                            Record Verification History
                          </FormLabel>
                          <Switch id="record-verifications" isChecked={true} colorScheme="blue" />
                        </FormControl>
                        
                        <Divider my={2} />
                        
                        <Heading size="sm" mb={2}>Verification Statistics</Heading>
                        
                        <SimpleGrid columns={3} spacing={4}>
                          <Box p={4} borderWidth="1px" borderRadius="md" textAlign="center">
                            <Heading size="xl" color="blue.500">{selectedCredential.verifications}</Heading>
                            <Text fontSize="sm">Total Verifications</Text>
                          </Box>
                          
                          <Box p={4} borderWidth="1px" borderRadius="md" textAlign="center">
                            <Heading size="xl" color="green.500">
                              {selectedCredential.verifications > 0 ? '100%' : '0%'}
                            </Heading>
                            <Text fontSize="sm">Success Rate</Text>
                          </Box>
                          
                          <Box p={4} borderWidth="1px" borderRadius="md" textAlign="center">
                            <Heading size="xl" color="purple.500">
                              {selectedCredential.lastVerified ? 
                                new Date(selectedCredential.lastVerified).toLocaleDateString().split('/')[0] : '-'}
                            </Heading>
                            <Text fontSize="sm">Last Verified</Text>
                          </Box>
                        </SimpleGrid>
                        
                        <Button 
                          leftIcon={<Icon as={FaHistory} />} 
                          mt={2}
                          onClick={() => {
                            detailsModal.onClose();
                            viewVerificationHistory(selectedCredential);
                          }}
                          isDisabled={selectedCredential.verifications === 0}
                        >
                          View Full Verification History
                        </Button>
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
            {selectedCredential && selectedCredential.status === 'active' ? (
              <Button colorScheme="red" leftIcon={<Icon as={FaExclamationCircle} />}>
                Revoke Credential
              </Button>
            ) : selectedCredential && selectedCredential.status === 'revoked' && (
              <Button colorScheme="green" leftIcon={<Icon as={FaCheckCircle} />}>
                Reactivate Credential
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Verification History Modal */}
      <Modal isOpen={verificationHistoryModal.isOpen} onClose={verificationHistoryModal.onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verification History</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            {selectedCredential && (
              <VStack spacing={4} align="stretch">
                <Box p={4} bg={highlightColor} borderRadius="md">
                  <Heading size="sm">{selectedCredential.credentialType}</Heading>
                  <Text>Recipient: {selectedCredential.recipientName}</Text>
                  <Text fontSize="sm" color="gray.500">
                    Total Verifications: {selectedCredential.verifications}
                  </Text>
                </Box>
                
                {selectedCredential.verifications > 0 ? (
                  <VStack align="stretch" spacing={4}>
                    {/* Mock verification history items */}
                    {[...Array(selectedCredential.verifications)].map((_, i) => (
                      <Box key={i} p={4} borderWidth="1px" borderRadius="md">
                        <Flex justify="space-between" align="center">
                          <Flex align="center">
                            <Icon as={FaCheckCircle} color="green.500" mr={3} />
                            <Box>
                              <Text fontWeight="medium">Successful Verification</Text>
                              <Text fontSize="sm" color="gray.500">
                                {new Date(Date.now() - (i * 15 + 5) * 24 * 60 * 60 * 1000).toLocaleString()}
                              </Text>
                            </Box>
                          </Flex>
                          <Badge>
                            {i === 0 ? 'Employer' : i === 1 ? 'University' : 'Unknown'}
                          </Badge>
                        </Flex>
                        <Text fontSize="sm" mt={2} color="gray.500">
                          IP: {i === 0 ? '192.168.1.105' : i === 1 ? '103.24.53.172' : '45.83.101.32'}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Alert status="info">
                    <AlertIcon />
                    No verification history available for this credential.
                  </Alert>
                )}
              </VStack>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button onClick={verificationHistoryModal.onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Export Data Modal */}
      <Modal isOpen={exportModal.isOpen} onClose={exportModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Export Credentials Data</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <Text>
                Select the format and data you want to export:
              </Text>
              
              <FormControl>
                <FormLabel>Export Format</FormLabel>
                <Select defaultValue="csv">
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                  <option value="json">JSON</option>
                  <option value="pdf">PDF Report</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Date Range</FormLabel>
                <Flex gap={4}>
                  <Input type="date" placeholder="Start Date" />
                  <Input type="date" placeholder="End Date" />
                </Flex>
              </FormControl>
              
              <FormControl>
                <FormLabel mb={2}>Include Fields</FormLabel>
                <SimpleGrid columns={2} spacing={3}>
                  <Checkbox defaultChecked>Credential Type</Checkbox>
                  <Checkbox defaultChecked>Recipient Name</Checkbox>
                  <Checkbox defaultChecked>Issue Date</Checkbox>
                  <Checkbox defaultChecked>Status</Checkbox>
                  <Checkbox defaultChecked>Verification Count</Checkbox>
                  <Checkbox defaultChecked>Blockchain Hash</Checkbox>
                  <Checkbox>Metadata</Checkbox>
                  <Checkbox>Verification History</Checkbox>
                </SimpleGrid>
              </FormControl>
              
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                This will export data for {filteredAndSortedCredentials.length} credentials based on your current filters.
              </Alert>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={exportModal.onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              leftIcon={<Icon as={FaFileExport} />}
              onClick={() => {
                toast({
                  title: "Export started",
                  description: "Your data export is being processed and will download shortly.",
                  status: "success",
                  duration: 3000,
                });
                exportModal.onClose();
              }}
            >
              Export Data
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default InstitutionCredentials;