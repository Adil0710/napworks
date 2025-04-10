import mongoose, { Schema, Document } from "mongoose";

export interface Products extends Document {
  name: string;
  price: number;
  images: string[];
}

const ProductsSchema: Schema<Products> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a product name"],
      lowercase: true,
    },
    price: {
      type: Number,
      required: [true, "Please enter a product price"],
      min: [0, "Price must be a positive number"],
    },
    images: {
      type: [String],
      required: [true, "Please upload product images"],
      validate: {
        validator: (images: string[]) => images.length <= 4,
        message: "You can only upload up to 4 images",
      },
    },
  },
  { timestamps: true }
);

const ProductModel =
  mongoose.models.Products ||
  mongoose.model<Products>("Products", ProductsSchema);
export default ProductModel;
