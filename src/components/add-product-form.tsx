"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { productSchema, type ProductFormValues } from "../schemas/productSchema";
import { toast } from "sonner";
import useProductStore from "../store/useProductStore";

import ImageSVG from "./SVG/imageSVG";

interface AddProductPageProps {
  onSwitchToProducts: () => void;
}

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
];


const categories = [
  { id: "sneakers", name: "Sneakers" },
  { id: "running", name: "Running" },
  { id: "casual", name: "Casual" },
  { id: "sports", name: "Sports" },
  { id: "limited", name: "Limited Edition" },
];

export default function AddProductForm({
  onSwitchToProducts,
}: AddProductPageProps) {
  const [images, setImages] = useState<
    ({ file: File; preview: string } | null)[]
  >([null, null, null, null]);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");


  const { addProduct, isLoading } = useProductStore();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      price: "",
    },
  });
  const hasImages = images.some((img) => img !== null);

  async function onSubmit(data: ProductFormValues) {
 

    if (!hasImages) {
      toast("Please upload at least one product image");
      return;
    }

    setIsSubmitting(true);

    try {

      const formData = new FormData();
      formData.append("productName", data.productName);
      formData.append("price", data.price);


      if (selectedCategory) {
        formData.append("category", selectedCategory);
      }


      images.forEach((image, index) => {
        if (image) {
          formData.append(`image-${index}`, image.file);
        }
      });


      const result = await addProduct(formData);

      if (!result.success) {
        throw new Error(result.message);
      }


      toast("Product added successfully");


      form.reset();
      setImages([null, null, null, null]);
      setSelectedCategory("");

      onSwitchToProducts();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast(error instanceof Error ? error.message : "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageUpload = (index: number, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];


    if (file.size > MAX_FILE_SIZE) {
      toast("File size exceeds 4MB limit");
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast("File type not supported. Please upload SVG, PNG, or JPG");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newImages = [...images];
      newImages[index] = { file, preview: e.target?.result as string };
      setImages(newImages);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  return (
    <div className="min-h-[80vh] flex flex-col gap-4 p-4 bg-[#f9fcff]">
      <Button
        className="bg-[#1a71f6] hover:bg-[#1a71f6]/90 w-32 cursor-pointer"
        onClick={onSwitchToProducts}
      >
        All Products
      </Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-[#e7e7e7] shadow-sm rounded-3xl h-auto">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Fill Details of the product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Input product name"
                          className="border-[#e7e7e7] focus:border-[#1a71f6] focus:ring-[#1a71f6]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Price"
                          className="border-[#e7e7e7] focus:border-[#1a71f6] focus:ring-[#1a71f6]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem> */}
              </CardContent>
            </Card>

            <div className="flex flex-col justify-between">
              <Card className="border-[#e7e7e7] shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle>Image Product</CardTitle>
                  <CardDescription className="text-[#1a71f6]">
                    <span className="font-medium">Note : </span>
                    Format photos SVG, PNG, or JPG (Max size 4mb)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className={cn(
                          "relative border border-dashed rounded-lg flex flex-col items-center justify-center p-4 h-[90px] transition-colors",
                          dragOver === index
                            ? "border-[#1a71f6] bg-[#d9edff]/40"
                            : "border-[#1a71f6] bg-[#d9edff]/20",
                        )}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOver(index);
                        }}
                        onDragLeave={() => setDragOver(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOver(null);
                          handleImageUpload(index, e.dataTransfer.files);
                        }}
                      >
                        <input
                          type="file"
                          id={`image-${index}`}
                          className="sr-only"
                          accept=".jpg,.jpeg,.png,.svg"
                          onChange={(e) =>
                            handleImageUpload(index, e.target.files)
                          }
                        />

                        {images[index] ? (
                          <>
                            <img
                              src={images[index]?.preview || "/placeholder.svg"}
                              alt={`Product image ${index + 1}`}
                              className="h-full w-full object-contain"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-5 w-5 rounded-full cursor-pointer"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          <label
                            htmlFor={`image-${index}`}
                            className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                          >
                          <ImageSVG/>
                            <p className="text-xs mt-2 text-[#737373] font-bold">
                              Photo {index + 1}
                            </p>
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  className="bg-[#1a71f6] hover:bg-[#1a71f6]/90 text-white px-6 cursor-pointer"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? "Saving..." : "Save Product"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
