import Image from "next/image";
import React from "react";

// คุณสามารถเพิ่ม props อื่นๆ ได้ตามต้องการ เช่น onClick
interface FloatingButtonProps {
  onClick?: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed right-5 bottom-[60] z-51 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform"
      aria-label="Help Button"
    >
      <Image
        src="/Picture1.png" // ตรวจสอบให้แน่ใจว่าไฟล์นี้อยู่ในโฟลเดอร์ public
        alt="Help Icon"
        width={60}
        height={40}
      />
    </button>
  );
};

export default FloatingButton;
