"use client";

import { useState } from "react";
import Image from "next/image";

export interface ImageFadeInProps {
  menuItemName: string;
  wrapperClass: string;
  imageUrl?: string;
  useOverlay?: boolean;
}

export default function OverlayImageWithFadeIn({
  imageUrl,
  menuItemName,
  wrapperClass,
  useOverlay = true,
}: ImageFadeInProps) {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [showImageOverlay, setShowImageOverlay] = useState<boolean>(false);

  return (
    <>
      <div className={wrapperClass} onClick={() => setShowImageOverlay(true)}>
        <Image
          src={imageUrl || "/queens.jpg"}
          alt={menuItemName}
          width={1536}
          height={2048}
          className="object-cover h-full"
          style={{ opacity: imageLoaded ? 1 : 0, transition: "opacity 0.1s ease" }}
          onLoadingComplete={() => setImageLoaded(true)}
        />
      </div>
      {useOverlay && showImageOverlay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowImageOverlay(false)}
        >
          <img
            src={imageUrl || "/queens.jpg"}
            alt={menuItemName}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
