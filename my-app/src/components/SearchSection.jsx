import React, { useState } from "react";

const SearchSection = ({ onSearch, onClearSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim() !== "" && onSearch) {
      onSearch(query.toLowerCase());
    }
  };

  const handleClear = () => {
    setQuery(""); // Clears input field
    if (onClearSearch) {
      onClearSearch(); // Clears search results
    }
    window.location.reload(); // Reloads the page to reset everything
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="search-section">
      <h2 className="findname">
        <span>F</span><span>i</span><span>n</span><span>d</span><span> </span>
        <span>m</span><span>y</span><span> </span><span>H</span><span>e</span><span>l</span>
        <span>p</span><span>e</span><span>r</span>
      </h2>

      <div className="search-controls">
        <input
          type="text"
          id="service-search"
          placeholder="Search for a service (e.g., plumbing, painting, AC repair...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <div className="search-buttons">
          <button onClick={handleSearch} className="search-btn">
            <i className="fas fa-search"></i> Search
          </button>
          <button onClick={handleClear} className="clear-btn">
            <i className="fas fa-times"></i> Clear
          </button>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
