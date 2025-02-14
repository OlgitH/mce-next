"use client";

import { useState } from "react";

// Define the Image type with src and alt
type Image = {
  image: {
    url: string;
    alt: string;
  };
};

type Props = {
  images: Image[] | undefined;
};

const Gallery = ({ images }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Ensure images are available and not empty
  if (!images || images.length === 0) {
    return <div>No images available</div>;
  }

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length); // Wrap around when reaching the end
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length); // Wrap around when reaching the start
  };

  // Ensure that currentSlide is within the range of images
  const currentImage = images[currentSlide]?.image ?? null;

  // If there is no current image, return a fallback
  if (!currentImage) {
    return <div>No image found</div>;
  }

  return (
    <div className="container relative">
      {/* Full-width image with number text */}
      <div className="mySlides relative">
        <img src={currentImage.url} alt={currentImage.alt} className="w-full" />
        {/* Next and previous buttons */}
        <div className="z-40 flex absolute h-full right-0 top-0 items-center bg-[coral] sm:bg-transparent sm:hover:bg-[coral] transition duration-300 ease-in-out ">
          <a
            className="next px-2 text-white block h-full flex items-center  text-2xl z-10  cursor-pointer"
            onClick={nextSlide}
          >
            &#10095;
          </a>
        </div>
        <div className="z-40 flex absolute h-full left-0 top-0 items-center bg-[coral] sm:bg-transparent sm:hover:bg-[coral] transition duration-300 ease-in-out ">
          <a
            className="prev px-2 text-white block h-full flex items-center  text-2xl z-10 cursor-pointer"
            onClick={prevSlide}
          >
            &#10094;
          </a>
        </div>
      </div>

      {/* Image caption */}
      <div className="caption-container">
        <p id="caption">{currentImage.alt}</p>
      </div>

      {/* Thumbnail images */}
      <div className="thumbnail-container flex gap-2 overflow-x-auto mt-4">
        {images.map((item, index) => (
          <div key={index} className="thumbnail-column flex-shrink-0">
            <img
              className="demo cursor-pointer w-24"
              src={item.image.url}
              alt={item.image.alt}
              onClick={() => setCurrentSlide(index)} // Clicking a thumbnail sets the current slide
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
