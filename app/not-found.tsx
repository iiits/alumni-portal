import { MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <div className="container px-4 flex flex-col items-center">
        {/* Error Code */}
        <Image src={"/404.svg"} alt="404" width={400} height={400} />

        {/* Description */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl mb-4">
            Oops! The page you&apos;re looking for isn&apos;t here.
          </h2>
          <p className="text-gray-600 mb-8">
            But don&apos;t worry, you can find plenty of other things on our
            homepage.
          </p>
        </div>

        {/* Back to Home Button */}
        <Link
          href="/"
          className="flex items-center space-x-2 bg-neutral-500 hover:bg-neutral-700 text-white px-4 py-2 rounded transition duration-150"
        >
          <MoveLeft size={20} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
