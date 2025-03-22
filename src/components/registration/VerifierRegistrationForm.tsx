/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/registration/VerifierRegistrationForm.tsx
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
  Checkbox,
} from '@chakra-ui/react';
import { useWeb3Auth } from '../../contexts/Web3Context';

interface VerifierRegistrationFormProps {
  onSubmit: (data: any) => void;
  isAuthenticated: boolean;
}

const VerifierRegistrationForm: React.FC<VerifierRegistrationFormProps> = ({ 
  onSubmit, 
  isAuthenticated 
}) => {
  const { login, isLoading } = useWeb3Auth();
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    industry: '',
    website: '',
    country: '',
    address: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    verificationPurpose: '',
    agreeToTerms: false,
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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
            <Text fontWeight="bold" fontSize="lg">Organization Information</Text>
            <Divider />
            
            <FormControl isRequired>
              <FormLabel>Organization Name</FormLabel>
              <Input
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="Full legal name of organization"
              />
            </FormControl>

            <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
              <FormControl isRequired>
                <FormLabel>Organization Type</FormLabel>
                <Select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  placeholder="Select organization type"
                >
                  <option value="company">Company</option>
                  <option value="government">Government Agency</option>
                  <option value="nonprofit">Non-profit Organization</option>
                  <option value="educationalInstitution">Educational Institution</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Industry</FormLabel>
                <Input
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="Your industry"
                />
              </FormControl>
            </Flex>

            <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
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

              <FormControl isRequired>
                <FormLabel>Country</FormLabel>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel>Address</FormLabel>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Organization address"
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

            <FormControl isRequired>
              <FormLabel>Verification Purpose</FormLabel>
              <Textarea
                name="verificationPurpose"
                value={formData.verificationPurpose}
                onChange={handleChange}
                placeholder="Please explain why your organization needs to verify academic credentials"
                rows={4}
              />
              <FormHelperText>
                This helps us understand how our platform will be used for verification purposes.
              </FormHelperText>
            </FormControl>

            <FormControl isRequired>
              <Checkbox 
                name="agreeToTerms" 
                isChecked={formData.agreeToTerms}
                onChange={handleChange}
              >
                I agree to use the verification system only for legitimate credential verification purposes and to maintain the privacy of credential data.
              </Checkbox>
            </FormControl>
          </>
        )}

        <Box pt={2}>
          <Button
            colorScheme="blue"
            type="submit"
            width="full"
            size="lg"
            isLoading={isLoading}
            isDisabled={isAuthenticated && !formData.agreeToTerms}
          >
            {isAuthenticated ? 'Complete Registration' : 'Sign In to Continue'}
          </Button>
          
          {isAuthenticated && (
            <Text fontSize="sm" color="gray.500" mt={2} textAlign="center">
              After registration, you'll be able to verify academic credentials instantly.
            </Text>
          )}
        </Box>
      </VStack>
    </form>
  );
};

export default VerifierRegistrationForm;