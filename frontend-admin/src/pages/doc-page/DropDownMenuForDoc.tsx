import { type Document } from "@/api/doc.api";

import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import {
  BookmarkIcon,
  BookmarkXIcon,
  DownloadIcon,
  EllipsisVerticalIcon,
  PenIcon,
  Trash2Icon,
} from "lucide-react";

type DropdownMenuForDocProps = {
  doc: Document;
  openEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onRestore: () => void;
  hasAccess: boolean;
  isSaved: boolean;
};

export function DropdownMenuForDoc({
  doc,
  openEdit,
  onSave,
  onDelete,
  onRestore,
  hasAccess,
  isSaved,
}: DropdownMenuForDocProps) {
  const handleDownload = (docId: number) => {
    window.open(
      `${import.meta.env.VITE_API_BASE_URL}/docs/${docId}/pdf`,
      "_blank",
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="m-0 p-0" size="icon">
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuItem onClick={() => handleDownload(doc.id)}>
          <DownloadIcon className="mr-2 h-4 w-4" /> Télécharger doc principal
        </DropdownMenuItem>
        {doc.relationships.relatedDocument?.data && (
          <DropdownMenuItem
            onClick={() =>
              handleDownload(doc.relationships.relatedDocument.data.id)
            }
          >
            <DownloadIcon className="mr-2 h-4 w-4" /> Télécharger doc lié
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onSave}>
          {isSaved ? (
            <>
              <BookmarkXIcon className="mr-2 h-4 w-4" /> unSave
            </>
          ) : (
            <>
              <BookmarkIcon className="mr-2 h-4 w-4" /> Enregistré
            </>
          )}
        </DropdownMenuItem>
        {hasAccess && (
          <>
            <DropdownMenuItem onClick={openEdit}>
              <PenIcon className="mr-2 h-4 w-4" /> Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={doc.attributes.isActive ? onDelete : onRestore}
            >
              <Trash2Icon className="mr-2 h-4 w-4" />
              {doc.attributes.isActive ? "Supprimer" : "Restaurer"}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
