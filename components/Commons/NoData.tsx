import { MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface NoDataProps {
  message?: string;
  description?: string;
  url: string;
}

export default function NoData({
  message = "No Data Found",
  description = "Please try again later.",
  url = "/",
}: NoDataProps) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <div className="container px-4 flex flex-col items-center">
        {/* Loading Animation */}
        <Image
          src={"/gifs/no_data.gif"}
          alt="searching"
          width={500}
          height={500}
        />

        {/* Description */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl mb-4">{message}</h2>
          <p className="text-gray-600 mb-8">{description}</p>
        </div>

        <Link
          href="/"
          className="flex items-center space-x-2 bg-neutral-500 hover:bg-neutral-700 text-white px-4 py-2 rounded transition duration-150"
        >
          <MoveLeft size={20} />
          <span>Return Back</span>
        </Link>
      </div>
    </div>
  );
}
