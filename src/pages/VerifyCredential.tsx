/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/VerifyCredential.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Divider,
  Badge,
  Spinner,
  useColorModeValue,
  SimpleGrid,
  Icon,
  HStack,
  useToast,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaInfoCircle, 
  FaUniversity, 
  FaUser, 
  FaScroll, 
  FaCalendar,
  FaSearch, 
  FaShieldAlt, 
  FaExternalLinkAlt
} from 'react-icons/fa';
import { useWeb3Auth } from '../contexts/Web3Context';
import { verificationService } from '../services/api';

const VerifyCredential: React.FC = () => {
  const { isAuthenticated } = useWeb3Auth();
  const [credentialId, setCredentialId] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string>('');
  const [verifierName, setVerifierName] = useState('');
  const [verifierType, setVerifierType] = useState('public');
  const toast = useToast();

  // Colors
  const formBg = useColorModeValue('white', 'gray.700');
  const resultBg = useColorModeValue('white', 'gray.700');
  // const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // Handle credential verification
  const handleVerify = async () => {
    // Validate credential ID
    if (!credentialId.trim()) {
      setError('Please enter a credential ID');
      return;
    }

    setStatus('loading');
    setError('');
    setResult(null);

    try {
      // Prepare verification data
      const verificationData = {
        credentialId,
        verifierName: verifierName || (isAuthenticated ? 'Authenticated User' : 'Anonymous User'),
        verifierType: verifierType || 'public'
      };

      // Call API to verify credential
      const response = await verificationService.verifyCredential(verificationData);
      
      // Check if verification was successful
      if (response.data.verified) {
        setResult(response.data);
        setStatus('success');
        
        toast({
          title: 'Verification Successful',
          description: 'The credential has been successfully verified.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(response.data.message || 'Verification failed');
      }
    } catch (err: unknown) {
      console.error('Verification error:', err);
      
      // Safely extract error message with type checking
      let errorMessage = 'Credential could not be verified. Please check the ID and try again.';
      if (err && typeof err === 'object' && 'response' in err) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        if (errorObj.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        }
      }
      
      setError(errorMessage);
      setStatus('error');
      
      toast({
        title: 'Verification Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle verification using hash directly
  // const handleVerifyHash = (hash: string) => {
  //   setCredentialId(hash);
  //   setTimeout(() => {
  //     handleVerify();
  //   }, 100);
  // };

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={10} align="stretch">
        {/* Page Header */}
        <Box textAlign="center">
          <Heading as="h1" mb={4} size="xl">
            Verify Academic Credential
          </Heading>
          <Text color="gray.600" maxW="3xl" mx="auto">
            Enter the credential ID to verify its authenticity on the blockchain. No technical knowledge required.
          </Text>
        </Box>

        {/* Verification Form */}
        <Box 
          p={8} 
          borderWidth="1px" 
          borderRadius="lg" 
          boxShadow="lg"
          bg={formBg}
        >
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Credential ID or Hash</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSearch} color="gray.300" />
                </InputLeftElement>
                <Input 
                  placeholder="Enter the unique credential identifier" 
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  size="lg"
                />
              </InputGroup>
              <Text fontSize="sm" color="gray.500" mt={2}>
                This is the unique identifier provided with the academic credential.
              </Text>
            </FormControl>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel>Verifier Name (Optional)</FormLabel>
                <Input 
                  placeholder="Your name or organization" 
                  value={verifierName}
                  onChange={(e) => setVerifierName(e.target.value)}
                />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  For record-keeping purposes only
                </Text>
              </FormControl>
              
              <FormControl>
                <FormLabel>Verifier Type</FormLabel>
                <select 
                  value={verifierType}
                  onChange={(e) => setVerifierType(e.target.value)}
                  className="chakra-input css-1kp110w"
                  style={{ width: '100%', height: '40px', borderRadius: '0.375rem', padding: '0 1rem' }}
                >
                  <option value="public">Public/Individual</option>
                  <option value="employer">Employer</option>
                  <option value="institution">Educational Institution</option>
                  <option value="government">Government Agency</option>
                </select>
              </FormControl>
            </SimpleGrid>
            
            <Button 
              colorScheme="blue" 
              size="lg" 
              width="full"
              onClick={handleVerify}
              isLoading={status === 'loading'}
              loadingText="Verifying..."
              leftIcon={<Icon as={FaShieldAlt} />}
            >
              Verify Credential
            </Button>
            
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Verification Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Box>
              </Alert>
            )}
          </VStack>
        </Box>
        
        {/* Loading State */}
        {status === 'loading' && (
          <Flex direction="column" align="center" my={10}>
            <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
            <Text mt={4} fontSize="lg">Verifying credential on the blockchain...</Text>
            <Text color="gray.500" fontSize="sm" mt={2}>
              This may take a few moments to complete.
            </Text>
          </Flex>
        )}
        
        {/* Verification Result - Success */}
        {status === 'success' && result && (
          <Box 
            mt={10} 
            p={6} 
            borderWidth="1px" 
            borderRadius="lg" 
            boxShadow="md"
            bg={resultBg}
            position="relative"
            overflow="hidden"
          >
            {/* Success Badge */}
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="md">Credential Verification Result</Heading>
              <Badge 
                colorScheme="green" 
                p={2} 
                borderRadius="md"
                display="flex"
                alignItems="center"
              >
                <Icon as={FaCheckCircle} mr={2} />
                Verified
              </Badge>
            </Flex>
            
            <Divider mb={6} />
            
            {/* Credential Details */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Flex align="center">
                <Icon as={FaUniversity} boxSize={5} color="blue.500" mr={3} />
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">Institution</Text>
                  <Text fontSize="md">{result.credential.institution}</Text>
                </Box>
              </Flex>
              
              {result.credential.recipientName && (
                <Flex align="center">
                  <Icon as={FaUser} boxSize={5} color="blue.500" mr={3} />
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Recipient</Text>
                    <Text fontSize="md">{result.credential.recipientName}</Text>
                  </Box>
                </Flex>
              )}
              
              <Flex align="center">
                <Icon as={FaScroll} boxSize={5} color="blue.500" mr={3} />
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">Credential Type</Text>
                  <Text fontSize="md">{result.credential.credentialType}</Text>
                </Box>
              </Flex>
              
              <Flex align="center">
                <Icon as={FaCalendar} boxSize={5} color="blue.500" mr={3} />
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">Issue Date</Text>
                  <Text fontSize="md">{new Date(result.credential.issueDate).toLocaleDateString()}</Text>
                </Box>
              </Flex>
            </SimpleGrid>
            
            {/* Additional Metadata */}
            {result.credential.metadata && Object.keys(result.credential.metadata).length > 0 && (
              <>
                <Heading size="sm" mt={8} mb={4}>Additional Information</Heading>
                <Divider mb={4} />
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {Object.entries(result.credential.metadata).map(([key, value]) => (
                    <Flex key={key} align="center">
                      <Icon as={FaInfoCircle} boxSize={5} color="blue.500" mr={3} />
                      <Box>
                        <Text fontWeight="bold" fontSize="sm" color="gray.500">{key}</Text>
                        <Text fontSize="md">{String(value)}</Text>
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </>
            )}
            
            {/* Blockchain verification info */}
            {result.blockchain && (
              <Box mt={8} p={4} bg={bgColor} borderRadius="md">
                <Heading size="sm" mb={3}>Blockchain Verification</Heading>
                <VStack align="stretch" spacing={2}>
                  {result.blockchain.txHash && (
                    <Flex justify="space-between">
                      <Text fontWeight="semibold">Transaction Hash:</Text>
                      <Text fontSize="sm" fontFamily="mono">
                        {result.blockchain.txHash.substring(0, 10)}...{result.blockchain.txHash.substring(result.blockchain.txHash.length - 10)}
                      </Text>
                    </Flex>
                  )}
                  {result.blockchain.timestamp && (
                    <Flex justify="space-between">
                      <Text fontWeight="semibold">Blockchain Timestamp:</Text>
                      <Text>{new Date(result.blockchain.timestamp).toLocaleString()}</Text>
                    </Flex>
                  )}
                </VStack>
                
                <HStack mt={4}>
                  <Icon as={FaInfoCircle} color="blue.500" />
                  <Text fontSize="sm" color="gray.600">
                    This credential has been cryptographically verified on the blockchain and is authentic.
                  </Text>
                </HStack>
                
                {result.blockchain.verificationUrl && (
                  <Button 
                    mt={4} 
                    size="sm" 
                    colorScheme="blue" 
                    variant="outline"
                    as="a" 
                    href={result.blockchain.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    rightIcon={<Icon as={FaExternalLinkAlt} />}
                  >
                    View on Blockchain Explorer
                  </Button>
                )}
              </Box>
            )}
          </Box>
        )}
        
        {/* Verification Result - Error (when status is error but no specific error message) */}
        {status === 'error' && !error && (
          <Box 
            mt={10} 
            p={6} 
            borderWidth="1px" 
            borderRadius="lg" 
            boxShadow="md"
            bg={resultBg}
          >
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">Credential Verification Result</Heading>
              <Badge 
                colorScheme="red" 
                p={2} 
                borderRadius="md"
                display="flex"
                alignItems="center"
              >
                <Icon as={FaTimesCircle} mr={2} />
                Not Verified
              </Badge>
            </Flex>
            
            <Divider mb={4} />
            
            <Alert status="error" mt={4}>
              <AlertIcon />
              <Box>
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>
                  This credential could not be verified on the blockchain. It may be invalid or may not exist.
                </AlertDescription>
              </Box>
            </Alert>
          </Box>
        )}
        
        {/* Instructions */}
        <Box p={6} borderWidth="1px" borderRadius="lg" borderStyle="dashed">
          <Heading size="md" mb={4}>How to Verify a Credential</Heading>
          <VStack align="stretch" spacing={3}>
            <HStack>
              <Box 
                bg="blue.500" 
                color="white" 
                borderRadius="full" 
                w={6} 
                h={6} 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                fontWeight="bold"
              >
                1
              </Box>
              <Text>Request the credential ID from the credential holder.</Text>
            </HStack>
            <HStack>
              <Box 
                bg="blue.500" 
                color="white" 
                borderRadius="full" 
                w={6} 
                h={6} 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                fontWeight="bold"
              >
                2
              </Box>
              <Text>Enter the credential ID in the verification form above.</Text>
            </HStack>
            <HStack>
              <Box 
                bg="blue.500" 
                color="white" 
                borderRadius="full" 
                w={6} 
                h={6} 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                fontWeight="bold"
              >
                3
              </Box>
              <Text>Optionally, enter your name and organization for record-keeping.</Text>
            </HStack>
            <HStack>
              <Box 
                bg="blue.500" 
                color="white" 
                borderRadius="full" 
                w={6} 
                h={6} 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                fontWeight="bold"
              >
                4
              </Box>
              <Text>Review the verification results to confirm authenticity.</Text>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default VerifyCredential;