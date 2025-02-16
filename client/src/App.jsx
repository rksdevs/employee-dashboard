import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>Welcome to Employee Dashboard</div>
      <Button>I'm a button</Button>
    </>
  );
}

export default App;
