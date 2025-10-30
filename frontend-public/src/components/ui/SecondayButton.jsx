export default function SecondayButton({ isActive = false, onClick = '', children }) {
  return (
    <div
      className={`flex gap-1 w-fit cursor-pointer text-sm items-center  hover:text-boa-blue transition-all md:duration-200 p-2 active:text-boa-gold
        ${isActive ? `text-black` : `text-gray-400`}
        `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
