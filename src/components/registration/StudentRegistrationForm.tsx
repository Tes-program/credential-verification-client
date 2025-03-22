/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/registration/StudentRegistrationForm.tsx
import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormHelperText,
  Select,
  Divider,
  Text,
  Box,
  Flex,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useWeb3Auth } from '../../contexts/Web3Context';

interface StudentRegistrationFormProps {
  onSubmit: (data: any) => void;
  isAuthenticated: boolean;
}

const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ 
  onSubmit, 
  isAuthenticated 
}) => {
  const { login, isLoading } = useWeb3Auth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    institution: '',
    studentId: '',
    major: '',
    graduationYear: '',
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      await login();
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        {!isAuthenticated && (
          <Alert status="info" mb={4} borderRadius="md">
            <AlertIcon />
            First, you'll need to sign in. Click the button below to continue.
          </Alert>
        )}

        {isAuthenticated && (
          <>
            <Text fontWeight="bold" fontSize="lg">Personal Information</Text>
            <Divider />
            
            <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                />
              </FormControl>
            </Flex>

            <FormControl isRequired>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                type="date"
              />
            </FormControl>

            <Text fontWeight="bold" fontSize="lg" mt={4}>Academic Information</Text>
            <Divider />

            <FormControl isRequired>
              <FormLabel>Institution</FormLabel>
              <Input
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                placeholder="Your university or college"
              />
              <FormHelperText>
                Enter the name of your academic institution
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Student ID</FormLabel>
              <Input
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Your student ID"
              />
              <FormHelperText>
                This helps link you to your academic records
              </FormHelperText>
            </FormControl>

            <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
              <FormControl>
                <FormLabel>Major/Field of Study</FormLabel>
                <Input
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="Your major"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Graduation Year</FormLabel>
                <Input
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="Expected graduation year"
                  type="number"
                />
              </FormControl>
            </Flex>
          </>
        )}

        <Box pt={2}>
          <Button
            colorScheme="blue"
            type="submit"
            width="full"
            size="lg"
            isLoading={isLoading}
          >
            {isAuthenticated ? 'Complete Registration' : 'Sign In to Continue'}
          </Button>
          
          {isAuthenticated && (
            <Text fontSize="sm" color="gray.500" mt={2} textAlign="center">
              Your registration allows you to manage and share your academic credentials.
            </Text>
          )}
        </Box>
      </VStack>
    </form>
  );
};

export default StudentRegistrationForm;