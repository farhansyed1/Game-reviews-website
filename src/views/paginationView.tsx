/*
  View for pagination
*/
import { Pagination } from "@mui/material";
import { SearchResult } from "../apiFetch";

interface PaginationProps {
  searchResults: SearchResult;
  currentPage: number;
  handlePageChange: (page: number) => void;
}

export function PaginationView(props: PaginationProps) {
  let pageCount = 0;
  const max = props.searchResults.count / 24;
  if(max > 400){
    pageCount = 400;
  }
  else{
    pageCount = Math.ceil(max);
  } 

  const handleChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    props.handlePageChange(page);
  };

  return (
    <Pagination
      count={pageCount}
      size="large"
      page={props.currentPage}
      onChange={handleChange}
      showFirstButton
      showLastButton
    />
  );
}
