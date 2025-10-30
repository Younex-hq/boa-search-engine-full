import NavLinks from "./NavLinks";
import SavedTab from "./SavedTab";
import NavLink from "./ui/NavLink";

import { Bookmark as IconBookmark } from "lucide-react";

export default function NavBar({
  setShowSaved,
  showSaved,
  savedDocs,
  deleteFromSaved,
}) {
  return (
    <nav className="start-0 top-0">
      <div className="m-auto flex items-center justify-between p-5 pb-2 sm:w-[80%]">
        <NavLinks />

        <div onClick={() => setShowSaved((prev) => !prev)}>
          <NavLink>
            <IconBookmark size={20} />
            <span className="hidden sm:inline-block">Enregistré</span>
          </NavLink>
        </div>
      </div>

      {showSaved && (
        <SavedTab
          setShowSaved={setShowSaved}
          savedDocs={savedDocs}
          deleteFromSaved={deleteFromSaved}
        />
      )}
    </nav>
  );
}
