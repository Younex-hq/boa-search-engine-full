import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";

import { useState, type ReactNode, useEffect } from "react";
import InputPasswordToggle from "./input-password-toggle";
import { Alert, AlertTitle } from "./ui/shadcn/alert";
import { CircleAlertIcon, UserPenIcon } from "lucide-react";

import { useAuthStore } from "@/store/auth";
import { useUpdateUser } from "@/hooks/useUser";
import { type UpdateUserPayload } from "@/api/user.api";

type ProfileDialogProps = {
  children: ReactNode;
};

export default function ProfileEditDialog({ children }: ProfileDialogProps) {
  const { user } = useAuthStore();
  const { mutate, isSuccess, isError, reset, isPending } = useUpdateUser();
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const attributes: UpdateUserPayload["data"]["attributes"] = {};

    if (firstName && firstName !== user?.first_name)
      attributes.firstName = firstName;
    if (lastName && lastName !== user?.last_name)
      attributes.lastName = lastName;
    if (email && email !== user?.email) attributes.email = email;
    if (password) attributes.password = password;

    if (Object.keys(attributes).length > 0 && user) {
      const payload: UpdateUserPayload = {
        data: {
          attributes,
        },
      };
      mutate(
        { id: user.id, payload },
        {
          onSuccess: (response) => {
            const apiUser = response.data;
            const updatedUserProfile = {
              ...user,
              email: apiUser.attributes.email,
              first_name: apiUser.attributes.firstName,
              last_name: apiUser.attributes.lastName,
              is_admin: apiUser.attributes.isAdmin,
              direction_id: apiUser.relationships.direction.data.id,
              is_active: apiUser.attributes.isActive,
            };
            useAuthStore.getState().updateUser(updatedUserProfile);
          },
        },
      );
    }
  };

  useEffect(() => {
    if (isSuccess || isError) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        if (isSuccess) {
          setOpen(false);
        }
        reset();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isError, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{children}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[510px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="flex flex-row items-center gap-3 border-b-1 pb-5">
            <UserPenIcon />
            <div className="from-boa-blue to-boa-sky bg-gradient-to-r bg-clip-text text-transparent">
              <DialogTitle>Modifier vos informations</DialogTitle>
              <DialogDescription>
                Gardez celles que vous ne souhaitez pas changer
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="mt-5 grid gap-6">
            <div className="flex gap-2">
              <div className="grid gap-1">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  name="name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  name="username"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="username-1">Adresse e-mail</Label>
              <Input
                id="username-1"
                name="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <InputPasswordToggle
                label="Mot de passe"
                value={password}
                placeholder="Changer le mot de passe"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {showAlert && isSuccess && <ProfileUpdateAlert isSuccessful={true} />}
          {showAlert && isError && <ProfileUpdateAlert isSuccessful={false} />}
          <DialogFooter className="mt-8 grid grid-cols-2">
            <DialogClose asChild>
              <Button type="button" variant="default">
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant={"outline"}
              className="text-red-600 hover:border-red-800 hover:text-red-800"
              disabled={isPending}
            >
              {isPending ? "Enregistrement..." : "Modifier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProfileUpdateAlert({ isSuccessful }: { isSuccessful: boolean }) {
  return (
    <Alert className="absolute top-0 left-0">
      <CircleAlertIcon />
      <AlertTitle>
        {isSuccessful ? (
          <span className="text-green-600">
            Vos informations ont été mises à jour avec succès
          </span>
        ) : (
          <span className="text-red-400">
            Veuillez réessayer, le profil n’a pas été mis à jour
          </span>
        )}
      </AlertTitle>
    </Alert>
  );
}
