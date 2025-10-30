import { useState } from "react";

export default function Filters({ onApplyFilters, setIsFilterShown }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onApplyFilters) {
      onApplyFilters(newCheckedState);
    }
    setIsFilterShown(false);
  };

  return (
    <div className="absolute top-15 z-30 flex flex-col gap-2 rounded-xl bg-white p-3 shadow-xl">
      <label className="flex cursor-pointer items-center gap-2">
        <span className="font-semibold text-gray-900">
          Uniquement les documents à jour
        </span>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="h-4 w-4"
        />
      </label>
    </div>
  );
}
