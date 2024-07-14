import React, { useEffect, useState } from "react";
import { SearchParameters } from "../Model";
import { Autocomplete, TextField } from "@mui/material";
import { search } from "../apiFetch";
import SearchIcon from "@mui/icons-material/Search";

interface SearchFormViewProps {
  currentSearch: SearchParameters;
  onSearchQueryChanged: (value: string) => void;
  onGameClick: () => void;
}

export const SearchFormView: React.FC<SearchFormViewProps> = ({
  currentSearch,
  onSearchQueryChanged,
  onGameClick,
}) => {
  const [query, setQuery] = useState<string>(currentSearch.query);
  const [lastUserQuery, setLastUserQuery] = useState<string>(currentSearch.query);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);

  useEffect(() => {
    if (query.trim() !== '' && query !== lastUserQuery) {

      const fetchAutocompleteOptions = async () => {
        try {
          const response = await search(query, [], [], "", 1, 10); // Fetch the first 10 games based on the query
          const gameNames = response.results.map((game) => game.name); // Extract game names
          setAutocompleteOptions(gameNames);
        } catch (error) {
          console.error("Error fetching autocomplete options:", error);
        }
      };

      fetchAutocompleteOptions();
    } else {
      setAutocompleteOptions([]); 
    }
  }, [query, lastUserQuery]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearchQueryChanged(e.target.value);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) =>{
    if (e.target.value) {
      setQuery(e.target.value);
      onSearchQueryChanged(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setLastUserQuery(query); 
      onGameClick();
    }
  };

  return (
    <div className="search-bar">
      <SearchIcon fontSize="large" />
      <Autocomplete
        className="search-bar-input"
        options={autocompleteOptions}
        freeSolo
        onSelect={handleSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            type="text"
            variant="outlined"
            size="small"
            label="Search for games"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            // InputProps={{ sx: { borderRadius: 20 } }}
          />
        )}
      />
    </div>
  );
};
