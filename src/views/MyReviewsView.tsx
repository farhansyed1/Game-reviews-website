/*
  View for My Reviews page
*/
import React from "react";
import Rating from "@mui/material/Rating";
import "./style.css";
import { Review } from "../Model";
import ArticleIcon from "@mui/icons-material/Article";

export interface MyReviewsProps {
  isLoggedIn: boolean;
  reviews: Record<string, Review>;
}

const MyReviewsView: React.FC<MyReviewsProps> = (props) => {
  return (
    <div className="personal-review-container">
      {props.isLoggedIn ? (
        props.reviews && Object.keys(props.reviews).length > 0 ? (
          <div className="personal-reviews">
            {Object.entries(props.reviews).sort(([_,a], [__,b]) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(([id, review]) => (
              <React.Fragment key={id}>
                {reviewRenderer(id, review)}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p className="no-content">No reviews made...</p>
        )
      ) : (
        <p className="no-content">Log in to see your reviews...</p>
      )}
    </div>
  );

  function reviewRenderer(id: string, review: Review) {
    return (
      <div className="personal-review">
        <div className="personal-review-title">
          <h2 >{review.gameTitle}</h2>
          <button title="Go to game page" onClick={() => window.location.hash=`#/details/${id}`} className="icon-button"><ArticleIcon fontSize="small"/></button>
        </div>
        <div className="personal-review-content">
          {reviewInfoRenderer(review)}
        </div>
      </div>
    );
  }

  function reviewTag(name: string, rating: number) {
    const key = `${name}-${rating}`;
    return (
      <div key={key} className="review-rating">
        <span>{name}</span>
        <Rating value={rating} size="small" readOnly />
      </div>
    );
  }

  function reviewInfoRenderer(review: Review) {
    const key = `${review.gameTitle}-${review.date}`;
    return (
      <div key={key} className="review">
        <div className="review-top">
          <div className="review-ratings">
            <div
              className={`review-rating-top ${
                review.tags && Object.keys(review.tags).length > 0
                  ? "review-rating-top-margin "
                  : ""
              }`}
            >
              <span>General</span>
              <Rating value={review.rating} size="small" readOnly />
            </div>
            {review.tags &&
              Object.entries(review.tags).map(([name, rating]) =>
                reviewTag(name, rating)
              )}
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
              }).format(new Date(review.date))}
            </div>
            <div className="review-user">
              <span>{review.username}</span>
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

export { MyReviewsView };
