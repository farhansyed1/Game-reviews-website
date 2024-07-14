/*
    View for navigation bar
*/
import { Typography, Link, Avatar } from "@mui/material";
import { modelInstance } from "../Model";

interface NavViewProps {
  currentUserImage: string;
  currentUsername: string;
  isLoggedIn: boolean;
}

export default function NavigationView(props: NavViewProps) {
  const handleLoginClick = () => {
    modelInstance.login();
  };

  const handleLogoutClick = () => {
    modelInstance.logOut();
  };

  return (
    <div className="navigation_bar">
      <div className="nav_left">
        <Link
          title="Tag Based Game Reviews"
          underline="hover"
          color="inherit"
          onClick={() => {
            modelInstance.setCurrentSearch(null)
            modelInstance.setPagination(1, modelInstance.pageSize);
            modelInstance.searchForGames()
          }}
          href="#/"
        >
          <Typography fontWeight="bold" variant="h4">TBGR</Typography>
        </Link>
        <div className="navigation_pages">
          <Link underline="hover" color="inherit" href="#/search">
            <Typography variant="h6" sx={{ marginRight: 2 }}>
              Search
            </Typography>
          </Link>
          <Link underline="hover" color="inherit" href="#/reviews">
            <Typography variant="h6" sx={{ marginLeft: 2 }}>
              My Reviews
            </Typography>
          </Link>
        </div>
      </div>
      <div>
        {props.isLoggedIn ? (
          <div className="profileContainer">
            <Typography variant="body1" sx={{ marginRight: 1 }}>
              {props.currentUsername}
            </Typography>
            <Avatar
              alt="User Avatar"
              src={props.currentUserImage}
              sx={{ marginRight: 1 }}
            />
            {/* Show avatar if logged in */}
            <button style={{ marginLeft: 16 }} onClick={handleLogoutClick}>Logout</button>
          </div>
        ) : (
          <button onClick={handleLoginClick}>Login</button> // Show login button if not logged in
        )}
      </div>
    </div>
  );
}
