import React, { createContext } from "react";
import CreateLink from "./Link/CreateLink";
import {
  BrowserRouter,
  Switch,
  Route,
  Router,
  Redirect,
} from "react-router-dom";
import Login from "./Auth/Login";
import ForgotPassword from "./Link/ForgotPassword";
import SearchLinks from "./Link/SearchLinks";
import LinkList from "./Link/LinkList";
import LinkDetail from "./Link/LinkDetail";
import Header from "./Header";
import useAuth from "./Auth/useAuth";
import firebaseGoogle from "./../firebase/firebase";

const FirebaseContext = createContext(null);
export { FirebaseContext };

function App() {
  const user = useAuth();

  return (
    <BrowserRouter>
      <FirebaseContext.Provider value={{ user, firebaseGoogle }}>
        <div className="app-container">
          <Header />
          <div className="route-container">
            <Switch>
              <Route path="/" exact render={() => <Redirect to="/new/1" />} />
              <Route path="/create" component={CreateLink} />
              <Route path="/login" component={Login} />
              <Route path="/forgot" component={ForgotPassword} />
              <Route path="/search" component={SearchLinks} />
              <Route path="/top" component={LinkList} />
              <Route path="/new/:page" component={LinkList} />
              <Route path="/link/:linkId" component={LinkDetail} />
            </Switch>
          </div>
        </div>
      </FirebaseContext.Provider>
    </BrowserRouter>
  );
}

export default App;
