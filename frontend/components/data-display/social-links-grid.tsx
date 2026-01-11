import React from "react";
import { 
    FaSquareFacebook,
    FaSquareInstagram,
    FaSquareTwitter,
} from "react-icons/fa6";

interface SocialLinks {
    facebook?: string;
    instagram?: string;
    twitter?: string;
}

const SocialLinksGrid: React.FC<SocialLinks> = (props) => {
    return (
        <div>
            <h3 className="text-2xl font-semibold mb-6 border-b-2 border-indigo-300 pb-2 text-indigo-900">
                Social Links
            </h3>
            <ul className="space-y-3">
                {props.facebook && (
                    <li><a href={`https://facebook.com/${props.facebook}`} className="flex items-center gap-2 hover:text-indigo-900 hover:underline cursor-pointer"><FaSquareFacebook /> Facebook</a></li>
                )}
                {props.instagram && (
                    <li><a href={`https://instagram.com/${props.instagram}`} className="flex items-center gap-2 hover:text-indigo-900 hover:underline cursor-pointer"><FaSquareInstagram /> Instagram</a></li>
                )}
                {props.twitter && (
                    <li><a href={`https://twitter.com/${props.twitter}`} className="flex items-center gap-2 hover:text-indigo-900 hover:underline cursor-pointer"><FaSquareTwitter /> Twitter</a></li>
                )}
            </ul>
        </div>
    );
};

export default SocialLinksGrid;