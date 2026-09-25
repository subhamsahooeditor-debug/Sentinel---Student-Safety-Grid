import React, { useState } from 'react';
import { ScrewHead } from './ScrewHead.tsx';
import { GCEK_CONTACTS } from '../data/contacts.ts';
import { ContactCategory, ContactItem } from '../types.ts';
import { soundManager } from '../utils/audio.ts';
import {
  PhoneCall,
  Search,
  Copy,
  Check,
  Building,
  Home,
  Shield,
  BookOpen,
} from 'lucide-react';

export const HelplineDirectory: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ContactCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: { key: ContactCategory | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'all', label: 'ALL NUMBERS', icon: PhoneCall },
    { key: 'security', label: 'SECURITY POSTS', icon: Shield },
    { key: 'hostel', label: 'HOSTEL WARDENS', icon: Home },
    { key: 'admin', label: 'ADMIN & DEANS', icon: Building },
    { key: 'hod', label: 'DEPT HEADS (HODs)', icon: BookOpen },
  ];

  const handleCopyNumber = (contact: ContactItem) => {
    soundManager.playClickTick();
    navigator.clipboard.writeText(contact.phone);
    setCopiedId(contact.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredContacts = GCEK_CONTACTS.filter((contact) => {
    const matchesCategory = activeCategory === 'all' || contact.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch =
      contact.title.toLowerCase().includes(query) ||
      (contact.name && contact.name.toLowerCase().includes(query)) ||
      contact.phone.toLowerCase().includes(query) ||
      contact.displayPhone.toLowerCase().includes(query) ||
      (contact.badge && contact.badge.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div
      id="emergency-directory-section"
      className="relative neu-card rounded-2xl p-5 mb-6 border border-white/40 overflow-hidden"
    >
      {/* 4 Corner Screws */}
      <div className="absolute top-3 left-3">
        <ScrewHead id="dir-screw-tl" rotation="default" />
      </div>
      <div className="absolute top-3 right-3">
        <ScrewHead id="dir-screw-tr" rotation="alt" />
      </div>
      <div className="absolute bottom-3 left-3">
        <ScrewHead id="dir-screw-bl" rotation="alt2" />
      </div>
      <div className="absolute bottom-3 right-3">
        <ScrewHead id="dir-screw-br" rotation="default" />
      </div>

      {/* Directory Title & Subtitle */}
      <div className="flex items-center justify-between border-b border-[#d1d9e6] pb-3 mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff4757] shadow-[0_0_6px_#ff4757]" />
          <h2 className="font-mono text-xs font-bold tracking-wider text-[#2d3436] uppercase">
            CAMPUS EMERGENCY HELPLINE DIRECTORY
          </h2>
        </div>
        <span className="text-[10px] font-mono text-[#4a5568] px-2 py-0.5 rounded neu-recessed">
          DIRECT CLICK-TO-CALL
        </span>
      </div>

      {/* Search Input Filter */}
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#8c96a8]">
          <Search className="w-4 h-4" />
        </div>
        <input
          id="search-emergency-directory"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter contacts (e.g. DSW, Warden, Main Gate, CSE, Security)..."
          className="w-full neu-recessed pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-mono text-[#2d3436] placeholder-[#8c96a8] outline-none border border-transparent focus:border-[#4a5568]/40 transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-xs font-mono text-[#4a5568] hover:text-[#2d3436] cursor-pointer"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => {
                soundManager.playClickTick();
                setActiveCategory(cat.key);
              }}
              className={`px-3 py-2 rounded-xl text-[11px] font-mono whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'neu-pressed text-[#ff4757] font-bold'
                  : 'neu-button text-[#2d3436] hover:text-[#ff4757]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Itemized Contact Cards Grid */}
      <div className="space-y-3">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-6 neu-recessed rounded-xl text-xs font-mono text-[#4a5568]">
            No emergency contacts match &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              id={`contact-${contact.id}`}
              className="neu-card-flat rounded-xl p-3.5 border border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* Left Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h3 className="text-sm font-semibold text-[#2d3436]">
                    {contact.title}
                  </h3>
                  {contact.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#d1d9e6] text-[#4a5568] font-medium">
                      {contact.badge}
                    </span>
                  )}
                </div>

                {contact.name && (
                  <p className="text-xs text-[#4a5568] font-medium">
                    {contact.name}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-1.5 text-xs font-mono text-[#2d3436]">
                  <span className="font-bold tracking-wider">
                    {contact.displayPhone}
                  </span>
                  {contact.timing && (
                    <span className="text-[10px] text-[#4a5568] border-l border-[#babecc] pl-2">
                      {contact.timing}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Call and Copy */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {/* Copy Number */}
                <button
                  type="button"
                  onClick={() => handleCopyNumber(contact)}
                  className="p-2.5 rounded-lg neu-button text-[#4a5568] hover:text-[#2d3436] cursor-pointer"
                  title="Copy Phone Number"
                  aria-label={`Copy phone number for ${contact.title}`}
                >
                  {copiedId === contact.id ? (
                    <Check className="w-4 h-4 text-[#10b981]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                {/* Direct Click-to-Call Link with Braun Safety Red */}
                <a
                  href={`tel:${contact.phone}`}
                  onClick={() => soundManager.playClickTick()}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4757] to-[#d63031] text-white shadow-[4px_4px_10px_#babecc,-4px_-4px_10px_#ffffff] hover:opacity-95 active:translate-y-[1px] flex items-center gap-2 text-xs font-mono font-bold tracking-wider cursor-pointer"
                  aria-label={`Call ${contact.title} at ${contact.displayPhone}`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>CALL</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
