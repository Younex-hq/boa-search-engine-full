import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/ui/shadcn/card";
import { Input } from "@/components/ui/shadcn/input";
import { SelectNative } from "@/components/ui/shadcn/select-native";
import PageHeader from "@/layouts/PageTitleHeader";
import { Label } from "@radix-ui/react-label";
import {
  CheckIcon,
  Link2Icon,
  NetworkIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  Undo2Icon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import {
  useAddDirection,
  useDeleteDirection,
  useGetDirections,
  useRestoreDirection,
  useUpdateDirection,
} from "@/hooks/useDirections";
import LoadingSkelaton from "@/components/loading/LoadingSkelaton";
import {
  type AddDirectionPayload,
  type Direction,
  type UpdateDirectionPayload,
} from "@/api/direction.api";

export default function DirectionPage() {
  const { user } = useAuthStore();
  const { data: directionsResponse, isLoading } = useGetDirections();
  const { mutate: addDirection } = useAddDirection();
  const { mutate: updateDirection } = useUpdateDirection();
  const { mutate: deleteDirection } = useDeleteDirection();
  const { mutate: restoreDirection } = useRestoreDirection();

  const [directions, setDirections] = useState<Direction[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newDirectionName, setNewDirectionName] = useState("");
  const [addParentId, setAddParentId] = useState<string | undefined>(undefined);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingItemName, setEditingItemName] = useState("");
  const [editingItemParentId, setEditingItemParentId] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (directionsResponse) {
      setDirections(directionsResponse.data);
    }
  }, [directionsResponse]);

  const handleAddItem = () => {
    const payload: AddDirectionPayload = {
      data: {
        attributes: {
          name: newDirectionName,
        },
      },
    };

    if (addParentId) {
      payload.data.relationships = {
        parent: {
          data: {
            name: Number(addParentId),
          },
        },
      };
    }

    addDirection(payload, {
      onSuccess: () => {
        setNewDirectionName("");
        setAddParentId(undefined);
      },
    });
  };

  const handleUpdateItem = (id: number) => {
    const originalDirection = directions.find((d) => d.id === id);

    const payload: UpdateDirectionPayload = {
      data: {
        attributes: {},
        relationships: {
          parent: {
            data: {
              name: editingItemParentId ? Number(editingItemParentId) : null,
            },
          },
        },
      },
    };

    if (
      originalDirection &&
      originalDirection.attributes.name !== editingItemName &&
      editingItemName
    ) {
      payload.data.attributes = { name: editingItemName };
    }

    updateDirection(
      {
        id,
        payload,
      },
      {
        onSuccess: () => {
          setEditingItemId(null);
        },
      },
    );
  };

  const handleDeleteItem = (id: number) => {
    deleteDirection(id);
  };

  const handleRestoreItem = (id: number) => {
    restoreDirection(id);
  };

  const handleEditClick = (direction: Direction) => {
    setEditingItemId(direction.id);
    setEditingItemName(direction.attributes.name);
    const parentName = direction.relationships.parent?.data.name;
    const parent = directions.find((d) => d.attributes.name === parentName);
    setEditingItemParentId(parent ? String(parent.id) : undefined);
  };

  if (isLoading)
    return (
      <div className="overflow-hidden sm:max-w-xs">
        <LoadingSkelaton />
      </div>
    );

  return (
    <>
      <PageHeader
        title="Les Directions"
        info="Les directions de la Banque d'Algérie"
      />
      <div className="m-auto flex w-[100vw] flex-wrap justify-center gap-4 sm:my-5 sm:w-full">
        <Card className="relative m-5 w-lg bg-gradient-to-br from-white via-white to-gray-50 sm:w-full sm:max-w-lg">
          <NetworkIcon className="text-foreground/10 absolute top-3 right-2 h-16 w-16 stroke-[1.5px]" />
          <CardHeader>
            <div className="flex flex-col gap-3">
              <span className="boa-gradient text-2xl leading-none font-semibold">
                List des directions
              </span>
              <span className="text-muted-foreground text-sm leading-none sm:pr-5">
                Les directions avec une ligne barrée signifient qu’ils sont
                désactivés. ils ne peuvent plus être utilisés.
              </span>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {isEditing && user?.is_admin && (
              <div className="bg-boa-sky/10 rounded-2xl p-2">
                <div className="text-boa-sky p-2 pt-0 text-center font-bold">
                  Nouvelle direction
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm" htmlFor="adDirection">
                    Nom de la nouvelle direction
                  </Label>
                  <Input
                    className="bg-white"
                    id="addDirection"
                    placeholder="Add new direction"
                    value={newDirectionName}
                    onChange={(e) => setNewDirectionName(e.target.value)}
                  />
                  <DirectionSelection
                    AddParentName={addParentId}
                    directions={directions.map((d) => ({
                      ...d.attributes,
                      id: d.id,
                      relationships: d.relationships,
                    }))}
                    setAddParentName={setAddParentId}
                  />

                  <Button
                    onClick={handleAddItem}
                    disabled={!newDirectionName.trim()}
                    className="flex items-center gap-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </div>
            )}
            <ul>
              {directions.map((dir) => {
                const isEditingThis = editingItemId === dir.id;
                const isActive =
                  dir.attributes.isActive === null ||
                  dir.attributes.isActive === 1;
                return (
                  <li
                    key={dir.id}
                    className={`flex items-center p-1 ${isEditing ? "justify-between" : ""} ${
                      !isActive ? "line-through" : ""
                    }`}
                  >
                    {isEditing && user?.is_admin ? (
                      isEditingThis ? (
                        <div className="flex w-full items-center">
                          <Input
                            type="text"
                            value={editingItemName}
                            onChange={(e) => setEditingItemName(e.target.value)}
                            placeholder="main dir"
                            className="flex-1"
                          />
                          <DirectionSelection
                            AddParentName={editingItemParentId}
                            setAddParentName={setEditingItemParentId}
                            directions={directions.map((d) => ({
                              ...d.attributes,
                              id: d.id,
                              relationships: d.relationships,
                            }))}
                            showLable={false}
                            className="flex-1"
                          />
                          <Button
                            className="h-7 w-7 p-0 text-green-500 hover:bg-green-100"
                            variant={"ghost"}
                            onClick={() => handleUpdateItem(dir.id)}
                          >
                            <CheckIcon />
                          </Button>
                          <Button
                            variant={"ghost"}
                            className="h-7 w-7"
                            onClick={() => setEditingItemId(null)}
                          >
                            <XIcon />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span>{dir.attributes.name}</span>
                          <span className="px-2 text-xs italic">
                            parent: {dir.relationships.parent?.data.name} .
                          </span>
                          <div className="flex items-center">
                            <Button
                              className="text-boa-sky"
                              variant={"ghost"}
                              size={"icon"}
                              onClick={() => handleEditClick(dir)}
                            >
                              <PencilIcon />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                isActive
                                  ? handleDeleteItem(dir.id)
                                  : handleRestoreItem(dir.id)
                              }
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
                            >
                              {isActive ? (
                                <Trash2Icon className="h-3 w-3" />
                              ) : (
                                <Undo2Icon className="h-3 w-3" color="green" />
                              )}
                            </Button>
                          </div>
                        </>
                      )
                    ) : (
                      <div>{dir.attributes.name}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex w-full justify-end">
              {user?.is_admin && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2"
                >
                  {isEditing ? (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      Confirmer
                    </>
                  ) : (
                    <>
                      <PencilIcon className="h-4 w-4" />
                      Modifier / Ajouter
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="hover:text-boa-sky m-auto flex w-[100vw] items-center gap-2 text-xs text-gray-400 hover:underline md:w-fit md:text-sm">
        <Link2Icon size={18} />
        <a href="https://www.bank-of-algeria.dz/organigramme/" target="_blank">
          officielle organigramme de la Banque d'Algérie
        </a>
      </div>
    </>
  );
}

type DirectionSelectionProps = {
  AddParentName?: string;
  setAddParentName: (value: string | undefined) => void;
  showLable?: boolean;
  directions: {
    id: number;
    name: string;
    isActive: number | boolean | null;
    relationships?: {
      parent: {
        data: {
          type: string;
          name: string;
        };
        links: {
          self: string;
        };
      } | null;
    } | null;
  }[];
  className?: string;
};

function DirectionSelection({
  AddParentName,
  setAddParentName,
  directions,
  showLable = true,
  className,
}: DirectionSelectionProps) {
  return (
    <div className={`*:not-first:mt-2 ${className}`}>
      {showLable && (
        <Label className="text-sm" htmlFor="directionSelection">
          Parent direction
        </Label>
      )}
      <SelectNative
        className="bg-white"
        id="directionSelection"
        value={AddParentName || ""}
        onChange={(e) => setAddParentName(e.target.value || undefined)}
      >
        <option value="">No Parent</option>
        {directions.map((dir) => (
          <option key={dir.id} value={dir.id}>
            {dir.name}
          </option>
        ))}
      </SelectNative>
    </div>
  );
}
