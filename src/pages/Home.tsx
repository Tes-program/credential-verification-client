// src/pages/Home.tsx
import React from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  Flex,
  Image,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaLock, FaBolt, FaGlobe, FaFileContract } from "react-icons/fa";

// Feature data
const features = [
  {
    title: "Immutable Records",
    description:
      "Credentials stored on blockchain cannot be altered or tampered with, ensuring complete data integrity.",
    icon: FaLock,
  },
  {
    title: "Instant Verification",
    description:
      "Verify credentials in seconds with guaranteed authenticity, eliminating lengthy manual verification processes.",
    icon: FaBolt,
  },
  {
    title: "Decentralized Storage",
    description:
      "No single point of failure means credentials are always accessible and secure from centralized breaches.",
    icon: FaGlobe,
  },
  {
    title: "Smart Contracts",
    description:
      "Automated credential issuance and verification through smart contracts ensures consistency and reliability.",
    icon: FaFileContract,
  },
];

// Process steps
const processSteps = [
  {
    title: "Issue Credentials",
    description:
      "Educational institutions issue digital credentials securely on the blockchain.",
  },
  {
    title: "Store Securely",
    description:
      "Credentials are stored with cryptographic protection, impossible to forge.",
  },
  {
    title: "Share Easily",
    description:
      "Graduates can share their credentials with employers with a simple link.",
  },
  {
    title: "Verify Instantly",
    description:
      "Employers can verify authenticity instantly without contacting the institution.",
  },
];

const Home: React.FC = () => {
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.100, blue.50)",
    "linear(to-r, blue.900, blue.800)"
  );

  return (
    <Box>
      {/* Hero Section */}
      <Box bgGradient={bgGradient} py={20}>
        <Container maxW="container.xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
          >
            <Box maxW={{ base: "100%", md: "50%" }} mb={{ base: 8, md: 0 }}>
              <Heading
                as="h1"
                size="2xl"
                mb={4}
                bgGradient="linear(to-r, brand.500, blue.600)"
                bgClip="text"
              >
                Secure Academic Credential Verification
              </Heading>
              <Text fontSize="xl" color="gray.600" mb={6}>
                A blockchain-based system for issuing, managing, and verifying
                academic credentials with complete security and transparency.
              </Text>
              <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme="blue"
                  size="lg"
                >
                  Get Started
                </Button>
                <Button
                  as={RouterLink}
                  to="/verify"
                  size="lg"
                  variant="outline"
                >
                  Verify a Credential
                </Button>
              </Stack>
            </Box>
            <Box maxW={{ base: "100%", md: "45%" }}>
              <Image
                src="https://images.unsplash.com/photo-1639322537504-6427a16b0a28?q=80&w=500&auto=format&fit=crop"
                alt="Blockchain Credential Verification"
                borderRadius="lg"
                shadow="lg"
                fallbackSrc="https://via.placeholder.com/500x400?text=Blockchain+Credentials"
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={20}>
        <Heading as="h2" size="xl" textAlign="center" mb={16}>
          Key Features
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          {features.map((feature, index) => (
            <Box
              key={index}
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              shadow="md"
              transition="all 0.3s"
              _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
            >
              <Flex mb={4}>
                <Box
                  bg="brand.500"
                  w={12}
                  h={12}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  mr={4}
                >
                  <Icon as={feature.icon} boxSize={5} />
                </Box>
                <Box>
                  <Heading size="md" mb={2}>
                    {feature.title}
                  </Heading>
                  <Text color="gray.600">{feature.description}</Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Container>

      {/* How It Works Section */}
      <Box bg={useColorModeValue("gray.50", "gray.800")} py={20}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" textAlign="center" mb={16}>
            How It Works
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
            {processSteps.map((step, index) => (
              <Box key={index} p={6} textAlign="center" position="relative">
                {index < processSteps.length - 1 && (
                  <Box
                    position="absolute"
                    right="-30px"
                    top="70px"
                    height="2px"
                    width="60px"
                    bg="brand.500"
                    display={{ base: "none", md: "block" }}
                  />
                )}

                <Box
                  w={16}
                  h={16}
                  borderRadius="full"
                  bg="brand.500"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="2xl"
                  fontWeight="bold"
                  mb={4}
                  mx="auto"
                >
                  {index + 1}
                </Box>
                <Heading size="md" mb={2}>
                  {step.title}
                </Heading>
                <Text color="gray.600">{step.description}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box py={20}>
        <Container maxW="container.xl" textAlign="center">
          <Heading as="h2" size="xl" mb={6}>
            Ready to Get Started?
          </Heading>
          <Text fontSize="lg" maxW="2xl" mx="auto" mb={8} color="gray.600">
            Join our platform today and experience the future of secure academic
            credential verification.
          </Text>
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={4}
            justify="center"
          >
            <Button
              as={RouterLink}
              to="/register"
              colorScheme="brand"
              size="lg"
              px={8}
            >
              Register Now
            </Button>
            <Button
              as={RouterLink}
              to="/about"
              variant="outline"
              size="lg"
              px={8}
            >
              Learn More
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
