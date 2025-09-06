import React, { useState } from "react";
import { ExclamationTriangleIcon, PhotoIcon, PaperAirplaneIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

const hazardTypes = [
    "Cyclone/Storm",
    "Tsunami/Flood",
    "Oil Spill/Pollution",
    "Rip Current",
    "Debris/Navigation Hazard",
    "Missing Person",
    "Other",
];

export default function HazardReportSidebar({ open, onClose }) {
    const [hazard, setHazard] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [photo, setPhoto] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const handlePhotoChange = (e) => {
        if (e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ hazard, description, location, photo });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-40 transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
                }`}
        >
            {/* Header */}
            <div className="p-4 border-b bg-blue-50 flex items-center space-x-2">
                <div className="bg-blue-600 text-white p-2 rounded-full">
                    <ExclamationTriangleIcon className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="font-bold text-lg">Report Ocean Hazard</h2>
                    <p className="text-sm text-gray-600">
                        Help save lives by reporting dangers along India’s coastline.
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <select
                    className="w-full border rounded-lg p-2"
                    value={hazard}
                    onChange={(e) => setHazard(e.target.value)}
                    required
                >
                    <option value="">Select Hazard Type</option>
                    {hazardTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Location (auto-detected or enter manually)"
                    className="w-full border rounded-lg p-2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Description (optional)"
                    className="w-full border rounded-lg p-2"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div>
                    <label className="flex items-center space-x-2 cursor-pointer border rounded-lg p-2">
                        <PhotoIcon className="h-5 w-5 text-blue-600" />
                        <span>Upload Photo/Video</span>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handlePhotoChange}
                            hidden
                        />
                    </label>
                    {photo && (
                        <div className="mt-2 flex items-center justify-between bg-gray-100 rounded-lg p-2 text-sm">
                            <span>{photo.name}</span>
                            <button
                                type="button"
                                className="text-red-500"
                                onClick={() => setPhoto(null)}
                            >
                                ✖
                            </button>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    disabled={submitted}
                >
                    <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                    {submitted ? "Thank You! Report Submitted." : "Submit Report"}
                </button>
            </form>

            {/* Footer */}
            <div className="border-t p-4">
                <button
                    onClick={onClose}
                    className="flex items-center text-gray-600 hover:text-gray-800"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Close
                </button>
            </div>
        </div>
    );
}
