import { type SearchResult } from "@/api/search.api";
import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import {
  DownloadIcon,
  EllipsisVerticalIcon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";

type DropdownMenuForSearchDocProps = {
  doc: SearchResult;
  openInfo: () => void;
};

export function DropdownMenuForSearchDoc({
  doc,
  openInfo,
}: DropdownMenuForSearchDocProps) {
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
              handleDownload(doc.relationships.relatedDocument?.data?.id ?? 0)
            }
          >
            <DownloadIcon className="mr-2 h-4 w-4" /> Télécharger doc lié
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={openInfo}>
          <SquareArrowOutUpRightIcon className="mr-2 h-4 w-4" />
          Infos / Modifier
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
