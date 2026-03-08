// src/components/common/ImageUpload.jsx
import { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUpload = ({ onImageSelect, currentImage, onRemove }) => {
  const [preview, setPreview] = useState(currentImage || null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageSelect(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-32 h-32 mx-auto"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg border-2 border-white/10"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
            >
              <FaTimes size={12} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
              dragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
            }`}
          >
            <FaCloudUploadAlt className={`text-3xl mb-2 ${dragging ? 'text-blue-400' : 'text-gray-400'}`} />
            <p className={`text-sm ${dragging ? 'text-blue-400' : 'text-gray-400'}`}>
              {dragging ? 'Drop image here' : 'Click or drag to upload'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUpload;