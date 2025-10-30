import PageHeader from "@/layouts/PageTitleHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import {
  CircleAlert,
  CircleCheckIcon,
  FilePlusIcon,
  InfoIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react"; // useRef and FileUploadRef are no longer needed
import { TypeSelection } from "../doc-page/DocTypeSelection";
import { useGetDocTypes } from "@/hooks/useDocTypes";
import { DatePicker1 } from "@/components/ui/shadcn/DatePicker1";
import { StateSelect } from "../doc-page/DocStateSelect";
import { getDocsByDate, type Document } from "@/api/doc.api";
import FileUPload from "@/pages/add-doc-page/FileUpload"; // Removed FileUploadRef import
import { useAddDoc } from "@/hooks/useAddDoc";
import { type FileWithPreview } from "@/hooks/use-file-upload";
import { useNavigate } from "react-router";
import RelatedDocPicker from "./RelatedDocPicker";
import ProgressAnimation from "@/components/progress-animation";

// Helper function to format date to YYYY-MM-DD without timezone conversion
const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function AddDocumentPage() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const { mutate: addDoc, isPending } = useAddDoc();

  const toDocList = () => {
    navigate("/docs");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setValidationError("Veuillez ajouter un document PDF");
      setTimeout(() => setValidationError(""), 2000);
      return;
    }
    if (!title) {
      setValidationError("Veuillez saisir un titre");
      setTimeout(() => setValidationError(""), 2000);
      return;
    }
    if (!docCreationDate) {
      setValidationError("Veuillez sélectionner une date de création");
      setTimeout(() => setValidationError(""), 2000);
      return;
    }
    if (!docTypeId) {
      setValidationError("Veuillez sélectionner un type de document");
      setTimeout(() => setValidationError(""), 2000);
      return;
    }
    if (!docStatutId) {
      setValidationError("Veuillez sélectionner un État (statut) de document");
      setTimeout(() => setValidationError(""), 2000);
      return;
    }
    if (docStatutId !== "1" && !relatedDocId) {
      setValidationError("Veuillez sélectionner un document lié");
      setTimeout(() => setValidationError(""), 2000);
      return;
    }
    setValidationError("");

    const payload = {
      title,
      file: file.file as File,
      docType: Number(docTypeId),
      // Correctly format the date before sending it to the API
      docCreationDate: formatDateToYYYYMMDD(docCreationDate),
      docStatut: Number(docStatutId),
      relatedDocument: relatedDocId ? Number(relatedDocId) : undefined,
    };

    const controller = new AbortController();
    setAbortController(controller);

    addDoc(
      {
        payload: { ...payload, docStatut: String(payload.docStatut) },
        signal: controller.signal,
      },
      {
        onSuccess: () => {
          setAbortController(null);
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            navigate("/docs");
            handleCancel();
            // reset();
          }, 3000);
        },
        onError: (error) => {
          setAbortController(null);
          if (error.name === "AbortError") {
            console.log("Upload aborted");
            return;
          }
          const responseData = (
            error as {
              response?: {
                data: {
                  message?: string;
                  data?: {
                    existing_document?: { attributes?: { title?: string } };
                  };
                };
              };
            }
          )?.response?.data;
          if (responseData) {
            setErrorMessage(responseData.message || "An error occurred");
            setDocumentTitle(
              responseData.data?.existing_document?.attributes?.title || "",
            );
            setShowError(true);
            setTimeout(() => {
              setShowError(false);
            }, 2000);
          }
        },
      },
    );
  };

  const { data: docTypesResponse } = useGetDocTypes();
  const [docTypeId, setDocTypeId] = useState<string | undefined>();

  const [docCreationDate, setDocCreationDate] = useState<Date | undefined>();
  const [docRelatedDate, setDocRelatedDate] = useState<Date | undefined>();
  const [relatedDocId, setRelatedDocid] = useState("");
  const [relatedDocTitle, setRelatedDocTitle] = useState("");

  const [docStatutId, setDocStatutId] = useState<string | undefined>("1");
  const [fetchedRelatedDocs, setFetchedRelatedDocs] = useState<Document[]>([]);
  // fileUploadRef is no longer needed as FileUPload doesn't use forwardRef
  // const fileUploadRef = useRef<FileUploadRef>(null);

  const handleCancel = () => {
    if (!isPending) {
      // if not uploading just reset the form
      // setTitle("");
      // setFile(null); // Setting file to null will clear the FileUPload component
      // setDocTypeId(undefined);
      // setDocCreationDate(undefined);
      // setDocRelatedDate(undefined);
      // setRelatedDocid("");
      // setRelatedDocTitle("");
      // setDocStatutId("1");
      window.location.reload(); // reload the page for quick reset
    } else {
      // stop the upload
      if (abortController) {
        abortController.abort();
        setAbortController(null);
        toDocList();
      }
    }
  };

  const [isRelatedPop, setIsRelatedPop] = useState(false);

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

  const handleRelatedDoc = (doc: Document) => {
    setRelatedDocid("" + doc.id);
    setRelatedDocTitle(doc.attributes.title);
    setIsRelatedPop(false);
  };

  return (
    <>
      <PageHeader
        className=""
        title="Ajouter un Document"
        // info="les utilisateurs qui peuvent accéder à ce panneau d'administration"
      />
      <br className="h-1" />
      <div className="m-auto flex w-[100vw] flex-wrap justify-center gap-4 sm:my-5 sm:w-full">
        <Card className="z-50 m-1 w-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex gap-4 sm:items-center">
                <span className="text-boa-sky">
                  <FilePlusIcon />
                </span>
                <div className="boa-gradient grid gap-2">
                  <CardTitle>
                    <h4>Ajouter un nouveau document</h4>
                  </CardTitle>
                  <CardDescription>
                    Le document PDF doit être unique
                  </CardDescription>
                </div>
              </div>
              <Button
                variant={"ghost"}
                className="rounded-full bg-gray-50 text-2xl"
                onClick={toDocList}
              >
                <XIcon />
              </Button>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* FileUPload now directly controlled by `file` state */}
                <FileUPload onFileChange={setFile} />
                <div className="grid gap-2">
                  <Label htmlFor="Title">Titre</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="title de document"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <DatePicker1
                    label="Date creation du document"
                    date={docCreationDate}
                    setDate={setDocCreationDate}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="grid flex-1 gap-2">
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

                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="stateSelection">État</Label>
                    <StateSelect
                      stateId={docStatutId}
                      setState={setDocStatutId}
                    />
                  </div>
                </div>
                {docStatutId !== "1" && (
                  <div>
                    <div>Document Lié</div>
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
                      <div className="flex w-[90%] items-center text-sm font-light">
                        <span className="text-xs font-light">
                          vous pouvez trouver le document lié en utilisant sa
                          date
                        </span>
                        <Button size={"icon"} variant={"ghost"}>
                          <InfoIcon />
                        </Button>
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
                {isPending ? "Uploading..." : "Ajouter"}
              </Button>
              {isPending && <ProgressAnimation />}
              {!isPending && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCancel}
                >
                  Annuler
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
      {showSuccess && <SuccsessMessage />}
      {showError && (
        <ErrorMessage message={errorMessage} documentTitle={documentTitle} />
      )}
      {validationError && <ErrorMessage message={validationError} />}
    </>
  );
}

function SuccsessMessage() {
  return (
    <div className="absolute top-[30vh] left-[50%] z-50 max-w-md rounded-md border border-emerald-500/50 bg-white px-4 py-3 text-emerald-600 shadow-2xl shadow-emerald-300">
      <p className="text-sm">
        <CircleCheckIcon
          className="me-3 -mt-0.5 inline-flex opacity-60"
          size={16}
          aria-hidden="true"
        />
        Document ajouté avec succès !
      </p>
    </div>
  );
}

function ErrorMessage({
  message,
  documentTitle,
}: {
  message: string;
  documentTitle?: string;
}) {
  return (
    <div className="absolute top-[30vh] z-50 w-md max-w-[100vw] rounded-md border border-red-500/50 bg-white px-4 py-3 text-red-600 shadow-2xl shadow-emerald-300 sm:left-[50%] sm:translate-[-25%]">
      <p className="grid gap-2 text-center text-sm">
        <CircleAlert
          className="m-auto inline-flex w-fit opacity-60"
          size={16}
          aria-hidden="true"
        />
        {documentTitle && <span>Le document existe déjà</span>}
        <span className="font-bold text-blue-500">{documentTitle}</span>
        <span>{message}</span>
      </p>
    </div>
  );
}
