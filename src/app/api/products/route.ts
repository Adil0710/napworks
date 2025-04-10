import type { NextRequest } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import ProductModel from "../../../models/Products";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const products = await ProductModel.find({}).sort({ createdAt: -1 });

    return Response.json(
      {
        success: true,
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred while fetching products",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
