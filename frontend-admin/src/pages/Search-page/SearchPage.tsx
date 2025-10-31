import InputWithButton from "@/components/comp-21";
import LoadingSkelaton from "@/components/loading/LoadingSkelaton";
import PageHeader from "@/layouts/PageTitleHeader";
import { useState } from "react";
import { DocInfoEdit } from "../doc-page/DocsPage";
import { useSearchDocs } from "@/hooks/useSearch";
import ReactMarkdown from "react-markdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import { DropdownMenuForSearchDoc } from "./DropdownMenuForSearchDoc";
import DocInfoCard from "@/components/DocInfoCard";
import { useSavedDocs } from "@/hooks/useSavedDocs";
import { type Document } from "@/api/doc.api";
import { Card, CardContent } from "@/components/ui/shadcn/card";

export default function SearchPage() {

  const [submittedQuery, setSubmittedQuery] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);

  const { data: searchResult, isLoading } = useSearchDocs(
    submittedQuery,
    !!submittedQuery,
  );
  const { saveDoc, unSaveDoc, isDocSaved } = useSavedDocs();

  const handleSearch = (query: string) => {
    if (query.length < 4) {
      return;
    }

    setSubmittedQuery(query);
  };

  const handleOpenInfo = (id: number) => {
    setSelectedDocId(id);
  };

  const handleCloseInfo = () => {
    setSelectedDocId(null);
  };

  const handleSaveFromInfoCard = (doc: Document) => {
    if (isDocSaved(doc.id)) {
      unSaveDoc(doc.id);
    } else {
      saveDoc(doc);
    }
  };

  const aiResponse = searchResult?.meta?.ai_response;

  return (
    <>
      <PageHeader title="Recherche" info="Rechercher des documents actifs" />
      <div className="m-auto flex w-[100vw] flex-wrap justify-center gap-4 sm:my-5 sm:w-full md:pr-4 md:pl-1">
        <div className="grid w-full">
          <div
            className={`m-auto mb-4 ${searchResult ? "sm:ml-[17%] md:ml-auto" : ""}`}
          >
            <InputWithButton handleSearch={handleSearch} className="bg-white" />
          </div>
          {isLoading ? (
            <LoadingSkelaton message="Searching..." />
          ) : (
            searchResult && (
              <>
                {aiResponse && <AiResponse content={aiResponse} />}
                <div className="overflow-auto">
                  <Table className="mb-9 overflow-hidden rounded-2xl bg-white">
                    <TableHeader className="bg-boa-sky/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[30px]"></TableHead>
                        <TableHead className="w-[350px] max-w-[350px]">
                          Titre
                        </TableHead>
                        <TableHead>État</TableHead>
                        <TableHead className="max-w-[350px]">Doc Lié</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResult &&
                        searchResult.data.map((doc) => {
                          return (
                            <TableRow
                              key={doc.id}
                              className={`even:bg-boa-sky/10 hover:bg-boa-sky/30`}
                            >
                              <TableHead className="w-[30px]">
                                <DropdownMenuForSearchDoc
                                  doc={doc}
                                  openInfo={() => handleOpenInfo(doc.id)}
                                />
                              </TableHead>
                              <TableCell className="max-w-[350px] overflow-auto">
                                {doc.attributes.title}
                              </TableCell>
                              {/* <TableCell>{doc.attributes.docStatut}</TableCell> */}
                              <TableCell>
                                {doc.attributes.docStatut === "Updates"
                                  ? "Met à jour"
                                  : doc.attributes.docStatut === "Cancels"
                                    ? "Annule"
                                    : doc.attributes.docStatut === "Updated"
                                      ? "Mis à jour par"
                                      : doc.attributes.docStatut === "Canceled"
                                        ? "Annulé par"
                                        : "Nouveau"}
                              </TableCell>
                              <TableCell className="max-w-[350px] overflow-auto">
                                {
                                  doc.relationships.relatedDocument?.data
                                    ?.attributes?.title
                                }
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              </>
            )
          )}
          {selectedDocId && (
            <DocInfoCard
              id={selectedDocId}
              setIsOpen={handleCloseInfo}
              onSave={handleSaveFromInfoCard}
              isSaved={isDocSaved(selectedDocId)}
            />
          )}
          {editingDoc && (
            <div className="bg-opacity-50 bg-boa-blue/20 fixed inset-0 flex items-center justify-center">
              <div
                className="absolute top-0 left-0 h-[100vh] w-[100vw] bg-transparent"
                onClick={() => setEditingDoc(null)}
              ></div>
              <DocInfoEdit
                doc={editingDoc}
                setIsOpen={() => setEditingDoc(null)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function AiResponse({ content }: { content: string }) {
  return (
    <Card className="m-auto mb-4 w-[95%] pb-3">
      <CardContent className="relative">
        <div className="from-boa-sky to-boa-blue relative top-[-15px] flex items-center gap-2 border-b-1 bg-gradient-to-r bg-clip-text pb-2 font-bold text-transparent">
          <span className="font-light">[Ai]</span>
          <span className="">Aperçu</span>
        </div>
        <div className="max-h-[50vh] overflow-auto sm:max-h-[40vh]">
          <ReactMarkdown children={content} />
          <div className="relative bottom-[-15px] ml-auto w-fit text-sm font-light text-gray-400">
            L'aperçu IA peut contenir des erreurs, veuillez consulter les documents ci-dessous pour plus d'informations.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
