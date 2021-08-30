import "./App.css";
import Login from "./components/Login";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Error404 from "./components/404";
import Header from "./components/Header";
import AboutUs from "./components/AboutUs";
import { useEffect, useState } from "react";
import axios from "./axios";

function App() {
  // This state is added to prevent side effects on hard refreshing as the token in the headers isn't set yet.
  const [enableRendering, setEnableRendering] = useState(false);
  const { user, userToken } = useSelector((state) => state);

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
    setEnableRendering(true);
  }, []);

  return (
    <div className="App">
      {!user ? (
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      ) : enableRendering ? (
        <>
          <Header />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/about" component={AboutUs} />
            <Route exact path="/*" component={Error404} />
          </Switch>
        </>
      ) : null}
    </div>
  );
}

export default App;
