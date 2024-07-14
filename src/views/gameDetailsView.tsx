/*
  View for game details page
*/
import React, { FormEvent } from "react";
import Rating from "@mui/material/Rating";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import ArrowForwardIosIconRounded from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIosIconRounded from "@mui/icons-material/ArrowBackIosRounded";
import "./style.css";

export interface GameDetailProps {
  isLoggedIn: boolean;
  name: string;
  img: string;
  rating: number;
  tags: {
    name: string;
    rating: number;
  }[];
  description: string;
  images: {
    src: string;
  }[];
  imageIndex: number;
  userHasReview: boolean;
  userReview: {
    rating: number;
    tags: {
      name: string;
      rating: number;
    }[];
    content: string;
  };
  invalidReview: boolean;
  reviews: {
    author: string;
    rating: number;
    date: Date;
    tags: {
      name: string;
      rating: number;
    }[];
    content: string;
    userImage: string;
  }[];
  showReviewWriter: () => void;
  addTagInReview: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  removeTagInReview: (id: string) => void;
  updateGeneralRating: (rating: number) => void;
  updateTagRating: (id: string, rating: number) => void;
  updateReviewContent: (event: FormEvent<HTMLTextAreaElement>) => void;
  publishReview: () => void;
  setImageIndex: (index: number) => void;
  login: () => void;
}

