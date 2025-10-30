import { useState } from "react";

import PageHeader from "@/layouts/PageTitleHeader";
import { useAuthStore } from "@/store/auth";
import {
  getDocsByDate,
  type Document,
  type UpdateDocPayload,
} from "@/api/doc.api";
import LoadingSkelaton from "@/components/loading/LoadingSkelaton";
import { useGetDocTypes } from "@/hooks/useDocTypes";
import {
  useGetDocs,
  useUpdateDoc,
  useDeleteDoc,
  useRestoreDoc,
} from "@/hooks/useDocs";
import { useSavedDocs } from "@/hooks/useSavedDocs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import { Button } from "@/components/ui/shadcn/button";

import { PenIcon, XIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { DatePicker1 } from "@/components/ui/shadcn/DatePicker1";

import { isWithinLast10Days } from "@/lib/countDay"; // helper function
import { DropdownMenuForDoc } from "@/pages/doc-page/DropDownMenuForDoc";
import { TypeSelection } from "@/pages/doc-page/DocTypeSelection";
import { StateSelect } from "@/pages/doc-page/DocStateSelect";
import Filterbar from "@/components/ui/Filterbar";

import { type GetDocsParams } from "@/api/doc.api";
import RelatedDocPicker from "../add-doc-page/RelatedDocPicker";

// Mapping for document status translations
const docStatutTranslations: { [key: string]: string } = {
  New: "Nouveau",
  Updates: "Mises à jour",
  Cancels: "Annulation",
  Updated: "Mis à jour par",
  Canceled: "Annulé par",
};

// Helper function to format date to YYYY-MM-DD without timezone conversion
const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function DocsPage() {
  const { user } = useAuthStore();
  const [filters, setFilters] = useState<GetDocsParams>({});
  const { data: docsResponse, isLoading } = useGetDocs(filters);
  const { mutate: deleteDoc } = useDeleteDoc();
  const { mutate: restoreDoc } = useRestoreDoc();
  const { saveDoc, unSaveDoc, isDocSaved } = useSavedDocs();

  const [editingDoc, setEditingDoc] = useState<Document | null>(null);

  const handleEdit = (doc: Document) => {
    setEditingDoc(doc);
  };

  const handleDelete = (id: number) => {
    deleteDoc(id);
  };

  const handleRestore = (id: number) => {
    restoreDoc(id);
  };

  return (
    <>
      <PageHeader
        title="Documents"
        info="Parcourez et gérez les documents les plus récents."
      />
      <div className="m-auto w-fit">
        <Filterbar setFilters={setFilters} />
      </div>
      <div className="m-auto flex w-[100vw] flex-wrap justify-center gap-4 sm:my-5 sm:w-full md:pr-4 md:pl-1">
        {isLoading ? (
          <LoadingSkelaton />
        ) : (
          <>
            <Table className="mb-9 overflow-hidden rounded-2xl bg-white">
              <TableHeader className="bg-boa-sky/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[30px]"></TableHead>
                  <TableHead className="w-[350px] max-w-[350px]">
                    Titre
                  </TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>État</TableHead>
                  <TableHead className="max-w-[350px]">Doc Lié</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Ajouté par</TableHead>
                  <TableHead>Actif</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {docsResponse &&
                  docsResponse.data &&
                  docsResponse.data.map((doc) => {
                    const date = new Date(doc.attributes.docCreationDate);
                    const yearMonth = date.toISOString().slice(0, 7); // show only year and month

                    const hasAccess =
                      user?.is_admin ||
                      (user?.id === doc.relationships.author.data.id &&
                        isWithinLast10Days(doc.attributes.createdAt));

                    return (
                      <TableRow
                        key={doc.id}
                        className={`even:bg-boa-sky/10 hover:bg-boa-sky/30 ${doc.attributes.isActive ? "" : "font-light"}`}
                      >
                        <TableHead className="w-[30px]">
                          <DropdownMenuForDoc
                            doc={doc}
                            openEdit={() => handleEdit(doc)}
                            onDelete={() => handleDelete(doc.id)}
                            onRestore={() => handleRestore(doc.id)}
                            onSave={() =>
                              isDocSaved(doc.id)
                                ? unSaveDoc(doc.id)
                                : saveDoc(doc)
                            }
                            isSaved={isDocSaved(doc.id)}
                            hasAccess={hasAccess}
                          />
                        </TableHead>
                        <TableCell
                          className={`max-w-[350px] overflow-auto ${doc.attributes.isActive ? "" : "line-through"}`}
                        >
                          {doc.attributes.title}
                        </TableCell>
                        <TableCell>{yearMonth}</TableCell>

                        <TableCell>
                          {docStatutTranslations[doc.attributes.docStatut] ||
                            doc.attributes.docStatut}
                        </TableCell>

                        <TableCell className="max-w-[350px] overflow-auto">
                          {doc.relationships.relatedDocument?.data?.title}
                        </TableCell>
                        <TableCell>{doc.attributes.docType}</TableCell>
                        <TableCell>
                          {doc.relationships?.direction?.data?.name}
                        </TableCell>
                        <TableCell>
                          {doc.relationships?.author?.data?.email.split("@")[0]}
                        </TableCell>
                        <TableCell>
                          {doc.attributes.isActive ? "Actif" : "Supp"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </>
        )}
        {editingDoc && (
          <div className="bg-opacity-50 bg-boa-blue/20 fixed inset-0 z-50 flex items-center justify-center">
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
    </>
  );
}

// ! -*/-*/-*/-*/-*/-*/-*/-*/-*/-*/-*-*/-*/-*/-*/-*/-*/-*/-*/-*/-*/-*/-*/
// ! -*/-*/-*/-*/-*/-*/-*/-*/-*/-*/-*-*/-*/-*/-*/-*/-*/-*/-*/-*/-*/-*/-*/
// ! -*/-*/-*/-*/-*/-*/-*/- S E P A R A T O R -*/-*/-*/-*/-*/-*/-*/-*/-*/
// ! -*/-*/-*/-*/-*/-*/-*/-*/-*/-*/-*-*/-*/-*/-*/-*/-*/-*/-*/-*/-*/-*/-*/
// ! -*/-*/-*/-*/-*/-*/-*/-*/-*/-*/-*-*/-*/-*/-*/-*/-*/-*/-*/-*/-*/-*/-*/

const state = [
  { id: 1, title: "New" },
  { id: 2, title: "Updates" },
  { id: 3, title: "Cancels" },
  { id: 4, title: "Updated" },
  { id: 5, title: "Canceled" },
];

type DocInfoEditProps = {
  doc: Document;
  setIsOpen: () => void;
  onUpdateSuccess?: () => void;
};

export function DocInfoEdit({
  doc,
  setIsOpen,
  onUpdateSuccess,
}: DocInfoEditProps) {
  const { mutate: updateDoc, isPending } = useUpdateDoc();
  const { data: docTypesResponse } = useGetDocTypes();

  const [title, setTitle] = useState(doc.attributes.title);
  const [docTypeId, setDocTypeId] = useState<string | undefined>(
    docTypesResponse?.data
      ? String(
          docTypesResponse.data.find(
            (dt) => dt.attributes.name === doc.attributes.docType,
          )?.id,
        )
      : undefined,
  );
  const [docCreationDate, setDocCreationDate] = useState<Date | undefined>(
    new Date(doc.attributes.docCreationDate),
  );
  const [docStatutId, setDocStatutId] = useState<string | undefined>(
    String(state.find((s) => s.title === String(doc.attributes.docStatut))?.id),
  );

  const [relatedDocId, setRelatedDocid] = useState(
    doc.relationships.relatedDocument?.data?.id
      ? String(doc.relationships.relatedDocument.data.id)
      : "",
  );
  const [relatedDocTitle, setRelatedDocTitle] = useState(
    doc.relationships.relatedDocument?.data?.title || "",
  );
  const [fetchedRelatedDocs, setFetchedRelatedDocs] = useState<Document[]>([]);
  const [docRelatedDate, setDocRelatedDate] = useState<Date | undefined>();

  const handleRelatedDate = async (date: Date) => {
    setDocRelatedDate(date);
    try {
      // Correctly format the date before sending it to the API
      const response = await getDocsByDate(formatDateToYYYYMMDD(date));
      setFetchedRelatedDocs(response.data);
      setIsRelatedPop(true);
    } catch (error) {
      console.error("Failed to fetch related documents", error);
    }
  };

  const [isRelatedPop, setIsRelatedPop] = useState(false);
  const handleRelatedDoc = (doc: Document) => {
    setRelatedDocid("" + doc.id);
    setRelatedDocTitle(doc.attributes.title);
    setIsRelatedPop(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UpdateDocPayload = { data: { attributes: {} } };

    // if input doesn't change it won't be sent in the request
    if (title !== doc.attributes.title) {
      payload.data.attributes.title = title;
    }
    if (
      docTypeId &&
      docTypesResponse?.data.find((dt) => dt.id === Number(docTypeId))
        ?.attributes.name !== doc.attributes.docType
    ) {
      payload.data.attributes.docType = Number(docTypeId);
    }
    if (
      docCreationDate &&
      // Correctly format the date for comparison to prevent unnecessary updates
      formatDateToYYYYMMDD(new Date(docCreationDate)) !==
        new Date(doc.attributes.docCreationDate).toISOString().slice(0, 10)
    ) {
      // Correctly format the date before sending it to the API
      payload.data.attributes.docCreationDate = formatDateToYYYYMMDD(
        new Date(docCreationDate),
      );
    }
    if (
      docStatutId &&
      state.find((s) => s.id === Number(docStatutId))?.title !==
        String(doc.attributes.docStatut)
    ) {
      payload.data.attributes.docStatut = Number(docStatutId);
    }

    if (
      relatedDocId &&
      Number(relatedDocId) !== doc.relationships.relatedDocument?.data?.id
    ) {
      payload.data.relationships = {
        relatedDocument: {
          data: {
            id: Number(relatedDocId),
          },
        },
      };
    }

    if (
      Object.keys(payload.data.attributes).length > 0 ||
      payload.data.relationships
    ) {
      updateDoc(
        { id: doc.id, payload },
        {
          onSuccess: () => {
            setIsOpen();
            onUpdateSuccess?.();
          },
        },
      );
    }
  };

  return (
    <Card className="z-50 w-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <PenIcon />
            <div className="grid gap-2">
              <CardTitle>
                <h4>Modifier le document</h4>
              </CardTitle>
              <CardDescription>
                Gardez celles que vous ne souhaitez pas changer
              </CardDescription>
            </div>
          </div>
          <Button
            variant={"ghost"}
            onClick={setIsOpen}
            className="rounded-full bg-gray-50 text-2xl"
          >
            <XIcon />
          </Button>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="Title">Titre</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="typeSelect">Type</Label>
              <TypeSelection
                types={
                  docTypesResponse?.data
                    .filter((dt) => dt.attributes.isActive)
                    .map((dt) => ({
                      id: dt.id,
                      name: dt.attributes.name,
                    })) || []
                }
                typeId={docTypeId}
                setType={setDocTypeId}
              />
            </div>
            <div className="flex items-center gap-1">
              <DatePicker1
                label="Date creation du document"
                date={docCreationDate}
                setDate={setDocCreationDate}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stateSelection">État</Label>
              <StateSelect stateId={docStatutId} setState={setDocStatutId} />
            </div>

            {docStatutId !== "1" && (
              <div>
                <div>Choisissez le document associé</div>
                <div className="flex flex-wrap items-center gap-2">
                  <DatePicker1
                    label=""
                    date={docRelatedDate}
                    setDate={(date) => {
                      if (date) {
                        handleRelatedDate(date);
                      }
                    }}
                  />
                  <div className="flex w-fit items-center text-sm font-light">
                    <span className="text-xs font-light">
                      vous pouvez trouver un document associé en utilisant sa
                      date de creation
                    </span>
                    {/* <Button size={"icon"} variant={"ghost"}>
                      <InfoIcon />
                    </Button> */}
                  </div>
                </div>
                {isRelatedPop && (
                  <RelatedDocPicker
                    fetchedRelatedDocs={fetchedRelatedDocs}
                    setIsRelatedPop={setIsRelatedPop}
                    handleRelatedDoc={handleRelatedDoc}
                  />
                )}
                {relatedDocTitle && (
                  <div
                    onClick={() => setIsRelatedPop(true)}
                    className="hover:text-boa-sky rounded-lg border-1 border-gray-300 bg-gray-100 p-2 hover:cursor-pointer"
                  >
                    <span>{relatedDocTitle}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="mt-8 flex-col gap-2">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Updating..." : "Confirmer"}
          </Button>
          <Button variant="outline" className="w-full" onClick={setIsOpen}>
            Annuler
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
