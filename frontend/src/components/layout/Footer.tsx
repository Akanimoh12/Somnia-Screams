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
    <footer className="bg-bg-secondary border-t border-border-color mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white ui-font mb-4">Somnia Screams</h3>
            <p className="text-text-secondary text-sm ui-font mb-4">
              A spooky Halloween mini-game on Somnia blockchain. Collect souls, battle spirits, and earn exclusive NFTs.
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
                    className={`text-text-secondary ${social.color} transition-colors`}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

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
                  >
                    <span className="text-white text-sm ui-font font-mono">
                      {contract.address}
                    </span>
                    {copiedAddress === contract.fullAddress ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-text-muted group-hover:text-accent-orange transition-colors" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white ui-font mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://docs.somniascreams.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-text-secondary hover:text-accent-orange transition-colors text-sm ui-font"
                >
                  <span>Documentation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/somniascreams"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-text-secondary hover:text-accent-orange transition-colors text-sm ui-font"
                >
                  <span>Community</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://somnia.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-text-secondary hover:text-accent-orange transition-colors text-sm ui-font"
                >
                  <span>Somnia Network</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://explorer.somnia.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-text-secondary hover:text-accent-orange transition-colors text-sm ui-font"
                >
                  <span>Block Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border-color">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-text-muted text-sm ui-font">
              © 2025 Somnia Screams. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <a href="/privacy" className="text-text-secondary hover:text-accent-orange transition-colors ui-font">
                Privacy Policy
              </a>
              <a href="/terms" className="text-text-secondary hover:text-accent-orange transition-colors ui-font">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
