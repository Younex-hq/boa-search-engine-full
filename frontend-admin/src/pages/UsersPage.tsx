import { useState, useEffect } from "react";
import PageHeader from "@/layouts/PageTitleHeader";

import { useGetDirections } from "@/hooks/useDirections";
import {
  useDeleteUser,
  useGetUsers,
  useRestoreUser,
  useUpdateUser,
} from "@/hooks/useUser";

import { RadioGroup, RadioGroupItem } from "@/components/ui/shadcn/radio-group";
import { Button } from "@/components/ui/shadcn/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/shadcn/input";
import { SelectNative } from "@/components/ui/shadcn/select-native";
import InputPasswordToggle from "@/components/input-password-toggle";
import LoadingSkelaton from "@/components/loading/LoadingSkelaton";

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

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";

import { EllipsisVerticalIcon, PenIcon, Trash2Icon, XIcon } from "lucide-react";

import { useLocation } from "react-router";

export type ApiUser = {
  id: number;
  type: string;
  attributes: {
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
    isActive: number;
  };
  relationships: {
    direction: {
      data: {
        type: string;
        id: number;
        name: string | null;
        location: string | null;
      };
    };
  };
};
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/shadcn/alert-dialog";

export default function UsersPage() {
  const { data: usersResponse, isLoading } = useGetUsers();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: restoreUser } = useRestoreUser();
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const highlightEmail = searchParams.get("highlightEmail")?.trim();

  const handleEdit = (user: ApiUser) => {
    setEditingUser(user);
  };

  const handleCloseEdit = () => {
    setEditingUser(null);
  };

  const sortedUsersByAdmin =
    usersResponse?.data
      ?.slice()
      .sort(
        (a, b) => Number(b.attributes.isAdmin) - Number(a.attributes.isAdmin),
      ) ?? []; // sort by admin to user

  const sortedbyAdminActive =
    sortedUsersByAdmin
      ?.slice()
      .sort(
        (a, b) => Number(b.attributes.isActive) - Number(a.attributes.isActive),
      )
      .filter((user) => user.id !== 1) ?? []; // don't show the user with id 1, the user that holds the forgot password notifications

  return (
    <>
      <PageHeader
        title="Les Utilisateur"
        info="les utilisateurs qui peuvent accéder à ce panneau d'administration"
      />
      {isLoading ? (
        <LoadingSkelaton />
      ) : (
        <div className="m-auto flex w-[100vw] flex-wrap justify-center gap-4 sm:my-5 sm:w-full md:pr-4 md:pl-1">
          <Table className="mb-9 overflow-hidden rounded-2xl bg-white">
            <TableHeader className="bg-boa-sky/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[30px]"></TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Admin / Utilisateur</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Actif</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedbyAdminActive.map((user) => {
                return (
                  <TableRow
                    key={user.id}
                    className={`even:bg-boa-sky/10 hover:bg-boa-sky/30 ${user.attributes.isActive ? "" : "font-light"} ${user.attributes.email.trim() == highlightEmail ? "border-boa-gold border-3" : ""}`}
                  >
                    <TableHead className="w-[30px]">
                      <DropDownMenuUserInfo
                        user={user}
                        onDelete={deleteUser}
                        onRestore={restoreUser}
                        onEdit={handleEdit}
                      />
                    </TableHead>
                    <TableCell>{user.attributes.firstName}</TableCell>
                    <TableCell>{user.attributes.lastName}</TableCell>
                    <TableCell>{user.attributes.email}</TableCell>
                    <TableCell
                      className={`${user.attributes.isAdmin ? "font-bold" : ""}`}
                    >
                      {user.attributes.isAdmin ? "Admin" : "Utilisateur"}
                    </TableCell>
                    <TableCell>
                      {user.relationships?.direction?.data?.name}
                    </TableCell>
                    <TableCell>
                      {user.attributes.isActive ? "Actif" : "Supp"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {editingUser && (
            <div className="bg-opacity-50 bg-boa-blue/20 fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute top-0 left-0 h-[100vh] w-[100vw] bg-transparent"
                onClick={handleCloseEdit}
              ></div>
              <EditUserInfo user={editingUser} onEdit={handleCloseEdit} />
            </div>
          )}
        </div>
      )}
    </>
  );
}

type DropDownMenuUserInfoProps = {
  user: ApiUser;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onEdit: (user: ApiUser) => void;
};

function DropDownMenuUserInfo({
  user,
  onDelete,
  onRestore,
  onEdit,
}: DropDownMenuUserInfoProps) {
  const isActive = user.attributes.isActive;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="m-0 p-0" size="icon">
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <PenIcon className="mr-2 h-4 w-4" /> Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => (isActive ? onDelete(user.id) : onRestore(user.id))}
        >
          <Trash2Icon className="mr-2 h-4 w-4" />
          {isActive ? "Supprimer" : "Restaurer"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type EditUserInfoProps = {
  user: ApiUser;
  onEdit: () => void;
};

export function EditUserInfo({ user, onEdit }: EditUserInfoProps) {
  type Attributes = {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    isAdmin?: boolean;
    isActive?: boolean;
  };

  type Relationships = {
    direction: {
      data: {
        name: number;
      } | null;
    };
  };

  type UpdateUserPayload = {
    data: {
      attributes?: Attributes;
      relationships?: Relationships;
    };
  };

  const { mutate: updateUser } = useUpdateUser();
  const { data: directionsResponse } = useGetDirections();
  const [formData, setFormData] = useState({
    firstName: user.attributes.firstName,
    lastName: user.attributes.lastName,
    email: user.attributes.email,
    password: "",
    isAdmin: user.attributes.isAdmin,
    directionId: user.relationships.direction?.data.id?.toString() || "",
  });

  useEffect(() => {
    setFormData({
      firstName: user.attributes.firstName,
      lastName: user.attributes.lastName,
      email: user.attributes.email,
      password: "",
      isAdmin: user.attributes.isAdmin,
      directionId: user.relationships.direction?.data.id?.toString() || "",
    });
  }, [user]);

  const emailChanged = formData.email !== user.attributes.email;
  const passwordChanged = formData.password !== "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value === "true" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const attributes: Attributes = {};
    if (formData.firstName !== user.attributes.firstName) {
      attributes.firstName = formData.firstName;
    }
    if (formData.lastName !== user.attributes.lastName) {
      attributes.lastName = formData.lastName;
    }
    if (formData.email !== user.attributes.email) {
      attributes.email = formData.email;
    }
    if (formData.password) {
      attributes.password = formData.password;
    }
    if (formData.isAdmin !== user.attributes.isAdmin) {
      attributes.isAdmin = formData.isAdmin;
    }

    let relationships: Relationships | undefined = undefined;
    const initialDirectionId =
      user.relationships.direction?.data.id?.toString() || "";
    if (formData.directionId !== initialDirectionId) {
      relationships = {
        direction: {
          data: formData.directionId
            ? { name: Number(formData.directionId) }
            : null,
        },
      };
    }

    const payload: UpdateUserPayload = { data: {} };
    if (Object.keys(attributes).length > 0) {
      payload.data.attributes = attributes;
    }
    if (relationships) {
      payload.data.relationships = relationships;
    }

    if (Object.keys(payload.data).length > 0) {
      updateUser({ id: user.id, payload } as Parameters<typeof updateUser>[0]);
    }
    onEdit();
  };

  const submitButton = (
    <Button type="submit" className="w-full">
      confirm
    </Button>
  );

  return (
    <Card className="z-50 w-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center md:gap-4">
            <span className="text-boa-sky">
              <PenIcon />
            </span>
            <div className="boa-gradient grid gap-2">
              <CardTitle>
                <h4>Modifier Info</h4>
              </CardTitle>
              <CardDescription>
                Gardez celles que vous ne souhaitez pas changer
              </CardDescription>
            </div>
          </div>
          <Button
            variant={"ghost"}
            className="rounded-full bg-gray-50 text-2xl"
            onClick={onEdit}
          >
            <XIcon />
          </Button>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex w-full gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="grid flex-1 gap-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="direction">Direction</Label>
              <DirectionSelection
                directions={
                  directionsResponse?.data.filter(
                    (direction) => direction.attributes.isActive !== 0,
                  ) || []
                }
                directionId={formData.directionId}
                setDirection={(value) =>
                  setFormData((prev) => ({ ...prev, directionId: value || "" }))
                }
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="isAdmin">Admin ?</Label>
              <RadioGroup
                defaultValue={formData.isAdmin ? "true" : "false"}
                onValueChange={(value) => handleRadioChange("isAdmin", value)}
                className="flex items-center gap-8 rounded-md border-1 p-1 pl-3 shadow-xs"
              >
                <div className="hover:bg-boa-sky/5 flex items-center space-x-2 rounded-full">
                  <RadioGroupItem value="false" id="NoAdmin" />
                  <Label htmlFor="NoAdmin">No</Label>
                </div>
                <div className="hover:bg-boa-sky/5 flex items-center space-x-2 rounded-full">
                  <RadioGroupItem value="true" id="YesAdmin" />
                  <Label htmlFor="YesAdmin">Oui</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <InputPasswordToggle
                label="Mot de passe"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Changer le mot de passe"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-8 flex-col gap-2">
          {emailChanged || passwordChanged ? (
            <AlertConfirmation message="This action cannot be undone. This will permanently update the account.">
              {submitButton}
            </AlertConfirmation>
          ) : (
            submitButton
          )}
          <Button variant="outline" className="w-full" onClick={onEdit}>
            Annuler
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export function DirectionSelection({
  directions,
  directionId,
  setDirection,
  className,
}: {
  directions: { id: number | string; attributes: { name: string } }[];
  directionId?: string;
  setDirection: (value: string | undefined) => void;
  className?: string;
}) {
  return (
    <div className={`*:not-first:mt-2 ${className}`}>
      <SelectNative
        id="typeSelection"
        value={directionId || ""}
        onChange={(e) => setDirection(e.target.value || undefined)}
      >
        <option value="">Sélectionner la direction</option>
        {directions.map((d) => (
          <option key={d.id} value={d.id}>
            {d.attributes.name}
          </option>
        ))}
      </SelectNative>
    </div>
  );
}

export function AlertConfirmation({
  message,
  children,
}: {
  message: string;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
