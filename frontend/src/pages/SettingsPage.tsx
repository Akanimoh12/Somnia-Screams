import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import { 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX,
  Palette,
  Zap,
  Wallet,
  Network,
  LogOut,
  Copy,
  CheckCircle,
  Gauge,
  Sparkles,
  Eye,
  Type,
  Accessibility
} from 'lucide-react';
import { somniaDevnet } from '../config/chains';

type SettingsTab = 'game' | 'wallet' | 'accessibility';

export default function SettingsPage() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  
  // Active tab
  const [activeTab, setActiveTab] = useState<SettingsTab>('game');
  
  // Game Settings State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(70);
  const [theme, setTheme] = useState<'dark' | 'halloween' | 'neon'>('dark');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [performanceMode, setPerformanceMode] = useState(false);
  
  // Accessibility Settings State
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  // Wallet Settings State
  const [gasPrice, setGasPrice] = useState<'low' | 'medium' | 'high'>('medium');
  const [slippage, setSlippage] = useState(0.5);
  const [copied, setCopied] = useState(false);

  // Copy address to clipboard
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Switch to Somnia Network
  const handleSwitchNetwork = () => {
    if (switchChain) {
      switchChain({ chainId: somniaDevnet.id });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <SettingsIcon className="w-10 h-10 text-accent-orange" />
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-secondary">Customize your game experience</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab('game')}
          className={`px-6 py-3 font-bold transition-colors relative whitespace-nowrap ${
            activeTab === 'game'
              ? 'text-accent-orange'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Game Settings
          {activeTab === 'game' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-orange"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('accessibility')}
          className={`px-6 py-3 font-bold transition-colors relative whitespace-nowrap ${
            activeTab === 'accessibility'
              ? 'text-accent-orange'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Accessibility
          {activeTab === 'accessibility' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-orange"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-6 py-3 font-bold transition-colors relative whitespace-nowrap ${
            activeTab === 'wallet'
              ? 'text-accent-orange'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Wallet Settings
          {activeTab === 'wallet' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-orange"
            />
          )}
        </button>
      </div>

      {/* Settings Content */}
      <div className="min-h-[500px]">
        {/* Game Settings Tab */}
        {activeTab === 'game' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Sound Effects */}
            <div className="bg-bg-secondary rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {soundEnabled ? (
                    <Volume2 className="w-6 h-6 text-accent-orange" />
                  ) : (
                    <VolumeX className="w-6 h-6 text-text-secondary" />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Sound Effects</h3>
                    <p className="text-sm text-text-secondary">
                      Enable or disable game sound effects
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    soundEnabled ? 'bg-accent-orange' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: soundEnabled ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>

              {/* Volume Slider */}
              {soundEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-4 border-t border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-text-primary">Volume</label>
                    <span className="text-sm font-bold text-accent-orange">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-accent-orange"
                  />
                </motion.div>
              )}
            </div>

            {/* Theme Selection */}
            <div className="bg-bg-secondary rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="w-6 h-6 text-accent-purple" />
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Theme</h3>
                  <p className="text-sm text-text-secondary">Choose your visual theme</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'dark', name: 'Dark', color: 'bg-gray-900', border: 'border-gray-700' },
                  { id: 'halloween', name: 'Halloween', color: 'bg-orange-900', border: 'border-orange-700' },
                  { id: 'neon', name: 'Neon', color: 'bg-purple-900', border: 'border-purple-700' },
                ].map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id as typeof theme)}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      theme === themeOption.id
                        ? 'border-accent-orange bg-accent-orange/10'
                        : `${themeOption.border} hover:border-accent-orange/50`
                    }`}
                  >
                    <div className={`w-full h-12 rounded ${themeOption.color} mb-2`} />
                    <p className="text-sm font-medium text-text-primary">{themeOption.name}</p>
                    {theme === themeOption.id && (
                      <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-accent-orange" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Animation Preferences */}
            <div className="bg-bg-secondary rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-accent-purple" />
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Animations</h3>
                    <p className="text-sm text-text-secondary">
                      Enable smooth transitions and effects
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAnimationsEnabled(!animationsEnabled)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    animationsEnabled ? 'bg-accent-purple' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: animationsEnabled ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>
            </div>

            {/* Performance Mode */}
            <div className="bg-bg-secondary rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Performance Mode</h3>
                    <p className="text-sm text-text-secondary">
                      Reduce visual effects for better performance
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPerformanceMode(!performanceMode)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    performanceMode ? 'bg-yellow-400' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: performanceMode ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>
              {performanceMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/30"
                >
                  <p className="text-sm text-yellow-400">
                    ⚡ Performance mode is active. Particle effects and background animations are reduced.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Accessibility Settings Tab */}
        {activeTab === 'accessibility' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Reduced Motion */}
            <div className="bg-bg-secondary rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Accessibility className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Reduced Motion</h3>
                    <p className="text-sm text-text-secondary">
                      Minimize animations for better comfort
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    reducedMotion ? 'bg-blue-400' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: reducedMotion ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>
              {reducedMotion && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 bg-blue-400/10 rounded-lg border border-blue-400/30"
                >
                  <p className="text-sm text-blue-400">
                    ♿ Reduced motion is active. Page transitions and decorative animations are minimized.
                  </p>
                </motion.div>
              )}
            </div>

            {/* High Contrast Mode */}
            <div className="bg-bg-secondary rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-purple-400" />
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">High Contrast Mode</h3>
                    <p className="text-sm text-text-secondary">
                      Increase color contrast for better visibility
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    highContrast ? 'bg-purple-400' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: highContrast ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>
              {highContrast && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 bg-purple-400/10 rounded-lg border border-purple-400/30"
                >
                  <p className="text-sm text-purple-400">
                    👁️ High contrast mode is active. Text and UI elements have enhanced contrast ratios.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Font Size Adjustment */}
            <div className="bg-bg-secondary rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Type className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Font Size</h3>
                  <p className="text-sm text-text-secondary">Adjust text size for better readability</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'small', name: 'Small', size: 'text-sm' },
                  { id: 'medium', name: 'Medium', size: 'text-base' },
                  { id: 'large', name: 'Large', size: 'text-lg' },
                ].map((sizeOption) => (
                  <button
                    key={sizeOption.id}
                    onClick={() => setFontSize(sizeOption.id as typeof fontSize)}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      fontSize === sizeOption.id
                        ? 'bg-green-400 text-white'
                        : 'bg-bg-primary text-text-secondary hover:bg-bg-primary/80'
                    }`}
                  >
                    <span className={sizeOption.size}>{sizeOption.name}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 p-4 bg-bg-primary rounded-lg border border-border">
                <p className={`text-text-primary ${fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base'}`}>
                  Preview: This is how text will appear with your selected font size. 
                  "The spirits whisper in the darkness, collecting souls in Somnia Screams."
                </p>
              </div>
            </div>

            {/* Accessibility Info */}
            <div className="bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-lg p-6 border border-blue-400/30">
              <div className="flex items-start gap-3">
                <Accessibility className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-text-primary">Accessibility Features</h3>
                  <p className="text-sm text-text-secondary">
                    We're committed to making Somnia Screams accessible to everyone. These settings help 
                    improve your experience based on your needs and preferences.
                  </p>
                  <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside pl-2">
                    <li>All interactive elements have keyboard navigation support</li>
                    <li>Screen reader compatible with ARIA labels</li>
                    <li>Color-blind friendly color schemes</li>
                    <li>Adjustable text sizes for better readability</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Wallet Settings Tab */}
        {activeTab === 'wallet' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {isConnected ? (
              <>
                {/* Connected Wallet Info */}
                <div className="bg-bg-secondary rounded-lg p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Wallet className="w-6 h-6 text-accent-orange" />
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">Connected Wallet</h3>
                      <p className="text-sm text-text-secondary">Your active wallet address</p>
                    </div>
                  </div>
                  <div className="bg-bg-primary rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-text-secondary mb-1">Address</p>
                        <p className="font-mono text-text-primary">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </p>
                      </div>
                      <button
                        onClick={copyAddress}
                        className="flex items-center gap-2 px-4 py-2 bg-accent-orange/10 hover:bg-accent-orange/20 rounded-lg transition-colors"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-green-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-accent-orange" />
                            <span className="text-sm font-medium text-accent-orange">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Network Selection */}
                <div className="bg-bg-secondary rounded-lg p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Network className="w-6 h-6 text-accent-purple" />
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">Network</h3>
                      <p className="text-sm text-text-secondary">Select your blockchain network</p>
                    </div>
                  </div>
                  <div className="bg-bg-primary rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-text-secondary mb-1">Current Network</p>
                        <p className="font-medium text-text-primary">
                          {chain?.name || 'Unknown Network'}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          chain?.id === somniaDevnet.id
                            ? 'bg-green-400/20 text-green-400'
                            : 'bg-red-400/20 text-red-400'
                        }`}
                      >
                        {chain?.id === somniaDevnet.id ? 'Connected' : 'Wrong Network'}
                      </div>
                    </div>
                    {chain?.id !== somniaDevnet.id && (
                      <button
                        onClick={handleSwitchNetwork}
                        className="w-full px-4 py-2 bg-accent-orange hover:bg-accent-orange/80 text-white font-bold rounded-lg transition-colors"
                      >
                        Switch to Somnia Network
                      </button>
                    )}
                  </div>
                </div>

                {/* Transaction Settings */}
                <div className="bg-bg-secondary rounded-lg p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Gauge className="w-6 h-6 text-blue-400" />
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">Transaction Settings</h3>
                      <p className="text-sm text-text-secondary">Customize gas and slippage</p>
                    </div>
                  </div>

                  {/* Gas Price */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Gas Price Priority
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['low', 'medium', 'high'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setGasPrice(option as typeof gasPrice)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            gasPrice === option
                              ? 'bg-accent-orange text-white'
                              : 'bg-bg-primary text-text-secondary hover:bg-bg-primary/80'
                          }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-text-secondary mt-2">
                      {gasPrice === 'low' && '⏱️ Slower transactions, lower fees'}
                      {gasPrice === 'medium' && '⚖️ Balanced speed and cost'}
                      {gasPrice === 'high' && '⚡ Faster transactions, higher fees'}
                    </p>
                  </div>

                  {/* Slippage Tolerance */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-text-primary">
                        Slippage Tolerance
                      </label>
                      <span className="text-sm font-bold text-accent-orange">{slippage}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="5"
                      step="0.1"
                      value={slippage}
                      onChange={(e) => setSlippage(Number(e.target.value))}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-accent-orange"
                    />
                    <p className="text-xs text-text-secondary mt-2">
                      Maximum price difference accepted during trades
                    </p>
                  </div>
                </div>

                {/* Disconnect Wallet */}
                <div className="bg-bg-secondary rounded-lg p-6 border border-red-400/30">
                  <div className="flex items-center gap-3 mb-4">
                    <LogOut className="w-6 h-6 text-red-400" />
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">Disconnect Wallet</h3>
                      <p className="text-sm text-text-secondary">
                        Disconnect your wallet from the application
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Disconnect Wallet
                  </button>
                </div>
              </>
            ) : (
              // Not Connected State
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-bg-secondary rounded-lg p-12 border border-border text-center"
              >
                <Wallet className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-text-primary mb-2">No Wallet Connected</h3>
                <p className="text-text-secondary mb-6">
                  Connect your wallet to access wallet settings and manage your transactions.
                </p>
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent-orange hover:bg-accent-orange/80 text-white font-bold rounded-lg transition-colors"
                >
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </a>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
