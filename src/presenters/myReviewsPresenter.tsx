/*
  Presenter for My Reviews page
*/
import { observer } from "mobx-react-lite";
import { Model, Review } from "../Model";
import { MyReviewsView } from "../views/MyReviewsView";
import { useEffect, useState } from "react";
import { getUserReviews } from "../firebase";

export interface Props {
  model: Model;
}
export interface Reviews { reviews: Record<string, Review> }

const MyReviews = observer(function GameDetailsRender({ model }: Props) {
  const [reviews, setReviews] = useState<Record<string,Review> | Record<string,never>>({})
  useEffect(() => {
    getUserReviews(model).then(res => setReviews(res as Record<string, Review> | Record<string, never>))
  }, [model.currentUserId])

  return (
    <MyReviewsView
      isLoggedIn={Boolean(model.currentUserId)}
      reviews={reviews}
    />
  );
});

export { MyReviews };
