import { useEffect, useState } from "react";
import { X as IconX } from "lucide-react";

import PageController from "./Pagination";
import DocCard from "./DocCard";

export default function DocResults({
  docsList,
  showUpToDate,
  setShowUpToDate,
  addToSaved,
  error,
  isLoading,
}) {
  const [page, setPage] = useState(1);
  const [activeCardId, setActiveCardId] = useState(0);

  const numOfPages = Math.ceil(docsList.length / 15);
  let paginatedDocs = docsList.slice(15 * (page - 1), page * 15); // 15 docs par page

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [docsList, page]);

  useEffect(() => {
    setPage(1);
  }, [docsList]); // reset to pagination 1 when docsList changes (new search, or filtering)

  return (
    <div className="mx-auto rounded-xl bg-gray-50 px-4 py-6 sm:max-w-[85%] lg:max-w-[65%]">
      <div className="relative m-auto">
        <hr className="text-gray-400" />
        <span className="absolute top-[-13px] bg-gray-50 p-1 text-xs font-light">
          {docsList.length} Résultats
        </span>
        <span
          onClick={() => setShowUpToDate(false)}
          className="absolute top-[-13px] right-0 flex cursor-pointer gap-2 bg-gray-50 p-1 text-xs font-light"
        >
          <div>
            <span>Filtres : </span>
            {showUpToDate ? "Documents à jour" : "Aucun"}
          </div>
          {showUpToDate && <IconX size={16} color="red" />}
        </span>
      </div>
      {docsList.length > 0 ? (
        <>
          <ul className="mx-auto my-5 flex flex-col gap-1">
            {paginatedDocs.map((doc) => (
              <DocCard
                key={doc.id}
                doc={doc}
                activeCardId={activeCardId}
                setActiveCardId={setActiveCardId}
                addToSaved={addToSaved}
              />
            ))}
          </ul>
          <PageController
            page={page}
            setPage={setPage}
            numOfPages={numOfPages}
          />
        </>
      ) : (
        <div className="m-auto my-5 w-fit">
          {error
            ? "Nous rencontrons un problème, veuillez réessayer dans quelques instants."
            : !isLoading && "Aucun résultat - Essayez d'autres termes!"}
        </div>
      )}
    </div>
  );
}
