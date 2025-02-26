import React, { useState, useRef, useEffect } from 'react';
import { BsThreeDots } from 'react-icons/bs'; // Import icon จุดสามจุดจาก react-icons หรือ library อื่น

interface IconButtonProps {
    commentId: string;
    parentId: string | null;
    onEdit: (commentId: string) => void;
    onDelete: (commentId: string, parentId: string | null) => void;
}

const IconButton: React.FC<IconButtonProps> = ({ commentId, parentId, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: any) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                    id="options-menu-button"
                    aria-expanded={isOpen ? "true" : "false"}
                    aria-haspopup="true"
                    onClick={toggleDropdown}
                >
                    <BsThreeDots className="h-5 w-5" aria-hidden="true" /> {/* ใช้ icon จุดสามจุด */}
                </button>
            </div>

            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu-button"
                    tabIndex={0}
                >
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu-button">
                        <button
                            onClick={() => { onEdit(commentId); setIsOpen(false); }} // เรียก function onEdit จาก props
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                            role="menuitem"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => { onDelete(commentId, parentId); setIsOpen(false); }} // เรียก function onDelete จาก props
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left text-red-500"
                            role="menuitem"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IconButton;