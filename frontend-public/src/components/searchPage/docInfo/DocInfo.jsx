import { useState } from "react";
import { BookmarkCheckIcon, FileText as IconFileText } from "lucide-react";
import { X as IconX, Bookmark as IconBookmark } from "lucide-react";
import DownloadDoc from "../DownloadDoc";

function statusMessage(status) {
  if (status === null) return "Document";

  return status === "Canceled"
    ? "Ce document a été annulé"
    : status === "Updated"
      ? "Ce document a été mis à jour"
      : "Nouveau document";
}

export default function DocInfo({
  doc,
  onShowInfo,
  hasRelatedDoc,
  color,
  addToSaved = () => null,
  canSave = true,
}) {
  const [activeDoc, setActiveDoc] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (doc) => {
    addToSaved(doc);
    setIsSaved(true);
  };

  const mainStatus = doc.attributes.docStatut;
  const relatedStatus =
    doc.relationships && doc.relationships.relatedDocument
      ? doc.relationships.relatedDocument.data.attributes.docStatut
      : null; // first check if there's related doc

  const activeDocStyle = " border-boa-sky shadow-boa-sky/30 shadow-md";
  const unActiveDocStyle =
    "hover:shadow-boa-sky/50 border-gray-200 hover:shadow:md";

  // removed pdf state, abortControllerRef, handlePdfView, useEffect
  const handleActiveDocChange = (isRelatedActive) => {
    setActiveDoc(isRelatedActive);
  };

  return (
    <div
      className="fixed inset-0 z-100 flex translate-y-[2%] items-center justify-center"
      onClick={() => onShowInfo(false)}
    >
      <div
        className="relative z-100 h-[80%] w-[90%] rounded-xl border-1 border-gray-200 shadow-xl backdrop-blur-md md:h-[80vh] md:w-[50vw] md:min-w-xl"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          onClick={() => onShowInfo(false)}
          className="absolute end-0 top-[-30px] cursor-pointer hover:text-red-400 md:right-[-30px]"
        >
          <IconX size={30} />
        </div>
        <div className="col-start-1 col-end-3 row-start-1 row-end-3 flex flex-col rounded-xl bg-linear-to-b from-gray-100 to-transparent md:col-end-2 md:row-end-6 md:rounded-tr-none">
          <div
            onClick={() => handleActiveDocChange(false)}
            className={`flex-1 overflow-auto rounded-tl-xl rounded-tr-xl p-2 md:rounded-tr-none ${!activeDoc && `from-boa-sky/30 bg-linear-to-l`} flex-end`}
          >
            <span className={`flex gap-1 p-1`}>
              <div>
                <IconFileText
                  className={`text-${color} ${color ?? `text-red-400`}`}
                />
              </div>
              {statusMessage(mainStatus)} :
            </span>
            <div
              className={`flex gap-2 rounded-xl rounded-l-none border-l-3 bg-white p-2 hover:shadow-md hover:shadow-gray-300 ${activeDoc ? unActiveDocStyle : activeDocStyle} `}
            >
              <div className="flex w-full items-center justify-between">
                <span className="flex-1">{doc.attributes.title}</span>
                <DownloadDoc className="text-gray-500" docId={doc.id} />
              </div>
            </div>
          </div>
          {hasRelatedDoc && (
            <div
              onClick={() => handleActiveDocChange(true)}
              className={`flex-1 overflow-auto p-2 ${activeDoc && `from-boa-sky/20 bg-linear-to-l`}`}
            >
              <span className={`flex gap-1 p-1 md:pl-4`}>
                <IconFileText />
                {statusMessage(relatedStatus)} :
              </span>
              <div
                className={`ml-5 cursor-pointer rounded-xl rounded-l-none border-l-3 bg-white p-2 hover:shadow-md hover:shadow-gray-300 ${!activeDoc ? unActiveDocStyle : activeDocStyle}`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="flex-1">
                    {doc.relationships.relatedDocument.data.attributes.title}
                  </span>
                  <DownloadDoc
                    className="text-gray-500"
                    docId={doc.relationships.relatedDocument.data.id}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {canSave && (
          // if we open the card from the saved section we won't see the save button
          <button
            onClick={() => handleSave(doc)}
            className={`m-auto mt-5 flex gap-2 rounded-lg px-4 py-2 sm:border-0 ${isSaved ? "text-gray-400" : "hover:text-boa-sky cursor-pointer text-black hover:font-bold"}`}
          >
            {isSaved ? <BookmarkCheckIcon /> : <IconBookmark />}
            {isSaved
              ? "le résultat est ajouté à vos documents Enregistré"
              : "Enregistrer le resulta"}
          </button>
        )}
      </div>
    </div>
  );
}

/* response example :
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
*/
