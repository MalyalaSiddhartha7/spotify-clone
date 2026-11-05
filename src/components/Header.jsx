
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  X,
  Clock,
  Trash2,
} from "lucide-react";

function Header({ searchQuery, setSearchQuery, activePage }) {
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("searchHistory")) || [];
    } catch {
      return [];
    }
  });

  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "searchHistory",
      JSON.stringify(searchHistory)
    );
  }, [searchHistory]);

  useEffect(() => {
    if (activePage !== "search") {
      setShowHistory(false);
    }
  }, [activePage]);

  const saveSearch = () => {
    const query = searchQuery.trim();

    if (!query) return;

    setSearchHistory((previous) => [
      query,
      ...previous.filter(
        (item) => item.toLowerCase() !== query.toLowerCase()
      ),
    ].slice(0, 10));

    setShowHistory(false);
  };

  const removeSearch = (search) => {
    setSearchHistory((previous) =>
      previous.filter((item) => item !== search)
    );
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const selectSearch = (search) => {
    setSearchQuery(search);
    setShowHistory(false);
  };

  return (
    <header className="header">
      <div className="navigation-buttons">
        <button aria-label="Go back">
          <ChevronLeft />
        </button>

        <button aria-label="Go forward">
          <ChevronRight />
        </button>
      </div>

      <div className="header-search-wrapper">
        <div className="header-search">
          <Search size={20} />

          <input
            type="text"
            placeholder="Search songs or artists..."
            value={searchQuery}
            onFocus={() => {
              if (activePage === "search") {
                setShowHistory(true);
              }
            }}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                saveSearch();
              }

              if (event.key === "Escape") {
                setShowHistory(false);
              }
            }}
          />

          {searchQuery && (
            <button
              className="clear-search-button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X size={17} />
            </button>
          )}
        </div>

        {activePage === "search" &&
          showHistory &&
          searchHistory.length > 0 && (
            <div className="search-history">
              <div className="search-history-header">
                <h4>Recent searches</h4>

                <button onClick={clearHistory}>
                  Clear history
                </button>
              </div>

              {searchHistory.map((search, index) => (
                <div
                  className="search-history-item"
                  key={`${search}-${index}`}
                >
                  <button
                    className="history-search-text"
                    onClick={() => selectSearch(search)}
                  >
                    <Clock size={16} />
                    <span>{search}</span>
                  </button>

                  <button
                    className="remove-history-button"
                    onClick={() => removeSearch(search)}
                    aria-label={`Remove ${search} from history`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
      </div>

      <button className="profile-button">
        <User size={18} />
        <span>Profile</span>
      </button>
    </header>
  );
}

export default Header;
