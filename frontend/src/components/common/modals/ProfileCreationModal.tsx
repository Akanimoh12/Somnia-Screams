/**
 * Profile Creation Modal
 * 
 * Welcome modal for new players to create their game profile.
 * Handles two-step transaction flow: register() then createProfile()
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, AlertCircle, Sparkles, Trophy, Skull } from 'lucide-react';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { usePlayerRegistration } from '../../../hooks/usePlayerRegistration';

interface ProfileCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ProfileCreationModal({ isOpen, onClose, onSuccess }: ProfileCreationModalProps) {
  const {
    register,
    isRegistering,
    isCreatingProfile,
    createProfileSuccess,
    registrationError,
    profileCreationError,
    registrationStep,
    registerHash,
    createProfileHash,
  } = usePlayerRegistration();

  const [showConfetti, setShowConfetti] = useState(false);
  const [username, setUsername] = useState('');

  // Show confetti on success
  useEffect(() => {
    if (createProfileSuccess) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        if (onSuccess) {
          onSuccess();
        }
      }, 5000);
    }
  }, [createProfileSuccess, onSuccess]);

  const handleCreateProfile = async () => {
    if (!username.trim()) {
      return;
    }
    await register();
  };

  const handleRetry = () => {
    if (registrationError) {
      register();
    }
  };

  const getStepContent = () => {
    // Step 1: Registering
    if (registrationStep === 'registering') {
      return (
        <div className="text-center py-8">
          <div className="mb-6">
            <Loader2 className="w-16 h-16 text-accent-orange mx-auto animate-spin" />
          </div>
          <h3 className="text-xl font-bold header-font text-white mb-2">
            Registering Your Account
          </h3>
          <p className="text-sm ui-font text-text-secondary mb-4">
            Transaction 1 of 2: Registering your wallet address...
          </p>
          {registerHash && (
            <a
              href={`https://explorer.somnia.network/tx/${registerHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent-purple hover:underline"
            >
              View Transaction
            </a>
          )}
        </div>
      );
    }

    // Step 2: Creating Profile
    if (registrationStep === 'creating') {
      return (
        <div className="text-center py-8">
          <div className="mb-6">
            <Loader2 className="w-16 h-16 text-accent-purple mx-auto animate-spin" />
          </div>
          <h3 className="text-xl font-bold header-font text-white mb-2">
            Creating Your Profile
          </h3>
          <p className="text-sm ui-font text-text-secondary mb-4">
            Transaction 2 of 2: Setting up your game profile...
          </p>
          {createProfileHash && (
            <a
              href={`https://explorer.somnia.network/tx/${createProfileHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent-purple hover:underline"
            >
              View Transaction
            </a>
          )}
        </div>
      );
    }

    // Step 3: Success
    if (registrationStep === 'complete') {
      return (
        <div className="text-center py-8">
          {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
          <div className="mb-6">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto" />
          </div>
          <h3 className="text-2xl font-bold header-font text-accent-orange mb-2">
            Welcome to Somnia Screams! 🎃
          </h3>
          <p className="text-sm ui-font text-text-secondary mb-6">
            Your profile has been created successfully!
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-bg-card p-4 rounded-lg border border-border-color">
              <Trophy className="w-8 h-8 text-accent-orange mx-auto mb-2" />
              <p className="text-xs text-text-muted">Earn Rewards</p>
            </div>
            <div className="bg-bg-card p-4 rounded-lg border border-border-color">
              <Skull className="w-8 h-8 text-accent-purple mx-auto mb-2" />
              <p className="text-xs text-text-muted">Battle Spirits</p>
            </div>
            <div className="bg-bg-card p-4 rounded-lg border border-border-color">
              <Sparkles className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-xs text-text-muted">Collect NFTs</p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              globalThis.location.href = '/game-arena';
            }}
            className="w-full bg-linear-to-r from-accent-orange to-accent-purple text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Playing
          </button>
        </div>
      );
    }

    // Error State
    if (registrationError || profileCreationError) {
      return (
        <div className="text-center py-8">
          <div className="mb-6">
            <AlertCircle className="w-16 h-16 text-error mx-auto" />
          </div>
          <h3 className="text-xl font-bold header-font text-white mb-2">
            Transaction Failed
          </h3>
          <p className="text-sm ui-font text-text-secondary mb-4">
            {registrationError || profileCreationError}
          </p>
          <button
            onClick={handleRetry}
            className="w-full bg-accent-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-accent-orange/90 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    // Initial Form
    return (
      <div>
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-linear-to-br from-accent-orange to-accent-purple rounded-full flex items-center justify-center mx-auto mb-4">
            <Skull className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold header-font text-accent-orange mb-2">
            Welcome to Somnia Screams!
          </h2>
          <p className="text-sm ui-font text-text-secondary">
            Enter the haunted manor and begin your journey
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="username-input" className="block text-sm font-bold ui-font text-white mb-2">
              Choose Your Name
            </label>
            <input
              id="username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username..."
              maxLength={20}
              className="w-full bg-bg-card border-2 border-border-color rounded-lg px-4 py-3 text-white ui-font focus:outline-none focus:border-accent-orange transition-colors"
            />
            <p className="text-xs text-text-muted mt-1">
              This is stored locally and can be changed later
            </p>
          </div>

          <div className="bg-bg-secondary border border-border-color rounded-lg p-4">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-orange" />
              What's Next?
            </h3>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent-orange">•</span>
                <span>Register your wallet (Transaction 1)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-orange">•</span>
                <span>Create your profile (Transaction 2)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-orange">•</span>
                <span>Start exploring the haunted manor!</span>
              </li>
            </ul>
          </div>

          <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
            <p className="text-xs text-warning">
              <strong>Note:</strong> This will require 2 transactions. Please approve both to complete your profile setup.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateProfile}
          disabled={!username.trim() || isRegistering || isCreatingProfile}
          className="w-full bg-linear-to-r from-accent-orange to-accent-purple text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRegistering || isCreatingProfile ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Profile...
            </span>
          ) : (
            'Create Profile'
          )}
        </button>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              // Only allow close if not in transaction
              if (!isRegistering && !isCreatingProfile) {
                onClose();
              }
            }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-bg-primary border-2 border-border-color rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button - only show if not in transaction */}
            {!isRegistering && !isCreatingProfile && registrationStep !== 'complete' && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}

            <div className="p-6">
              {getStepContent()}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
