"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

export interface ImageFadeInProps {
  itemName: string;
  wrapperClass: string;
  imageUrl?: string;
  useOverlay?: boolean;
}

export default function OverlayImageWithFadeIn({
  imageUrl,
  itemName,
  wrapperClass,
  useOverlay = true,
}: ImageFadeInProps) {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [showImageOverlay, setShowImageOverlay] = useState<boolean>(false);

  return (
    <>
      <div
        className={clsx(wrapperClass, useOverlay ? "cursor-pointer" : "cursor-default")}
        {...(useOverlay && { onClick: () => setShowImageOverlay(true) })}
      >
        <Image
          src={imageUrl || "/queens.jpg"}
          alt={itemName}
          width={1536}
          height={2048}
          className="object-cover h-full"
          style={{ opacity: imageLoaded ? 1 : 0, transition: "opacity 0.1s ease" }}
          onLoadingComplete={() => setImageLoaded(true)}
        />
      </div>
      {useOverlay && showImageOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 rounded-full p-2"
            onClick={(e) => {
              e.stopPropagation();
              setShowImageOverlay(false);
            }}
            aria-label="Close"
          >
            Close ✕
          </button>

          <img
            src={imageUrl || "/queens.jpg"}
            alt={itemName}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
