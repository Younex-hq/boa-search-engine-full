import React from 'react';
import Loader from './ui/Loader';

export default function LoadingOverlay() {
  return (
    <div className="top-0 left-0 w-full h-full bg-white/50 overflow-hidden z-9 fixed cursor-progress">
      <Loader />
    </div>
  );
}
