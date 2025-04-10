import type { NextRequest } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import ProductModel from "../../../models/Products";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();


    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const categories = searchParams.get("categories") || "";
    const sortOrder = searchParams.get("sortOrder") || "newest";


    let query: any = {};


    if (search) {
      query.name = { $regex: search, $options: "i" };
    }


    if (minPrice && !isNaN(parseFloat(minPrice))) {
      query.price = { ...query.price, $gte: parseFloat(minPrice) };
    }

    if (maxPrice && !isNaN(parseFloat(maxPrice))) {
      query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    }


    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      query.createdAt = { ...query.createdAt, $gte: start };
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { ...query.createdAt, $lte: end };
    }


    if (categories) {
      const categoryList = categories.split(",");
      if (categoryList.length > 0) {
        query.category = { $in: categoryList };
      }
    }


    let sort: any = { createdAt: -1 }; 

    if (sortOrder === "oldest") {
      sort = { createdAt: 1 };
    } else if (sortOrder === "price-low-high") {
      sort = { price: 1 };
    } else if (sortOrder === "price-high-low") {
      sort = { price: -1 };
    }


    const total = await ProductModel.countDocuments(query);


    const products = await ProductModel.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return Response.json(
      {
        success: true,
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
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
