import { SelectNative } from "./shadcn/select-native";
import { useState } from "react";
import { Button } from "./shadcn/button";
import {
  Check,
  LucideBoxSelect,
  RefreshCcwIcon,
  Trash2Icon,
  TrashIcon,
  UsersIcon,
} from "lucide-react";
import { useGetUsers } from "@/hooks/useUser";
import { useAuthStore } from "@/store/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";

import { type GetDocsParams } from "@/api/doc.api";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Filterbar({
  setFilters,
}: {
  setFilters: (params: GetDocsParams) => void;
}) {
  const { user: currentUser } = useAuthStore();
  const { data: usersResponse } = useGetUsers();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isActiveFilter, setIsActiveFilter] = useState<0 | 1 | undefined>(
    undefined,
  );

  // to not add a number to selcted when just selecting self
  const [selfSeleced, setSelfSeleced] = useState(false);
  const selectedLength = selectedUsers.length - (selfSeleced ? 1 : 0);

  const handleUserSelect = (userId: string) => {
    const newSelectedUsers = [...selectedUsers];
    if (newSelectedUsers.includes(userId)) {
      newSelectedUsers.splice(newSelectedUsers.indexOf(userId), 1);
    } else {
      newSelectedUsers.push(userId);
    }
    setSelectedUsers(newSelectedUsers);
    setFilters({
      userIds: newSelectedUsers.map((id) => Number(id)),
      isActive: isActiveFilter,
    });
  };

  const handleShowMyDocs = () => {
    const myId = String(currentUser?.id);
    if (!myId) return;

    setSelfSeleced((prev) => !prev);

    const newSelectedUsers = [...selectedUsers];
    if (newSelectedUsers.includes(myId)) {
      newSelectedUsers.splice(newSelectedUsers.indexOf(myId), 1);
    } else {
      newSelectedUsers.push(myId);
    }
    setSelectedUsers(newSelectedUsers);
    setFilters({
      userIds: newSelectedUsers.map((id) => Number(id)),
      isActive: isActiveFilter,
    });
  };
  const handleDeleted = () => {
    const newIsActive = isActiveFilter === 0 ? undefined : 0;
    setIsActiveFilter(newIsActive);
    setFilters({
      userIds: selectedUsers.map((id) => Number(id)),
      isActive: newIsActive,
    });
  };

  const handleReset = () => {
    setSelectedUsers([]);
    setIsActiveFilter(undefined);
    setFilters({});
  };

  return (
    <div className="bg-boa-sky/10 mx-[1.5vw] my-2 flex w-[97vw] flex-wrap justify-center gap-3 rounded-xl p-2 sm:w-fit">
      <div>
        <Button onClick={handleReset} variant={`outline`}>
          <RefreshCcwIcon />
        </Button>
      </div>
      <div>
        <Button
          onClick={handleShowMyDocs}
          variant={
            selectedUsers.includes(String(currentUser?.id ?? -1))
              ? "default"
              : `outline`
          }
        >
          {selectedUsers.includes(String(currentUser?.id ?? -1)) ? (
            <Check />
          ) : (
            <LucideBoxSelect />
          )}
          Mes docs
        </Button>
      </div>
      {currentUser?.is_admin && (
        <Button
          className="flex"
          // variant={selectedLength > 0 ? `default` : `outline`} // popover is a button can't put a button in a button
          asChild
        >
          <Popover>
            <PopoverTrigger
              className={` ${selectedLength > 0 ? "bg-boa-sky hover:bg-boa-sky/90 text-white" : "hover:text-boa-blue bg-gray-100"} h-[35px] cursor-pointer rounded-md px-4 shadow`}
            >
              {selectedLength > 0 ? (
                `${selectedLength} choisis`
              ) : (
                <span className="flex items-center gap-2">
                  <UsersIcon size={18} /> Utilisateurs
                </span>
              )}
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <SelectNative
                className=""
                id="userSelection"
                value={selectedUsers}
                onChange={(e) => handleUserSelect(e.target.value)}
                multiple
              >
                {usersResponse?.data.map(
                  (user) =>
                    currentUser?.id !== user.id && ( // don't show the name of the user in the list
                      <option
                        key={user.id}
                        value={String(user.id)}
                        className="hover:bg-gray-100"
                      >
                        -{" "}
                        {user.attributes.firstName +
                          " " +
                          user.attributes.lastName}
                      </option>
                    ),
                )}
              </SelectNative>
            </PopoverContent>
          </Popover>
        </Button>
      )}
      <Button
        onClick={handleDeleted}
        variant={isActiveFilter === 0 ? `default` : `outline`}
      >
        {isActiveFilter === 0 ? <Trash2Icon /> : <TrashIcon />}
        {!useIsMobile() && "Supprimé"}
      </Button>
    </div>
  );
}
