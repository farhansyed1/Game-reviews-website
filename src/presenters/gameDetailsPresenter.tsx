/*
  Presenter for game details page
*/
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { GameDetailsView } from "../views/gameDetailsView";
import { Model, ReviewPresenterFormat, UserReview } from "../Model";

export interface Props {
  model: Model;
}

const GameDetails = observer(function GameDetailsRender({ model }: Props) {
  const { gameID } = useParams();

  // If user changes game id of url, then model's gameId is updated
  useEffect(() => {
    if (gameID && model.currentGameId !== parseInt(gameID, 10)) {
      model.setCurrentGameId(parseInt(gameID));
    }
    model.resetUserReview();
    setInvalidReview(false);
  }, [gameID, model]);

  // Suspense for loading reviews
  const [reviews, setReviews] = useState<ReviewPresenterFormat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidReview, setInvalidReview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    fetchReviewsForCurrentGame();
  }, [model.currentGameId]);

  if (isLoading) return <p>Loading reviews...</p>;
  if (error) return <p>Error loading reviews: {error}</p>;

  // Suspense for displaying game details. Displays a gif if data is not ready to be shown
  if (!model.currentGamePromiseState.promise) {
    return <div>No data</div>;
  }
  if (
    !model.currentGamePromiseState.data && !model.currentGamePromiseState.error
  ) {
    return (
      <img
        src={
          "https://i.pinimg.com/originals/b4/4e/22/b44e229598a8bdb7f2f432f246fb0813.gif"
        }
        alt="loading"
        style={{ display: "block", margin: "30vh auto" }}
      ></img>
    );
  }
  if (model.currentGamePromiseState.error) {
    <div>Error: {model.currentGamePromiseState.error.message}</div>;
  }
  // Displays the game details
  return (
    <GameDetailsView
      isLoggedIn={Boolean(model.currentUserId)}
      name={model?.currentGamePromiseState?.data?.name || "No Title"}
      img={
        model?.currentGamePromiseState?.data?.background_image ||
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png"
      }
      rating={
        Number(model?.currentGamePromiseState?.data?.rating.toFixed(1)) || 0
      }
      tags={
        model?.currentGamePromiseState?.data?.tagsAndGenresList?.map(
          (name) => ({
            name,
            rating: 5,
          })
        ) || []
      }
      description={
        model?.currentGamePromiseState?.data?.description_raw.replace(
          /<[^>]*>/g,
          ""
        ) || "No game description..."
      }
      images={
        model?.currentGamePromiseState?.data?.game_images?.map((src) => ({
          src,
        })) || []
      }
      imageIndex={imageIndex}
      userHasReview={reviews.some(review => review.author === model.currentUsername)} // Problematic if two accounts have the same name, proof of concept
      userReview={{
        rating: model.userReview.rating,
        tags: Object.entries(model.userReview.tags).map(([name, rating]) => {
          return { name, rating };
        }),
        content: model.userReview.content,
      }}
      invalidReview={invalidReview}
      reviews={reviews}
      showReviewWriter={showReviewWriterACB}
      addTagInReview={addTagInReviewACB}
      removeTagInReview={removeTagInReviewACB}
      updateGeneralRating={updateGeneralRatingACB}
      updateTagRating={updateTagRatingACB}
      updateReviewContent={updateReviewContentACB}
      publishReview={publishReviewACB}
      setImageIndex={setImageIndexACB}
      login={loginACB}
    />
  );

  function loginACB() {
    model.login();
  }

  function setImageIndexACB(index: number) {
    const images = model?.currentGamePromiseState?.data?.game_images?.length || 0;
    if (index < 0)
      setImageIndex(images - 1);
    else if (index >= images)
      setImageIndex(0);
    else
      setImageIndex(index);
  }

  function fetchReviewsForCurrentGame() {
    if (!model.currentGameId) {
      setError("No game selected");
      return;
    }

    setIsLoading(true);
    model
      .getReviewsForCurrentGame()
      .then((fetchedReviews) => {
        setReviews(fetchedReviews);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }

  function showReviewWriterACB() {
    const element: HTMLElement | null =
      document.getElementById("review-writer");
    if (element) {
      if (element.style.display === "none") {
        element.style.display = "flex";
      } else {
        element.style.display = "none";
      }
    }
  }

  function addTagInReviewACB(event: React.ChangeEvent<HTMLSelectElement>) {
    model.addTagToReview(event.target.value);
  }

  function removeTagInReviewACB(id: string) {
    model.removeTagFromReview(id);
  }

  function updateGeneralRatingACB(rating: number) {
    model.updateGeneralRatingInReview(rating);
  }

  function updateTagRatingACB(id: string, rating: number) {
    model.updateTagRatingInReview(id, rating);
  }

  function updateReviewContentACB(event: FormEvent<HTMLTextAreaElement>) {
    model.updateReviewContent(event.currentTarget.value);
  }

  function publishReviewACB() {
    if (model.userReview.rating === 0) {
      setInvalidReview(true);
      return;
    }

    const allTagsValid = Object.values(model.userReview.tags).every(
      (tag_rating) => {
        return tag_rating > 0;
      }
    );

    if (!allTagsValid) {
      setInvalidReview(true);
      return;
    }

    const rev: UserReview = {
      rating: model.userReview.rating,
      content: model.userReview.content,
      tags: model.userReview.tags,
    };

    model.addReviewToCurrentGame(rev);
    fetchReviewsForCurrentGame();
    model.resetUserReview();
    setInvalidReview(false);
  }
});

export { GameDetails };
