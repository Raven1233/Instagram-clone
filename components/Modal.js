import { useRecoilState } from "recoil"
import { modalState } from "../atoms/modalAtom"
import {Dialog, Transition} from "@headlessui/react"
import { Fragment, useRef, useState } from "react";
import {db, storage} from "../firebase";
import { CameraIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react"
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "@firebase/firestore";

function Modal() {

    const [open, setOpen] = useRecoilState(modalState);
    const filePickerRef = useRef(null);
    const captionRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const {data: session} = useSession();
    const addImageToPost = (e) =>{
        const reader = new FileReader();
        if (e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
        }

        reader.onload = (readerEvent) =>{
            setSelectedFile(readerEvent.target.result);
        }
    }

    const uploadPost = async() =>{
        if(loading) return;

        setLoading(true);

        //create a post and add to the posts collection in firebase 
        // make post id for newly created post
        // upload the image to the firebase storage with id
        // get a download link from firebase storage and update the original post image.

        const docRef = await addDoc(collection(db,'posts'),{
            username: session.user.username,
            caption: captionRef.current.value,
            profileImg: session.user.image,
            timestamp: serverTimestamp(),
        })

        console.log("New doc added with id ",docRef.id);

        const imageRef = ref(storage,`posts/${docRef.id}/image`);

        await uploadString(imageRef, selectedFile, "data_url").then(async snapshot =>{
            const downloadUrl = await getDownloadURL(imageRef);
            await updateDoc(doc(db, 'posts', docRef.id),{
                image: downloadUrl,
            })
        })

        setOpen(false);
        setLoading(false);
        setSelectedFile(null);

    }

    return (
        <Transition.Root show={open} as={Fragment}>
           <Dialog 
                as='div' 
                className="fixed z-10 inset-0 overflow-y-auto"
                onClose={setOpen}
           >   
            <div className="flex items-end justify-center min-h-[800px]
            sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
               <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-4"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75"/>
                </Transition.Child>
                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen "
                    aria-hidden="true"
                >
                    &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"s
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-05"
                  enterTo="opacity-0 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 trnslate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 text-left
                    overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle
                    sm:max-w-sm sm:w-full sm:p-6 ">
                       <div>

                           {selectedFile ? (
                               <img 
                                    src={selectedFile} 
                                    className="w-full object-contain cursor-pointer"
                                    onClick={()=> setSelectedFile(null)} 
                                    alt=""
                                />
                           ):(


                            <div
                                onClick={()=>filePickerRef.current.click()}
                                className="mx-auto flex items-center justify-center h-12 w-12 rounded-full
                                bg-red-100 cursor-pointer"
                            >
                                <CameraIcon
                                  className="h-6 w-6 text-red-600"
                                  aria-hidden="true"
                                />

                            </div>
                           )}


                           <div>
                               <div className="mt-3 text-center sm:mt-5">
                                   <Dialog.Title
                                     as="h3"
                                     className="text-lg loading-6 font-medium text-gray-900" 
                                   >
                                       Upload a photo
                                    </Dialog.Title>
                                
                                    <div>
                                        <input 
                                            ref={filePickerRef}
                                            type="file" 
                                            hidden
                                            onChange={addImageToPost}
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <input 
                                        className="border-none focus:ring-0 w-full text-center"
                                        type="text"
                                        ref={captionRef}
                                        placeholder="Please enter a caption..."
                                        />
                                    </div>
                                </div>
                           </div>
                           <div className="mt-5 sm:mt-6">
                               <button
                                type="button"
                                disabled={!selectedFile}
                                onClick={uploadPost}
                                className="inline-flex justify-center w-full rounded-md border border-transparent
                                shadow-sm px-4 py-2 bg-red-600 text-base text-white hover:bg-red-700
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 
                                sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
                                >
                                    {loading ? "Uploading...": "Upload post"}
                                </button>
                           </div>
                       </div>
                    </div>
                </Transition.Child>

            </div>
            </Dialog>
        </Transition.Root>
    )
}


export default Modal
