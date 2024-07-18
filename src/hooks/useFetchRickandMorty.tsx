import { UseQueryResult, useQuery } from "@tanstack/react-query";
import axios from "axios";

import Character from "../interfaces/character.interface";

const fetchCharacters = async (searchTerm: string): Promise<Character[]> => {
  const baseURL = "https://rickandmortyapi.com/api/character/";

  const requests = [
    axios.get(`${baseURL}?name=${searchTerm}`),
    axios.get(`${baseURL}?species=${searchTerm}`),
    axios.get(`${baseURL}?type=${searchTerm}`),
  ];
  const validStatusValues = ["alive", "dead", "unknown"];
  if (validStatusValues.includes(searchTerm)) {
    requests.push(axios.get(`${baseURL}?status=${searchTerm}`));
  }
  const validGenderValues = ["male", "female", "genderless", "unknown"];

  if (validGenderValues.includes(searchTerm)) {
    requests.push(axios.get(`${baseURL}?gender=${searchTerm}`));
  }

  const responses = await Promise.allSettled(requests);
  const results = responses
    .filter((response) => response.status === "fulfilled")
    .flatMap(
      (response) =>
        (response as PromiseFulfilledResult<any>).value.data
          .results as Character[]
    );

  const uniqueResults = Array.from(
    new Set(results.map((character) => character.id))
  ).map((id) => results.find((character) => character.id === id) as Character);

  return uniqueResults;
};

const useFetchRickAndMorty = (
  searchTerm: string
): UseQueryResult<Character[], Error> => {
  return useQuery<Character[], Error>({
    queryKey: ["characters", searchTerm],
    queryFn: () => fetchCharacters(searchTerm),
    enabled: !!searchTerm,
  });
};

export default useFetchRickAndMorty;
