// ABI for your credential verification smart contract
export const credentialVerificationABI = [
    // This is a placeholder - replace with your actual contract ABI
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "credentialId",
          "type": "string"
        }
      ],
      "name": "verifyCredential",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isValid",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "institution",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "studentName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "credentialType",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
  // Contract addresses for different networks
  export const contractAddresses = {
    development: "0x0000000000000000000000000000000000000000", // Placeholder for local development
    testnet: "0x0000000000000000000000000000000000000000",    // Placeholder for testnet (e.g., Goerli)
    mainnet: "0x0000000000000000000000000000000000000000",    // Placeholder for mainnet
  };
  
  // Helper function to get the appropriate contract address based on the current network
  export const getContractAddress = (chainId: number): string => {
    // Map chainId to appropriate network
    if (chainId === 1337 || chainId === 31337) {
      return contractAddresses.development;
    } else if (chainId === 5) {  // Goerli testnet
      return contractAddresses.testnet;
    } else if (chainId === 1) {  // Ethereum mainnet
      return contractAddresses.mainnet;
    }
    
    // Default to development
    return contractAddresses.development;
  };