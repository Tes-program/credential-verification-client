/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/contexts/Web3Context.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { ethers } from 'ethers';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import ABI and contract configuration
import CredentialRegistryABI from '../contracts/abi/CredentialRegistry.json';
import InstitutionRegistryABI from '../contracts/abi/InstitutionRegistry.json';

// API base URL
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define our context type
type Web3AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  provider: IProvider | null;
  ethersProvider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  user: any | null;
  userRole: 'institution' | 'student' | null;
  walletAddress: string | null;
  verificationContract: ethers.Contract | null;
  institutionContract: ethers.Contract | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<any>;
  setUserRole: (role: 'institution' | 'student') => Promise<void>;
  error: string | null;
  refreshUserInfo: () => Promise<void>;
};

// Create context with default values
const Web3AuthContext = createContext<Web3AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  provider: null,
  ethersProvider: null,
  signer: null,
  user: null,
  walletAddress: null,
  verificationContract: null,
  institutionContract: null,
  login: async () => {},
  logout: async () => {},
  register: async () => ({}),
  error: null,
  setUserRole: async () => {},
  userRole: null,
  refreshUserInfo: async () => {},
});

// Custom hook to use the Web3Auth context
export const useWeb3Auth = () => useContext(Web3AuthContext);

// Define Web3Auth configuration
const clientId = process.env.REACT_APP_WEB3AUTH_CLIENT_ID || "BFGQKwBPuTNOiNTFlrUUsTXSzk0niUJ84_rBHiyTlnKbMA16a2K25JcoVXdRFd1NKqPuF8ENUJYzCETO6QejXOk";

// Define props for the provider component
type Web3AuthProviderProps = {
  children: ReactNode;
};

// Set up contract addresses from environment variables or defaults
const CREDENTIAL_REGISTRY_ADDRESS = process.env.REACT_APP_CREDENTIAL_REGISTRY_ADDRESS || "0x4d66a220F0B3F0b7320D50e084CC9f0b9a0Bccab";
const INSTITUTION_REGISTRY_ADDRESS = process.env.REACT_APP_INSTITUTION_REGISTRY_ADDRESS || "0x22e4c747A65dd1d38C7bf57F3C3B995c772dBb65";

