import { Outlet } from "react-router-dom";
import "./App.css";
import Dashboard from "./screens/Dashboard";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import Register from "./screens/Register";
import { Toaster } from "./components/ui/toaster";

const client = new ApolloClient({
  uri: `http://localhost:8000/graphql`,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <Router>
      <ApolloProvider client={client}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </ApolloProvider>
    </Router>
  );
}

export default App;
