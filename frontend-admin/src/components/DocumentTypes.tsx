import {
  useAddDocType,
  useDeleteDocType,
  useGetDocTypes,
  useRestoreDocType,
  useUpdateDocType,
} from "@/hooks/useDocTypes";
import { EditableList } from "./EditibleList";
import { useAuthStore } from "@/store/auth";
import LoadingSkelaton from "./loading/LoadingSkelaton";

export default function DocumentTypes() {
  const { user } = useAuthStore();
  const { data: docTypes, isLoading } = useGetDocTypes();
  const { mutate: addDocType } = useAddDocType();
  const { mutate: updateDocType } = useUpdateDocType();
  const { mutate: deleteDocType } = useDeleteDocType();
  const { mutate: restoreDocType } = useRestoreDocType();

  const description =
    "Les types avec une ligne barrée signifient qu’ils sont désactivés. Il existe des documents dans ce type, mais ils ne peuvent plus être utilisés.";

  const handleAddItem = (name: string) => {
    addDocType({ data: { attributes: { name } } });
  };

  const handleUpdateItem = (id: number, name: string) => {
    updateDocType({ id, payload: { data: { attributes: { name } } } });
  };

  const handleDeleteItem = (id: number) => {
    deleteDocType(id);
  };

  const handleRestoreItem = (id: number) => {
    restoreDocType(id);
  };

  if (isLoading)
    return (
      <div className="overflow-hidden sm:max-w-xs">
        <LoadingSkelaton />
      </div>
    );

  return (
    <>
      <EditableList
        items={
          docTypes?.data.map(({ id, attributes }) => ({
            id,
            name: attributes.name,
            isActive: attributes.isActive,
          })) || []
        }
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onRestoreItem={handleRestoreItem}
        name="Document Types"
        description={description}
        isAdmin={user?.is_admin || false}
      />
    </>
  );
}
