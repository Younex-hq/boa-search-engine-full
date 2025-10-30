import { Search as IconSearch, X as IconX } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function SearchBar({
  searchQuery,
  handleSearchQuery,
  queryFromHistory = "",
  addToHistory = () => {}, // default to no-op
  variant = "default",
}) {
  const [searchText, setSearchText] = useState(
    `${variant !== "default" ? searchQuery : ""}`,
  );

  const [showPopup, setShowPopup] = useState(false); // the more than 4 characters popup
  const [isMobile, setIsMobile] = useState(false); // if opened on mobile // set with useEffect

  const inputRef = useRef(null);

  // Dynamic placeholder based on screen size
  const placeholder = isMobile ? " Rechercher..." : " Rechercher... ' / '";

  // handle functions :
  const handleSubmite = () => {
    if (searchText.trim().length > 3) {
      addToHistory(searchText);
      handleSearchQuery(searchText);
    } else {
      setShowPopup(true); // Show popup when search text is too short
      handleInputFocus();
    }
  };

  const handleDeletedText = () => {
    setSearchText("");
    handleInputFocus();
  };

  const handleInputFocus = () => {
    inputRef.current.focus();
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmite();
    }
  };

  // Variant-based styling default or small
  const inputPadding = variant === "default" ? "p-3" : "p-2";
  const autoFocus = variant === "default"; // false for the small version
  const size = variant === "default" ? "max-w-xl" : "w-full";
  const margineX = variant === "default" ? "mx-auto" : "mx-5";

  // use Effects :

  // update the searchText input value with the text from history
  useEffect(() => {
    if (queryFromHistory) setSearchText(queryFromHistory);
  }, [queryFromHistory]);

  // Add keyboard event listener for '/' key
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if '/' is pressed and the input is not already focused
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault(); // Prevent the '/' from being typed
        handleInputFocus();
      }
    };

    // Add event listener to document
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Hide popup after 3 seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // movile brake point
    };

    // Check on initial load
    checkMobile();

    // Add event listener for window resize // wondow is resized = checkMobile() tuns again
    window.addEventListener("resize", checkMobile);

    // Cleanup event listener
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={`${margineX} my-2 h-fit ${size} relative z-10`}>
      <input
        type="text"
        name="SearchBar"
        placeholder={placeholder}
        className={`shadow-boa-sky/10 border-boa-blue/20 w-full rounded-full border-2 bg-white shadow-md ${inputPadding} focus:border-boa-sky focus:shadow-boa-sky/10 px-13 outline-none focus:shadow-xl`}
        autoFocus={autoFocus}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={handleEnterKeyPress}
        ref={inputRef}
        required
      />
      {showPopup && <PopUp />}

      {/* // ! search button */}
      <button
        id="searchButton"
        className={`hover:text-boa-gold absolute start-2 top-0 flex h-full w-10 cursor-pointer transition-all duration-100 ${
          searchText.length > 3 ? `text-boa-sky` : `text-gray-500`
        }`}
        onClick={handleSubmite}
      >
        <IconSearch className="m-auto justify-center" />
      </button>

      {/* // ! cancle button */}
      <button
        id="cancelButton"
        className={`absolute end-3 top-0 flex h-full w-10 cursor-pointer transition-all duration-100 hover:text-red-400 ${
          searchText.length > 0 ? `text-gray-500` : `text-transparent`
        }`}
        onClick={handleDeletedText}
      >
        <IconX className="m-auto justify-center" />
      </button>
    </div>
  );
}

function PopUp() {
  return (
    <div className="absolute top-3 right-15 z-10 rounded-xl bg-white text-sm font-light text-gray-500 sm:bg-transparent">
      La recherche nécessite au moins 4 caractères
    </div>
  );
}
