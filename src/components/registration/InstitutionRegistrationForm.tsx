/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/registration/InstitutionRegistrationForm.tsx
import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormHelperText,
  Select,
  Textarea,
  Divider,
  Text,
  Box,
  Flex,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useWeb3Auth } from '../../contexts/Web3Context';

interface InstitutionRegistrationFormProps {
  onSubmit: (data: any) => void;
  isAuthenticated: boolean;
  isSubmitting: boolean; // Add this prop
}

const InstitutionRegistrationForm: React.FC<InstitutionRegistrationFormProps> = ({ 
  onSubmit, 
  isAuthenticated,
  isSubmitting, // Add this prop
}) => {
  const { login, isLoading } = useWeb3Auth();
  const [formData, setFormData] = useState({
    institutionName: '',
    institutionType: '',
    country: '',
    address: '',
    website: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
            <Text fontWeight="bold" fontSize="lg">Institution Information</Text>
            <Divider />
            
            <FormControl isRequired>
              <FormLabel>Institution Name</FormLabel>
              <Input
                name="institutionName"
                value={formData.institutionName}
                onChange={handleChange}
                placeholder="Full legal name of institution"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Institution Type</FormLabel>
              <Select
                name="institutionType"
                value={formData.institutionType}
                onChange={handleChange}
                placeholder="Select institution type"
              >
                <option value="university">University</option>
                <option value="college">College</option>
                <option value="highSchool">High School</option>
                <option value="technicalSchool">Technical School</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>

            <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
              <FormControl isRequired>
                <FormLabel>Country</FormLabel>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Website</FormLabel>
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Official website"
                  type="url"
                />
              </FormControl>
            </Flex>

            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address"
              />
            </FormControl>

            <Text fontWeight="bold" fontSize="lg" mt={4}>Contact Information</Text>
            <Divider />

            <FormControl isRequired>
              <FormLabel>Contact Person</FormLabel>
              <Input
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Name of authorized representative"
              />
            </FormControl>

            <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
              <FormControl isRequired>
                <FormLabel>Contact Email</FormLabel>
                <Input
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="Official email address"
                  type="email"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Contact Phone</FormLabel>
                <Input
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  type="tel"
                />
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel>Institution Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the institution"
                rows={4}
              />
              <FormHelperText>
                This information will be visible on your public profile.
              </FormHelperText>
            </FormControl>
          </>
        )}

        <Box pt={2}>
          <Button
            colorScheme="blue"
            type="submit"
            width="full"
            size="lg"
            isLoading={isLoading || isSubmitting} // Update this line
            loadingText={isAuthenticated ? "Submitting..." : "Connecting..."}
          >
            {isAuthenticated ? 'Complete Registration' : 'Sign In to Continue'}
          </Button>
          
          {isAuthenticated && (
            <Text fontSize="sm" color="gray.500" mt={2} textAlign="center">
              Your institution will be verified before being able to issue credentials.
            </Text>
          )}
        </Box>
      </VStack>
    </form>
  );
};

export default InstitutionRegistrationForm;