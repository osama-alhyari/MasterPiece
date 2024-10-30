import { Routes } from "react-router-dom";

import { Route } from "react-router-dom";
import { lazy } from "react";
import Home from "./User/Home.js";
import AdminLayout from "./layouts/admin/AdminLayout.js";
import Signup from "./Registration/Signup.js";
import Login from "./Registration/Login.js";
import Groups from "./Admin/Group/Groups.js";
import EditGroup from "./Admin/Group/EditGroup.js";
import AddGroup from "./Admin/Group/AddGroup.js";
import AddProduct from "./Admin/Product/AddProduct.js";
import EditProduct from "./Admin/Product/EditProduct.js";
import AddVariant from "./Admin/Product/AddVariant.js";
import Users from "./Admin/User/Users.js";
import Orders from "./Admin/Orders/Orders.js";
import UserLayout from "./layouts/user/UserLayout.js";
import Group from "./User/Group.js";
import Customization from "./Admin/Customization/Customization.js";
import AddSlider from "./Admin/Customization/AddSlider.js";
import EditUser from "./Admin/User/EditUser.js";
import AddUser from "./Admin/User/AddUser.js";
import EditSlider from "./Admin/Customization/EditSlider.js";
import AdminProfile from "./Admin/User/AdminProfile.js";
import Profile from "./User/Profile.js";
import Cart from "./User/Cart.js";
import Product from "./User/Product.js";
import CheckOut from "./User/CheckOut.js";
import ProductsPage from "./User/ProductsPage.js";
import Order from "./Admin/Orders/Order.js";
import MyOrders from "./User/MyOrders.js";
import MyOrder from "./User/MyOrder.js";

/****Layouts*****/
// const FullLayout = lazy(() => import("./layouts/FullLayout.js"));

/***** Pages ****/
const Starter = lazy(() => import("./views/Starter.js"));
const About = lazy(() => import("./views/About.js"));
const Alerts = lazy(() => import("./views/ui/Alerts"));
const Badges = lazy(() => import("./views/ui/Badges"));
const Buttons = lazy(() => import("./views/ui/Buttons"));
const Cards = lazy(() => import("./views/ui/Cards"));
const Grid = lazy(() => import("./views/ui/Grid"));
const Tables = lazy(() => import("./views/ui/Tables"));
const Forms = lazy(() => import("./views/ui/Forms"));
const Breadcrumbs = lazy(() => import("./views/ui/Breadcrumbs"));
const Products = lazy(() => import("./Admin/Product/Products"));

const App = () => {
  return (
    <div className="dark">
      <Routes>
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route path="" element={<Home />} />
          <Route path="group/:id" element={<Group />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="checkout" element={<CheckOut />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="orders/:id" element={<MyOrder />} />
        </Route>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<Starter />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="customization" element={<Customization />} />
          <Route path="customization/create" element={<AddSlider />} />
          <Route path="customization/edit/:id" element={<EditSlider />} />
          <Route path="products" element={<Products />} />
          <Route path="products/create" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />}>
            <Route path="addvariant" element={<AddVariant />} />
          </Route>
          <Route path="groups" element={<Groups />} />
          <Route path="groups/create" element={<AddGroup />} />
          <Route path="groups/edit/:id" element={<EditGroup />} />
          <Route path="users" element={<Users />} />
          <Route path="users/edit/:id" element={<EditUser />} />
          <Route path="users/create" element={<AddUser />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<Order />} />

          <Route path="starter" element={<Starter />} />
          <Route path="about" element={<About />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="badges" element={<Badges />} />
          <Route path="buttons" element={<Buttons />} />
          <Route path="cards" element={<Cards />} />
          <Route path="grid" element={<Grid />} />
          <Route path="table" element={<Tables />} />
          <Route path="forms" element={<Forms />} />
          <Route path="breadcrumbs" element={<Breadcrumbs />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