const GameDetailsView: React.FC<GameDetailProps> = (props) => {
  return (
    <div className="game-details">
      <div className="gd-top">
        <div className="gd-title">
          <button onClick={() => (window.location.hash = "/search")}>
            <ArrowBackIcon />
            <span>Back to Search</span>
          </button>
          <h1>{props.name}</h1>
          <div className="gd-rating">
            <Rating value={props.rating} precision={0.1} readOnly />
            <div>{props.rating}/5</div>
          </div>
        </div>
        <img src={props.img} alt=""></img>
      </div>
      <div>
        <h2>Tags</h2>
        {props.tags.length > 0 ? (
          <div className="tag-container">
            {props.tags.map(gameDetailsTagsCB)}
          </div>
        ) : (
          <p>No game tags...</p> // If game does not contain any details, default details are displayed
        )}
      </div>
      <div>
        <h2>Description</h2>
        <p className="gd-description">{props.description}</p>
      </div>
      <div>
        <h2>Images</h2>
        {props.images.length > 0 ? (
          <div className="slideshow-container">
            <div className="slideshow-main">
              <button
                className="icon-button"
                onClick={() => props.setImageIndex(props.imageIndex - 1)}
              >
                <ArrowBackIosIconRounded />
              </button>
              <img src={props.images[props.imageIndex].src}></img>
              <button
                className="icon-button"
                onClick={() => props.setImageIndex(props.imageIndex + 1)}
              >
                <ArrowForwardIosIconRounded />
              </button>
            </div>
            <div className="slideshow-dots">
              {createSlideshowDots(props.images.length)}
            </div>
          </div>
        ) : (
          <p>No game images...</p>
        )}
      </div>
      <div>
        <h2>Reviews</h2>
        <div className="review-section">
          <div className="buttons">
            <button
              onClick={props.isLoggedIn ? props.showReviewWriter : props.login}
              className={`icon-button review-button ${
                props.isLoggedIn && !props.userHasReview
                  ? "icon-displacement"
                  : ""
              }`}
            >
              {props.isLoggedIn ? (
                props.userHasReview ? (
                  <span>Edit Review</span>
                ) : (
                  <>
                    <span>New Review</span>
                    <AddIcon />
                  </>
                )
              ) : (
                "Log In To Review"
              )}
            </button>
          </div>
          {props.isLoggedIn && (
            <div
              id="review-writer"
              className="review-writer"
              style={{ display: "none" }}
            >
              <div className="review-writer-ratings">
                <div className="review-writer-tag">
                  <span>General</span>
                  <Rating
                    value={props.userReview.rating}
                    onChange={updateGeneralRatingACB}
                  />
                </div>
                {props.userReview.tags.map(reviewWriterRatingCB)}
              </div>
              <div>
                <select
                  onChange={props.addTagInReview}
                  style={{
                    display:
                      props.userReview.tags.length >= props.tags.length
                        ? "none"
                        : "block",
                  }}
                  value={""}
                >
                  <option value="" disabled>
                    Add Tag
                  </option>
                  {props.tags
                    .filter(
                      (x) =>
                        !props.userReview.tags.some((y) => y.name === x.name)
                    )
                    .map(reviewWriterAddTagOptionCB)}
                </select>
              </div>
              <textarea
                rows={5}
                value={props.userReview.content}
                onInput={props.updateReviewContent}
                className="review-writer-content"
              />
              <div className="publish">
                <button onClick={props.publishReview}>Publish Review</button>
                <div
                  className="publish-warning"
                  style={{
                    display: props.invalidReview ? "flex" : "none",
                  }}
                >
                  <WarningRoundedIcon />
                  <span>Missing rating</span>
                </div>
              </div>
            </div>
          )}
          <div className="review-container">
            {props.reviews.length > 0 ? (
              [...props.reviews]
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .map(gameDetailsReviewsCB)
            ) : (
              <div className="no-reviews">No reviews yet...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function createSlideshowDots(amount: number) {
    const divs = [];
    for (let i = 0; i < amount; i++) {
      divs.push(
        <button
          id={i == props.imageIndex ? "dot-selected" : ""}
          key={i}
          onClick={() => props.setImageIndex(i)}
        ></button>
      );
    }
    return divs;
  }

  function updateGeneralRatingACB(
    _: React.SyntheticEvent<Element, Event>,
    newValue: number | null
  ) {
    props.updateGeneralRating(newValue ?? 0);
  }

  function reviewWriterRatingCB(tag: { name: string; rating: number }) {
    return (
      <div key={tag.name} className="review-writer-tag">
        <div>{tag.name}</div>
        <Rating value={tag.rating} onChange={updateTagRatingACB} />
        <button
          title="Remove tag"
          className="icon-button"
          onClick={removeReviewTagACB}
        >
          <DeleteIcon fontSize="small" />
        </button>
      </div>
    );

    function removeReviewTagACB() {
      props.removeTagInReview(tag.name);
    }
    function updateTagRatingACB(
      _event: React.SyntheticEvent<Element, Event>,
      newValue: number | null
    ) {
      props.updateTagRating(tag.name, newValue ?? 0);
    }
  }

  function reviewWriterAddTagOptionCB(tag: { name: string; rating: number }) {
    return <option key={tag.name}>{tag.name}</option>;
  }

  function gameDetailsTagsCB(tag: { name: string; rating: number }) {
    return (
      <div key={tag.name} className="tag">
        <span>{tag.name}</span>
      </div>
    );
  }

  function gameDetailsReviewRatingCB(tag: { name: string; rating: number }) {
    return (
      <div key={tag.name} className="review-rating">
        <span>{tag.name}</span>
        <Rating value={tag.rating} size="small" readOnly />
      </div>
    );
  }

  function gameDetailsReviewsCB(review: {
    author: string;
    rating: number;
    date: Date;
    tags: {
      name: string;
      rating: number;
    }[];
    content: string;
    userImage: string;
  }) {
    return (
      <div key={review.date.toISOString()} className="review">
        <div className="review-top">
          <div className="review-ratings">
            <div
              className={`review-rating-top ${
                review.tags.length > 0 ? "review-rating-top-margin " : ""
              }`}
            >
              <span>General</span>
              <Rating value={review.rating} size="small" readOnly />
            </div>
            {review.tags.map(gameDetailsReviewRatingCB)}
          </div>
          <div className="review-top-info">
            <div className="review-date">
              {Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Paris",
              }).format(review.date)}
            </div>
            <div className="review-user">
              <span>{review.author}</span>
              <div
                className="review-user-logo"
                style={{ backgroundImage: `url(${review.userImage})` }}
              ></div>
            </div>
          </div>
        </div>
        <div className={review.content.length > 0 ? "review-content" : ""}>
          <span>{review.content}</span>
        </div>
      </div>
    );
  }
};

export { GameDetailsView };
