/*
    Presenter for navigation bar
*/
import { observer } from "mobx-react-lite";
import NavigationView from "../views/navView";
import { Model } from "../Model";

const NavBar = observer(function NavRender({model}: {model: Model}) {
    return(
        <div>
            <NavigationView 
                currentUserImage={model.currentUserImage}
                currentUsername={model.currentUsername}
                isLoggedIn={Boolean(model.currentUserId)}
            />
        </div>
    );
});

export { NavBar };