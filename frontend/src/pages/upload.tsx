import { useState, ChangeEvent, DragEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/dashboard";

interface FileWithPreview {
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
}

interface Metadata {
  color: string;
  season: string;
  fabric: string;
  usage: string;
  category: string;
  fit: string;
  description: string;
}

export default function PhotoUploadPage(): JSX.Element {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [metadataList, setMetadataList] = useState<Metadata[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFiles = (files: FileList): void => {
    const newFiles: FileWithPreview[] = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setMetadataList(prev => [...prev, ...newFiles.map(() => ({
      color: "", season: "", fabric: "", usage: "", category: "", fit: "", description: ""
    }))]);
  };

  const handleMetadataChange = (index: number, field: keyof Metadata, value: string) => {
    const updatedMetadata = [...metadataList];
    updatedMetadata[index][field] = value;
    setMetadataList(updatedMetadata);
  };
  const handleDrag = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('images', file.file);
    });
  
    formData.append('metadataList', JSON.stringify(metadataList));
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    try {
      const res = await fetch("http://localhost:5000/api/wardrobe/upload", {
        method: "POST",
        body: formData
      });
  
      if (res.ok) {
        alert("Upload successful!");
        setSelectedFiles([]);
        setMetadataList([]);
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
    setUploading(false);
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].preview);
      copy.splice(index, 1);
      return copy;
    });
    setMetadataList(prev => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 text-gray-800 font-sans">
      <header className="opacity-75 bg-gradient-to-r from-blue-600 to-pink-500 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">MyStylist AI</h1>
          <nav className="space-x-6 text-sm md:text-base">
            <Link to="/recommendation" className="hover:text-blue-100 transition">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500">
          Upload Your Wardrobe Photos
        </h2>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600 mb-6 text-center">
            Upload photos of your clothing items to build your virtual closet. Our AI will catalog and organize them for personalized style recommendations.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}>
              <div className="space-y-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only" 
                      accept="image/*"
                      multiple
                      onChange={handleChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <ul className="space-y-6">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="p-4 border rounded-lg shadow-md bg-gray-50 space-y-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={file.preview} 
                        alt={file.name}
                        className="object-cover h-24 w-24 rounded-md"/>
                      <div className="flex-1 space-y-2">
                        <select className="w-full p-2 border rounded" onChange={(e) => handleMetadataChange(index, 'color', e.target.value)}>
                          <option value="" disabled>Color</option>
                          <option>Black</option>
                          <option>White</option>
                          <option>Red</option>
                          <option>Blue</option>
                          <option>Green</option>
                          <option>Pink</option>
                          <option>Yellow</option>
                          <option>Gray</option>
                         </select>
                         <select className="w-full p-2 border rounded" onChange={(e) => handleMetadataChange(index, 'season', e.target.value)}>
                          <option value="" disabled>Season</option>
                          <option>Summer</option>
                          <option>Winter</option>
                          <option>Spring</option>
                          <option>Fall</option>
                        </select>
                        <select className="w-full p-2 border rounded" onChange={(e) => handleMetadataChange(index, 'fabric', e.target.value)}>
                          <option value="" disabled>Fabric</option>
                          <option>Cotton</option>
                          <option>Blended</option>
                          <option>Polyester</option>
                          <option>Synthetic</option>
                        </select>
                        <select className="w-full p-2 border rounded" onChange={(e) => handleMetadataChange(index, 'usage', e.target.value)}>
                          <option value="" disabled>Usage</option>
                          <option>Casual</option>
                          <option>Formal</option>
                          <option>Sports</option>
                          <option>Party</option>
                          <option>Travel</option>
                          <option>Ethnic</option>
                        </select>
                        <select className="w-full p-2 border rounded" onChange={(e) => handleMetadataChange(index, 'category', e.target.value)}>
                          <option value="" disabled>Top or Bottom</option>
                          <option>Top</option>
                          <option>Bottom</option>
                        </select>
                        <select className="w-full p-2 border rounded" onChange={(e) => handleMetadataChange(index, 'fit', e.target.value)}>
                          <option value="" disabled>Fit</option>
                          <option>Slim</option>
                          <option>Regular</option>
                          <option>Loose</option>
                          <option>Skinny</option>
                        </select>
                        <input type="text" className="w-full p-2 border rounded" placeholder="Description" onChange={(e) => handleMetadataChange(index, 'description', e.target.value)} />
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 text-sm">
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Uploading...</span>
                  <span className="text-gray-700">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-pink-500 h-2 rounded-full"
                    style={{ width: `${uploadProgress}%` }}/>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={selectedFiles.length === 0 || uploading}
                className={`px-6 py-2 rounded-md bg-gradient-to-r from-blue-600 to-pink-500 text-white font-medium 
                  ${selectedFiles.length === 0 || uploading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-pink-600'}`}>
                {uploading ? 'Uploading...' : 'Upload Photos'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Photo Tips</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Take photos of individual clothing items on a neutral background
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Include all types of items: tops, bottoms, shoes, and accessories
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Please fill details about every type of clothes you upload for recommendations.
            </li>
          </ul>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-blue-600 to-pink-500 text-white text-center py-6 mt-16">
        <p className="text-sm">&copy; {new Date().getFullYear()} MyStylist AI. All rights reserved.</p>
      </footer>
    </div>
    </DashboardLayout>
  );
}