// Create the provider component
export const Web3AuthProvider: React.FC<Web3AuthProviderProps> = ({ children }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [ethersProvider, setEthersProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [verificationContract, setVerificationContract] = useState<ethers.Contract | null>(null);
  const [institutionContract, setInstitutionContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'institution' | 'student' | null>(null);
  
  const navigate = useNavigate();

  // Add request interceptor to attach auth token
  useEffect(() => {
    apiClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }, []);

  // Initialize Web3Auth
  useEffect(() => {
    const init = async () => {
      try {
        // Clear previous error
        setError(null);
        setIsLoading(true);
        
        // Configure the private key provider
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: {
            chainConfig: {
              chainNamespace: CHAIN_NAMESPACES.EIP155,
              chainId: "0xaa36a7", // Sepolia testnet (11155111 in hex)
              rpcTarget: "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // Public RPC target
            }
          }
        });

        // Create and configure Web3Auth
        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: "sapphire_devnet", // Use "mainnet" for production
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0xaa36a7", // Sepolia testnet
            rpcTarget: "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
          },
          uiConfig: {
            loginMethodsOrder: ["google", "email_passwordless"],
          },
          privateKeyProvider
        });

        // Initialize Web3Auth
        await web3authInstance.initModal({
          modalConfig: {
            [WALLET_ADAPTERS.TORUS_EVM]: {
              label: "openlogin",
              loginMethods: {
                google: {
                  name: "Google",
                  showOnModal: true,
                },
                email_passwordless: {
                  name: "Email",
                  showOnModal: true,
                },
              },
              showOnModal: true,
            },
          },
        });

        setWeb3auth(web3authInstance);

        // Check if the user is already connected and logged in
        if (web3authInstance.connected) {
          const web3Provider = web3authInstance.provider;
          setProvider(web3Provider);
          
          try {
            const userInfo = await web3authInstance.getUserInfo();
            setUser(userInfo);
            
            if (web3Provider) {
              await setUpEthers(web3Provider);
            }
            
            // Verify if user is also authenticated with the backend
            const token = localStorage.getItem('token');
            if (token) {
              try {
                // Verify token with backend
                const response = await apiClient.get('/auth/profile');
                setIsAuthenticated(true);
                setUserRole(response.data.role);
              } catch (error) {
                // If token is invalid, clear it
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setUserRole(null);
              }
            }
          } catch (error) {
            console.error("Error getting user info:", error);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize Web3Auth", error);
        setError("Failed to initialize Web3Auth. Please try again later.");
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Helper function to set up ethers with the provider
  const setUpEthers = async (provider: IProvider) => {
    try {
      const ethersProviderInstance = new ethers.providers.Web3Provider(provider as any);
      setEthersProvider(ethersProviderInstance);
      
      const signerInstance = ethersProviderInstance.getSigner();
      setSigner(signerInstance);
      
      const address = await signerInstance.getAddress();
      setWalletAddress(address);
      
      // Create contract instances
      const credContract = new ethers.Contract(
        CREDENTIAL_REGISTRY_ADDRESS,
        CredentialRegistryABI.abi,
        signerInstance
      );
      setVerificationContract(credContract);
      
      const instContract = new ethers.Contract(
        INSTITUTION_REGISTRY_ADDRESS,
        InstitutionRegistryABI.abi,
        signerInstance
      );
      setInstitutionContract(instContract);
      
      return { address, signer: signerInstance };
    } catch (error) {
      console.error("Error setting up ethers", error);
      setError("Failed to connect to the blockchain. Please try again.");
      throw error;
    }
  };

  // Login function
  const login = async () => {
    if (!web3auth) {
      setError("Web3Auth not initialized yet.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const provider = await web3auth.connect();
      setProvider(provider);
      
      if (provider) {
        const userInfo = await web3auth.getUserInfo();
        setUser(userInfo);
        
        const { address } = await setUpEthers(provider);
        
        // Try to login with the backend
        try {
          const response = await apiClient.post('/auth/login', {
            web3AuthId: userInfo.verifierId,
            walletAddress: address
          });
          
          if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            setIsAuthenticated(true);
            setUserRole(response.data.user.role);
            navigate('/dashboard');
          }
        } catch (error) {
          // If login fails, likely user not registered
          console.log("Login failed, redirecting to registration");
          navigate('/register', { 
            state: { 
              userInfo, 
              walletAddress: address 
            } 
          });
        }
      }
    } catch (error) {
      console.error("Error logging in", error);
      setError("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Register function to connect with backend
  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/auth/register', userData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        setUserRole(response.data.user.role);
      }
      
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to update user role
  const updateUserRole = async (role: 'institution' | 'student') => {
    setUserRole(role);
  };

  // Refresh user info from backend
  const refreshUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setUserRole(null);
      return;
    }
    
    try {
      const response = await apiClient.get('/auth/profile');
      setIsAuthenticated(true);
      setUserRole(response.data.role);
    } catch (error) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUserRole(null);
    }
  };

  // Logout function
  const logout = async () => {
    if (!web3auth) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await web3auth.logout();
      setProvider(null);
      setEthersProvider(null);
      setSigner(null);
      setUser(null);
      setWalletAddress(null);
      setVerificationContract(null);
      setInstitutionContract(null);
      setIsAuthenticated(false);
      setUserRole(null);
      
      // Remove token from localStorage
      localStorage.removeItem('token');
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error("Error logging out", error);
      setError("Failed to logout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Create context value
  const contextValue: Web3AuthContextType = {
    isAuthenticated,
    isLoading,
    provider,
    ethersProvider,
    signer,
    user,
    walletAddress,
    verificationContract,
    institutionContract,
    login,
    logout,
    register,
    error,
    userRole,
    setUserRole: updateUserRole,
    refreshUserInfo
  };

  return (
    <Web3AuthContext.Provider value={contextValue}>
      {children}
    </Web3AuthContext.Provider>
  );
};