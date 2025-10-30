import { useState, useEffect } from "react";
import { useOutletContext, useLocation } from "react-router";
import FilterSearchbar from "../components/searchPage/fullSearchBar/FilterSearchbar";
import DocResults from "../components/searchPage/DocResults";
import LoadingOverlay from "../components/LoadingOverlay";
import { ChevronDownIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function SearchPage() {
  const {
    docsList,
    aiResponse,
    handleSearchQuery,
    addToSaved,
    isLoading,
    error,
  } = useOutletContext();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q");

  const [showUpToDate, setShowUpToDate] = useState(false);

  const handleFilters = (isChecked) => {
    setShowUpToDate(isChecked);
  };

  const transformDocs = (docs) => {
    // to transform the docs to a primary doc structure (related doc will turn to primary doc) (for filtering)
    if (!showUpToDate) {
      return docs;
    }

    const relevantDocs = [];
    const addedDocIds = new Set(); // automatically unique ids, no need to check if id is already added that is why i didn't use []

    docs.forEach((doc) => {
      const docStatus = doc.attributes.docStatut;
      const relatedDoc = doc.relationships.relatedDocument?.data;

      if (["Updates", "Cancels", "New"].includes(docStatus)) {
        if (!addedDocIds.has(doc.id)) {
          relevantDocs.push(doc);
          addedDocIds.add(doc.id);
        }
      }

      if (relatedDoc) {
        const relatedDocStatus = relatedDoc.attributes.docStatut;
        if (["Updates", "Cancels", "New"].includes(relatedDocStatus)) {
          if (!addedDocIds.has(relatedDoc.id)) {
            // Transform the related doc to a primary doc structure
            const transformedRelatedDoc = {
              type: "document",
              id: relatedDoc.id,
              attributes: relatedDoc.attributes,
              links: relatedDoc.links,
              relationships: { relatedDocument: null }, // the card component expects this relationship so we add it as null
            };
            relevantDocs.push(transformedRelatedDoc);
            addedDocIds.add(relatedDoc.id);
          }
        }
      }
    });

    return relevantDocs;
  };

  const filteredDocsList = transformDocs(docsList || []);

  useEffect(() => {
    setShowUpToDate(false);
  }, [searchQuery]);

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <FilterSearchbar
        searchQuery={searchQuery}
        handleSearchQuery={handleSearchQuery}
        onApplyFilters={handleFilters}
      />
      {aiResponse && <AiSection content={aiResponse} />}
      <ResultSection
        docsList={filteredDocsList}
        showUpToDate={showUpToDate}
        setShowUpToDate={setShowUpToDate}
        addToSaved={addToSaved}
        error={error}
        isLoading={isLoading}
      />
    </>
  );
}

function ResultSection({
  docsList,
  showUpToDate,
  setShowUpToDate,
  addToSaved,
  error,
  isLoading,
}) {
  return (
    <DocResults
      docsList={docsList}
      showUpToDate={showUpToDate}
      setShowUpToDate={setShowUpToDate}
      addToSaved={addToSaved}
      error={error}
      isLoading={isLoading}
    />
  );
}

function AiSection({ content }) {
  const [isMinimized, setIsMinimized] = useState(true);
  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      <div className="mx-auto mb-4 rounded-xl bg-gray-50 px-4 py-6 sm:max-w-[85%] lg:max-w-[65%]">
        <div className="relative m-auto h-5">
          <hr className="text-gray-400" />
          <span className="text-boa-blue absolute top-[-13px] bg-gray-50 p-1 text-sm">
            [Ai] <span className="font-bold">Aperçu</span>
          </span>
          <span
            onClick={handleMinimize}
            className="absolute top-[-13px] right-0 flex cursor-pointer gap-2 bg-gray-50 p-1 text-xs font-light"
          >
            <div
              className={`${isMinimized ? "" : "rotate-180"} transform transition-transform`}
            >
              <ChevronDownIcon />
            </div>
          </span>
        </div>
        <div
          className={`overflow-auto ${isMinimized ? "max-h-[10vh]" : "max-h-[50vh]"}`}
        >
          <div>
            <ReactMarkdown children={content} />
          </div>
          <div className="mt-3 mr-2 ml-auto flex w-fit items-center gap-1 text-sm font-light text-gray-500">
            L'aperçu IA peut contenir des erreurs, veuillez consulter les
            documents ci-dessous pour plus d'informations.
          </div>
        </div>
      </div>
    </>
  );
}
