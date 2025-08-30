'use client';

import Image from "next/image";
import React, { useEffect, useState } from "react";

const FloatingButton: React.FC = () => {
  const [lineId, setLineId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLineId = async () => {
      try {
        const res = await fetch('/api/line-setting');
        if (res.ok) {
          const { data } = await res.json();
          setLineId(data.value);
        }
      } catch (error) {
        console.error('Failed to fetch Line ID', error);
      }
    };

    fetchLineId();
  }, []);

  const handleClick = () => {
    if (lineId) {
      window.open(`https://line.me/ti/p/~${lineId}`, '_blank');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed right-5 bottom-[60] z-51 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform"
      aria-label="Help Button"
      disabled={!lineId}
    >
      <Image
        src="/Picture1.png"
        alt="Help Icon"
        width={60}
        height={40}
      />
    </button>
  );
};

export default FloatingButton;