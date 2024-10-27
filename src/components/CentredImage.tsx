'use client'

import Image from 'next/image';

export default function CenteredImage() {
  return (
    <div className="flex justify-center mb-4">
      <Image src="/images/core-values.png" alt="" width={200} height={200} />
    </div>
  );}