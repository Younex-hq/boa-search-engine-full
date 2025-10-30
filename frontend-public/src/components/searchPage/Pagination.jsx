import {
  ChevronRight as IconChevronRight,
  ChevronLeft as IconChevronLeft,
} from "lucide-react";

export default function PageController({ page, setPage, numOfPages }) {
  return (
    <div>
      <div className="ml-auto flex w-fit items-center gap-2">
        <button
          className={`hover:text-boa-sky cursor-pointer rounded-lg p-2 ${page === 1 && `text-gray-300 hover:text-gray-300`}`}
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
        >
          <IconChevronLeft />
        </button>
        <div>
          Page <strong>{page}</strong> / <span>{numOfPages}</span>
        </div>
        <button
          className={`hover:text-boa-sky cursor-pointer rounded-lg p-2 ${page === numOfPages && `text-gray-300 hover:text-gray-300`}`}
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === numOfPages}
        >
          <IconChevronRight />
        </button>
      </div>
    </div>
  );
}
