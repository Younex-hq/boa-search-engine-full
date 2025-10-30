import { SelectNative } from "@/components/ui/shadcn/select-native";

// const state = [
//   { id: 1, title: "New" },
//   { id: 2, title: "Updates" },
//   { id: 3, title: "Cancels" },
//   { id: 4, title: "Updated" },
//   { id: 5, title: "Canceled" },
// ];

const state = [
  { id: 1, title: "Nouveau" },
  { id: 2, title: "Met à jour un autre document " },
  { id: 3, title: "Annule un autre document" },
  { id: 4, title: "Mis à jour par un autre document" },
  { id: 5, title: "Annulé par un autre document" },
];

export function StateSelect({
  stateId,
  setState,
}: {
  stateId?: string;
  setState: (value: string | undefined) => void;
}) {
  return (
    <div className={`*:not-first:mt-2`}>
      <SelectNative
        id="stateSelection"
        value={stateId || ""}
        onChange={(e) => setState(e.target.value || undefined)}
      >
        {/* <option value="">Select State</option> */}
        {state.map((T) => (
          <option key={T.id} value={T.id}>
            {T.title}
          </option>
        ))}
      </SelectNative>
    </div>
  );
}
