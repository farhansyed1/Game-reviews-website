/*
  Functions for fetching data from the RAWG api
*/ 

import { Review, UserReview } from "./Model";
import { RAWG_API_KEY } from "./apikeys";
export {
  search,
  getGameDetails,
  getScreenshots,
  apiFetch,
};

// Search results format from api
export interface SearchResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    id: number;
    slug: string;
    name: string;
    released: string;
    tba: boolean;
    background_image: string;
    rating: number;
    rating_top: number;
    ratings: object;
    ratings_count: number;
    reviews_text_count: string;
    added: number;
    added_by_status: object;
    metacritic: number;
    playtime: number;
    suggestions_count: number;
    updated: string;
    esrb_rating: object | null;
    platforms: object[];
    page: number;
    page_size: number;
  }[];
}

// Format for genres and tags
interface GenreAndTagFormat {
  id: number;
  name: string;
}

export interface GameDetailsInfo {
  // tags and genres are merged to form this string list
  tagsAndGenresList: string[];
  // These are from the api
  tags: GenreAndTagFormat[];
  genres: GenreAndTagFormat[];
  header_image: string;
  game_images: string[];
  user_review: UserReview | null;
  reviews: Review[] | null;
  id: number;
  name: string;
  description_raw: string;
  background_image: string;
  rating: number;
}

function paramsToURlSearchParams(params: Map<string, string>): URLSearchParams {
  const filteredParams = Array.from(params.entries()).filter(
    ([, value]) => value != ""
  );
  return new URLSearchParams(filteredParams);
}

function apiFetch(address: string): Promise<object> {
  const options = {
    method: "GET",
    headers: {},
  };
  return fetch(address, options).then((res) => res.json());
}

// Search using api
function search(
  searchQuery: string,
  genres: string[],
  platforms: number[],
  ordering: string,
  page: number,
  pageSize: number
): Promise<SearchResult> {
  const urlparams = paramsToURlSearchParams(
    new Map([
      ["search", searchQuery],
      ["genres", genres.join(",")],
      ["platforms", platforms.join(",")],
      ["ordering", ordering],
      ["key", RAWG_API_KEY],
      ["page", page.toString()],
      ["page_size", pageSize.toString()],
    ])
  );
  return apiFetch(
    "https://api.rawg.io/api/games?" + urlparams.toString()
  ) as Promise<SearchResult>;
}

// The fetch getGameDetails() does not get all necessary details. 
// This function combines those details with the getScreenshots() fetch and also extracts the tags and genres
export async function getFullGameDetails(id: number): Promise<GameDetailsInfo> {
  // Fetch initial game details
  const gameDetails = await getGameDetails(id);

  // Fetch screenshots
  const screenshotsResponse = await getScreenshots(id);
  const results = (screenshotsResponse as { results: Array<{ image: string }> })
    .results;
  gameDetails.game_images = results.map((screenshot) => screenshot.image);

  // Extract tags and merge with genres
  gameDetails.tagsAndGenresList = gameDetails.tags.map(
    (tag) => tag.name.charAt(0).toUpperCase() + tag.name.slice(1)
  );

  const genreString = gameDetails.genres.map((tag) => tag.name);

  gameDetails.tagsAndGenresList = Array.from(
    new Set([...gameDetails.tagsAndGenresList, ...genreString])
  );

  return gameDetails;
}

// Fetch game details
function getGameDetails(id: number | string): Promise<GameDetailsInfo> {
  const urlparams = paramsToURlSearchParams(new Map([["key", RAWG_API_KEY]]));
  return apiFetch(
    "https://api.rawg.io/api/games/" +
      id.toString() +
      "?" +
      urlparams.toString()
  ) as Promise<GameDetailsInfo>;
}

// Fetch game images
function getScreenshots(id: number): Promise<object> {
  const urlparams = paramsToURlSearchParams(new Map([["key", RAWG_API_KEY]]));
  return apiFetch(
    "https://api.rawg.io/api/games/" +
      id.toString() +
      "/screenshots?" +
      urlparams.toString()
  );
}