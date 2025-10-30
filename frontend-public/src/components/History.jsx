import { useState } from "react";
import SecondayButton from "./ui/SecondayButton";

import { History as IconHistory } from "lucide-react";

export default function History({ history, setQueryFromHistory }) {
  const [isShown, setIsShown] = useState(false);

  return (
    <div className="rounded-xl sm:m-10 sm:mt-0">
      <div className="flex items-center justify-end">
        {/* show and hid history list */}
        <SecondayButton
          isActive={isShown}
          onClick={() => setIsShown((prev) => !prev)}
        >
          <IconHistory size={18} />
          Historique des recherches
        </SecondayButton>
      </div>

      {isShown && (
        <div className="bg-boa-sky/5 overflow-hidden rounded-xl">
          <HistoryList
            history={history}
            setQueryFromHistory={setQueryFromHistory}
          />
        </div>
      )}
    </div>
  );
}

function HistoryList({ history, setQueryFromHistory }) {
  return (
    <ul className="max-h-[25vh] overflow-x-hidden">
      {history.map((his, index) => (
        <Item key={index} his={his} setQueryFromHistory={setQueryFromHistory} />
      ))}
    </ul>
  );
}

function Item({ his, setQueryFromHistory }) {
  return (
    <li
      onClick={() => setQueryFromHistory(his)}
      className="hover:text-boa-blue active:text-boa-gold flex w-full cursor-pointer justify-between p-2 pl-4 text-gray-500 hover:bg-white"
    >
      <span>{his}</span>
    </li>
  );
}
