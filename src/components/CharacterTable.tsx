import React, { useState, useEffect } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import useFetchRickAndMorty from "../hooks/useFetchRickandMorty.tsx";
import useDebounce from "../hooks/useDebounce.tsx";
import Character from "../interfaces/character.interface";
import styles from "./CharacterTable.module.css";

interface CharacterTableProps {
  columns: string[];
}

const CharacterTable: React.FC<CharacterTableProps> = ({ columns }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data, error, isLoading }: UseQueryResult<Character[], Error> =
    useFetchRickAndMorty(debouncedSearchTerm);

  useEffect(() => {
    if (data) {
      const filteredSuggestions = data
        .flatMap((character) =>
          columns.map((column) => String((character as any)[column]))
        )
        .filter((value, index, self) => self.indexOf(value) === index) // remove duplicates
        .filter((value) =>
          value.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
      setSuggestions(filteredSuggestions);
    }
  }, [debouncedSearchTerm, data, columns]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  const handleInputBlur = () => {
    // Hide suggestions when input loses focus
    setTimeout(() => setSuggestions([]), 100);
  };

  const getHighlightedText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} style={{ backgroundColor: "yellow" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by any attribute"
          value={searchTerm}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        {suggestions.length > 0 && (
          <ul className={styles.autocomplete}>
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error fetching data</div>}
      {data && (
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data
              .filter((character) =>
                columns.some((column) =>
                  String((character as any)[column])
                    .toLowerCase()
                    .includes(debouncedSearchTerm.toLowerCase())
                )
              )
              .map((character: Character) => (
                <tr key={character.id}>
                  {columns.map((column) => (
                    <td key={column}>
                      {getHighlightedText(
                        String((character as any)[column]),
                        debouncedSearchTerm
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CharacterTable;
