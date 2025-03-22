/* eslint-disable @typescript-eslint/no-unused-vars */
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
} from '@chakra-ui/react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaUniversity, FaUser, FaScroll, FaCalendar } from 'react-icons/fa';
import { useWeb3Auth } from '../contexts/Web3Context';

// Define the types for our verification state and results
type VerificationStatus = 'idle' | 'loading' | 'success' | 'error';

type VerificationResult = {
  isValid: boolean;
  institution: string;
  studentName: string;
  credentialType: string;
  issueDate: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalData?: Record<string, any>;
};

const VerifyCredential: React.FC = () => {
  const { isAuthenticated, login, isLoading: authLoading, verificationContract, error: authError } = useWeb3Auth();
  const [credentialId, setCredentialId] = useState('');
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string>('');
  const toast = useToast();

  // Colors for different sections
  const formBg = useColorModeValue('white', 'gray.700');
  const resultBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // Handle credential verification
  const handleVerify = async () => {
    // Validate credential ID
    if (!credentialId.trim()) {
      setError('Please enter a credential ID');
      return;
    }

    // Handle authentication if not authenticated
    if (!isAuthenticated) {
      try {
        await login();
        // If we successfully authenticated but don't have the contract yet, show message
        if (!verificationContract) {
          toast({
            title: "Authentication Successful",
            description: "Please try verification again now that you're signed in.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          return;
        }
      } catch (err) {
        setError('Failed to authenticate. Please try again.');
        return;
      }
    }

    // Verify the contract is available
    if (!verificationContract) {
      setError('Blockchain connection not initialized. Please ensure you are signed in.');
      return;
    }

    // Start verification process
    setStatus('loading');
    setError('');
    setResult(null);

    try {
      // Call the smart contract to verify the credential
      // Note: This is a mock implementation - replace with your actual contract call
      
      // For testing, we'll use a timeout to simulate the blockchain call
      setTimeout(async () => {
        try {
          // Mock verification result - in production, this would be:
          // const verificationResult = await verificationContract.verifyCredential(credentialId);
          
          // Simulate successful verification for credential IDs that start with "valid"
          if (credentialId.toLowerCase().startsWith('valid')) {
            const mockResult = {
              isValid: true,
              institution: 'Babcock University',
              studentName: 'John Doe',
              credentialType: 'Bachelor of Science in Information Technology',
              issueDate: new Date().toLocaleDateString(),
              additionalData: {
                'GPA': '3.8',
                'Year of Graduation': '2023',
                'Department': 'Information Technology'
              }
            };
            
            setResult(mockResult);
            setStatus('success');
            
            toast({
              title: 'Verification Successful',
              description: 'The credential has been successfully verified.',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          } else {
            // Simulate invalid credential
            setError('Credential could not be verified or does not exist on the blockchain.');
            setStatus('error');
            
            toast({
              title: 'Verification Failed',
              description: 'The credential could not be verified.',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          }
        } catch (err) {
          console.error('Verification error:', err);
          setError('An error occurred during verification. Please try again.');
          setStatus('error');
        }
      }, 2000); // 2-second mock delay to simulate blockchain transaction
    } catch (err) {
      console.error('Verification error:', err);
      setError('An error occurred while interacting with the blockchain. Please try again.');
      setStatus('error');
    }
  };

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
              <Input 
                placeholder="Enter the unique credential identifier" 
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                size="lg"
              />
              <Text fontSize="sm" color="gray.500" mt={2}>
                This is the unique identifier provided with the academic credential.
              </Text>
            </FormControl>
            
            <Button 
              colorScheme="blue" 
              size="lg" 
              width="full"
              onClick={handleVerify}
              isLoading={status === 'loading' || authLoading}
              loadingText={authLoading ? "Authenticating..." : "Verifying..."}
            >
              {isAuthenticated ? 'Verify Credential' : 'Sign in to Verify'}
            </Button>
            
            {(error || authError) && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Verification Error</AlertTitle>
                  <AlertDescription>{error || authError}</AlertDescription>
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
                  <Text fontSize="md">{result.institution}</Text>
                </Box>
              </Flex>
              
              <Flex align="center">
                <Icon as={FaUser} boxSize={5} color="blue.500" mr={3} />
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">Student Name</Text>
                  <Text fontSize="md">{result.studentName}</Text>
                </Box>
              </Flex>
              
              <Flex align="center">
                <Icon as={FaScroll} boxSize={5} color="blue.500" mr={3} />
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">Credential Type</Text>
                  <Text fontSize="md">{result.credentialType}</Text>
                </Box>
              </Flex>
              
              <Flex align="center">
                <Icon as={FaCalendar} boxSize={5} color="blue.500" mr={3} />
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">Issue Date</Text>
                  <Text fontSize="md">{result.issueDate}</Text>
                </Box>
              </Flex>
            </SimpleGrid>
            
            {/* Additional Data */}
            {result.additionalData && Object.keys(result.additionalData).length > 0 && (
              <>
                <Heading size="sm" mt={8} mb={4}>Additional Information</Heading>
                <Divider mb={4} />
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {Object.entries(result.additionalData).map(([key, value]) => (
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
            <Box mt={8} p={4} bg={bgColor} borderRadius="md">
              <HStack>
                <Icon as={FaInfoCircle} color="blue.500" />
                <Text fontSize="sm" color="gray.600">
                  This credential has been cryptographically verified on the blockchain and is authentic.
                </Text>
              </HStack>
            </Box>
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
              <Text>Sign in with your preferred method when prompted.</Text>
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