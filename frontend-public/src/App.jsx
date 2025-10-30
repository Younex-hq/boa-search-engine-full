import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useSearch } from "./hooks/useSearch";
import NavBar from "./components/NavBar";

function App() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(() => {
    const stored = localStorage.getItem("savedDocs");
    return stored ? JSON.parse(stored) : [];
  });
  const [showSaved, setShowSaved] = useState(false);

  const { data: searchResult, isLoading, error } = useSearch();

  useEffect(() => {
    localStorage.setItem("savedDocs", JSON.stringify(saved));
  }, [saved]);

  const handleSearchQuery = (query) => {
    navigate(`/search?q=${query}`);
  };

  const addToSaved = (doc) => {
    if (!saved.some((d) => d.id === doc.id)) {
      setSaved((prev) => [...prev, doc]);
    }
  };

  const removeFromSaved = (doc) => {
    if (doc === "all") return setSaved([]);
    setSaved((prev) => prev.filter((d) => d.id !== doc.id));
  };

  return (
    <>
      <NavBar
        savedDocs={saved}
        deleteFromSaved={removeFromSaved}
        showSaved={showSaved}
        setShowSaved={setShowSaved}
      />
      <main>
        <Outlet
          context={{
            docsList: searchResult?.data,
            aiResponse: searchResult?.meta?.ai_response,
            handleSearchQuery,
            addToSaved,
            isLoading,
            error,
          }}
        />
      </main>
    </>
  );
}

export default App;
