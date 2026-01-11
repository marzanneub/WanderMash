"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Cropper, { Area, Point } from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import SidebarRestaurant from "@/components/navigation/sidebarRestaurant";

interface User {
    logo: string;
    dp: string;
    phone: string;
    images: string[];
}

const RestaurantGalleryPage: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [images, setImages] = useState([]);
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(true);

    const [errors, setErrors] = useState<{
        logo?: string;
        phone?: string;
        loading?: string;
        errormessage?: string;
    }>({});

    const searchParams = useSearchParams();
    const warnmessage = searchParams.get("warnmessage");
    const successmessage = searchParams.get("successmessage");
    useEffect(() => {
        toast.warn(warnmessage, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        toast.success(successmessage, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }, []);

    useEffect(() => {
        fetch('/api/get-user-info-for-profile')
            .then(res => res.json())
            .then(data => {
                setUser(data.user);
                setPhone(data.user.phone);
                setImages(data.user.images);

                setLoading(false);
            }
            );
    }, []);


    const deleteImage = async (item: string) => {

        const formData = new FormData();

        formData.append("image", item);


        const res = await fetch("http://localhost:4000/restaurant/deleteImage", {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) {
            toast.error(data.errormessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }
        else {
            toast.success(data.successmessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            fetch('/api/get-user-info-for-profile')
                .then(res => res.json())
                .then(data => {
                    setImages(data.user.images);
                }
                );

            return;
        }
    };

    const setAsDp = async (item: string) => {

        const formData = new FormData();

        formData.append("image", item);


        const res = await fetch("http://localhost:4000/restaurant/setAsDp", {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) {
            toast.error(data.errormessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }
        else {
            toast.success(data.successmessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            fetch('/api/get-user-info-for-profile')
                .then(res => res.json())
                .then(data => {
                    setUser(data.user);
                }
                );

            return;
        }
    };

    ////////////////////for image////////////////////
    const [fileName, setFileName] = useState("No file selected");
    const [currentUploadedFile, setCurrentUploadedFile] = useState("No file selected");

    const [image, setImage] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);

    const onMediaLoaded = (mediaSize: { width: number; height: number }) => {
        const { width, height } = mediaSize;
        setAspectRatio(width / height);
    };

    const handleResetImage = () => {
        setCroppedImage(null);
        setImage(null);
        setFileName("No file selected");
        setCurrentUploadedFile("No file selected");
    };

    const onCropComplete = (_: Area, croppedPixels: Area) => {
        setCroppedArea(croppedPixels);
    };

    const handleCrop = async () => {
        if (!image || !croppedArea) return;
        const cropped = await getCroppedImg(image, croppedArea);
        setCroppedImage(cropped);
        setIsOpen(false);
        setFileName(currentUploadedFile);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCurrentUploadedFile(file.name);
        setImage(URL.createObjectURL(file));
        setZoom(1);
        setIsOpen(true);
    };

    const dataURLtoBlob = (dataurl: string) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    /////////////////////////////////////////////////

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        if (croppedImage !== null) {
            const imageBlob = dataURLtoBlob(croppedImage);
            formData.append("image", imageBlob, `${phone}.png`);
        }

        const res = await fetch("http://localhost:4000/restaurant/uploadImage", {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) {
            toast.error(data.errormessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }
        else {
            toast.success(data.successmessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            fetch('/api/get-user-info-for-profile')
                .then(res => res.json())
                .then(data => {
                    setImages(data.user.images);
                }
                );
            handleResetImage();

            return;
        }

        // router.push("dashboard?successmessage=Successfully updated");
    }

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarRestaurant pagetype="Gallery" />

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-10">Gallery</h1>

                {loading && (
                    <div className="animate-pulse">
                    {/* ================= Upload Form Skeleton ================= */}
                    <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* -------- Left: Image Upload Box -------- */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-slate-200" />
                            <div className="h-4 w-32 bg-slate-200 rounded" />
                            </div>

                            <div className="w-full h-64 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <div className="w-12 h-12 bg-slate-200 rounded-full" />
                            </div>

                            <div className="mt-3 h-3 w-40 bg-slate-200 rounded" />
                        </div>

                        {/* -------- Right: Confirm Actions -------- */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-slate-200" />
                            <div className="h-4 w-40 bg-slate-200 rounded" />
                            </div>

                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                            <div className="h-3 w-full bg-slate-200 rounded" />
                            <div className="h-3 w-5/6 bg-slate-200 rounded" />
                            <div className="h-3 w-4/6 bg-slate-200 rounded" />

                            <div className="flex gap-3 mt-6">
                                <div className="flex-1 h-12 bg-slate-300 rounded-xl" />
                                <div className="w-28 h-12 bg-slate-200 rounded-xl" />
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* ================= Uploaded Photos Skeleton ================= */}
                    <div className="mt-10 bg-white p-6 rounded-2xl shadow-md">
                        <div className="h-5 w-48 bg-slate-200 rounded mb-6" />

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-full h-48 bg-slate-200 rounded-xl" />
                        ))}
                        </div>
                    </div>
                    </div>
                )}

                {user !== null && (
                    <div>
                        <form className="bg-white rounded-xl shadow-lg p-8 space-y-8" onSubmit={handleSubmit}>
                            {/* /////////////////////////////////////////////////////// */}
                            <div className="grid md:grid-cols-2 gap-8 items-start">
                                <div>
                                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg text-sm">01</span>
                                        Select Photo
                                    </h2>
                                    <label htmlFor="imageInput" className="group relative flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all overflow-hidden">
                                        {croppedImage ? (
                                            <img
                                                src={croppedImage}
                                                className="w-full h-full object-cover"
                                                alt="Preview"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg
                                                    className="w-10 h-10 mb-3 text-slate-400 group-hover:text-indigo-500 transition-colors"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    />
                                                </svg>
                                                <p className="text-sm text-slate-600 font-medium">
                                                    Click to upload image
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id="imageInput"
                                            name="image"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <p className="mt-3 text-xs text-slate-500 italic">
                                        Current file: {fileName}
                                    </p>
                                </div>

                                <div className="w-full space-y-6">
                                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg text-sm">02</span>
                                        Confirm Actions
                                    </h2>
                                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                            Upload photos of your dishes, interior, or ambiance. You
                                            can set any uploaded photo as your primary display picture
                                            later.
                                        </p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleSubmit}
                                                disabled={!croppedImage}
                                                className={`flex-1 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${!croppedImage
                                                        ? "bg-slate-300 cursor-not-allowed"
                                                        : "bg-indigo-600 hover:bg-indigo-700 active:scale-95 cursor-pointer"
                                                    }`}
                                            >
                                                Upload Now
                                            </button>
                                            {croppedImage && (
                                                <button
                                                    onClick={handleResetImage}
                                                    className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* /////////////////////////////////////////////////////// */}

                        </form>
                        {isOpen && image && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                                <div className={`bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden`}>
                                    <div className="flex justify-between items-center px-4 py-3 border-b">
                                        <h2 className="font-semibold">Crop Image</h2>
                                        <div>
                                            <button
                                                onClick={() => setIsOpen(false)}
                                                className="text-gray-500 hover:text-black cursor-pointer px-4"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>

                                    <div 
                                        className="relative w-full overflow-hidden bg-slate-100" 
                                        style={{ 
                                            aspectRatio: `${aspectRatio}`, 
                                            maxHeight: '70vh' 
                                        }}
                                    >
                                        <Cropper
                                            image={image}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={aspectRatio}
                                            onMediaLoaded={onMediaLoaded}
                                            minZoom={1}
                                            maxZoom={4}
                                            showGrid={false}
                                            onCropChange={setCrop}
                                            onZoomChange={setZoom}
                                            onCropComplete={onCropComplete}
                                        />
                                        <div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                                            style={{
                                                aspectRatio: "1 / 1",
                                                height: "100%", 
                                                width: "auto",
                                                maxHeight: "100%",
                                                maxWidth: "100%",
                                                border: "2px dashed rgba(255, 255, 255, 0.6)",
                                            }}
                                        />
                                        <div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                                            style={{
                                                aspectRatio: "21 / 9",
                                                width: "100%",
                                                height: "auto", 
                                                maxHeight: "100%",
                                                maxWidth: "100%",
                                                border: "2px dashed rgba(255, 255, 255, 0.6)",
                                            }}
                                        />
                                    </div>

                                    <div className="p-4 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm">Zoom</span>
                                            <input
                                                type="range"
                                                min={1}
                                                max={4}
                                                step={0.1}
                                                value={zoom}
                                                onChange={(e) => setZoom(Number(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3">
                                            <a
                                                onClick={() => setIsOpen(false)}
                                                className="px-4 py-3 text-indigo-600 hover:bg-gray-100 font-semibold rounded-md shadow-md transition cursor-pointer"
                                            >
                                                Cancel
                                            </a>
                                            <a
                                                onClick={handleCrop}
                                                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold border rounded-md shadow-md transition cursor-pointer"
                                            >
                                                Crop & Save
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-10 bg-white p-6 rounded-2xl shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Uploaded Photos</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                <div className="relative group">
                                    <img src={`http://localhost:4000/images/${user.dp}`} alt="Gallery Image" className="w-full h-48 object-cover rounded-xl shadow-md" />

                                    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full shadow">Display</div>

                                    <div className="absolute bottom-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition">
                                    </div>
                                </div>

                                {images.map((item) => (item !== user.dp && (
                                    <div key={item} className="relative group w-full h-auto">
                                        <img src={`http://localhost:4000/images/${item}`} alt="Gallery Image" className="w-full h-full object-cover rounded-xl shadow-md" />

                                        <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                                            <button
                                                onClick={() => setAsDp(item)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-lg shadow cursor-pointer"
                                            >
                                                Set as DP
                                            </button>
                                            <button
                                                onClick={() => deleteImage(item)}
                                                className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg shadow cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                )))}

                            </div>
                        </div>

                    </div>
                )}

            </main>

        </div>
    )
}

export default RestaurantGalleryPage;