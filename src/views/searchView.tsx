import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Grid,
} from "@mui/material";
import "./style.css";
import { SearchResult } from "../apiFetch";

export interface Props {
  searchResults: SearchResult;
  onGameClick: (gameId: number) => void;
}

export function SearchView(props: Props) {
  function gameClickACB(gameId: number) {
    window.location.hash = "/details/" + gameId;
    props.onGameClick(gameId);
  }

  return (
    <Grid className="searchGrid" container columns={{ xs: 2, sm: 8, md: 12 }}>
      {props.searchResults.results.map((res) => (
        <Card
          className="card"
          title={res.name}
          key={res.id}
          sx={{ maxWidth: 200, margin: 2, width: 200 }}
          onClick={() => gameClickACB(res.id)}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              height="200"
              image={res.background_image || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png"}
              alt={res.name}
            />
            <CardContent>
              <Typography
                variant="h6"
                className="words"
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {res.name}
              </Typography>
              <Rating
                name="read-only"
                value={res.rating}
                precision={0.25}
                readOnly
              />
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Grid>
  );
}
