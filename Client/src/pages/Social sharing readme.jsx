import SocialShare from './SocialShare';

// In your component
const [showShareModal, setShowShareModal] = useState(false);
const [shareData, setShareData] = useState(null);

// When user clicks share
const handleShare = () => {
  setShareData({
    type: 'achievement', // or 'leaderboard' or 'analytics'
    totalWaste: 150.5,
    level: 5,
    points: 230,
    rank: 12,
    userName: 'John Doe',
  });
  setShowShareModal(true);
};

// In JSX
{showShareModal && shareData && (
  <SocialShare
    type={shareData.type}
    data={shareData}
    onClose={() => setShowShareModal(false)}
  />
)}