import React, { useRef, useState } from 'react';
import { Share2, Download, Facebook, Twitter, Linkedin, MessageCircle, Instagram, Link, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SocialShare = ({ 
  type = 'achievement', // 'achievement', 'leaderboard', 'analytics'
  data = {},
  onClose 
}) => {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate share text based on type
  const getShareText = () => {
    switch(type) {
      case 'achievement':
        return `🌱 I've collected ${data.totalWaste || 0}kg of waste and reached Level ${data.level || 1}! Join me in making our environment cleaner. #WasteManagement #EcoWarrior`;
      case 'leaderboard':
        return `🏆 I'm ranked #${data.rank || 0} on the leaderboard with ${data.points || 0} points! Competing to make our planet cleaner! #WasteManagement #Sustainability`;
      case 'analytics':
        return `📊 Our community has collected ${data.totalWaste || 0}kg of waste across ${data.locations || 0} locations! Together we're making a difference! #WasteManagement #CommunityImpact`;
      default:
        return `🌍 Join me in making our environment cleaner! #WasteManagement`;
    }
  };

  const shareUrl = window.location.href;
  const shareText = getShareText();

  // Web Share API (native mobile sharing)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Waste Management Achievement',
          text: shareText,
          url: shareUrl,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      toast.error('Sharing not supported on this browser');
    }
  };

  // Copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  // Social media share URLs
  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
  };

  const openSocialShare = (platform) => {
    window.open(socialLinks[platform], '_blank', 'width=600,height=400');
  };

  // Download achievement card as image
  const downloadCard = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      // Using html2canvas library (you'll need to install it: npm install html2canvas)
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `waste-management-achievement-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success('Card downloaded successfully!');
    } catch (error) {
      console.error('Error generating card:', error);
      toast.error('Failed to download card. Try screenshot instead.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Share2 className="h-6 w-6 text-green-600" />
              Share Your Achievement
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Achievement Card Preview */}
          <div className="mb-6">
            <div 
              ref={cardRef}
              className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 rounded-2xl p-8 text-white relative overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
              </div>

              <div className="relative z-10">
                {/* Logo/Title */}
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold mb-2">🌱 Eco Warrior</h3>
                  <p className="text-green-100">Waste Management Platform</p>
                </div>

                {/* Stats */}
                {type === 'achievement' && (
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 mb-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-green-100 text-sm mb-1">Total Waste Collected</p>
                        <p className="text-4xl font-bold">{data.totalWaste || 0} kg</p>
                      </div>
                      <div className="text-center">
                        <p className="text-green-100 text-sm mb-1">Current Level</p>
                        <p className="text-4xl font-bold">Level {data.level || 1}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-green-100 text-sm mb-1">Points Earned</p>
                        <p className="text-2xl font-bold">{data.points || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-green-100 text-sm mb-1">Rank</p>
                        <p className="text-2xl font-bold">#{data.rank || '-'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {type === 'leaderboard' && (
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 mb-6">
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-2">🏆</div>
                      <p className="text-5xl font-bold">#{data.rank || 0}</p>
                      <p className="text-green-100 text-lg mt-2">Leaderboard Rank</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-100 text-sm mb-1">Total Points</p>
                      <p className="text-3xl font-bold">{data.points || 0} pts</p>
                    </div>
                  </div>
                )}

                {type === 'analytics' && (
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 mb-6">
                    <div className="text-center mb-4">
                      <p className="text-green-100 text-sm mb-2">Community Impact</p>
                      <p className="text-5xl font-bold mb-2">{data.totalWaste || 0} kg</p>
                      <p className="text-green-100">Waste Collected</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{data.locations || 0}</p>
                        <p className="text-green-100 text-sm">Locations</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{data.wasteTypes || 0}</p>
                        <p className="text-green-100 text-sm">Waste Types</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* User name */}
                <div className="text-center">
                  <p className="text-lg font-semibold">{data.userName || 'Anonymous User'}</p>
                  <p className="text-green-100 text-sm">Making a difference, one collection at a time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Download Card Button */}
          <div className="mb-6">
            <Button
              onClick={downloadCard}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Download Achievement Card'}
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Download and share on Instagram, Stories, or anywhere!
            </p>
          </div>

          {/* Share Buttons */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700">Share on social media:</p>
            
            {/* Native Share (Mobile) */}
            {navigator.share && (
              <Button
                onClick={handleNativeShare}
                variant="outline"
                className="w-full justify-start"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share via...
              </Button>
            )}

            {/* Social Media Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => openSocialShare('twitter')}
                className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              
              <Button
                onClick={() => openSocialShare('facebook')}
                className="bg-[#1877F2] hover:bg-[#166fe5] text-white"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              
              <Button
                onClick={() => openSocialShare('linkedin')}
                className="bg-[#0A66C2] hover:bg-[#095196] text-white"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              
              <Button
                onClick={() => openSocialShare('whatsapp')}
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>

            {/* Copy Link */}
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full"
            >
              <Link className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>

          {/* Share Text Preview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Preview text:</p>
            <p className="text-sm text-gray-700">{shareText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialShare;