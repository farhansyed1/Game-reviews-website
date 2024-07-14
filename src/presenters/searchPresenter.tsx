/*
  Presenter for search page
*/
import { observer } from "mobx-react-lite";
import { SearchView } from "../views/searchView.tsx";
import { Model } from "../Model.ts";
import { RenderPromise } from "../views/renderPromiseView.tsx";
import { SearchFormView } from "../views/searchFormView.tsx";
import { PaginationView } from "../views/paginationView.tsx";
import { useEffect } from "react";

export interface Props {
  model: Model;
}

const Search = observer(function SearchRender({ model }: Props) {
  useEffect(() => {
    model.setCurrentGameId(null);
  }, []);

  function handleGameClick(gameId: number) {
    model.setCurrentGameId(gameId);
  }

  const setSearchQueryACB = (text: string) => {
    model.setSearchQuery(text);
    model.setPagination(1, model.pageSize);
  };

  const searchForGamesACB = () => {
    model.searchForGames();
  };

  const handlePageChange = (page: number) => {
    model.setPagination(page, model.pageSize);
    model.searchForGames();
  };

  return (
    <div className="searchContainer">
      {RenderPromise(model.searchResultsPromiseState) || (
        <>
          <div className="searchForm">
            <SearchFormView
              currentSearch={model.currentSearch}
              onSearchQueryChanged={setSearchQueryACB}
              onGameClick={searchForGamesACB}
            />
          </div>
          <div>
            <SearchView
              searchResults={model.searchResultsPromiseState.data!}
              onGameClick={handleGameClick}
            />
          </div>
          <div className="paginationView">
            <PaginationView
              searchResults={model.searchResultsPromiseState.data!}
              currentPage={model.currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
});

export { Search };
