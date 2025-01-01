import React from 'react';
import { ShareButtonProps } from './types';

const TwitterShareButton: React.FC<ShareButtonProps> = ({
  text,
  url,
  fill = 'currentColor',
  size = 32,
  round = false,
}) => {
  const shareText = encodeURIComponent(`${text}`);
  const shareUrlQ = encodeURIComponent(`${url}`);
  const shareUrl = `https://x.com/intent/tweet?text=${shareText}&url=${shareUrlQ}`;
  const handleClick = () => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };
  return (
    <button
      onClick={handleClick}
      aria-label="Share on X"
      className={`font-inherit inline-flex h-8 w-8 cursor-pointer items-center justify-center border-none bg-black p-0 text-inherit text-white no-underline outline-none hover:bg-black ${round ? 'rounded-full' : 'rounded-none'}`}
    >
      <svg width={size} height={size} viewBox="0 0 1200 1227" fill={fill} xmlns="http://www.w3.org/2000/svg">
        <path
          d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
          fill="white"
        />
      </svg>
    </button>
  );
};

export default TwitterShareButton;
