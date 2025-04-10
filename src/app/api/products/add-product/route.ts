import type { NextRequest } from "next/server";
import ProductModel from "../../../..//models/Products";
import cloudinary from "cloudinary";
import { productSchema } from "../../../..//schemas/productSchema";
import dbConnect from "../../../../lib/dbConnect";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string,
  publicId: string,
  transformations: Record<string, any> = {}
) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite: true,
        ...transformations,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const productName = formData.get("productName") as string;
    const price = formData.get("price") as string;

    try {
      productSchema.parse({
        productName,
        price,
      });
    } catch (error) {
      console.error("Initial validation failed:", error);
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: error,
        },
        { status: 400 }
      );
    }

    const imageUrls: string[] = [];
    const imageFiles = [];

    for (let i = 0; i < 4; i++) {
      const imageFile = formData.get(`image-${i}`) as File | null;
      if (imageFile && imageFile.size > 0) {
        imageFiles.push(imageFile);
      }
    }

    if (imageFiles.length === 0) {
      return Response.json(
        {
          success: false,
          message: "At least one image is required",
        },
        { status: 400 }
      );
    }

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      const publicId = `product-${Date.now()}-${i}`;

      try {
        // @ts-ignore - Cloudinary types are not perfect
        const uploadResult = await uploadToCloudinary(
          fileBuffer,
          "products",
          publicId
        );

        // @ts-ignore - Cloudinary types are not perfect
        imageUrls.push(uploadResult.secure_url);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return Response.json(
          {
            success: false,
            message: "Failed to upload images",
          },
          { status: 500 }
        );
      }
    }

    const product = new ProductModel({
      name: productName,
      price: Number(price),
      images: imageUrls,
    });

    await product.save();

    return Response.json(
      {
        success: true,
        message: "Product added successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred while adding product",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
