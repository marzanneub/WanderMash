import React from "react";

interface PropItems {
    description: string;
}

const DescriptionGrid: React.FC<PropItems> = (props) => {
    return (
        <div>
            <h3 className="text-2xl font-semibold mb-6 border-b-2 border-indigo-300 pb-2 text-indigo-900">
                Description
            </h3>
            <p>{ props.description || "No description provided yet." }</p>
        </div>
    );
};

export default DescriptionGrid;