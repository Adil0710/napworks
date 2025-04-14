import dbConnect from "../../../lib/dbConnect";
import ProductModel from "../../../models/Products";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      searchQuery,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      selectedCategories,
      sortOrder,
      page = 1,
      itemsPerPage = 10,
    } = body;

    const query: any = {};

    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: "i" };
    }

    if (selectedCategories && selectedCategories.length > 0) {
      query.category = { $in: selectedCategories };
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        query.createdAt.$gte = startOfDay;
      }
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endOfDay;
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && !isNaN(Number.parseFloat(minPrice))) {
        query.price.$gte = Number.parseFloat(minPrice);
      }
      if (maxPrice && !isNaN(Number.parseFloat(maxPrice))) {
        query.price.$lte = Number.parseFloat(maxPrice);
      }
    }

    let sort: { [key: string]: 1 | -1 } = { createdAt: -1 };
    if (sortOrder === "oldest") {
      sort = { createdAt: 1 };
    } else if (sortOrder === "price-low-high") {
      sort = { price: 1 };
    } else if (sortOrder === "price-high-low") {
      sort = { price: -1 };
    }

    const totalItems = await ProductModel.countDocuments(query);

    const skip = (page - 1) * itemsPerPage;

    const products = await ProductModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(itemsPerPage);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return Response.json(
      {
        success: true,
        products,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          itemsPerPage,
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
