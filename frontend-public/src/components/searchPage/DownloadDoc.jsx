import { DownloadIcon } from "lucide-react";
import { usePdfDownload } from "../../hooks/usePdfDownload";

export default function DownloadDoc({ docId, className = "" }) {
  const { mutate: downloadPdf } = usePdfDownload();
  return (
    <div
      onClick={() => downloadPdf(docId)}
      className={`hover:text-boa-sky + flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 hover:font-bold ${className}`}
    >
      <DownloadIcon />
      <span className="hidden sm:inline-block">Télécharger</span>
    </div>
  );
}
