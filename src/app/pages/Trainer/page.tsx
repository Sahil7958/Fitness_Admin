"use client"
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./addTrainer.css"
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai';

interface trainer {
    name: string;
    email: string;
    contactNo: number;
    imageURL: string;
    imageFile: File | null;
}
const Page = () => {
    const searchParams = useSearchParams()

    const [trainer, setTrainer] = React.useState<trainer>({
        name: '',
        email: '',
        contactNo: 0,
        imageURL: '',
        imageFile: null
    })
    const handleTrainerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTrainer({
            ...trainer,
            [e.target.name]: e.target.value
        })
    }
    const uploadImage = async (image: any) => {
        const formData = new FormData();
        formData.append('myimage', image);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/image-upload/uploadimage`, {
            method: `POST`,
            body: formData,
        });
        if (response.ok) {
            const data = await response.json();
            console.log("image uploaded successfully:", data);
            return data.imageURL;
        }
        else {
            console.error("Failed to upload the image.")
            return null;
        }
    }
    const checkLogin = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/checklogin', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        if (response.ok) {
            console.log("Admin is authenticated")
        }
        else {
            console.log("Admin is not authenticated");
            window.location.href = '/adminauth/login'
        }
    }
    const saveTrainer = async () => {
        await checkLogin();
        // console.log(trainer)
        if (trainer.name == '' || trainer.email == '' || trainer.contactNo == 0 || trainer.imageFile == null) {
            toast.error("please fill all the fields", {
                position: "top-center"
            });
            return;
        }

        const imageURL = await uploadImage(trainer.imageFile)
        // console.log(imageURL)
        if (imageURL) {
            trainer.imageURL = imageURL
        }

        console.log(trainer)
        // addtrainer/${userid}
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/trainerData/addtrainer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trainer),
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            console.log("Trainer added successfully", data)
            toast.success("Trainer added successfully", {
                position: 'top-center'
            })
        }
        else {
            console.error("Trainer creation failed", response.statusText)
            toast.error("Trainer creation failed", {
                position: 'top-center'
            })
        }
    }

    return (
        <div className="trainer-popup">
            <div className="trainer-wrapper">
                <div className="closebtn">
                    <Link className="close" href={'/'}><AiOutlineClose /></Link>
                </div>
                <div className="trainer-form-box">
                    <div className='Add-Trainer'>
                        <h2 className='title'>ADD TRAINER</h2>
                        <div className="input-box">
                            <label>Name</label>
                            <input type="text" name='name' value={trainer.name} onChange={handleTrainerChange} />
                        </div>
                        <div className="input-box">
                            <label>Email</label>
                            <input type='text' name='email' value={trainer.email} onChange={(e) => setTrainer({
                                ...trainer,
                                email: e.target.value
                            })} />
                        </div>
                        <div className="input-box">
                            <label>Contact No.</label>
                            <input type="number" name='contactNo' value={trainer.contactNo} onChange={handleTrainerChange} />
                        </div>
                        <div className="file-input">
                            <label>Profile Image</label>
                            <input type="file" name='image' onChange={(e) => setTrainer({
                                ...trainer,
                                imageFile: e.target.files![0]
                            })} />
                        </div>
                        <button className='btn' onClick={(e) => {
                            saveTrainer()
                        }
                        }>Save Trainer</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page