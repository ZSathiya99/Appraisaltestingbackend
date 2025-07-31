import { ChevronDown, Search, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { UploadCloud } from "lucide-react";

const subjects = [
    "Mongo Db", "React js", "Javascript", "Node js", "Express js"
]

const TeachingForm = () => {
    const [isTeachingAssgingment, setIsTeachingAssignment] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSubjectData, setFileredSubjectData] = useState(subjects);
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [files, setFiles] = useState([]);
    // useEffect for searching subjects 
    useEffect(() => {
        if (searchQuery == "") {
            setFileredSubjectData(subjects);
            return;
        }
        const filteredData = subjects.filter((subject) => subject.toLowerCase().includes(searchQuery.toLowerCase()));
        setFileredSubjectData(filteredData);
    }, [searchQuery]);

    // function for selecting multiple subjects 
    const handleCheckboxChange = (subject) => {
        if (selectedSubjects.includes(subject)) {
            setSelectedSubjects(prev => prev.filter(item => item !== subject));
        } else {
            setSelectedSubjects(prev => [...prev, subject])
        }

    }
    // function for uploading Files / Attachments 
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles((prev) => [...prev, ...droppedFiles]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileCance = (f) => {
        setFiles(prev => prev.filter(item => item.name !== f.name))
    }

    return (
        <>
            {/* bg-[#D6D6D6] */}
            <div className="main-container">
                <div className="input-container-1 border-1 p-3 border-gray-400 bg-[#d6d6d677]  rounded-xl grid gap-4 grid-cols-12">
                    <div className="first-container pr-3 border-r border-gray-400 col-span-10">
                        <div>
                            <h1 className='text-lg'>Teaching Assignment <span className='text-sm text-gray-400'>( No of credits per subject taught )</span>
                            </h1>
                            <h1 className='text-lg text-gray-400'>( 3 Credits -Points || Max 3 Points )</h1>
                        </div>
                        <div className={`relative search-container border-1 border-gray-500 px-2 py-2 rounded-lg mt-2 ${isTeachingAssgingment ? "bg-white" : ""}`}>
                            <div className={`search-field flex items-center gap-2 justify-between `}>
                                {selectedSubjects.length === 0 ? (
                                    <h1 className='text-gray-500'>Select Subject</h1>
                                ) : (
                                    <div className='flex flex-wrap gap-2'>
                                        {selectedSubjects.map((subject, index) => (
                                            <div
                                                key={index}
                                                className='flex items-center bg-gray-50 px-2 text-gray-700 py-1 rounded-full text-sm'
                                            >
                                                {subject}
                                                <span
                                                    onClick={() => handleCheckboxChange(subject)}
                                                    className='cursor-pointer ml-2 text-gray-500  hover:text-red-500'
                                                >
                                                    <X className='w-4 h-4' />
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <ChevronDown onClick={() => setIsTeachingAssignment(!isTeachingAssgingment)} className={` font-semibold w-8  rounded-full h-8 cursor-pointer ${isTeachingAssgingment ? "rotate-180" : "rotate-0"}`} />
                            </div>
                            {isTeachingAssgingment && <div className="dropdown-container absolute left-0 top-[104%] bg-white w-full border-1 border-gray-500 rounded-lg py-2 px-2">
                                <div className="input-container flex items-center gap-2 border-1 border-gray-400 rounded-lg px-2 py-2">
                                    <Search className='text-gray-500 w-6 h-6' />
                                    <input onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder='Search subject here..' className='text-sm outline-none w-full' />
                                </div>
                                <div className="checkbox-container mt-2">
                                    {filteredSubjectData.map((item, index) => {
                                        return <div className='flex items-center gap-2'>
                                            <input type="checkbox" checked={selectedSubjects.includes(item)} onChange={() => handleCheckboxChange(item)} />
                                            <label className='text-gray-500'>{item}</label>
                                        </div>
                                    })}
                                </div>
                            </div>}

                        </div>
                        <div className="file-attachment-container">
                            <div className="w-full mt-2">
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    className="border-1 border-dashed border-gray-600 rounded-lg px-6 py-2 flex items-center justify-center text-gray-600 cursor-pointer hover:bg-gray-50 transition"
                                >
                                    <label htmlFor="file-upload" className="flex items-center gap-2 cursor-pointer">
                                        <UploadCloud className="w-5 h-5" />
                                        <span>Drag and drop the files here or</span>
                                        <span className="underline text-blue-600">choose file</span>
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>

                                {/* Display selected files */}
                                {files.length > 0 && (
                                    <div className="mt-2 flex gap-2">
                                        {files.map((file, index) => (
                                            <div className='flex items-center gap-2'>
                                                <p key={index} className="text-sm text-gray-500">{file.name}</p>
                                                <X onClick={() => handleFileCance(file)} className='w-4 h-4 hover:text-red-400 cursor-pointer' />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="second-container col-span-2 text-center">
                        <h1 className='text-lg'>Marks</h1>
                        <div className='h-[80%] flex items-center justify-center'>
                            <h1 className='text-gray-400 text-lg'><span className='font-semibold text-black'>1</span> out of 2</h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TeachingForm
