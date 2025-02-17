import "./App.css";
import Dashboard from "./screens/Dashboard";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: `http://localhost:8000/graphql`,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App overflow-hidden">
        <Dashboard />
      </div>
    </ApolloProvider>
  );
}

export default App;
