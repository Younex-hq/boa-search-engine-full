import {
  BookmarkIcon,
  BookmarkXIcon,
  FileTextIcon,
  PenIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/shadcn/card";
import { Button } from "./ui/shadcn/button";
import { useState } from "react";
import { useGetDoc } from "@/hooks/useDocs";
import { useAuthStore } from "@/store/auth";
import { isWithinLast10Days } from "@/lib/countDay";
import { DocInfoEdit } from "@/pages/doc-page/DocsPage";
import LoadingSkelaton from "./loading/LoadingSkelaton";
import { type Document } from "@/api/doc.api";

type DocInfoCardProps = {
  id: number;
  setIsOpen: () => void;
  onSave: (doc: Document) => void;
  isSaved: boolean;
};

export default function DocInfoCard({
  id,
  setIsOpen,
  onSave,
  isSaved,
}: DocInfoCardProps) {
  const [editInfo, setEditInfo] = useState(false);
  const { user } = useAuthStore();
  const { data: docResponse, isLoading, refetch } = useGetDoc(id, true);

  const handleEdit = () => setEditInfo((prev) => !prev);

  if (isLoading) {
    return <LoadingSkelaton />;
  }

  if (!docResponse) {
    return <div>Document not found</div>;
  }

  const fetchedDoc = docResponse.data;

  const hasAccess =
    user?.is_admin ||
    (user?.id === fetchedDoc.relationships.author.data.id &&
      isWithinLast10Days(fetchedDoc.attributes.createdAt));

  const handleRefresh = () => {
    refetch();
  };

  return (
    <>
      <div className="bg-opacity-50 bg-boa-blue/20 fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute top-0 left-0 h-[100vh] w-[100vw] bg-transparent"
          onClick={setIsOpen}
        ></div>
        <Card className="relative z-50 w-xl">
          <CardHeader>
            <span className="text-sky-600">
              <FileTextIcon className="text-foreground/10 absolute top-3 right-2 h-16 w-16 stroke-[1.5px]" />
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="grid gap-2">
                  <CardTitle
                    className="flex items-center"
                    onClick={handleRefresh}
                  >
                    <h4 className="boa-gradient">Doc Info</h4>
                  </CardTitle>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid w-full gap-2">
            <div>
              <span className="font-bold underline">Titre :</span>{" "}
              {fetchedDoc.attributes.title}
            </div>
            <div>
              <span className="font-bold underline">Type :</span>{" "}
              {fetchedDoc.attributes.docType}
            </div>
            <div>
              <span className="font-bold underline">Statut (Etat) :</span>{" "}
              {fetchedDoc.attributes.docStatut}
            </div>
            <div>
              <span className="font-bold underline">Actif :</span>{" "}
              {fetchedDoc.attributes.isActive ? "Active" : "Deleted"}
            </div>
            <div>
              <span className="font-bold underline">Document lié :</span>{" "}
              {fetchedDoc.relationships.relatedDocument?.data?.title}
            </div>
            <div>
              <span className="font-bold underline">Ajouté par :</span>{" "}
              {fetchedDoc.relationships.author.data.email}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <div className="flex gap-4">
              {hasAccess && (
                <Button variant={"secondary"} onClick={handleEdit}>
                  <PenIcon /> Modifier
                </Button>
              )}
              <Button variant={"secondary"} onClick={() => onSave(fetchedDoc)}>
                {isSaved ? (
                  <>
                    <BookmarkXIcon className="h-4" size={36} />
                    unSave
                  </>
                ) : (
                  <>
                    <BookmarkIcon className="h-4" /> Save
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      {editInfo && (
        <div className="bg-opacity-50 bg-boa-blue/20 fixed inset-0 z-60 flex items-center justify-center">
          <div
            className="absolute top-0 left-0 h-[100vh] w-[100vw] bg-transparent"
            onClick={handleEdit}
          >
            {/*background*/}
          </div>
          <DocInfoEdit
            doc={fetchedDoc}
            setIsOpen={handleEdit}
            onUpdateSuccess={handleRefresh}
          />
        </div>
      )}
    </>
  );
}
