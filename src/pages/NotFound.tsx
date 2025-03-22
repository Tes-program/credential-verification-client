// src/pages/NotFound.tsx
import React from 'react';
import { Box, Heading, Text, Button, Container, VStack, Icon } from '@chakra-ui/react';
import { FaHome, FaSearch } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={6} textAlign="center">
        <Heading size="4xl" color="gray.400">404</Heading>
        
        <Icon as={FaSearch} boxSize={20} color="blue.400" opacity={0.6} />
        
        <Heading as="h1" size="xl" mt={6}>
          Page Not Found
        </Heading>
        
        <Text color="gray.600" fontSize="lg">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        
        <Box mt={8}>
          <Button 
            as={RouterLink} 
            to="/" 
            colorScheme="blue" 
            size="lg" 
            leftIcon={<FaHome />}
          >
            Return Home
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default NotFound;