import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { ScrewHead } from './ScrewHead.tsx';
import {
  Download,
  Share2,
  PlusSquare,
  X,
  CheckCircle2,
  Smartphone,
  Shield,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Radio,
} from 'lucide-react';
import { soundManager } from '../utils/audio.ts';

interface PWAInstallButtonProps {
  variant?: 'banner' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'banner' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }
  }, []);

  const handleCopyLink = () => {
    soundManager.playClickTick();
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenDirect = () => {
    soundManager.playClickTick();
    window.open(window.location.href, '_blank', 'noopener,noreferrer');
  };

  // If already running in standalone mode (installed PWA)
  if (isInstalled) {
    if (variant === 'compact') {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg neu-recessed text-[10px] font-mono text-[#10b981] font-semibold">
          <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
          <span>APP INSTALLED</span>
        </div>
      );
    }
    return (
      <div className="neu-card rounded-xl p-3 mb-4 flex items-center justify-between border border-emerald-500/30">
        <div className="flex items-center gap-2 text-xs font-mono text-[#10b981] font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>RUNNING AS INSTALLED HOME SCREEN APP (OFFLINE ENABLED)</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded neu-pressed text-[#4a5568]">
          GCEK GRID OK
        </span>
      </div>
    );
  }

  // If user dismissed this banner in current session
  if (isDismissed && variant === 'banner') {
    return null;
  }

  // Compact variant for header or navbar
  if (variant === 'compact') {
    if (isInstallable) {
      return (
        <button
          type="button"
          onClick={() => {
            soundManager.playClickTick();
            install();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg neu-button text-xs font-mono font-bold text-[#ff4757] hover:text-[#d63031] cursor-pointer"
          title="Install Sentinel App to your phone or desktop"
        >
          <Download className="w-3.5 h-3.5" />
          <span>INSTALL</span>
        </button>
      );
    }

    return (
      <>
        <button
          type="button"
          onClick={() => {
            soundManager.playClickTick();
            setShowInstallGuide(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg neu-button text-xs font-mono font-bold text-[#2d3436] hover:text-[#ff4757] cursor-pointer"
          title="Download & Install App"
        >
          <Download className="w-3.5 h-3.5 text-[#ff4757]" />
          <span>INSTALL APP</span>
        </button>

        {showInstallGuide && (
          <InstallGuideModal
            isInstallable={isInstallable}
            isIOS={isIOS}
            isInIframe={isInIframe}
            onInstall={install}
            onCopyLink={handleCopyLink}
            onOpenDirect={handleOpenDirect}
            copied={copied}
            onClose={() => setShowInstallGuide(false)}
          />
        )}
      </>
    );
  }

  // Full Hero Banner Variant (Prominent tactile mobile download prompt)
  return (
    <section
      id="pwa-install-banner"
      aria-label="Install App Prompt"
      className="relative neu-card rounded-2xl p-4 mb-5 border border-white/60 shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] overflow-hidden"
    >
      {/* Corner Hardware Screws */}
      <div className="absolute top-2.5 left-2.5">
        <ScrewHead rotation="default" />
      </div>
      <div className="absolute top-2.5 right-2.5">
        <ScrewHead rotation="alt" />
      </div>

      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl neu-recessed flex items-center justify-center shrink-0 text-[#ff4757]">
            <Smartphone className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-[#2d3436]">
                INSTALL TO MOBILE HOME SCREEN
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded neu-pressed text-[#10b981] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                OFFLINE READY
              </span>
            </div>

            <p className="text-xs text-[#4a5568] mt-1 leading-relaxed">
              Install Sentinel directly to your Android or iPhone for instant 1-tap launching, full-screen emergency mode, and cached college directory without needing app stores.
            </p>

            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {isInstallable ? (
                <button
                  id="btn-pwa-install-prompt"
                  type="button"
                  onClick={() => {
                    soundManager.playClickTick();
                    install();
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff4757] to-[#d63031] text-white shadow-[4px_4px_10px_#babecc,-4px_-4px_10px_#ffffff] hover:opacity-95 active:translate-y-[1px] flex items-center gap-2 text-xs font-mono font-bold tracking-wider cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>1-CLICK DOWNLOAD / INSTALL</span>
                </button>
              ) : isInIframe ? (
                <button
                  id="btn-pwa-open-direct"
                  type="button"
                  onClick={handleOpenDirect}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff4757] to-[#d63031] text-white shadow-[4px_4px_10px_#babecc,-4px_-4px_10px_#ffffff] hover:opacity-95 active:translate-y-[1px] flex items-center gap-2 text-xs font-mono font-bold tracking-wider cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>OPEN PUBLISHED APP TO INSTALL</span>
                </button>
              ) : (
                <button
                  id="btn-pwa-install-guide"
                  type="button"
                  onClick={() => {
                    soundManager.playClickTick();
                    setShowInstallGuide(true);
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl neu-button text-[#2d3436] hover:text-[#ff4757] flex items-center gap-2 text-xs font-mono font-bold tracking-wider cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#ff4757]" />
                  <span>HOW TO DOWNLOAD ON PHONE</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyLink}
                className="min-h-[44px] px-3 py-2 rounded-xl neu-button text-xs font-mono text-[#4a5568] hover:text-[#2d3436] flex items-center gap-1.5 cursor-pointer"
                title="Copy direct web link to share or open on mobile"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10b981]" />
                    <span className="text-[#10b981] font-bold">LINK COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY LINK</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClickTick();
                  setShowInstallGuide(true);
                }}
                className="text-[11px] font-mono text-[#ff4757] underline underline-offset-2 hover:opacity-80 p-1 cursor-pointer"
              >
                Instructions
              </button>
            </div>
          </div>
        </div>

        {/* Dismiss banner */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClickTick();
            setIsDismissed(true);
          }}
          className="p-1.5 rounded-lg neu-button text-[#8c96a8] hover:text-[#2d3436] cursor-pointer shrink-0"
          title="Dismiss install card"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {showInstallGuide && (
        <InstallGuideModal
          isInstallable={isInstallable}
          isIOS={isIOS}
          isInIframe={isInIframe}
          onInstall={install}
          onCopyLink={handleCopyLink}
          onOpenDirect={handleOpenDirect}
          copied={copied}
          onClose={() => setShowInstallGuide(false)}
        />
      )}
    </section>
  );
};

interface InstallGuideModalProps {
  isInstallable: boolean;
  isIOS: boolean;
  isInIframe: boolean;
  onInstall: () => void;
  onCopyLink: () => void;
  onOpenDirect: () => void;
  copied: boolean;
  onClose: () => void;
}

const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isInstallable,
  isInIframe,
  onInstall,
  onCopyLink,
  onOpenDirect,
  copied,
  onClose,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Install & Download Instructions"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md neu-card rounded-2xl p-5 border border-white/60 shadow-[12px_12px_24px_#babecc,-12px_-12px_24px_#ffffff] max-h-[90vh] overflow-y-auto">
        {/* Screws */}
        <div className="absolute top-3 left-3">
          <ScrewHead rotation="default" />
        </div>
        <div className="absolute top-3 right-3">
          <ScrewHead rotation="alt" />
        </div>

        <div className="flex items-center justify-between border-b border-[#d1d9e6] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-[#ff4757]" />
            <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-[#2d3436]">
              DOWNLOAD & INSTALL GUIDE
            </h4>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playClickTick();
              onClose();
            }}
            className="p-1 rounded-lg neu-button text-[#4a5568] hover:text-[#2d3436] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice for preview iframe */}
        {isInIframe && (
          <div className="mb-4 p-3 rounded-xl bg-[#fff2f2] border border-[#ff4757]/30 text-xs font-mono text-[#2d3436]">
            <p className="font-bold text-[#ff4757] flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Viewing in Embedded Preview
            </p>
            <p className="mt-1 text-[#4a5568] text-[11px] leading-relaxed">
              Browsers disable direct PWA installation inside embedded iframes. Open the direct published URL in a full browser tab or on your phone to trigger the 1-click install prompt.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenDirect}
                className="px-3 py-1.5 rounded-lg bg-[#ff4757] text-white font-bold text-[11px] flex items-center gap-1.5 hover:bg-[#d63031] cursor-pointer"
              >
                <ExternalLink className="w-3 h-3" />
                Open Direct Published URL
              </button>
              <button
                type="button"
                onClick={onCopyLink}
                className="px-3 py-1.5 rounded-lg neu-button text-[#2d3436] font-bold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy Link'}
              </button>
            </div>
          </div>
        )}

        {isInstallable && (
          <div className="mb-4">
            <button
              type="button"
              onClick={onInstall}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff4757] to-[#d63031] text-white font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_10px_#babecc] hover:opacity-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              TRIGGER NATIVE INSTALL PROMPT NOW
            </button>
          </div>
        )}

        {/* Step-by-Step for Platforms */}
        <div className="space-y-3 text-xs font-mono text-[#2d3436]">
          {/* Android / Chrome */}
          <div className="neu-recessed p-3.5 rounded-xl">
            <div className="flex items-center gap-2 text-[#2d3436] font-bold pb-2 border-b border-[#d1d9e6]">
              <Smartphone className="w-4 h-4 text-[#10b981]" />
              <span>ON ANDROID (Chrome / Edge / Brave / Samsung)</span>
            </div>
            <ol className="mt-2 space-y-1.5 text-[11px] text-[#4a5568]">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#ff4757]">1.</span>
                <span>Open the published link in Google Chrome on your phone.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#ff4757]">2.</span>
                <span>Tap the three dots menu (<strong className="text-[#2d3436]">⋮</strong>) in the top-right corner.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#ff4757]">3.</span>
                <span>Select <strong className="text-[#2d3436]">&quot;Install App&quot;</strong> or <strong className="text-[#2d3436]">&quot;Add to Home Screen&quot;</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#ff4757]">4.</span>
                <span>Sentinel will download with its icon and launch like a native application!</span>
              </li>
            </ol>
          </div>

          {/* iPhone / Safari */}
          <div className="neu-recessed p-3.5 rounded-xl">
            <div className="flex items-center gap-2 text-[#2d3436] font-bold pb-2 border-b border-[#d1d9e6]">
              <Smartphone className="w-4 h-4 text-[#3b82f6]" />
              <span>ON IPHONE / IPAD (Apple Safari)</span>
            </div>
            <ol className="mt-2 space-y-1.5 text-[11px] text-[#4a5568]">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#ff4757]">1.</span>
                <span>Open the link in <strong className="text-[#2d3436]">Safari</strong> on your iPhone.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#ff4757]">2.</span>
                <span>Tap the <strong className="text-[#2d3436]">Share</strong> button (<Share2 className="w-3 h-3 inline text-[#3b82f6]" /> square with upward arrow) at the bottom.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#ff4757]">3.</span>
                <span>Scroll down and tap <strong className="text-[#2d3436]">&quot;Add to Home Screen&quot;</strong> (<PlusSquare className="w-3 h-3 inline text-[#10b981]" />).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#ff4757]">4.</span>
                <span>Tap <strong className="text-[#2d3436]">Add</strong> at the top right. Sentinel is now on your home screen.</span>
              </li>
            </ol>
          </div>

          {/* Windows / Mac / Desktop */}
          <div className="neu-recessed p-3.5 rounded-xl">
            <div className="flex items-center gap-2 text-[#2d3436] font-bold pb-2 border-b border-[#d1d9e6]">
              <Globe className="w-4 h-4 text-[#8b5cf6]" />
              <span>ON DESKTOP / LAPTOP (Chrome / Edge)</span>
            </div>
            <p className="mt-2 text-[11px] text-[#4a5568]">
              Look for the <strong className="text-[#2d3436]">Install icon</strong> (<Download className="w-3 h-3 inline text-[#ff4757]" />) in the right side of the browser URL bar to install Sentinel onto your computer desktop.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#d1d9e6] flex items-center justify-between gap-3">
          <span className="text-[10px] font-mono text-[#8c96a8] flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#10b981]" />
            Encrypted & PWA Certified
          </span>
          <button
            type="button"
            onClick={() => {
              soundManager.playClickTick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl neu-button text-xs font-mono font-bold text-[#2d3436] hover:text-[#ff4757] cursor-pointer uppercase"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
