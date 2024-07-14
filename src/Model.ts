/* 
   The Model 
*/

import { resolvePromise, PromiseState } from "./resolvePromise.ts";
import {
  SearchResult,
  GameDetailsInfo,
  search,
  getFullGameDetails,
} from "./apiFetch.ts";
import {
  addReview,
  authenticate,
  getGameReviews,
  logOut,
  setupUserDetails,
} from "./firebase.ts";
import { makeAutoObservable} from "mobx";

// Details needed for a game's details page
export interface GameDetails {
  title: string;
  rating: number;
  tags: string[];
  description: string;
  header_image: string;
  game_images: string[];
  user_review: UserReview | null;
  reviews: Review[] | null;
}

export interface Tag {
  name: string;
  rating: number;
}

// Format for how presenter requires reviews
export interface ReviewPresenterFormat {
  author: string;
  rating: number;
  date: Date;
  tags: Tag[];
  content: string;
  userImage: string;
}

// All details needed for a review
export interface Review {
  username: string;
  date: string;
  rating: number;
  content: string;
  tags: Record<string, number>;
  gameTitle: string;
  userImage: string;
}

// Details that the user fills in when writing a review
export interface UserReview {
  rating: number;
  content: string;
  tags: Record<string, number>;
}

// Available search parameters from api
export interface SearchParameters {
  query: string;
  tag: string;
  genres: string[];
  platforms: number[];
  ordering: string;
}

export class Model {
  currentSearch: SearchParameters;
  searchResultsPromiseState: PromiseState<SearchResult>;

  currentGameId: number | null;
  currentGamePromiseState: PromiseState<GameDetailsInfo>;

  userReview: UserReview;

  currentUserId: string | undefined;
  currentUserPromiseState: PromiseState<object>;
  currentUserImage: string;
  currentUsername: string;

  ready: boolean;

  currentPage: number;
  pageSize: number;

  // Initialise all variables
  constructor() {
    makeAutoObservable(this);
    this.currentSearch = {
      query: "",
      tag: "",
      genres: [],
      platforms: [],
      ordering: "",
    };
    this.searchResultsPromiseState = { promise: null, data: null, error: null };

    this.currentGameId = null;
    this.currentGamePromiseState = { promise: null, data: null, error: null };
    this.currentUserImage = "";
    this.currentUsername = "";

    this.userReview = { rating: 0, content: "", tags: {} };

    this.currentUserId = undefined;
    this.currentUserPromiseState = { promise: null, data: null, error: null };

    this.ready = false;
    this.login = this.login.bind(this);

    this.currentPage = 1; // Initialize current page
    this.pageSize = 24;
  }

  // PAGINATION

  // Method to set pagination parameters
  setPagination(page: number, pageSize: number): void {
    this.currentPage = page;
    this.pageSize = pageSize;
  }

  // REVIEWS
  addTagToReview(id: string): void {
    this.userReview = {
      ...this.userReview,
      tags: {
        ...this.userReview.tags,
        [id]: 0,
      },
    };
  }

  removeTagFromReview(id: string): void {
    const { [id]: _, ...remainingTags } = this.userReview.tags;
    this.userReview.tags = remainingTags;
  }

  updateGeneralRatingInReview(rating: number): void {
    this.userReview.rating = rating;
  }

  updateTagRatingInReview(id: string, rating: number): void {
    this.userReview.tags[id] = rating;
  }

  updateReviewContent(content: string): void {
    this.userReview.content = content;
  }

  resetUserReview() {
    this.userReview = {
      rating: 0,
      tags: {},
      content: "",
    };
  }

  addReviewToCurrentGame(review: UserReview): void {
    addReview(review, this);
  }

  getReviewsForCurrentGame(): Promise<ReviewPresenterFormat[]> {
    return getGameReviews(this);
  }

  // SEARCH

  // Methods to set search parameters
  setCurrentSearch(parameters: SearchParameters | null): void {
    if (!parameters) {
      this.currentSearch = {
        query: "",
        tag: "",
        genres: [],
        platforms: [],
        ordering: "",
      };
      return;
    }
    this.currentSearch = {
      query: parameters.query,
      tag: parameters.tag,
      genres: parameters.genres,
      platforms: parameters.platforms,
      ordering: parameters.ordering,
    };
  }

  setSearchQuery(query: string): void {
    this.currentSearch.query = query;
  }

  setSearchTag(tag: string): void {
    this.currentSearch.tag = tag;
  }

  setSearchGenres(genres: string[]): void {
    this.currentSearch.genres = genres;
  }

  setSearchPlatform(platforms: number[]): void {
    this.currentSearch.platforms = platforms;
  }

  setCurrentUserId(id: string | undefined) {
    this.currentUserId = id;
  }

  setCurrentUserImage(url: string | null | undefined) {
    if(!url){
      this.currentUserImage = ""
    }
    else{
      this.currentUserImage = url
    }
  }

  setCurrentUsername(username:string|null|undefined){
    if (!username) {
      this.currentUsername = ""
    }
    else {
      this.currentUsername = username
    }
  }

  setReady(ready:boolean){
    this.ready = ready
  }

  // Method to search for games with current search parameters. Calls search() to get games from api
  searchForGames(): void {
    resolvePromise(
      search(
        this.currentSearch.query,
        this.currentSearch.genres,
        this.currentSearch.platforms,
        this.currentSearch.ordering,
        this.currentPage,
        this.pageSize
      ),
      this.searchResultsPromiseState
    );
  }

  // LOGIN / LOGOUT

  login() {
    return (
      authenticate()
        .then((uid) => (this.currentUserId = uid))
        .then(() => setupUserDetails(this))
        .catch((error) => console.log(error))
    );
  }

  logOut() {
    return logOut()
      .then(() => {
        this.currentUserId = undefined;
      })
      .catch((error) => console.log(error));
  }

  // GAME ID

  // Method to set the current game id
  setCurrentGameId(gameId: number | null): void {
    if (!gameId) {
      this.currentGameId = null;
      return;
    }
    if (this.currentGameId === gameId) {
      return;
    }
    this.currentGameId = gameId;
    this.currentGamePromiseState.promise = getFullGameDetails(gameId);
    resolvePromise(
      this.currentGamePromiseState.promise!,
      this.currentGamePromiseState
    );
  }
}

export const modelInstance = new Model();
