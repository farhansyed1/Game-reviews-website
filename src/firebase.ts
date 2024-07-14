/*
  Functions for setting up the database and for storing and retrieving data from firebase
*/ 
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import {
  DatabaseReference,
  get,
  getDatabase,
  ref,
  set,
} from "firebase/database";
import {
  Model,
  Review,
  UserReview,
  ReviewPresenterFormat,
} from "./Model.ts";

const firebaseConfig = {
  apiKey: "", // Fill
  authDomain: "tbgr-18c7e.firebaseapp.com",
  databaseURL:
    "https://tbgr-18c7e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tbgr-18c7e",
  storageBucket: "tbgr-18c7e.appspot.com",
  messagingSenderId: "96309912155",
  appId: "1:96309912155:web:f295f75daec0080bbdd57e",
  measurementId: "G-SFL0FZE6C4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Google authentication functions
function getUserId() {
  const auth = getAuth(app);
  return auth.authStateReady().then(() => auth.currentUser?.uid);
}

function getUserProfileImage(){
  const auth = getAuth()
  return auth.authStateReady().then(() => auth.currentUser?.photoURL)
}

function getUsername() {
  const auth = getAuth()
  return auth.authStateReady().then(() => auth.currentUser?.displayName)
}

function authenticate() {
  const auth = getAuth(app);
  return setPersistence(auth, browserSessionPersistence).then(() => {
    return signInWithPopup(auth, new GoogleAuthProvider()).then(
      (res) => res.user.uid
    );
  });
}

function logOut() {
  return getAuth(app).signOut();
}

// Functions for reviews

// Saving the user's name and profile picture to the model
function setupUserDetails(model: Model) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return;
  }

  model.currentUsername = currentUser.displayName || currentUser.email || "Unknown User";
  model.currentUserImage = currentUser.photoURL || "";
}

// Add a review to firebase
function addReview(userReview: UserReview, model: Model) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return;
  }
  const review: Review = {
    rating: userReview.rating,
    content: userReview.content,
    tags: userReview.tags,
    // Additional details are added 
    username: model.currentUsername,
    gameTitle: model?.currentGamePromiseState?.data?.name || "No Title",
    userImage: model.currentUserImage,
    date: new Date().toISOString(),
  }; 
  
  return saveReview(model, review);
}

function saveReview(model: Model, review: Review | Record<string, never>) {
  const db = getDatabase();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!model.ready) {
    return;
  }

  if (!currentUser) {
    return;
  }

  const gameReviewRef = ref(
    db,
    `games/${model.currentGameId}/reviews/${currentUser?.uid}`  // The path for store reviews for each game
  );
  const userReviewRef = ref(
    db,
    `users/${currentUser?.uid}/reviews/${model.currentGameId}`  // The path for storing individual users
  );

  return Promise.all([set(gameReviewRef, review), set(userReviewRef, review)]);
}

function deleteReview(model: Model) {
  return saveReview(model, {});
}

// Function to get reviews made by a specific user
function getUserReviews(model: Model) {
  return readFromFirebase(ref(db, `users/${model.currentUserId}/reviews`));
}

function transformReview(review: Review): ReviewPresenterFormat {
  return {
    author: review.username,
    rating: review.rating,
    date: new Date(review.date),
    content: review.content,
    userImage: review.userImage,
    tags: review.tags
      ? Object.entries(review.tags).map(([name, rating]) => {
        return { name, rating };
      })
      : [],
  };
}

// Function to get games for a specific game
function getGameReviews(model: Model): Promise<ReviewPresenterFormat[]> {
  if (!model.currentGameId) {
    return Promise.reject(new Error("No current game ID provided"));
  }

  const reviewsRef: DatabaseReference = ref(
    db,
    `games/${model.currentGameId}/reviews/`
  );

  return get(reviewsRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        return [];
      }

      const rawReviews: Record<string, Review> = snapshot.val();
      const transformedReviews: ReviewPresenterFormat[] =
        Object.values(rawReviews).map(transformReview);

      return transformedReviews;
    })
    .catch((error) => {
      console.error("Failed to fetch reviews:", error);
      throw error;
    });
}

function readFromFirebase(rf: DatabaseReference) {
  return get(rf).then((snapshot) => snapshot.toJSON());
}

export {
  authenticate,
  logOut,
  getUserId,
  getUserProfileImage,
  getUsername,
  addReview,
  deleteReview,
  getUserReviews,
  getGameReviews,
  setupUserDetails, 
};
