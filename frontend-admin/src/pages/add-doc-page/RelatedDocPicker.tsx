import { Card, CardContent, CardHeader } from "@/components/ui/shadcn/card";
import { type Document } from "@/api/doc.api";

type RelatedDocPickerProps = {
  fetchedRelatedDocs: Document[];
  setIsRelatedPop: (value: boolean) => void;
  handleRelatedDoc: (doc: Document) => void;
};

export default function RelatedDocPicker({
  fetchedRelatedDocs,
  setIsRelatedPop,
  handleRelatedDoc,
}: RelatedDocPickerProps) {
  return (
    <div className="bg-opacity-50 bg-boa-blue/20 fixed inset-0 z-60 flex items-center justify-center">
      <div
        className="absolute top-0 left-0 h-[100vh] w-[100vw] bg-transparent"
        onClick={() => setIsRelatedPop(false)} // Close popup on background click
      >
        {/*background*/}
      </div>
      <Card className="z-50 w-xl">
        <CardHeader>choisir le document associé</CardHeader>
        <CardContent className="max-h-[60vh] overflow-y-auto">
          <ul>
            {fetchedRelatedDocs.map((doc) => (
              <li
                key={doc.id} // Added key prop for list items
                onClick={() => handleRelatedDoc(doc)}
                className="hover:bg-boa-sky/20 cursor-pointer rounded-sm border-b-1 py-2 pl-1"
              >
                {doc.attributes.title}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
