// src/pages/ShareCredential.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Button,
  Flex,
  VStack,
  HStack,
//   Avatar,
//   Badge,
  Divider,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Switch,
  useToast,
  Alert,
  AlertIcon,
  Icon,
  InputGroup,
  InputRightElement,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
  Tag,
  TagLabel,
  TagCloseButton,
  useClipboard,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  FaShare, 
  FaEnvelope, 
  FaLink, 
//   FaCalendarAlt, 
  FaClock, 
  FaLock, 
  FaUnlock, 
  FaCheck,
  FaCopy,
  FaDownload,
  FaQrcode,
  FaUniversity,
  FaGraduationCap,
  FaUserTie,
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
  },
  {
    id: 'cred346',
    institution: 'Babcock University',
    credentialType: 'Certificate in Web Development',
    issueDate: '2021-08-22',
    description: 'Professional certification in modern web development technologies',
    credentialHash: '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    shared: 1,
  },
];

const ShareCredential: React.FC = () => {
  const { credentialId } = useParams<{ credentialId: string }>();
  const { user, userRole, walletAddress } = useWeb3Auth();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [credential, setCredential] = useState<any>(null);
  const [shareMethod, setShareMethod] = useState<'link' | 'email'>('link');
  const [expiryEnabled, setExpiryEnabled] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [recipientEmails, setRecipientEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');
  const [viewerAccessLevel, setViewerAccessLevel] = useState('full');
  const [shareLink, setShareLink] = useState('');
  const { hasCopied, onCopy } = useClipboard(shareLink);
  const qrModalDisclosure = useDisclosure();
  const successModalDisclosure = useDisclosure();

  // Colors
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const highlightColor = useColorModeValue('blue.50', 'blue.900');
  const bg = useColorModeValue('white', 'gray.800')

  // Load credential data
  useEffect(() => {
    // In a real app, we'd fetch the credential from an API
    setIsLoading(true);
    setTimeout(() => {
      const foundCredential = mockCredentials.find(c => c.id === credentialId);
      if (foundCredential) {
        setCredential(foundCredential);
      }
      setIsLoading(false);
    }, 1000);
  }, [credentialId]);

  // Handle adding recipient email
  const handleAddEmail = () => {
    if (!newEmail) return;
    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    if (!recipientEmails.includes(newEmail)) {
      setRecipientEmails([...recipientEmails, newEmail]);
      setNewEmail('');
    }
  };

  // Handle removing recipient email
  const handleRemoveEmail = (email: string) => {
    setRecipientEmails(recipientEmails.filter(e => e !== email));
  };

  // Generate shareable link
  const generateLink = () => {
    // In a real app, this would call an API to generate a secure link
    const baseUrl = window.location.origin;
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const newLink = `${baseUrl}/verify/${credential?.credentialHash}?access=${uniqueId}`;
    setShareLink(newLink);
    
    toast({
      title: 'Share link generated',
      description: 'The link has been generated successfully.',
      status: 'success',
      duration: 3000,
    });
  };

  // Handle share submission
  const handleShare = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      successModalDisclosure.onOpen();
    }, 1500);
  };

  // Determine if share button should be enabled
  const isShareEnabled = () => {
    if (shareMethod === 'email') {
      return recipientEmails.length > 0;
    }
    return shareLink !== '';
  };

  // If credential not found
  if (!isLoading && !credential) {
    return (
      <Container maxW="container.md" py={10}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          Credential not found. Please check the URL and try again.
        </Alert>
        <Button 
          as={RouterLink} 
          to="/dashboard" 
          mt={4} 
          colorScheme="blue"
        >
          Return to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Flex direction="column" mb={8}>
        <Heading size="lg">Share Academic Credential</Heading>
        <Text color="gray.500" mt={1}>
          Share your verified academic credential with employers, institutions, or individuals
        </Text>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {/* Credential Preview */}
        <Box 
          bg={cardBg} 
          p={6} 
          borderRadius="lg" 
          borderWidth="1px" 
          borderColor={borderColor}
          boxShadow="sm"
        >
          <Heading size="md" mb={4}>
            <Flex align="center">
              <Icon as={FaGraduationCap} mr={2} color="blue.500" />
              Credential Preview
            </Flex>
          </Heading>
          
          {isLoading ? (
            <VStack spacing={4} align="stretch">
              <Box height="24px" width="80%" bg="gray.200" borderRadius="md" />
              <Box height="18px" width="60%" bg="gray.200" borderRadius="md" />
              <Box height="100px" width="100%" bg="gray.200" borderRadius="md" />
            </VStack>
          ) : (
            <VStack align="stretch" spacing={4}>
              <Flex justify="center" mb={2}>
                <Icon as={FaUniversity} boxSize={12} color="blue.500" />
              </Flex>
              
              <Heading size="md" textAlign="center">{credential?.credentialType}</Heading>
              <Text textAlign="center" color="gray.600">{credential?.institution}</Text>
              
              <Divider />
              
              <Flex justify="space-between">
                <Text fontWeight="bold">Issue Date:</Text>
                <Text>{new Date(credential?.issueDate).toLocaleDateString()}</Text>
              </Flex>
              
              <Text fontSize="sm">{credential?.description}</Text>
              
              <Divider />
              
              <Flex justify="space-between">
                <Text fontWeight="bold">Credential ID:</Text>
                <Text fontSize="sm" fontFamily="mono">
                  {credential?.id}
                </Text>
              </Flex>
              
              <Flex justify="center" mt={4}>
                <Button leftIcon={<FaDownload />} size="sm" variant="outline">
                  Download PDF
                </Button>
              </Flex>
            </VStack>
          )}
        </Box>

        {/* Share Options */}
        <Box 
          bg={cardBg} 
          p={6} 
          borderRadius="lg" 
          borderWidth="1px" 
          borderColor={borderColor}
          boxShadow="sm"
          gridColumn={{ base: '1', md: '2 / span 2' }}
        >
          <Heading size="md" mb={6}>
            <Flex align="center">
              <Icon as={FaShare} mr={2} color="blue.500" />
              Share Options
            </Flex>
          </Heading>
          
          <Tabs colorScheme="blue" variant="enclosed" onChange={(index) => setShareMethod(index === 0 ? 'link' : 'email')}>
            <TabList mb={4}>
              <Tab><Icon as={FaLink} mr={2} /> Shareable Link</Tab>
              <Tab><Icon as={FaEnvelope} mr={2} /> Email</Tab>
            </TabList>
            <TabPanels>
              {/* Link Sharing Tab */}
              <TabPanel p={0}>
                <VStack align="stretch" spacing={6}>
                  <Flex 
                    p={4} 
                    bg={highlightColor}
                    borderRadius="md" 
                    direction={{ base: 'column', md: 'row' }}
                    align="center"
                    justify="space-between"
                    gap={4}
                  >
                    <Box flex="1" overflow="hidden">
                      <Text fontWeight="medium" mb={1}>Shareable Verification Link</Text>
                      <InputGroup size="md">
                        <Input 
                          value={shareLink} 
                          isReadOnly 
                          placeholder="Click 'Generate Link' to create a shareable link"
                          bg={bg}
                        />
                        <InputRightElement width="4.5rem">
                          <Button 
                            h="1.75rem" 
                            size="sm" 
                            onClick={onCopy}
                            isDisabled={!shareLink}
                          >
                            {hasCopied ? <Icon as={FaCheck} /> : <Icon as={FaCopy} />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </Box>
                    
                    <HStack>
                      <Button 
                        leftIcon={<Icon as={FaQrcode} />} 
                        onClick={qrModalDisclosure.onOpen}
                        isDisabled={!shareLink}
                      >
                        QR
                      </Button>
                      <Button 
                        colorScheme="blue"
                        onClick={generateLink}
                      >
                        Generate Link
                      </Button>
                    </HStack>
                  </Flex>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl display="flex" flexDirection="column">
                      <Flex alignItems="center" mb={2}>
                        <FormLabel htmlFor="expires" mb="0" mr={2}>
                          <Flex align="center">
                            <Icon as={FaClock} mr={1} />
                            Link Expiration
                          </Flex>
                        </FormLabel>
                        <Switch 
                          id="expires" 
                          isChecked={expiryEnabled} 
                          onChange={(e) => setExpiryEnabled(e.target.checked)}
                          colorScheme="blue"
                        />
                      </Flex>
                      {expiryEnabled && (
                        <Input 
                          type="date" 
                          value={expiryDate} 
                          onChange={(e) => setExpiryDate(e.target.value)}
                          mt={2}
                        />
                      )}
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>
                        <Flex align="center">
                          <Icon as={viewerAccessLevel === 'full' ? FaUnlock : FaLock} mr={1} />
                          Viewer Access Level
                        </Flex>
                      </FormLabel>
                      <Select 
                        value={viewerAccessLevel} 
                        onChange={(e) => setViewerAccessLevel(e.target.value)}
                      >
                        <option value="full">Full credential details</option>
                        <option value="limited">Limited details (no personal info)</option>
                        <option value="verification">Verification only (yes/no)</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </TabPanel>
              
              {/* Email Sharing Tab */}
              <TabPanel p={0}>
                <VStack align="stretch" spacing={6}>
                  <FormControl>
                    <FormLabel>
                      <Flex align="center">
                        <Icon as={FaEnvelope} mr={1} />
                        Recipient Email Addresses
                      </Flex>
                    </FormLabel>
                    <Flex>
                      <Input 
                        placeholder="Enter email address" 
                        value={newEmail} 
                        onChange={(e) => setNewEmail(e.target.value)}
                        mr={2}
                      />
                      <Button onClick={handleAddEmail}>Add</Button>
                    </Flex>
                  </FormControl>
                  
                  {recipientEmails.length > 0 && (
                    <Box>
                      <Text fontSize="sm" mb={2}>Recipients:</Text>
                      <Flex wrap="wrap" gap={2}>
                        {recipientEmails.map((email) => (
                          <Tag
                            key={email}
                            size="md"
                            borderRadius="full"
                            variant="solid"
                            colorScheme="blue"
                          >
                            <TagLabel>{email}</TagLabel>
                            <TagCloseButton onClick={() => handleRemoveEmail(email)} />
                          </Tag>
                        ))}
                      </Flex>
                    </Box>
                  )}
                  
                  <FormControl>
                    <FormLabel>
                      <Flex align="center">
                        <Icon as={FaUserTie} mr={1} />
                        Personal Message (Optional)
                      </Flex>
                    </FormLabel>
                    <Textarea 
                      placeholder="Add a personal message to the recipient" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                    />
                  </FormControl>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl display="flex" flexDirection="column">
                      <Flex alignItems="center" mb={2}>
                        <FormLabel htmlFor="emailExpires" mb="0" mr={2}>
                          <Flex align="center">
                            <Icon as={FaClock} mr={1} />
                            Access Expiration
                          </Flex>
                        </FormLabel>
                        <Switch 
                          id="emailExpires" 
                          isChecked={expiryEnabled} 
                          onChange={(e) => setExpiryEnabled(e.target.checked)}
                          colorScheme="blue"
                        />
                      </Flex>
                      {expiryEnabled && (
                        <Input 
                          type="date" 
                          value={expiryDate} 
                          onChange={(e) => setExpiryDate(e.target.value)}
                          mt={2}
                        />
                      )}
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>
                        <Flex align="center">
                          <Icon as={viewerAccessLevel === 'full' ? FaUnlock : FaLock} mr={1} />
                          Recipient Access Level
                        </Flex>
                      </FormLabel>
                      <Select 
                        value={viewerAccessLevel} 
                        onChange={(e) => setViewerAccessLevel(e.target.value)}
                      >
                        <option value="full">Full credential details</option>
                        <option value="limited">Limited details (no personal info)</option>
                        <option value="verification">Verification only (yes/no)</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
          
          <Alert status="info" mt={6} borderRadius="md">
            <AlertIcon />
            When you share this credential, recipients will be able to verify its authenticity on the blockchain.
          </Alert>
          
          <Flex justify="flex-end" mt={6}>
            <Button 
              as={RouterLink} 
              to="/dashboard" 
              variant="outline" 
              mr={4}
            >
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              leftIcon={<Icon as={FaShare} />}
              onClick={handleShare}
              isLoading={isLoading}
              isDisabled={!isShareEnabled()}
            >
              Share Credential
            </Button>
          </Flex>
        </Box>
      </SimpleGrid>
      
      {/* QR Code Modal */}
      <Modal isOpen={qrModalDisclosure.isOpen} onClose={qrModalDisclosure.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Scan QR Code</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {/* This would be a real QR code in production */}
              <Box 
                width="200px" 
                height="200px" 
                bg="gray.200" 
                mx="auto" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                borderRadius="md"
              >
                <Icon as={FaQrcode} boxSize={16} />
              </Box>
              <Text textAlign="center">
                Scan this QR code to verify the credential
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={qrModalDisclosure.onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Success Modal */}
      <Modal isOpen={successModalDisclosure.isOpen} onClose={() => {
        successModalDisclosure.onClose();
        navigate('/dashboard');
      }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Credential Shared Successfully</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Icon as={FaCheck} boxSize={12} color="green.500" />
              <Text textAlign="center">
                Your credential has been shared successfully.
                {shareMethod === 'email' ? ' Recipients will receive an email with access instructions.' : ' You can now share the link with anyone you choose.'}
              </Text>
              
              {shareMethod === 'link' && shareLink && (
                <Box p={4} bg={highlightColor} borderRadius="md" width="full">
                  <Text fontWeight="bold" mb={2}>Your shareable link:</Text>
                  <InputGroup size="sm">
                    <Input 
                      value={shareLink} 
                      isReadOnly 
                      bg={bg}
                    />
                    <InputRightElement width="4.5rem">
                      <Button 
                        h="1.5rem" 
                        size="xs" 
                        onClick={onCopy}
                      >
                        {hasCopied ? <Icon as={FaCheck} /> : <Icon as={FaCopy} />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => {
              successModalDisclosure.onClose();
              navigate('/dashboard');
            }}>
              Return to Dashboard
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ShareCredential;