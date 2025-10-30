import { useState, useEffect } from "react";
import DocInfo from "./docInfo/DocInfo";
import SubCard from "./SubCard";

import {
  ChevronRight as IconChevronRight,
  FileText as IconFileText,
} from "lucide-react";

export default function DocCard({
  doc,
  activeCardId,
  setActiveCardId,
  addToSaved,
  canSave = true,
}) {
  const cardClicked = activeCardId === doc.id;
  const hasRelatedDoc = !!doc.relationships.relatedDocument; // true/false : 1st ! makes it boolean oposit, 2nd ! turns it back to original
  const [showInfo, setShowInfo] = useState(false); // to show the doc info overlay changed from the subdoc

  // give color to the doc icon dipending on the status
  const statusColors = {
    null: "black",
    New: "black",
    Updates: "boa-sky",
    Cancels: "boa-sky",
  };
  const color = statusColors[doc.attributes.docStatut] || null;

  const handleCardClick = () => {
    setActiveCardId((prev) => (prev === doc.id ? null : doc.id)); // open and close card
    hasRelatedDoc || setShowInfo(true); // open info onClick if the card has no related
  };

  const showSubCard = cardClicked && hasRelatedDoc;

  // stop the scroll behavior when opening the doc info pop up
  useEffect(() => {
    if (showInfo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    }
    return () => {
      // Cleanup on unmount
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "unset";
    };
  }, [showInfo]);

  return (
    <>
      <li
        className={`group hover:shadow-boa-blue/10 hover:text-boa-blue hover:border-boa-sky border-boa-sky relative flex h-21 justify-between overflow-hidden overflow-x-hidden rounded-lg border-1 border-l-2 bg-white shadow-sm hover:border-b-1 hover:shadow-xl md:h-15 ${cardClicked ? `shadow-boa-blue/10 rounded-bl-md border-b-transparent shadow-xl` : `border-transparent`}`}
        onClick={handleCardClick}
      >
        <div
          id="seeInfo"
          onClick={(e) => {
            e.stopPropagation();
            setShowInfo((prev) => !prev);
          }}
          className="flex max-w-4xl cursor-pointer items-center gap-3 overflow-hidden p-2 pl-4"
        >
          <div className={`text-${color} ${color ?? "text-red-400"}`}>
            <IconFileText size={18} />
          </div>
          <span className="truncate">{doc.attributes.title}</span>
        </div>
        <div
          className={`active:text-boa-sky flex h-full cursor-pointer items-center p-3 text-gray-500 group-hover:opacity-100 sm:opacity-0 ${cardClicked ? `opacity-100` : ``} ${hasRelatedDoc ? `rotate-90` : ``} ${cardClicked ? "text-gray-500 hover:rotate-270" : ``} transform transition-transform`}
        >
          <IconChevronRight />
        </div>
      </li>
      {showSubCard && (
        <SubCard
          doc={doc.relationships.relatedDocument.data}
          status={doc.attributes.docStatut}
          color={color}
          onShowInfo={setShowInfo}
        />
      )}
      {showInfo && (
        <DocInfo
          doc={doc}
          onShowInfo={setShowInfo}
          hasRelatedDoc={hasRelatedDoc}
          color={color}
          addToSaved={addToSaved}
          canSave={canSave}
        />
      )}
    </>
  );
}

/* example of the api response for docs
{
    "data": [
        {
            "type": "Document",
            "id": 18,
            "attributes": {
                "title": "test 6 api update2",
                "docStatut": "Updated"
            },
            "links": {
                "download": "http://localhost:8800/api/v1/docs/18/pdf"
            },
            "relationships": {
                "relatedDocument": {
                    "data": {
                        "type": "document",
                        "id": 17,
                        "attributes": {
                            "title": "test 5 api",
                            "docStatut": "Updates"
                        },
                        "links": {
                            "download": "http://localhost:8800/api/v1/docs/17/pdf"
                        }
                    }
                }
            }
        },
    ],
    "meta": {
        "total_results": 1,
        "query": "update",
        "normalized_query": "update"
    }
}
*/
