import { ChevronRight as IconChevronRight } from "lucide-react";

export default function SubCard({ onShowInfo, doc, status, color }) {
  return (
    <div
      onClick={() => onShowInfo(true)}
      className="hover:text-boa-blue hover:border-boa-sky hover:shadow-boa-blue/10 group relative top-[-3px] right-2 ml-auto flex w-[90%] justify-between rounded-br-xl rounded-bl-xl border-1 border-t-0 border-l-2 border-transparent bg-white p-2 text-gray-700 shadow-sm hover:shadow-xl"
    >
      <div className="flex cursor-pointer items-center truncate">
        <p className="p-1">
          <span className={`text-${color} ${color ?? "text-red-400"}`}>
            {status === "Updates"
              ? "Met à jour"
              : status === "Cancels"
                ? "Annule"
                : status === "Updated"
                  ? "Mis à jour par"
                  : status === "Canceled"
                    ? "Annulé par"
                    : status}
          </span>{" "}
          ce document :
        </p>
        <span className="truncate">{doc.attributes.title}</span>
      </div>
      <div className="cursor-pointer opacity-0 group-hover:opacity-100">
        <IconChevronRight />
      </div>
    </div>
  );
}
