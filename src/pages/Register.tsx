// src/pages/Register.tsx
import React, { useState } from 'react';
import {
  Box,
//   Button,
  Container,
//   FormControl,
//   FormLabel,
  Heading,
//   Input,
//   Select,
  VStack,
  Text,
  Divider,
  useToast,
//   FormHelperText,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useWeb3Auth } from '../contexts/Web3Context';
import InstitutionRegistrationForm from '../components/registration/InstitutionRegistrationForm';
import StudentRegistrationForm from '../components/registration/StudentRegistrationForm';
// import VerifierRegistrationForm from '../components/registration/VerifierRegistrationForm';

const Register: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { isAuthenticated, login, user } = useWeb3Auth();
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');

  // Handle tab change
  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  // Complete registration after authentication
  const completeRegistration = async (roleSpecificData: any) => {
    try {
      // If not authenticated, prompt login first
      if (!isAuthenticated) {
        await login();
        // After login, we'd continue registration, but for now just show a toast
        toast({
          title: "Sign-in successful",
          description: "Please complete your registration details now.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Here we would call our backend API to save the user role and additional data
      // For now, we'll just simulate a successful registration
      
      const userRole = tabIndex === 0 ? 'institution' : tabIndex === 1 ? 'student' : '';
      
      toast({
        title: "Registration successful",
        description: `You've been registered as a ${userRole}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "There was an error during registration. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={4}>
            Create Your Account
          </Heading>
          <Text color="gray.600">
            Register as an institution, student, or verifier to access the credential system.
          </Text>
        </Box>

        <Box 
          p={8} 
          borderWidth="1px" 
          borderRadius="lg" 
          bg={bgColor}
          boxShadow="lg"
        >
          {isAuthenticated ? (
            <>
              <Flex justify="center" mb={6}>
                <Box textAlign="center">
                  <Heading size="md" mb={2}>Welcome, {user?.name || 'User'}</Heading>
                  <Text color="gray.600">Complete your profile to continue</Text>
                </Box>
              </Flex>
              <Divider mb={6} />
            </>
          ) : (
            <Text mb={6} textAlign="center">
              You'll be prompted to sign in after selecting your account type.
            </Text>
          )}

          <Tabs isFitted variant="enclosed" index={tabIndex} onChange={handleTabChange}>
            <TabList mb="1em">
              <Tab>Institution</Tab>
              <Tab>Student</Tab>
              {/* <Tab>Verifier</Tab> */}
            </TabList>
            <TabPanels>
              <TabPanel>
                <InstitutionRegistrationForm 
                  onSubmit={completeRegistration} 
                  isAuthenticated={isAuthenticated}
                />
              </TabPanel>
              <TabPanel>
                <StudentRegistrationForm 
                  onSubmit={completeRegistration} 
                  isAuthenticated={isAuthenticated}
                />
              </TabPanel>
              {/* <TabPanel>
                <VerifierRegistrationForm 
                  onSubmit={completeRegistration} 
                  isAuthenticated={isAuthenticated}
                />
              </TabPanel> */}
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </Container>
  );
};

export default Register;