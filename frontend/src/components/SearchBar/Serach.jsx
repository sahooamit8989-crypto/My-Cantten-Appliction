


import { useContext, useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./Serach.css";

const Serach = () => {
  const [query, setQuery] = useState("");
  const { setSearchResults, setSearchActive, url } =
    useContext(StoreContext);

  useEffect(() => {
    if (!query) {
      setSearchActive(false);
      setSearchResults([]);
      return;
    }

    setSearchActive(true);

    const timer = setTimeout(async () => {
      const res = await axios.get(`${url}/api/food/search?q=${query}`);
      setSearchResults(res.data);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="search-bar">
      <Search size={18} />
      <input
        type="text"
        placeholder="Search for dishes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && <X size={18} onClick={() => setQuery("")} />}
    </div>
  );
};

export default Serach;
