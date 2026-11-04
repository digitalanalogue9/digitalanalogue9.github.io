import { BlueskyShareButton, LinkedInShareButton, TwitterShareButton } from '../components/common/ShareButtons';
import { getShareUrl } from './site';

export default function PersonalShareButtons() {
  const shareUrl = getShareUrl();
  const shareText = `Check out Core Values at ${shareUrl}`;

  return (
    <div className="flex items-center gap-3" aria-label="Share Core Values">
      <BlueskyShareButton text={shareText} size={22} round />
      <TwitterShareButton url={shareUrl} text="Check out Core Values!" size={20} round />
      <LinkedInShareButton url={shareUrl} text={shareText} size={32} round />
    </div>
  );
}
