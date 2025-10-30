import { SelectNative } from "@/components/ui/shadcn/select-native";

type TypeSelectionProps = {
  types: { id: number | string; name: string }[];
  typeId?: string;
  setType: (value: string | undefined) => void;
  className?: string;
};
export function TypeSelection({
  types,
  typeId,
  setType,
  className,
}: TypeSelectionProps) {
  return (
    <div className={`*:not-first:mt-2 ${className}`}>
      <SelectNative
        id="typeSelection"
        value={typeId || ""}
        onChange={(e) => setType(e.target.value || undefined)}
      >
        <option value="">Sélectionner le type</option>
        {types.map((T) => (
          <option key={T.id} value={T.id}>
            {T.name}
          </option>
        ))}
      </SelectNative>
    </div>
  );
}
