import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Starfield from "./components/Starfield";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import "./index.css";

const App = () => {
  return (
    <div className="app-shell">
      <Starfield />
      <ScrollToTop />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<Product />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
