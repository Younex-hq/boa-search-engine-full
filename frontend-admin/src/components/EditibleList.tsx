import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import {
  Trash2,
  Pencil,
  Plus,
  Check,
  FileTypeIcon,
  X,
  Undo2Icon,
} from "lucide-react";

type ListItem = {
  id: number;
  name: string;
  isActive: number | boolean;
};

interface EditableListProps {
  items: ListItem[];
  onAddItem: (name: string) => void;
  onUpdateItem: (id: number, name: string) => void;
  onDeleteItem: (id: number) => void;
  onRestoreItem: (id: number) => void;
  name?: string;
  description?: string;
  isAdmin?: boolean;
  className?: string;
}

export function EditableList({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onRestoreItem,
  name = "Document Types",
  description = "Manage your document types",
  isAdmin = true,
  className = "",
}: EditableListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newItemname, setNewItemname] = useState("");
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingItemname, setEditingItemname] = useState("");

  const handleAddItem = () => {
    if (newItemname.trim()) {
      onAddItem(newItemname.trim());
      setNewItemname("");
    }
  };

  const handleDeleteItem = (id: number, isActive: number | boolean) => {
    if (isActive) {
      onDeleteItem(id);
    } else {
      onRestoreItem(id);
    }
  };

  const handleEditItem = (id: number, currentname: string) => {
    setEditingItemId(id);
    setEditingItemname(currentname);
  };

  const handleSaveEdit = () => {
    if (editingItemname.trim() && editingItemId !== null) {
      onUpdateItem(editingItemId, editingItemname.trim());
    }
    setEditingItemId(null);
    setEditingItemname("");
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingItemname("");
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    }
    if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <Card
      className={`relative m-5 w-full max-w-sm bg-gradient-to-br from-white via-white to-gray-50 ${className}`}
    >
      <FileTypeIcon className="text-foreground/10 absolute top-3 right-2 h-16 w-16 stroke-[1.5px]" />
      <CardHeader className="pt-5">
        <div className="flex flex-col gap-3">
          <span className="boa-gradient text-2xl leading-none font-semibold">
            {name}
          </span>
          <span className="text-muted-foreground text-sm leading-none">
            {description}
          </span>
        </div>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        <div className="my-4 flex w-full max-w-lg flex-col justify-between">
          {/* Edit Mode - Add new item */}
          {isEditing && (
            <div className="border-border mb-4 flex gap-2 border-b pb-4">
              <Input
                placeholder="Add new item..."
                value={newItemname}
                onChange={(e) => setNewItemname(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleAddItem}
                disabled={!newItemname.trim()}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          )}

          <ul className="flex flex-col gap-3">
            {items.map(({ name, id, isActive }) => (
              <li
                key={id}
                className={`rounded p-2 transition-colors hover:bg-gray-50 ${
                  isEditing ? "flex items-center justify-between gap-2" : ""
                }`}
              >
                {editingItemId === id ? (
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      value={editingItemname}
                      onChange={(e) => setEditingItemname(e.target.value)}
                      onKeyDown={handleEditKeyPress}
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSaveEdit}
                      className="h-6 w-6 p-0 text-green-600 hover:bg-green-50 hover:text-green-600"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="h-6 w-6 p-0 text-gray-500 hover:bg-gray-50 hover:text-gray-500"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`flex-1 ${isActive ? "" : "text-gray-400 line-through"}`}
                    >
                      {name}
                    </span>
                    {isEditing && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditItem(id, name)}
                          className="text-boa-sky h-6 w-6 p-0 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(id, isActive)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
                        >
                          {isActive ? (
                            <Trash2 className="h-3 w-3" />
                          ) : (
                            <Undo2Icon className="h-3 w-3" color="green" />
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex w-full justify-end">
            {/* Show the button only for the admin */}
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <Check className="h-4 w-4" />
                    Confirmer
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4" />
                    Modifier
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
