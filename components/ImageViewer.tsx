import React, { useState, useRef, useEffect } from 'react';

interface ImageViewerProps {
  imageUrl: string;
  onClose: () => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ResetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
    </svg>
)

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, onClose }) => {
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleFactor = 0.1;
    let newScale = transform.scale;

    if (e.deltaY < 0) { // Zoom in
        newScale += scaleFactor;
    } else { // Zoom out
        newScale -= scaleFactor;
    }
    
    setTransform(t => ({ ...t, scale: Math.max(1, Math.min(newScale, 5)) }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (transform.scale <= 1) return;
    e.preventDefault();
    e.stopPropagation();
    setIsPanning(true);
    startPos.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    setTransform(t => ({ ...t, x: e.clientX - startPos.current.x, y: e.clientY - startPos.current.y }));
  };

  const handleMouseUpOrLeave = (e: React.MouseEvent) => {
    if (isPanning) {
      e.preventDefault();
      setIsPanning(false);
    }
  };
  
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTransform({ scale: 1, x: 0, y: 0 });
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex justify-center items-center z-[60]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button onClick={handleReset} className="text-white bg-slate-700/50 p-2 rounded-full hover:bg-slate-600 transition-colors" title="Reset Zoom/Pan">
            <ResetIcon />
        </button>
        <button onClick={onClose} className="text-white bg-slate-700/50 p-2 rounded-full hover:bg-slate-600 transition-colors" title="Close (Esc)">
            <CloseIcon />
        </button>
      </div>

      <div className="w-full h-full flex items-center justify-center overflow-hidden" onWheel={handleWheel}>
        <img
            ref={imageRef}
            src={imageUrl}
            alt="Observation full screen"
            className="max-w-none max-h-none transition-transform duration-100 ease-out"
            style={{ 
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, 
                cursor: isPanning ? 'grabbing' : (transform.scale > 1 ? 'grab' : 'zoom-in')
            }}
            onMouseDown={handleMouseDown}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
        />
      </div>
    </div>
  );
};

export default ImageViewer;