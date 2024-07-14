import { useEffect } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Model } from "./Model.ts";

import { Search } from "./presenters/searchPresenter.tsx";
import { GameDetails } from "./presenters/gameDetailsPresenter.tsx";
import { MyReviews } from "./presenters/myReviewsPresenter.tsx";
import { NavBar } from "./presenters/navPresenter.tsx";
import { getUserId, getUsername, getUserProfileImage } from "./firebase.ts";

const NotFound = () => {
  return (
    <div>
      <h1>404 Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

function makeRouter(model: Model) {
  return createHashRouter([
    {
      path: "/",
      element: <Search model={model} />,
    },
    {
      path: "/search",
      element: <Search model={model} />,
    },
    {
      path: "/details/:gameID", // in view, set: window.location.hash="#/details/" + gameID
      element: <GameDetails model={model} />,
    },
    {
      path: "/reviews",
      element: <MyReviews model={model} />
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
}

const ReactRoot = observer(function ReactRoot({ model }: { model: Model }) {
  useEffect(() => {
    model.setReady(false)
    Promise.all(
      [getUserId().then(uid => model.setCurrentUserId(uid)),
      getUserProfileImage().then(url => model.setCurrentUserImage(url)),
      getUsername().then(username => model.setCurrentUsername(username))]
    ).then(() => model.setReady(true))  
  }, [])
  if (model.ready) {
    return (
      <div>
        <div className="main">
        <NavBar model={model} />
        <RouterProvider router={makeRouter(model)} />
        </div>
        <footer className="footer">
            <div className="footer-content">
                <span>Tag Based Game Reviews</span>
                <div className="footer-names">
                  <span className="footer-names-title">Made by:</span>
                  <span>David Aldenbro</span>
                  <span>Hugo Björs</span>
                  <span>Farhan Syed</span>
                  <span>Mimmi Weng</span>
                </div>
            </div>
        </footer>
      </div>
    );
  } else {
    return <img
      src={
        "https://i.pinimg.com/originals/b4/4e/22/b44e229598a8bdb7f2f432f246fb0813.gif"
      }
      alt="loading"
      style={{ display: "block", margin: "30vh auto" }}
    ></img>;
  }
});
export { ReactRoot };
