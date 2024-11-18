import ProductsComponent from "./ProductsComponent";

export default function ProductsPage() {
  return (
    <div style={{ backgroundColor: "#1c1c1e" }}>
      <h1 className=" text-white text-center mb-5">All Products</h1>
      <ProductsComponent />
    </div>
  );
}
