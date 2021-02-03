import "./App.css";
import ToDosAccordion from "./ToDosAccordion";

const sampleToDoList = [
  { todo: "Groceries" },
  { todo: "Clothes" },
  { todo: "electronic" },
];
function App() {
  return <ToDosAccordion toDosList={sampleToDoList} />;
}

export default App;
