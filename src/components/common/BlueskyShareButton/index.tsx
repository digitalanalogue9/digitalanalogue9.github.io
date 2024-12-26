import React from 'react';

interface BlueskyShareButtonProps {
  text: string;
  url: string;
  fill : string;
  size?: number;
  round?: boolean;
}

const BlueskyShareButton: React.FC<BlueskyShareButtonProps> = ({ text, url, fill='currentColor', size = 32, round = false }) => {
    const shareText = encodeURIComponent(`${text} ${url}`);
    const shareUrl = `https://bsky.app/intent/compose?text=${shareText}`;
    const handleClick = () => {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };
    return (
        <button
            onClick={handleClick}
            aria-label="Share on Bluesky"
            className={`border-none p-0 mt-0.5 font-inherit text-inherit cursor-pointer outline-none inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white hover:bg-blue-600 no-underline ${round ? 'rounded-full' : 'rounded-none'}`}
        >
            <svg
            width={size}
            height={size}
            viewBox="0 0 600 530"
            xmlns="http://www.w3.org/2000/svg"
            fill={fill}
            >
            <path d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z" />
            </svg>
        </button>
    );
};

export default BlueskyShareButton;