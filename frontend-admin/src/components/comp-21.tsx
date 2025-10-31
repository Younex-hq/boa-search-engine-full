import { useId, useState } from "react";

import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { SearchIcon } from "lucide-react";

type InputWithButtonProps = {
  lable?: string;
  className?: string;
  handleSearch: (text: string) => void;
};

export default function InputWithButton({
  lable,
  className,
  handleSearch,
  ...props
}: InputWithButtonProps) {
  const id = useId();

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="*:not-first:mt-2 sm:max-w-lg lg:w-lg">
      {lable && <Label htmlFor={id}>Input with end button</Label>}
      <div className={`flex rounded-md shadow-xs ${className}`}>
        <Input
          id={id}
          className="-me-px flex-1 rounded-e-none border-r-0 focus-visible:z-10"
          placeholder="Rechercher..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(searchQuery);
            }
          }}
          minLength={4}
        />
        <button
          className="border-input bg-background hover:bg-accent focus-visible:border-ring focus-visible:ring-ring/50 text-boa-sky hover:text-boa-blue inline-flex cursor-pointer items-center rounded-e-md border border-l-0 px-3 text-sm font-medium transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => handleSearch(searchQuery)}
        >
          <SearchIcon />
        </button>
      </div>
    </div>
  );
}
