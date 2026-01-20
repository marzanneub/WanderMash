"use client";
import React, {useState, useEffect, ChangeEvent} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cropper, { Area, Point } from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import SidebarGeneralUser from "@/components/navigation/sidebarGeneralUser";

const GeneralUserEditProfilePage: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(true);

    const [errors, setErrors] = useState<{
        name?: string;
        phone?: string;
        errormessage?: string;
    }>({});

    useEffect(() => {
        fetch('/api/get-user-info-for-profile') 
            .then(res => res.json())
            .then(data => {
                setUser(data.user);
                setProfilePicture(data.user.profilePicture);
                setName(data.user.name);
                setEmail(data.user.email);
                setPhone(data.user.phone);
                setBio(data.user.bio);
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
    const aspectRatio = 1;

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

        const newErrors: typeof errors = {};

        if(!name) {
            newErrors.name = "Name is required";
        }

        if(!phone) {
            newErrors.phone = "Phone number is required";
        } else if(phone.startsWith("880")) {
            setPhone(`+${phone}`);
        } else if(phone.startsWith("0")) {
            setPhone(`+880${phone.slice(1)}`);
        } else if(!phone.startsWith("+880")) {
            setPhone(`+880${phone}`);
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length !== 0) return;

        const formData = new FormData();
        if(croppedImage!== null){
            const imageBlob = dataURLtoBlob(croppedImage);
            formData.append("profilePicture", imageBlob, `${phone}.png`);
        }
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("bio", bio);


        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/generalUser/editProfile`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        const data = await res.json();
        if(!res.ok){
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
        
        router.push("profile?successmessage=Successfully updated");
    };

    return (
        <div className="bg-indigo-50 min-h-screen w-full flex">
            <SidebarGeneralUser pagetype="Edit Profile" />

            <main className="container mx-auto px-10 py-16 max-w-7xl">
                <h1 className="text-4xl font-bold text-indigo-900 mb-10">Edit Profile</h1>
                
                {loading && (
                    <div className="bg-white rounded-xl shadow-lg p-8 space-y-8 animate-pulse">
                    {/* Profile Image + Change Photo */}
                        <div className="flex items-center space-x-6">
                            <div className="rounded-full w-24 h-24 bg-gray-200" />
                            <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                            <div className="h-3 w-24 bg-gray-100 rounded" />
                            </div>
                        </div>

                        {/* Input Field Skeleton */}
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                            <div className="h-12 w-full bg-gray-200 rounded-md" />
                            </div>
                        ))}

                        {/* Bio Textarea Skeleton */}
                        <div className="space-y-2">
                            <div className="h-4 w-20 bg-gray-200 rounded" />
                            <div className="h-24 w-full bg-gray-200 rounded-lg" />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between items-center">
                            <div className="h-12 w-28 bg-gray-200 rounded-md" />
                            <div className="h-12 w-36 bg-gray-300 rounded-md" />
                        </div>
                    </div>

                )}
                {user!==null && (
                <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center space-x-6">
                            <img
                                id="profilePreview"
                                src={croppedImage || `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/images/${profilePicture}`}
                                className="rounded-full w-24 h-24 object-cover shadow-md"
                            />
                            <div>
                                <label htmlFor="profilePicture" className="block text-gray-700 font-semibold mb-1 cursor-pointer hover:text-indigo-600">
                                    Change Photo
                                </label>
                                <input
                                    type="file"
                                    id="profilePicture"
                                    name="profilePicture"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <p className="mt-1 text-gray-600 italic text-sm">{fileName}</p>
                            </div>
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
                                            cropShape="round"    // This makes the cropping guide circular
                                            showGrid={false}     // Circular crops usually look better without the grid
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

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full name <span className="text-red-500">*</span></label>
                            <input
                            id="name"
                            name="name"
                            type="text"
                            // required
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                            <input
                            id="email"
                            name="email"
                            type="email"
                            // required
                            placeholder="you@example.com"
                            value={email}
                            disabled
                            className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-500 cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-400">Email cannot be changed.</p>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                // required
                                placeholder="01XXX XXX XXX"
                                value={phone}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^[0-9+]*$/.test(val)) {
                                        setPhone(val);
                                    };
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                                id="bio"
                                name="bio"
                                placeholder="Tell us about yourself (Optional)"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            ></textarea>
                        </div>





                        <div className="flex justify-between items-center">
                            <Link href={`profile?warnmessage=${"Nothing Changed"}`}>
                            <button className="px-4 py-3 text-indigo-600 hover:bg-gray-100 font-semibold rounded-md shadow-md transition cursor-pointer">
                                    Cancel
                            </button>
                            </Link>

                            <button type="submit"
                                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold border rounded-md shadow-md transition cursor-pointer">
                                Save Changes
                            </button>
                        </div>


                    </form>
                    
                </div>
                )}
            </main>
        </div>
    )
}

export default GeneralUserEditProfilePage;