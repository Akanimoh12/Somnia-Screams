/**
 * Player Registration Hook
 * 
 * Handles new player onboarding by checking registration status
 * and providing functions to register and create profiles.
 * 
 * Flow:
 * 1. Check if player is registered in PlayerRegistry
 * 2. If not registered, call register() to register address
 * 3. Then call createProfile() to initialize PlayerProfile data
 * 4. Store completion flag in localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '../contracts/addresses';
import { PlayerRegistryABI, PlayerProfileABI } from '../contracts/abis';

const STORAGE_KEY_PREFIX = 'profile-created-';

export const usePlayerRegistration = () => {
  const { address, isConnected } = useAccount();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [profileCreationError, setProfileCreationError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // Manually controlled

  // Check if player is registered
  const { 
    data: isRegistered, 
    isLoading: checkingRegistration,
    refetch: refetchRegistration 
  } = useReadContract({
    address: CONTRACTS.PlayerRegistry as `0x${string}`,
    abi: PlayerRegistryABI,
    functionName: 'isRegistered',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.PlayerRegistry,
    },
  });

  // Register player write contract
  const { 
    data: registerHash,
    writeContract: registerWrite,
    isPending: registerPending,
    error: registerWriteError,
  } = useWriteContract();

  // Wait for register transaction
  const { 
    isLoading: registerConfirming,
    isSuccess: registerSuccess,
  } = useWaitForTransactionReceipt({
    hash: registerHash,
  });

  // Create profile write contract
  const { 
    data: createProfileHash,
    writeContract: createProfileWrite,
    isPending: createProfilePending,
    error: createProfileWriteError,
  } = useWriteContract();

  // Wait for create profile transaction
  const { 
    isLoading: createProfileConfirming,
    isSuccess: createProfileSuccess,
  } = useWaitForTransactionReceipt({
    hash: createProfileHash,
  });

  // Check localStorage for profile creation flag
  const getProfileCreatedFlag = useCallback(() => {
    if (!address) return false;
    const key = `${STORAGE_KEY_PREFIX}${address.toLowerCase()}`;
    return localStorage.getItem(key) === 'true';
  }, [address]);

  // Set profile created flag in localStorage
  const setProfileCreatedFlag = useCallback(() => {
    if (!address) return;
    const key = `${STORAGE_KEY_PREFIX}${address.toLowerCase()}`;
    localStorage.setItem(key, 'true');
  }, [address]);

  // Register player function
  const register = useCallback(async () => {
    if (!address || !CONTRACTS.PlayerRegistry) {
      setRegistrationError('Wallet not connected or contract not found');
      return;
    }

    try {
      setIsRegistering(true);
      setRegistrationError(null);

      registerWrite({
        address: CONTRACTS.PlayerRegistry as `0x${string}`,
        abi: PlayerRegistryABI,
        functionName: 'register',
        args: [],
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      setRegistrationError(error.message || 'Failed to register player');
      setIsRegistering(false);
    }
  }, [address, registerWrite]);

  // Create profile function
  const createProfile = useCallback(async () => {
    if (!address || !CONTRACTS.PlayerProfile) {
      setProfileCreationError('Wallet not connected or contract not found');
      return;
    }

    try {
      setIsCreatingProfile(true);
      setProfileCreationError(null);

      createProfileWrite({
        address: CONTRACTS.PlayerProfile as `0x${string}`,
        abi: PlayerProfileABI,
        functionName: 'createProfile',
        args: [address],
      });
    } catch (error: any) {
      console.error('Profile creation error:', error);
      setProfileCreationError(error.message || 'Failed to create profile');
      setIsCreatingProfile(false);
    }
  }, [address, createProfileWrite]);

  // Handle register transaction completion
  useEffect(() => {
    if (registerSuccess) {
      console.log('Registration successful!');
      setIsRegistering(false);
      // Automatically create profile after registration
      createProfile();
    }
  }, [registerSuccess, createProfile]);

  // Handle create profile transaction completion
  useEffect(() => {
    if (createProfileSuccess) {
      console.log('Profile creation successful!');
      setIsCreatingProfile(false);
      setProfileCreatedFlag();
      refetchRegistration();
      // Auto-close modal after success
      setTimeout(() => setShowModal(false), 3000);
    }
  }, [createProfileSuccess, setProfileCreatedFlag, refetchRegistration]);

  // Handle register errors
  useEffect(() => {
    if (registerWriteError) {
      setRegistrationError(registerWriteError.message || 'Transaction failed');
      setIsRegistering(false);
    }
  }, [registerWriteError]);

  // Handle create profile errors
  useEffect(() => {
    if (createProfileWriteError) {
      setProfileCreationError(createProfileWriteError.message || 'Transaction failed');
      setIsCreatingProfile(false);
    }
  }, [createProfileWriteError]);

  // Determine if modal should be shown
  const shouldShowModal = 
    isConnected && 
    !checkingRegistration && 
    !isRegistered && 
    !getProfileCreatedFlag() &&
    showModal; // Only show if manually triggered

  // Function to check if registration is needed and show modal
  const checkAndShowRegistration = useCallback(() => {
    console.log('🔍 [usePlayerRegistration] checkAndShowRegistration called');
    console.log('🔍 [usePlayerRegistration] isConnected:', isConnected);
    console.log('🔍 [usePlayerRegistration] isRegistered:', isRegistered);
    console.log('🔍 [usePlayerRegistration] checkingRegistration:', checkingRegistration);
    console.log('🔍 [usePlayerRegistration] getProfileCreatedFlag():', getProfileCreatedFlag());
    console.log('🔍 [usePlayerRegistration] showModal:', showModal);
    console.log('🔍 [usePlayerRegistration] shouldShowModal:', shouldShowModal);
    
    if (isConnected && !isRegistered && !getProfileCreatedFlag()) {
      console.log('✅ [usePlayerRegistration] Setting showModal to true');
      setShowModal(true);
      return true; // Registration needed
    }
    console.log('✅ [usePlayerRegistration] Already registered or profile created');
    return false; // Already registered
  }, [isConnected, isRegistered, getProfileCreatedFlag, showModal, shouldShowModal]);

  // Combined loading state
  const isLoading = 
    checkingRegistration ||
    isRegistering ||
    registerPending ||
    registerConfirming ||
    isCreatingProfile ||
    createProfilePending ||
    createProfileConfirming;

  // Current step in registration flow
  const getRegistrationStep = (): 'idle' | 'registering' | 'creating' | 'complete' => {
    if (createProfileSuccess) return 'complete';
    if (isCreatingProfile || createProfilePending || createProfileConfirming) return 'creating';
    if (isRegistering || registerPending || registerConfirming) return 'registering';
    return 'idle';
  };

  return {
    // Registration status
    isRegistered: !!isRegistered,
    checkingRegistration,
    shouldShowModal,
    showModal,
    setShowModal,
    checkAndShowRegistration,
    
    // Actions
    register,
    createProfile,
    
    // Loading states
    isLoading,
    isRegistering: isRegistering || registerPending || registerConfirming,
    isCreatingProfile: isCreatingProfile || createProfilePending || createProfileConfirming,
    
    // Success states
    registerSuccess,
    createProfileSuccess,
    
    // Transaction hashes
    registerHash,
    createProfileHash,
    
    // Errors
    registrationError,
    profileCreationError,
    
    // Flow helpers
    registrationStep: getRegistrationStep(),
    profileCreatedFlag: getProfileCreatedFlag(),
    
    // Refetch
    refetchRegistration,
  };
};
