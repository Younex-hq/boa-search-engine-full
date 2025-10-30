import { useState } from "react";
import DocCard from "./searchPage/DocCard";
import { ChevronRight as IconChevronRight, X as IconX } from "lucide-react";

export default function SavedTab({ setShowSaved, savedDocs, deleteFromSaved }) {
  return (
    <div
      onClick={() => setShowSaved(false)}
      className="fixed inset-0 z-49 flex justify-end"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="shadow-boa-sky/50 z-50 w-[100%] overflow-auto bg-white shadow-2xl md:max-w-[600px]"
      >
        <SavedOverlay
          setShowSaved={setShowSaved}
          savedDocs={savedDocs}
          deleteFromSaved={deleteFromSaved}
        />
      </div>
    </div>
  );
}

function SavedOverlay({ setShowSaved, savedDocs, deleteFromSaved }) {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-x-hidden p-3">
      <div>
        <div className="text-boa-blue sticky top-[-12px] z-50 flex w-full items-center justify-between bg-white p-2 py-4 text-xl font-bold">
          <div
            onClick={() => setShowSaved(false)}
            className="hover:text-boa-sky cursor-pointer md:hidden"
          >
            <IconChevronRight size={30} />
          </div>
          <span>Documents enregistrés</span>
        </div>
        <SavedList savedDocs={savedDocs} deleteFromSaved={deleteFromSaved} />
      </div>

      <div>
        {savedDocs && (
          <button
            onClick={() => deleteFromSaved("all")}
            className="my-3 w-fit cursor-pointer rounded-xl p-2 px-4 text-gray-600 shadow-md hover:text-red-400 hover:shadow-red-400/20 active:text-red-500 active:shadow-sm"
          >
            Tout effacer
          </button>
        )}
      </div>
    </div>
  );
}

function SavedList({ savedDocs, deleteFromSaved }) {
  const [activeCardId, setActiveCardId] = useState(0); // this state is livitated to show one subcard at a time

  return (
    <ul className="bg-boa-sky/5 flex flex-col gap-1 rounded-xl p-2 pr-0">
      <div className="flex w-full items-center gap-1 px-3">
        <hr className="w-full" />
        <span className="w-24 text-xs font-light">
          {savedDocs.length} Enregistrés
        </span>
      </div>

      {savedDocs.map((doc) => (
        <div key={doc.id} className="group relative flex pr-2 hover:pr-0">
          <div className="w-full group-hover:w-[95%]">
            <DocCard
              key={doc.id}
              doc={doc}
              activeCardId={activeCardId}
              setActiveCardId={setActiveCardId}
              canSave={false}
            />
          </div>

          <div
            onClick={() => {
              deleteFromSaved(doc);
            }}
            className={`h-fit cursor-pointer text-gray-500 group-hover:block hover:text-red-400 active:text-red-500 ${activeCardId === doc.id ? `block` : `hidden`}`}
          >
            <IconX />
          </div>
        </div>
      ))}
    </ul>
  );
}
