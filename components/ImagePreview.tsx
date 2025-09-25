
import React, { useMemo } from 'react';
import type { ImageFile } from '../types';

interface ImagePreviewProps {
  image: ImageFile;
  onRemove: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onRemove }) => {
  const imageUrl = useMemo(() => URL.createObjectURL(image.file), [image.file]);
  
  return (
    <div className="relative inline-block mb-2">
      <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg border-2 border-gray-600" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center border-2 border-gray-600 hover:bg-red-500 transition-colors"
        aria-label="Remove image"
      >
        &times;
      </button>
    </div>
  );
};
