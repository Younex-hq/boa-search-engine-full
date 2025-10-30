import { Link } from "react-router";
import SearchBar from "../../SearchBar";
import Filters from "./Filters";
import {
  ChevronLeftIcon,
  SlidersHorizontal as IconSlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

export default function FilterSearchbar({
  searchQuery,
  handleSearchQuery,
  onApplyFilters,
}) {
  const [isFilterShown, setIsFilterShown] = useState(false);

  return (
    <div className="sticky top-0 z-20 mx-auto my-2 flex flex-col items-center justify-between rounded-xl bg-gradient-to-b from-white to-gray-50 px-4 py-2 shadow-lg shadow-white backdrop-blur-xl sm:max-w-[85%] md:flex-row lg:max-w-[65%]">
      <Link
        to="/"
        className="text-boa-blue flex cursor-pointer items-center p-2 text-2xl font-bold whitespace-nowrap"
      >
        <ChevronLeftIcon />
        Documents trouvés
      </Link>
      <div className="relative flex flex-2 justify-end">
        <div className="flex flex-2 justify-center md:max-w-xl">
          <SearchBar
            variant="small"
            searchQuery={searchQuery}
            handleSearchQuery={handleSearchQuery}
          />
        </div>
        <div
          onClick={() => setIsFilterShown((prev) => !prev)}
          className={`active:text-boa-gold hover:text-boa-sky flex cursor-pointer items-center gap-1 text-gray-500`}
        >
          <IconSlidersHorizontal
            className={`${isFilterShown ? "text-boa-sky" : " "}`}
          />
        </div>
        {isFilterShown && (
          <>
            <Filters
              onApplyFilters={onApplyFilters}
              setIsFilterShown={setIsFilterShown}
            />
          </>
        )}
      </div>
    </div>
  );
}
