import PageHeader from "@/layouts/PageTitleHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { Button } from "@/components/ui/shadcn/button";
import {
  BookmarkXIcon,
  DownloadIcon,
  EllipsisVerticalIcon,
} from "lucide-react";
import { useSavedDocs } from "@/hooks/useSavedDocs";
import { type Document } from "@/api/doc.api";

export default function SavedPage() {
  const { savedDocs, unSaveDoc } = useSavedDocs();

  return (
    <>
      <PageHeader
        title="Document Enregistré"
        info="Documents enregistrés pour un accès rapide"
      />
      <div className="m-auto flex w-[100vw] flex-wrap justify-center gap-4 sm:my-5 sm:w-full">
        <Table className="mb-9 overflow-hidden rounded-2xl bg-white">
          <TableHeader className="bg-boa-sky/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[30px]"></TableHead>
              <TableHead className="w-[350px] max-w-[350px]">Titre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>État</TableHead>
              <TableHead className="max-w-[350px]">Doc Lié</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Ajouté par</TableHead>
              <TableHead>Actif</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {savedDocs.map((doc) => {
              const dateValue = doc.attributes.docCreationDate;

              // Check if the date value is a valid, non-empty string or timestamp
              const isValidDate =
                dateValue && !isNaN(new Date(dateValue).getTime());

              let yearMonth = "N/A"; // Provide a default value for invalid dates

              if (isValidDate) {
                const date = new Date(dateValue);
                yearMonth = date.toISOString().slice(0, 7);
              }

              return (
                <TableRow
                  key={doc.id}
                  className={`even:bg-boa-sky/10 hover:bg-boa-sky/30 ${doc.attributes.isActive ? "" : "font-light"}`}
                >
                  <TableHead className="w-[30px]">
                    <DropdownMenuWithShortcuts
                      doc={doc}
                      onUnSave={() => unSaveDoc(doc.id)}
                    />
                  </TableHead>
                  <TableCell className="max-w-[350px] overflow-auto">
                    {doc.attributes.title}
                  </TableCell>
                  <TableCell>{yearMonth}</TableCell>
                  <TableCell>{doc.attributes.docStatut}</TableCell>
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
                    {doc.attributes.isActive ? "Active" : "Deleted"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function DropdownMenuWithShortcuts({
  doc,
  onUnSave,
}: {
  doc: Document;
  onUnSave: () => void;
}) {
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
      <DropdownMenuContent className="z-100 w-60">
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
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onUnSave}>
          <BookmarkXIcon className="mr-2 h-4 w-4" /> unSave
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
