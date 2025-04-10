import Link from "next/link";


export default function Dashboard() {
  return <div className=" w-full  justify-center items-center text-color-2 flex">click on products to show <Link href="/products" className=" font-bold text-header mx-1"> Product </Link> page</div>;
}
