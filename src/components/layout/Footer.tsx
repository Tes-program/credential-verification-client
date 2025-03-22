import React from 'react';
import { 
  Box, 
  Container, 
  Stack, 
  Text, 
  Link, 
  useColorModeValue, 
  Flex, 
  Divider 
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <Box
      as="footer"
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt="auto" // This helps push the footer to the bottom
    >
      <Divider />
      <Container
        as={Stack}
        maxW="container.xl"
        py={6}
        spacing={4}
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}
        >
          <Text>© {new Date().getFullYear()} VerifiChain. All rights reserved.</Text>
          <Stack direction="row" spacing={6} mt={{ base: 4, md: 0 }}>
            <Link as={RouterLink} to="/">Home</Link>
            <Link as={RouterLink} to="/about">About</Link>
            <Link as={RouterLink} to="/verify">Verify</Link>
            <Link href="#" isExternal>GitHub</Link>
          </Stack>
        </Flex>
        <Text fontSize="sm" textAlign="center">
          Final Year Project | ODUMUYIWA TESLIM BOLARINWA & IKPEKAOGU CHINEMEREM EMMANUEL | Babcock University
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;