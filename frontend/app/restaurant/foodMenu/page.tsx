"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Cropper, { Area, Point } from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import SidebarRestaurant from "@/components/navigation/sidebarRestaurant";

interface MenuItems {
    _id: string;
    name: string;
    price: string;
    description: string;
    category: string;
    image: string;
    isAvailable: boolean;
}

interface User {
    menuItems: MenuItems[];
    phone: string;
}

const RestaurantFoodMenuPage: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItems[] | null>([]);
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(true);

    const [errors, setErrors] = useState<{
        name?: string;
        price?: string;
        category?: string;
        image?: string;
        description?: string;
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
                setMenuItems(data.user.menuItems);

                setLoading(false);
            }
            );
    }, []);


    ////////////////////for image////////////////////
    const [fileName, setFileName] = useState("No file selected");
    const [currentUploadedFile, setCurrentUploadedFile] = useState("No file selected");

    const [image, setImage] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<number>(1);

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
    
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string>("");

    //////////////////For adding items///////////////

    const resetForm = async() => {
        handleResetImage();
        setName("");
        setPrice("");
        setDescription("");
        setCategory("");
        setImagePreview(null);
        setEditingId("");
    }

    /////////////////////////////////////////////////

    /////////////////For editing items///////////////
    const startEdit = (item: MenuItems) => {
        handleResetImage();
        setName(item.name);
        setPrice(item.price);
        setDescription(item.description);
        setCategory(item.category);
        setImagePreview(item.image);
        setEditingId(item._id);
    }

    /////////////////////////////////////////////////

    const handleDeleteMenuItem = async (_id: string) => {
        const formData = new FormData();
        formData.append("_id", _id);
        
        const res = await fetch("http://localhost:4000/restaurant/deleteMenuItem", {
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
                    setMenuItems(data.user.menuItems);
                }
            );

            return;
        }

    }

    const handleEditMenuItem = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};

        if(!name) {
            newErrors.name = "Name is required";
        }

        if(!price) {
            newErrors.price = "Price is required";
        }

        if(!category) {
            newErrors.category = "category is required";
        }

        if(description.length > 100) {
            newErrors.description = "Description will contain maximum 100 characters.";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length !== 0) return;

        const formData = new FormData();
        if (croppedImage !== null) {
            const imageBlob = dataURLtoBlob(croppedImage);
            formData.append("image", imageBlob, `${phone}.png`);
        }
        
        formData.append("_id", editingId);
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("category", category);

        const res = await fetch("http://localhost:4000/restaurant/editMenuItem", {
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
                    setMenuItems(data.user.menuItems);
                }
            );
            resetForm();

            return;
        }

    }

    const handleAddMenuItem = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};

        if(!name) {
            newErrors.name = "Name is required";
        }

        if(!price) {
            newErrors.price = "Price is required";
        }

        if(!category) {
            newErrors.category = "category is required";
        }

        if(description.length > 100) {
            newErrors.description = "Description will contain maximum 100 characters.";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length !== 0) return;

        const formData = new FormData();
        if (croppedImage !== null) {
            const imageBlob = dataURLtoBlob(croppedImage);
            formData.append("image", imageBlob, `${phone}.png`);
        }

        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("category", category);

        const res = await fetch("http://localhost:4000/restaurant/addMenuItem", {
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
                    setMenuItems(data.user.menuItems);
                }
            );
            resetForm();

            return;
        }

        // router.push("dashboard?successmessage=Successfully updated");
    }

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarRestaurant pagetype="Food Menu" />

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-10">Food Menu</h1>

                {loading && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-pulse">
                    
                    {/* LEFT FORM SKELETON */}
                    <div className="bg-white rounded-2xl shadow-xl p-12 gap-14 lg:col-span-5 lg:sticky lg:top-10 space-y-6">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-6 w-40 bg-gray-200 rounded" />
                        <div className="h-10 w-24 bg-gray-200 rounded-md" />
                    </div>

                    {/* Image Upload */}
                    <div className="w-full h-44 bg-gray-200 rounded-2xl border-2 border-dashed border-gray-300" />

                    {/* Input Fields */}
                    <div className="space-y-4">
                        <div>
                        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                        <div className="h-12 w-full bg-gray-200 rounded-md" />
                        </div>

                        <div>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                        <div className="h-12 w-full bg-gray-200 rounded-md" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
                            <div className="h-12 bg-gray-200 rounded-md" />
                        </div>
                        <div>
                            <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                            <div className="h-12 bg-gray-200 rounded-md" />
                        </div>
                        </div>

                        {/* Submit Button */}
                        <div className="h-12 w-full bg-gray-300 rounded-md mt-4" />
                    </div>
                    </div>

                    {/* RIGHT LIVE MENU VIEW */}
                    <div className="lg:col-span-7 space-y-5">
                    
                    {/* Title */}
                    <div className="h-6 w-48 bg-gray-200 rounded" />

                    {/* Menu Item Skeletons */}
                    {[...Array(3)].map((_, i) => (
                        <div
                        key={i}
                        className="bg-white p-5 rounded-2xl border border-slate-200 flex gap-5 shadow-sm"
                        >
                        {/* Image */}
                        <div className="w-24 h-24 bg-gray-200 rounded-2xl shrink-0" />

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                            <div className="flex justify-between">
                            <div>
                                <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                                <div className="h-5 w-40 bg-gray-200 rounded" />
                            </div>
                            <div className="h-5 w-16 bg-gray-200 rounded" />
                            </div>

                            <div className="space-y-2">
                            <div className="h-4 w-full bg-gray-200 rounded" />
                            <div className="h-4 w-5/6 bg-gray-200 rounded" />
                            </div>

                            <div className="flex gap-4 mt-4 pt-3 border-t border-slate-100">
                            <div className="h-4 w-16 bg-gray-200 rounded" />
                            <div className="h-4 w-16 bg-gray-200 rounded" />
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>

                </div>
                )}


                {user !== null && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        <div className="bg-white rounded-2xl shadow-xl p-12 gap-14 lg:col-span-5 lg:sticky lg:top-10">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                {editingId ? "Edit Item" : "New Item"}
                                </h2>
                                {editingId && (
                                    <button onClick={resetForm} className="px-4 py-3 text-indigo-600 hover:bg-gray-100 font-semibold rounded-md shadow-md transition cursor-pointer">
                                        Cancel
                                    </button>
                                )}
                            </div>

                            <form  onSubmit={editingId ? handleEditMenuItem : handleAddMenuItem} className="space-y-4">
                                {/* <label className="relative group w-full h-44 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden transition-all hover:border-indigo-400"> */}
                                <label className="group relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all overflow-hidden">
                                {croppedImage ? (
                                    <img 
                                        src={croppedImage} 
                                        className="w-full h-full object-cover"
                                        alt="Preview"
                                    />
                                ) : (editingId ? (
                                    <img 
                                        src={`http://localhost:4000/images/${imagePreview}`} 
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
                                ))}
                                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </label>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Dish name <span className="text-red-500">*</span></label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        // required
                                        placeholder="e.g. Past Carbona"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <input
                                        id="description"
                                        name="description"
                                        type="text"
                                        // required
                                        placeholder="Describe the ingredients, taste, or size..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full h-auto px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
                                        <input
                                            id="price"
                                            name="price"
                                            type="number"
                                            // required
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="w-full h-12 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {errors.price && (
                                            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                                        <select
                                            value={category} 
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full h-12 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="" disabled>-- select --</option>
                                                <option  value="Appetizer">Appetizer</option>
                                                <option  value="Main Course">Main Course</option>
                                                <option  value="Dessert">Dessert</option>
                                                <option  value="Drinks">Drinks</option>
                                        </select>
                                        {errors.category && (
                                            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className={`w-full ${editingId ? "bg-amber-400" : "bg-indigo-600 hover:bg-indigo-700"} text-white font-semibold py-3 rounded-md shadow-md transition cursor-pointer`}
                                >
                                    {editingId ? "Update item" : "Save to Menu"}
                                </button>
                                

                            </form>

                        </div>
                        {isOpen && image && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                                <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
                                    <div className="flex justify-between items-center px-4 py-3 border-b">
                                        <h2 className="font-semibold">Crop Image</h2>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="text-gray-500 hover:text-black cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="relative h-96 bg-black">
                                        <Cropper
                                            image={image}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={aspectRatio}
                                            minZoom={1}
                                            maxZoom={4}
                                            onCropChange={setCrop}
                                            onZoomChange={setZoom}
                                            onCropComplete={onCropComplete}
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


                        <div className="lg:col-span-7 space-y-5">
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                Live Menu View
                            </h2>
                            {(menuItems && menuItems.length>0) ? (menuItems.map((item) => (
                                <div key={item._id} className={`bg-white p-5 rounded-2xl border flex gap-5 shadow-sm transition-all ${editingId === item._id ? 'border-amber-400 bg-amber-50/30 ring-1 ring-amber-400' : 'border-slate-200'}`}>
                                    <img src={`http://localhost:4000/images/${item.image}`} className="w-24 h-24 rounded-2xl object-cover border border-slate-100 shrink-0" alt={item.name} />
                                
                                    <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{item.category}</span>
                                        <h4 className="text-xl font-bold text-slate-800 mt-1">{item.name}</h4>
                                        </div>
                                        <p className="text-indigo-600 font-black text-lg">৳{item.price}</p>
                                    </div>
                                    
                                    <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed italic">
                                        {item.description}
                                    </p>

                                    <div className="flex gap-4 mt-4 pt-3 border-t border-slate-50">
                                        <button onClick={() => startEdit(item)} className="text-slate-400 hover:text-amber-500 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer">
                                            Edit item
                                        </button>
                                        <button onClick={() => handleDeleteMenuItem(item._id)} className="text-slate-400 hover:text-rose-500 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer">
                                            Delete
                                        </button>
                                    </div>
                                    </div>
                                </div>
                            ))
                            ):(
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                                <h3 className="text-xl font-bold text-slate-700">Your menu is empty</h3>
                                <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                                Start building your digital menu by adding your first dish using the form on the left.
                                </p>
                            </div>
                            )}
                        </div>
                    </div>
                )}

            </main>

        </div>
    )
}

export default RestaurantFoodMenuPage;