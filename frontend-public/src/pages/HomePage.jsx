import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import History from "../components/History";
import SearchBar from "../components/SearchBar";
import ChartGraphique from "../components/ChartGraphique";
import { FileSearch2Icon } from "lucide-react";

export default function HomePage() {
  const { handleSearchQuery } = useOutletContext();
  const [queryFromHistory, setQueryFromHistory] = useState("");

  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem("searchHistory");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }, [history]);

  const addToHistory = (item) => {
    setHistory((prev) => {
      const updated = [item, ...prev.filter((h) => h !== item)];
      return updated.slice(0, 10); // Keep latest 10
    });
  };
  const icon =
    window.innerWidth < 768 ? (
      <FileSearch2Icon size={30} />
    ) : (
      <FileSearch2Icon size={40} />
    ); // change icon size when screen size is changed

  return (
    <>
      {/* <ChartGraphique /> */}
      <div className="text-boa-blue m-auto mt-20 mb-7 flex w-fit items-center gap-4 text-4xl font-bold md:mb-10 md:text-5xl">
        {icon} Documents
      </div>

      <div className="relative m-auto max-w-2xl px-5">
        <SearchBar
          handleSearchQuery={handleSearchQuery}
          addToHistory={addToHistory}
          queryFromHistory={queryFromHistory}
        />
        <History history={history} setQueryFromHistory={setQueryFromHistory} />
      </div>
    </>
  );
}
