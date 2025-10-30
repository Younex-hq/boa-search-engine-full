import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { useAuthStore } from "@/store/auth";
import { LogOutIcon } from "lucide-react";

export default function LogoutDropDownMenu() {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex justify-between">
          <span className="p-2">Déconnecter</span>
          <span className="cursor-pointer rounded-md p-2 hover:text-red-400">
            <LogOutIcon />
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px]">
        <DropdownMenuLabel className="text-black/50">
          Êtes-vous sûr(e)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          Oui, se Déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
