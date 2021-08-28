import "./App.css";
import Login from "./components/Login";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Error404 from "./components/404";

function App() {
  const { user } = useSelector((state) => state);

  return (
    <div className="App">
      {user ? (
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/*" component={Error404} />
        </Switch>
      )}
    </div>
  );
}

export default App;
