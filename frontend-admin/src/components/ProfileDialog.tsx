import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import type { ReactNode } from "react";
import { SquarePenIcon, UserRoundIcon } from "lucide-react";
import ProfileEditDialog from "./ProfileEditDialog";
import { useAuthStore } from "@/store/auth";

type ProfileDialogProps = {
  children: ReactNode;
};

export default function ProfileDialog({ children }: ProfileDialogProps) {
  const { user } = useAuthStore();
  return (
    <Dialog>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex gap-5">
          <DialogTitle className="flex items-center gap-3 border-b-2 pb-3 text-2xl">
            <UserRoundIcon className="text-boa-blue" />
            <div className="from-boa-blue to-boa-sky via-boa-sky bg-gradient-to-r bg-clip-text text-transparent">
              Infos de profil
            </div>
          </DialogTitle>
          <DialogDescription className="text-black">
            <div className="flex gap-4">
              <div className="flex flex-col gap-3">
                <div className="text-lg font-light">Prénom :</div>
                <div className="text-lg font-light">Nom :</div>
                <div className="text-lg font-light">E-mail :</div>
                <div className="text-lg font-light">Mot de passe :</div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="text-lg">{user?.first_name}</div>
                <div className="text-lg">{user?.last_name}</div>
                <div className="text-lg">{user?.email}</div>
                <div className="text-lg">******</div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogHeader>
          <div className="flex justify-end">
            <ProfileEditDialog>
              {/* sub component */}
              <div className="hover:text-boa-blue flex items-center gap-2 px-4 py-2">
                <span>Modifier</span>
                <SquarePenIcon size={20} />
              </div>
            </ProfileEditDialog>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
