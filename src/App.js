import { Routes, Route, BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import ShowProducts from './components/ShowProducts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/frontend" element={<ShowProducts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
