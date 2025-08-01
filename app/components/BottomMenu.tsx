"use client";
import { useRouter } from "next/navigation";
import { FaClipboardList } from "react-icons/fa";
import { IoClipboardOutline } from "react-icons/io5";
import { IoClipboard } from "react-icons/io5";

type BottomMenuProps = {
  leftLabel?: string;
  rightLabel?: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  active?: "left" | "right";
};

export default function BottomMenu({
  leftLabel = "คำสั่ง",
  rightLabel = "ความคืบหน้าการชำระ",
  onLeftClick,
  onRightClick,
  active,
}: BottomMenuProps) {
  const router = useRouter();

  const handleLeftClick = () => {
    if (onLeftClick) {
      onLeftClick();
    } else {
      router.push("/invoice");
    }
  };

  const handleRightClick = () => {
    if (onRightClick) {
      onRightClick();
    } else {
      router.push("/qr");
    }
  };

  const getButtonClasses = (button: "left" | "right") => {
    const isActive = active === button;
    return `flex w-1/2 flex-col items-center gap-1 ${
      isActive ? "text-indigo-700" : "text-gray-500"
    }`;
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 flex w-full justify-between border-t border-slate-200 bg-white pt-3 pb-2">
      <button className={getButtonClasses("left")} onClick={handleLeftClick}>
        <FaClipboardList size={25} />
        {leftLabel}
      </button>
      <button className={getButtonClasses("right")} onClick={handleRightClick}>
        {active === "right" ? (
          <IoClipboard size={25} />
        ) : (
          <IoClipboardOutline size={25} />
        )}

        {rightLabel}
      </button>
    </div>
  );
}
