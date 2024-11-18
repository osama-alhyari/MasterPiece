import { Routes } from "react-router-dom";

import { Route } from "react-router-dom";
import { lazy } from "react";
const Home = lazy(() => import("./User/Home.js"));
const AdminLayout = lazy(() => import("./layouts/admin/AdminLayout.js"));
const Signup = lazy(() => import("./Registration/Signup.js"));
const Login = lazy(() => import("./Registration/Login.js"));
const Groups = lazy(() => import("./Admin/Group/Groups.js"));
const EditGroup = lazy(() => import("./Admin/Group/EditGroup.js"));
const AddGroup = lazy(() => import("./Admin/Group/AddGroup.js"));
const AddProduct = lazy(() => import("./Admin/Product/AddProduct.js"));
const EditProduct = lazy(() => import("./Admin/Product/EditProduct.js"));
const AddVariant = lazy(() => import("./Admin/Product/AddVariant.js"));
const Users = lazy(() => import("./Admin/User/Users.js"));
const Orders = lazy(() => import("./Admin/Orders/Orders.js"));
const UserLayout = lazy(() => import("./layouts/user/UserLayout.js"));
const Group = lazy(() => import("./User/Group.js"));
const Customization = lazy(() =>
  import("./Admin/Customization/Customization.js")
);
const AddSlider = lazy(() => import("./Admin/Customization/AddSlider.js"));
const EditUser = lazy(() => import("./Admin/User/EditUser.js"));
const AddUser = lazy(() => import("./Admin/User/AddUser.js"));
const EditSlider = lazy(() => import("./Admin/Customization/EditSlider.js"));
const AdminProfile = lazy(() => import("./Admin/User/AdminProfile.js"));
const Profile = lazy(() => import("./User/Profile.js"));
const Cart = lazy(() => import("./User/Cart.js"));
const Product = lazy(() => import("./User/Product.js"));
const CheckOut = lazy(() => import("./User/CheckOut.js"));
const ProductsPage = lazy(() => import("./User/ProductsPage.js"));
const Order = lazy(() => import("./Admin/Orders/Order.js"));
const MyOrders = lazy(() => import("./User/MyOrders.js"));
const MyOrder = lazy(() => import("./User/MyOrder.js"));
const Test = lazy(() => import("./User/Test.jsx"));

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
          <Route path="Test" element={<Test />} />
          <Route path="orders/:id" element={<MyOrder />} />
        </Route>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<AdminProfile />} />
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
        </Route>
      </Routes>
    </div>
  );
};

export default App;
