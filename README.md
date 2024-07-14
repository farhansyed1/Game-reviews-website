# TBGR (Tag based game reviews)

Isn’t it absurd to distill the vast, intricate experience of a video game into a single number? That’s often what happens on review platforms. But what if there was a different way?

Welcome to our unique gaming review platform, where we believe that the richness of gaming experiences cannot be captured by a solitary rating. We understand that games are more than just their overall impression; they are a combination of different elements, each contributing to the grand experience.

Our platform offers a revolutionary approach to game reviews. Instead of providing a single, oversimplified score, we dissect each game into multiple tags. Each tag can be rated individually, providing a more comprehensive understanding of the game’s strengths and weaknesses.

This nuanced approach allows gamers to make more informed decisions based on what matters most to them. Are you a visual enthusiast who values stunning graphics? Or perhaps a narrative lover who craves a compelling storyline? Our detailed reviews guide you to games that excel in the areas you care about.

Join us now, available at: https://tbgr.web.app

## Tools

### Frameworks
React with Typescript.

### API
The API used to fetch different game data is the RAWG Video Games Database API (https://rawg.io/apidocs).

### Database
A firebase database is used to store the reviews, and users that have made reviews. Data such as the review's text content, date of creation, general rating, tags with their respective ratings are stored, together with the user's name and profile picture. 

## How to set up the project locally

### Node
1. Install node

2. install the necessary packages: <br>
`npm install`

3. Start the development server <br>
`npm run dev`

### API key
In order to make the API work locally, an API key must be provided. To do so, first obtain one from https://rawg.io/apidocs. Then create a file in the `/src` folder named `apikeys.ts` and paste the following:
```typescript
export const RAWG_API_KEY = /* Insert key string here */
```

## 3rd party components

The project uses Material UI (MUI) components to render certain aspects of the site. The most used component is the so called `Rating` component which in our application is used to display and submit ratings in the forms of stars (1-5). Can be found in, for example `src/views/gameDetailsView.tsx`.

Other MUI components has also been used in some views to provide certain functionality, such as a search bar and info card among other things.

## Project file structure
* presenters/ 
    * gameDetailsPresenter.tsx - Presenter for the gameDetails view
    * myReviewsPresenter.tsx - Presenter for the MyReviewsView view
    * navPresenter.tsx - Presenter for the navView view
    * searchPresenter.tsx - Presenter for the search, searchForm and pagination views

* views/	
    * MyReviewsView.tsx - View for My Reviews page
    * gameDetailsView.tsx - View for Game Details page
    * navView.tsx - View for navigation bar
    * paginationView.tsx - View for page selecter at the bottom of the search page
    * renderPromiseView.tsx - View for what to display when waiting for a promise
    * searchFormView.tsx - View for the search box on the search page
    * searchView.tsx - View for a grid of cards with games and their ratings on the search page
    * style.css - styling for views 

* Model.ts - The model with data and associated functions
* ReactRoot.ts - The router
* apiFetch.ts - Methods for fetching from the RAWG api
* apikeys.ts - API key (not pushed)
* firebase.ts - Functions for authenticating and accessing data from firebase
* main.tsx - The main component, all other components are called downstream from this
* resolvePromise.ts - Method for resolving a promise.
