/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Register.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Divider,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  useColorModeValue,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWeb3Auth } from '../contexts/Web3Context';
import InstitutionRegistrationForm from '../components/registration/InstitutionRegistrationForm';
import StudentRegistrationForm from '../components/registration/StudentRegistrationForm';
import { authService } from '../services/api';

const Register: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { isAuthenticated, login, user, walletAddress, register: contextRegister } = useWeb3Auth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if we have user info from location state (redirected from login)
  const locationState = location.state as { userInfo?: any; walletAddress?: string } | null;

  // If user is already authenticated with both Web3Auth and backend, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle tab change
  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  // Complete registration after authentication
  const completeRegistration = async (roleSpecificData: any) => {
    try {
      setIsSubmitting(true);
      
      // If not authenticated with Web3Auth, prompt login first
      if (!user || !walletAddress) {
        await login();
        // After login we might be redirected, so return early
        return;
      }
      
      // Define interface for user registration data
      interface UserRegistrationData {
        email: any;
        name: any;
        role: string;
        web3AuthId: any;
        walletAddress?: string;
        institutionDetails?: any;
        studentDetails?: any;
      }
      
      // Prepare registration data
      const userData: UserRegistrationData = {
        email: user.email || locationState?.userInfo?.email,
        name: user.name || locationState?.userInfo?.name,
        role: tabIndex === 0 ? 'institution' : 'student',
        web3AuthId: user.id || locationState?.userInfo?.id,
        walletAddress: walletAddress || locationState?.walletAddress,
      };
      
      // Add role-specific data based on tab index
      if (tabIndex === 0) {
        userData.institutionDetails = roleSpecificData;
      } else {
        userData.studentDetails = roleSpecificData;
      }
      
      // Register using API service
      try {
        const response = await authService.register(userData);
        
        if (response.data.success) {
          // Store the token and update auth state
          localStorage.setItem('token', response.data.token);
          
          // Show success message
          toast({
            title: "Registration successful",
            description: `You've been registered as a ${userData.role}`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          
          // Redirect to dashboard
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Registration error:", error);
        
        // Show error message with specific backend error if available
        toast({
          title: "Registration failed",
          description: error.response?.data?.message || "There was an error during registration. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      toast({
        title: "Registration failed",
        description: "There was an error during registration. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If we're still loading Web3Auth, show loading state
  if (!user && locationState?.userInfo === undefined) {
    return (
      <Container maxW="container.md" py={10}>
        <Flex direction="column" align="center" justify="center" h="50vh">
          <Spinner size="xl" mb={4} color="blue.500" />
          <Text>Loading authentication...</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={4}>
            Create Your Account
          </Heading>
          <Text color="gray.600">
            Register as an institution or student to access the credential system.
          </Text>
        </Box>

        <Box 
          p={8} 
          borderWidth="1px" 
          borderRadius="lg" 
          bg={bgColor}
          boxShadow="lg"
        >
          {(user || locationState?.userInfo) && (
            <>
              <Flex justify="center" mb={6}>
                <Box textAlign="center">
                  <Heading size="md" mb={2}>
                    Welcome, {user?.name || locationState?.userInfo?.name || 'User'}
                  </Heading>
                  <Text color="gray.600">Complete your profile to continue</Text>
                </Box>
              </Flex>
              <Divider mb={6} />
            </>
          )}

          {!user && !locationState?.userInfo && (
            <Alert status="info" mb={6} borderRadius="md">
              <AlertIcon />
              <Text>
                You'll need to sign in with Web3Auth before completing registration.
              </Text>
            </Alert>
          )}

          <Tabs isFitted variant="enclosed" index={tabIndex} onChange={handleTabChange}>
            <TabList mb="1em">
              <Tab>Institution</Tab>
              <Tab>Student</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <InstitutionRegistrationForm 
                  onSubmit={completeRegistration} 
                  isAuthenticated={!!user || !!locationState?.userInfo}
                  isSubmitting={isSubmitting}
                />
              </TabPanel>
              <TabPanel>
                <StudentRegistrationForm 
                  onSubmit={completeRegistration} 
                  isAuthenticated={!!user || !!locationState?.userInfo}
                  isSubmitting={isSubmitting}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </Container>
  );
};

export default Register;