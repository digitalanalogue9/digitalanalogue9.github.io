// src/components/CentredImage.tsx
export default function CenteredImage() {
  return (
    <div className="absolute inset-0">
      <img
        src="/images/core-values.png" // Update with your actual image path
        alt="Core Values"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
