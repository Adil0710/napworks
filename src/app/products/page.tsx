"use client";
import AddProductForm from "../../components/add-product-form";
import ProductsPage from "../../components/products";

import React from "react";

function Page() {
  const [pageTitle, setPageTitle] = React.useState<"Products" | "AddProduct">(
    "Products"
  );

  const handleSwitchToProducts = () => setPageTitle("Products");
  const handleSwitchToAddProduct = () => setPageTitle("AddProduct");

  return (
    <div>
      {pageTitle === "Products" ? (
        <ProductsPage onSwitchToAddProduct={handleSwitchToAddProduct} />
      ) : (
        <AddProductForm onSwitchToProducts={handleSwitchToProducts} />
      )}
    </div>
  );
}

export default Page;
