// src/components/layout/Header.tsx
import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useColorModeValue,
  useDisclosure,
  IconButton,
  HStack,
  Link as ChakraLink,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useWeb3Auth } from "../../contexts/Web3Context";
import useAuthStore from "../../store/authStore";

// Navigation links configuration
const Links = [
  { name: "Home", path: "/" },
  { name: "Verify Credential", path: "/verify" },
];

// Authenticated navigation links
const AuthLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Issue Credential", path: "/issue" },
];

const Header: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isAuthenticated,
    login,
    logout,
    isLoading,
    user,
    walletAddress,
    userRole,
  } = useWeb3Auth();


  console.log(user)

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgGrayColor = useColorModeValue("gray.100", "gray.700");

  // Helper function to truncate Ethereum address
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const getAuthLinks = () => {
    const baseLinks = [{ name: "Dashboard", path: "/dashboard" }];

    // Add institution-specific links
    if (userRole === "institution") {
      baseLinks.push({ name: "Issue Credential", path: "/issue" });
    }

    // Add links for all authenticated users
    // baseLinks.push({ name: "Profile", path: "/profile" });

    return baseLinks;
  };

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={10}
      bg={bgColor}
      borderBottom={1}
      borderStyle="solid"
      borderColor={borderColor}
      px={4}
      boxShadow="sm"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Mobile Menu Button */}
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />

        {/* Logo */}
        <Box flex={{ base: 1, md: "auto" }}>
          <Text
            as={RouterLink}
            to="/"
            fontSize="xl"
            fontWeight="bold"
            color="brand.500"
          >
            VerifiChain
          </Text>
        </Box>

        {/* Desktop Navigation Links */}
        <Flex
          flex={{ md: 1 }}
          justify="center"
          display={{ base: "none", md: "flex" }}
          alignItems="center"
          paddingRight={24}
        >
          <HStack as="nav" spacing={6}>
            {Links.map((link) => (
              <ChakraLink
                key={link.path}
                as={RouterLink}
                to={link.path}
                px={3}
                py={1}
                rounded="md"
                fontWeight="medium"
                _hover={{
                  textDecoration: "none",
                  bg: bgGrayColor,
                }}
              >
                {link.name}
              </ChakraLink>
            ))}

            {isAuthenticated &&
              getAuthLinks().map((link) => (
                <ChakraLink
                  key={link.path}
                  as={RouterLink}
                  to={link.path}
                  px={3}
                  py={1}
                  rounded="md"
                  fontWeight="medium"
                  _hover={{
                    textDecoration: "none",
                    bg: bgGrayColor,
                  }}
                >
                  {link.name}
                </ChakraLink>
              ))}
          </HStack>
        </Flex>

        {/* Auth Buttons */}
        <Flex alignItems="center" flex={{ md: "auto" }} justify="flex-end">
          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
              >
                <Avatar
                  size="sm"
                  src={user.profileImage || ""}
                  name={user?.name || "User"}
                />
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/dashboard">
                  Dashboard
                </MenuItem>
                <MenuItem as={RouterLink} to="/profile">
                  Profile
                </MenuItem>
                {walletAddress && (
                  <MenuItem isDisabled>
                    {truncateAddress(walletAddress)}
                  </MenuItem>
                )}
                <MenuDivider />
                <MenuItem onClick={logout}>Log Out</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              variant="solid"
              colorScheme="blue"
              size="sm"
              onClick={login}
              isLoading={isLoading}
              loadingText="Connecting"
            >
              Sign In
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" spacing={4}>
            {Links.map((link) => (
              <ChakraLink
                key={link.path}
                as={RouterLink}
                to={link.path}
                px={2}
                py={1}
                rounded="md"
                _hover={{
                  textDecoration: "none",
                  bg: bgGrayColor,
                }}
                onClick={onClose}
              >
                {link.name}
              </ChakraLink>
            ))}

            {isAuthenticated &&
              AuthLinks.map((link) => (
                <ChakraLink
                  key={link.path}
                  as={RouterLink}
                  to={link.path}
                  px={2}
                  py={1}
                  rounded="md"
                  _hover={{
                    textDecoration: "none",
                    bg: bgGrayColor,
                  }}
                  onClick={onClose}
                >
                  {link.name}
                </ChakraLink>
              ))}

            {/* Mobile login/logout button */}
            {isAuthenticated ? (
              <Button
                w="full"
                variant="outline"
                colorScheme="red"
                size="sm"
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                Log Out
              </Button>
            ) : (
              <Button
                w="full"
                variant="solid"
                colorScheme="blue"
                size="sm"
                onClick={() => {
                  login();
                  onClose();
                }}
                isLoading={isLoading}
                loadingText="Connecting"
              >
                Sign In
              </Button>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Header;
