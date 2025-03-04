"use client"; // Ensures the component runs on the client side

import {  useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import FileUpload from "../../../../../../../public/assets/file-upload.svg";

interface FileUploaderProps {
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
}

const FileUploader = ({ selectedImage, setSelectedImage }: FileUploaderProps) => {
  // State to store the uploaded image as a base64 string
  // const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Ref to access the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handles file selection from input
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first selected file
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader(); // Create a FileReader instance
      reader.onloadend = () => {
        setSelectedImage(reader.result as string); // Convert file to base64 and set state
      };
      reader.readAsDataURL(file); // Read file as data URL
    }
  };

  // Handles drag-over event (prevents default behavior)
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Handles dropped file and updates state
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0]; // Get dropped file
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Triggers the hidden file input when the button is clicked
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="flex flex-col flex-center bg-dark-3 rounded-xl cursor-pointer p-6"
      onDragOver={handleDragOver} // Enables drag-over behavior
      onDrop={handleDrop} // Handles file drop
    >
      <div className="file_uploader-box">
        {/* If an image is uploaded, display the image preview */}
        {selectedImage ? (
          <div className="flex flex-1 flex-col justify-center w-[40vw] p-5 mt-5 max-sm:mt-0 max-sm:w-[85vw]">
            <Image
              src={selectedImage}
              width={200}
              height={200}
              alt="Uploaded"
              className="file_uploader-img"
            />
            <p className="file_uploader-label" onClick={handleButtonClick}>Click or drag photo to replace</p>
          </div>
        ) : (
          // Default UI when no image is uploaded
          <>
            <Image src={FileUpload} width={96} height={77} alt="File Upload" />
            <h3 className="base-medium mt-6 mb-2 text-light-2">Drag photo here</h3>
            <p className="text-light-4 mb-4 small-regular">SVG, PNG, JPG</p>
            <button type="button" className="shad-button_dark_4" onClick={handleButtonClick}>
              <p>Select from computer</p>
            </button>
          </>
        )}
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange} // Handles file selection
        />
      </div>
    </div>
  );
};

export default FileUploader;
