import type { NextRequest } from "next/server"
import dbConnect from "../../../../../lib/dbConnect"
import ProductModel from "../../../../../models/Products"
import cloudinary from "cloudinary"


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const id = params.id

    // Find the product to get image URLs
    const product = await ProductModel.findById(id)

    if (!product) {
      return Response.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 },
      )
    }


    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {

          const urlParts = imageUrl.split("/")
          const publicIdWithExtension = urlParts[urlParts.length - 1]
          const publicId = publicIdWithExtension.split(".")[0]
          const folder = urlParts[urlParts.length - 2]

       
          await cloudinary.v2.uploader.destroy(`${folder}/${publicId}`)
        } catch (error) {
          console.error("Error deleting image from Cloudinary:", error)
     
        }
      }
    }


    await ProductModel.findByIdAndDelete(id)

    return Response.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error deleting product:", error)
    return Response.json(
      {
        success: false,
        message: "An error occurred while deleting product",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
