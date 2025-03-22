/* eslint-disable @typescript-eslint/no-explicit-any */
// src/contexts/Web3AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { ethers } from 'ethers';
import { credentialVerificationABI, getContractAddress } from '../config/contract';

// Define our context type
type Web3AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  provider: IProvider | null;
  ethersProvider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  user: any | null;
  userRole: 'institution' | 'student' | null;
  walletAddress: string | null;
  verificationContract: ethers.Contract | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setUserRole: (role: 'institution' | 'student') => Promise<void>;
  error: string | null;
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
  login: async () => {},
  logout: async () => {},
  error: null,
  setUserRole: async () => {},
  userRole: null,
});

// Custom hook to use the Web3Auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useWeb3Auth = () => useContext(Web3AuthContext);

// Define Web3Auth configuration
const clientId = "BFGQKwBPuTNOiNTFlrUUsTXSzk0niUJ84_rBHiyTlnKbMA16a2K25JcoVXdRFd1NKqPuF8ENUJYzCETO6QejXOk"; // You'll need to get this from Web3Auth dashboard

// Define props for the provider component
type Web3AuthProviderProps = {
  children: ReactNode;
};

// Create the provider component
export const Web3AuthProvider: React.FC<Web3AuthProviderProps> = ({ children }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [ethersProvider, setEthersProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [verificationContract, setVerificationContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'institution' | 'student'| null>("institution");


  // Initialize Web3Auth
  useEffect(() => {
    const init = async () => {
      try {
        // Clear previous error
        setError(null);
        
        // Configure the private key provider
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: {
            chainConfig: {
              chainNamespace: CHAIN_NAMESPACES.EIP155,
              chainId: "0x1", // Ethereum mainnet (use testnet IDs for development)
              rpcTarget: "https://rpc.ankr.com/eth/f60707a1cd6cb1f7e5af5ff6660772cb84dda52ff71fa7fb99f68484628394d2", // Public RPC target
            }
          }
        });

        // Create and configure Web3Auth
        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: "sapphire_devnet", // Use "mainnet" for production
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1", // Ethereum mainnet 
            rpcTarget: "https://rpc.ankr.com/eth/f60707a1cd6cb1f7e5af5ff6660772cb84dda52ff71fa7fb99f68484628394d2",
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

        // Check if user is already logged in
        if (web3authInstance.connected) {
          const provider = web3authInstance.provider;
          setProvider(provider);
          const userInfo = await web3authInstance.getUserInfo();
          setUser(userInfo);
          setIsAuthenticated(true);
          
          if (provider) {
            await setUpEthers(provider);
          }
        }
      } catch (error) {
        console.error("Failed to initialize Web3Auth", error);
        setError("Failed to initialize Web3Auth. Please try again later.");
      }
    };

    init();
  }, []);

  // Helper function to set up ethers with the provider
  const setUpEthers = async (provider: IProvider) => {
    try {
      const ethersProviderInstance = new ethers.BrowserProvider(provider as any);
      setEthersProvider(ethersProviderInstance);
      
      const signerInstance = await ethersProviderInstance.getSigner();
      setSigner(signerInstance);
      
      const address = await signerInstance.getAddress();
      setWalletAddress(address);
      
      // Get the chain ID
      const network = await ethersProviderInstance.getNetwork();
      const chainId = Number(network.chainId);
      
      // Create contract instance
      const contractAddress = getContractAddress(chainId);
      const contract = new ethers.Contract(
        contractAddress,
        credentialVerificationABI,
        signerInstance
      );
      setVerificationContract(contract);
    } catch (error) {
      console.error("Error setting up ethers", error);
      setError("Failed to connect to the blockchain. Please try again.");
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
        setIsAuthenticated(true);
        await setUpEthers(provider);
      }
    } catch (error) {
      console.error("Error logging in", error);
      setError("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (role: 'institution' | 'student') => {
    // In a real implementation, this would make an API call to update the user's role
    // For now, we'll just set it in the state
    setUserRole("institution");
    
    // Here you would store this information in your backend
    console.log(`User role set to: ${role}`);
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
      setIsAuthenticated(false);
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
    login,
    logout,
    error,
    userRole,
    setUserRole: updateUserRole,
  };

  return (
    <Web3AuthContext.Provider value={contextValue}>
      {children}
    </Web3AuthContext.Provider>
  );
};