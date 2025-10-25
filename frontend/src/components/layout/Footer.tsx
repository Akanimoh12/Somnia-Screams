// Credits and links
import { motion } from 'framer-motion';
import { Github, Twitter, MessageCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const socialLinks = [
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/somniascreams', color: 'hover:text-blue-400' },
  { icon: MessageCircle, label: 'Discord', href: 'https://discord.gg/somniascreams', color: 'hover:text-indigo-400' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/somniascreams', color: 'hover:text-gray-400' },
];

const contractAddresses = [
  { label: 'Game Contract', address: '0x1234...5678', fullAddress: '0x1234567890abcdef1234567890abcdef12345678' },
  { label: 'NFT Contract', address: '0xabcd...ef01', fullAddress: '0xabcdef0123456789abcdef0123456789abcdef01' },
];

export default function Footer() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <footer className="bg-bg-secondary border-t border-border-color mt-auto">
      <div className="
        w-full
        px-4 py-8
        sm:px-6 sm:py-10
        lg:px-8 lg:py-12
        max-w-7xl mx-auto
      ">
        {/* Main Footer Content - Responsive Grid */}
        <div className="
          grid gap-8
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
        ">
          {/* Column 1: About & Social Links */}
          <div>
            <h3 className="text-lg font-bold text-white ui-font mb-4">Somnia Screams</h3>
            <p className="text-text-secondary text-sm ui-font mb-4 leading-relaxed">
              A spooky Halloween mini-game on Somnia blockchain. Collect souls, battle spirits, and earn exclusive NFTs every 2 minutes.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`text-text-secondary ${social.color} transition-colors`}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Contract Addresses with Copy */}
          <div>
            <h3 className="text-lg font-bold text-white ui-font mb-4">Contract Addresses</h3>
            <div className="space-y-3">
              {contractAddresses.map((contract) => (
                <div key={contract.label}>
                  <p className="text-text-secondary text-xs ui-font mb-1">{contract.label}</p>
                  <button
                    onClick={() => copyAddress(contract.fullAddress)}
                    className="
                      flex items-center justify-between w-full
                      px-3 py-2 rounded-lg bg-bg-card
                      hover:bg-bg-primary transition-colors
                      group
                    "
                    title={`Copy ${contract.fullAddress}`}
                  >
                    <span className="text-white text-sm ui-font font-mono">
                      {contract.address}
                    </span>
                    <motion.div
                      initial={false}
                      animate={copiedAddress === contract.fullAddress ? { scale: [1, 1.2, 1] } : {}}
                    >
                      {copiedAddress === contract.fullAddress ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-text-muted group-hover:text-accent-orange transition-colors" />
                      )}
                    </motion.div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Resources & Links */}
          <div>
            <h3 className="text-lg font-bold text-white ui-font mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://docs.somniascreams.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-text-secondary hover:text-accent-orange transition-colors text-sm ui-font group"
                >
                  <span>Documentation</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/somniascreams"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-text-secondary hover:text-accent-orange transition-colors text-sm ui-font group"
                >
                  <span>Community Discord</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="https://somnia.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-text-secondary hover:text-accent-orange transition-colors text-sm ui-font group"
                >
                  <span>Somnia Network</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href="https://explorer.somnia.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-text-secondary hover:text-accent-orange transition-colors text-sm ui-font group"
                >
                  <span>Block Explorer</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Copyright & Legal Links */}
        <div className="mt-8 pt-8 border-t border-border-color">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-text-muted text-sm ui-font text-center md:text-left">
              © 2025 Somnia Screams. Built with 💀 on Somnia Devnet. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <a 
                href="/privacy" 
                className="text-text-secondary hover:text-accent-orange transition-colors ui-font"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-text-secondary hover:text-accent-orange transition-colors ui-font"
              >
                Terms of Service
              </a>
              <a 
                href="https://github.com/somniascreams" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-orange transition-colors ui-font flex items-center space-x-1"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
