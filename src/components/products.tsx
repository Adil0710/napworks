"use client";

import { useEffect, useState } from "react";
import { Search, Plus, FilterIcon, CalendarIcon } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Checkbox } from "../components/ui/checkbox";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { cn } from "../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { Card, CardContent } from "../components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Slider } from "../components/ui/slider";
import { toast } from "sonner";
import useProductStore from "../store/useProductStore";
import { Skeleton } from "../components/ui/skeleton";
import Trash from "./SVG/trash";

interface ProductsPageProps {
  onSwitchToAddProduct: () => void;
}

const categories = [
  { id: "sneakers", name: "Sneakers" },
  { id: "running", name: "Running" },
  { id: "casual", name: "Casual" },
  { id: "sports", name: "Sports" },
  { id: "limited", name: "Limited Edition" },
];

export default function ProductsPage({
  onSwitchToAddProduct,
}: ProductsPageProps) {
  const {
    isLoading,
    error,
    filters,
    pagination,
    fetchProducts,
    deleteProduct,
    setSearchQuery,
    setStartDate,
    setEndDate,
    setMinPrice,
    setMaxPrice,
    toggleCategory,
    setSortOrder,
    resetFilters,
    setCurrentPage,

    getFilteredProducts,
    getCurrentPageProducts,
  } = useProductStore();

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const currentProducts = getCurrentPageProducts();
  const filteredProducts = getFilteredProducts();

  useEffect(() => {
    if (priceRange[0] > 0) {
      setMinPrice(priceRange[0].toString());
    }
    if (priceRange[1] < 100) {
      setMaxPrice(priceRange[1].toString());
    }
  }, [priceRange, setMinPrice, setMaxPrice]);

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };

  const handleDeleteProduct = async (id: string) => {
    const success = await deleteProduct(id);
    if (success) {
      toast("Product deleted successfully");
    } else {
      toast("Failed to delete product");
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentProducts.map((product) => product._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
      setSelectAll(false);
    } else {
      setSelectedItems([...selectedItems, id]);
      if (selectedItems.length + 1 === currentProducts.length) {
        setSelectAll(true);
      }
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, "MM/dd/yy"),
      time: format(date, "h:mm a"),
    };
  };

  return (
    <div className="flex-1 p-6 min-h-[84vh]">
      <div className="mb-4">
        <h1 className="text-2xl text-header font-semibold mb-2">Product</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Product</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                className="text-[#1a71f6] hover:text-[#1a71f6] font-bold"
              >
                Sneakers
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card className="rounded-3xl">
        <CardContent className="p-6">
          {/* search & filters */}
          <div className="flex md:flex-row flex-col justify-between mb-6 md:gap-0 gap-4">
            <div className="relative md:w-[400px] w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search product"
                  className="pl-10 w-full"
                  value={filters.searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className=" cursor-pointer">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                    <SheetDescription>
                      Apply filters to narrow down your product list.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 px-5">
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full"
                      defaultValue="categories"
                    >
                      <AccordionItem value="categories">
                        <AccordionTrigger>Categories</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid gap-2">
                            {categories.map((category) => (
                              <div
                                key={category.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`category-${category.id}`}
                                  checked={filters.selectedCategories.includes(
                                    category.id
                                  )}
                                  onCheckedChange={() =>
                                    toggleCategory(category.id)
                                  }
                                />
                                <Label htmlFor={`category-${category.id}`}>
                                  {category.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="price">
                        <AccordionTrigger>Price Range</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <Slider
                              defaultValue={[0, 100]}
                              max={100}
                              step={1}
                              value={priceRange}
                              onValueChange={(value) =>
                                setPriceRange(value as [number, number])
                              }
                              className="my-6"
                            />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span>$</span>
                                <Input
                                  type="number"
                                  placeholder="Min"
                                  value={priceRange[0]}
                                  onChange={(e) =>
                                    setPriceRange([
                                      Number.parseInt(e.target.value) || 0,
                                      priceRange[1],
                                    ])
                                  }
                                  className="w-24"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <span>$</span>
                                <Input
                                  type="number"
                                  placeholder="Max"
                                  value={priceRange[1]}
                                  onChange={(e) =>
                                    setPriceRange([
                                      priceRange[0],
                                      Number.parseInt(e.target.value) || 100,
                                    ])
                                  }
                                  className="w-24"
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="date">
                        <AccordionTrigger>Date Range</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="grid gap-2">
                              <Label>Start Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !filters.startDate &&
                                        "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filters.startDate ? (
                                      format(filters.startDate, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={filters.startDate}
                                    onSelect={setStartDate}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="grid gap-2">
                              <Label>End Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !filters.endDate &&
                                        "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filters.endDate ? (
                                      format(filters.endDate, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={filters.endDate}
                                    onSelect={setEndDate}
                                    initialFocus
                                    disabled={(date) =>
                                      filters.startDate
                                        ? date < filters.startDate
                                        : false
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="sort">
                        <AccordionTrigger>Sort By</AccordionTrigger>
                        <AccordionContent>
                          <RadioGroup
                            value={filters.sortOrder}
                            onValueChange={(value: any) => setSortOrder(value)}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="newest" id="newest" />
                              <Label htmlFor="newest">Newest First</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="oldest" id="oldest" />
                              <Label htmlFor="oldest">Oldest First</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="price-low-high"
                                id="price-low-high"
                              />
                              <Label htmlFor="price-low-high">
                                Price: Low to High
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="price-high-low"
                                id="price-high-low"
                              />
                              <Label htmlFor="price-high-low">
                                Price: High to Low
                              </Label>
                            </div>
                          </RadioGroup>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  <SheetFooter>
                    <Button variant="outline" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                    <SheetClose asChild>
                      <Button>Apply Filters</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
              <Button
                className="bg-[#1a71f6] hover:bg-[#1a71f6]/90 cursor-pointer"
                onClick={onSwitchToAddProduct}
              >
                New Product
                <Plus className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* date range & price filters */}
          <div className="flex items-center justify-center md:flex-row flex-col mb-6">
            <div className="md:w-1/2 w-full pr-0">
              <div className="mb-2 text-sm font-medium">Date Range</div>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-1/2 justify-start text-left font-normal cursor-pointer",
                        !filters.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.startDate ? (
                        format(filters.startDate, "PPP")
                      ) : (
                        <span>Start Date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-1/2 justify-start text-left font-normal cursor-pointer",
                        !filters.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.endDate ? (
                        format(filters.endDate, "PPP")
                      ) : (
                        <span>End Date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) =>
                        filters.startDate ? date < filters.startDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="w-full md:pl-14 pl-0 md:mt-0 mt-4">
              <div className="mb-2 w-1/2 text-sm font-medium">Price</div>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  className="md:w-1/4 w-full"
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  className="md:w-1/4 w-full"
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* active filters */}
          {(filters.selectedCategories.length > 0 ||
            filters.startDate ||
            filters.endDate ||
            filters.minPrice ||
            filters.maxPrice) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.selectedCategories.map((categoryId) => {
                const category = categories.find((c) => c.id === categoryId);
                return category ? (
                  <div
                    key={categoryId}
                    className="flex items-center bg-[#f0f7ff] text-[#1a71f6] px-3 py-1 rounded-full text-sm "
                  >
                    {category.name}
                    <button
                      className="ml-2 cursor-pointer"
                      onClick={() => toggleCategory(categoryId)}
                    >
                      ×
                    </button>
                  </div>
                ) : null;
              })}
              {filters.startDate && (
                <div className="flex items-center bg-[#f0f7ff] text-[#1a71f6] px-3 py-1 rounded-full text-sm">
                  From: {format(filters.startDate, "PP")}
                  <button
                    className="ml-2"
                    onClick={() => setStartDate(undefined)}
                  >
                    ×
                  </button>
                </div>
              )}
              {filters.endDate && (
                <div className="flex items-center bg-[#f0f7ff] text-[#1a71f6] px-3 py-1 rounded-full text-sm">
                  To: {format(filters.endDate, "PP")}
                  <button
                    className="ml-2"
                    onClick={() => setEndDate(undefined)}
                  >
                    ×
                  </button>
                </div>
              )}
              {filters.minPrice && (
                <div className="flex items-center bg-[#f0f7ff] text-[#1a71f6] px-3 py-1 rounded-full text-sm">
                  Min: ${filters.minPrice}
                  <button className="ml-2" onClick={() => setMinPrice("")}>
                    ×
                  </button>
                </div>
              )}
              {filters.maxPrice && (
                <div className="flex items-center bg-[#f0f7ff] text-[#1a71f6] px-3 py-1 rounded-full text-sm">
                  Max: ${filters.maxPrice}
                  <button className="ml-2" onClick={() => setMaxPrice("")}>
                    ×
                  </button>
                </div>
              )}
              <button
                className="text-[#1a71f6] text-sm underline cursor-pointer"
                onClick={resetFilters}
              >
                Clear all
              </button>
            </div>
          )}

          {/* products table */}
          {isLoading ? (
            <div className="border rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-[#f6f6f6]">
                  <TableRow>
                    <TableHead className="w-10">
                      <Skeleton className="h-4 w-4" />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Skeleton className="w-10 h-10 mr-3 rounded" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <div>
                          <Skeleton className="h-4 w-20 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <>
              {error ? (
                <div className="text-red-500 text-center py-10">{error}</div>
              ) : (
                <div className="border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-[#f6f6f6]">
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!isLoading && currentProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10">
                            No products found
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentProducts.map((product) => {
                          const formattedDate = formatDate(product.createdAt);
                          return (
                            <TableRow key={product._id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedItems.includes(product._id)}
                                  onCheckedChange={() =>
                                    handleSelectItem(product._id)
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-10 h-10 mr-3 bg-[#f3f3f3] rounded overflow-hidden">
                                    <Image
                                      src={
                                        product.images[0] ||
                                        "/placeholder.svg?height=40&width=40" ||
                                        "/placeholder.svg"
                                      }
                                      alt={product.name}
                                      width={35}
                                      height={35}
                                    />
                                  </div>
                                  <span className=" text-sm capitalize">
                                    {product.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>${product.price.toFixed(2)}</TableCell>
                              <TableCell>
                                <div className="text-sm text-color">
                                  <div>{formattedDate.date}</div>
                                  <div>at {formattedDate.time}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className=" cursor-pointer"
                                    >
                                      {" "}
                                      <Trash className="w-10 h-10" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Product
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete the
                                        &quot;
                                        {product.name}&quot; product? This
                                        action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className=" cursor-pointer">
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteProduct(product._id)
                                        }
                                        className="bg-red-500 hover:bg-red-500/90 cursor-pointer"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}

          {!isLoading && !error && filteredProducts.length > 0 && (
            <div className="mt-4 flex md:flex-row flex-col md:gap-0 gap-5 items-center justify-between text-sm">
              <div className="text-muted-foreground">
                {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} -{" "}
                {Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  filteredProducts.length
                )}{" "}
                of {filteredProducts.length} items
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-muted-foreground w-full">
                  The page on
                </span>
                <Select
                  value={pagination.currentPage.toString()}
                  onValueChange={(value) =>
                    setCurrentPage(Number.parseInt(value))
                  }
                >
                  <SelectTrigger className="w-16 cursor-pointer">
                    <SelectValue placeholder="Page" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Pagination className="ml-2">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.currentPage > 1)
                            setCurrentPage(pagination.currentPage - 1);
                        }}
                        className={
                          pagination.currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {pagination.totalPages > 5 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.currentPage < pagination.totalPages) {
                            setCurrentPage(pagination.currentPage + 1);
                          }
                        }}
                        className={
                          pagination.currentPage >= pagination.totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
