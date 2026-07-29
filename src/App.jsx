import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Starfield from "./components/Starfield";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentResult from "./pages/PaymentResult";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminProductNew from "./pages/admin/ProductNew";
import AdminProductEdit from "./pages/admin/ProductEdit";
import AdminUsers from "./pages/admin/Users";
import AdminOrders from "./pages/admin/Orders";
import OrderConfirmed from "./pages/OrderConfirmed";
import MyOrders from "./pages/MyOrders";
import "./index.css";

const App = () => {
  return (
    <div className="app-shell">
      <Starfield />
      <ScrollToTop />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:slug" element={<Product />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pago"              element={<PaymentResult />} />
          <Route path="/pedido-confirmado" element={<OrderConfirmed />} />
          <Route path="/mis-pedidos"       element={<MyOrders />} />

          {/* Admin — protegido por rol */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index                      element={<AdminDashboard />} />
            <Route path="productos"           element={<AdminProducts />} />
            <Route path="productos/nuevo"     element={<AdminProductNew />} />
            <Route path="productos/:slug"     element={<AdminProductEdit />} />
            <Route path="ordenes"             element={<AdminOrders />} />
            <Route path="usuarios"            element={<AdminUsers />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
