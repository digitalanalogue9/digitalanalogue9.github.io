/**
 * A React functional component that renders a centered image.
 * The image is positioned absolutely to cover the entire container.
 *
 * @component
 * @example
 * // Usage example:
 * <CenteredImage />
 *
 * @returns {JSX.Element} The rendered centered image component.
 */
// src/components/CentredImage.tsx
export default function CenteredImage() {
  return (
    <div className="absolute inset-0">
      <img
        src="/images/core-values.png" // Update with your actual image path
        alt="Core Values"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
