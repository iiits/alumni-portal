import Image from "next/image";

interface SearchingProps {
  message?: string;
  description?: string;
}

export default function Searching({
  message = "Searching...",
  description = "Please wait while we fetch the results for you.",
}: SearchingProps) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <div className="container px-4 flex flex-col items-center">
        {/* Loading Animation */}
        <Image
          src={"/gifs/search.gif"}
          alt="searching"
          width={500}
          height={500}
        />

        {/* Description */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl mb-4">{message}</h2>
          <p className="text-gray-600 mb-8">{description}</p>
        </div>
      </div>
    </div>
  );
}
