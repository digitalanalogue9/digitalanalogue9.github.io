// src/lib/utils/styles/textStyles.ts - Update this file with comprehensive styles
export const getResponsiveTextStyles = (isMobile: boolean) => ({
  heading: isMobile ? 'text-2xl' : 'text-4xl sm:text-5xl',
  subheading: isMobile ? 'text-xl' : 'text-2xl sm:text-2xl',
  paragraph: isMobile ? 'text-sm' : 'text-base sm:text-lg',
  prose: isMobile ? 'prose prose-sm,' : 'prose sm:prose-lg',
  largeParagraph: isMobile ? 'text-base' : 'text-lg sm:text-xl',
  smallText: isMobile ? 'text-xs' : 'text-sm',
  containerPadding: isMobile ? 'flex flex-col justify-center py-2' : 'py-8',
  spacing: isMobile ? 'space-y-2 mb-2' : 'space-y-4 sm:space-y-6 mb-6',
});

export const getContainerClassName = (isMobile: boolean) =>
  `mx-auto px-4 sm:px-6 lg:px-8 ${isMobile ? 'flex flex-col justify-center py-2' : 'py-8'}`;
