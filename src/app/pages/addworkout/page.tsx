"use client"
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./addworkout.css"
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai';

interface workout {
    name: string;
    description: string;
    durationInMinutes: number;
    exercises: Exercise[];
    imageURL: string;
    imageFile: File | null;
}
interface Exercise {
    name: string,
    description: string,
    sets: number,
    reps: number,
    imageURL: string,
    imageFile: File | null;

}

const Page = () => {
    const searchParams = useSearchParams()
    const userid = searchParams.get('id')
    // console.log(userid)

    const [workout, setWorkout] = React.useState<workout>({
        name: '',
        description: '',
        durationInMinutes: 0,
        exercises: [],
        imageURL: '',
        imageFile: null
    })

    const [exercise, setExercise] = React.useState<Exercise>({
        name: '',
        description: '',
        sets: 0,
        reps: 0,
        imageURL: '',
        imageFile: null
    })

    const handleWorkoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWorkout({
            ...workout,
            [e.target.name]: e.target.value
        })
    }
    const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExercise({
            ...exercise,
            [e.target.name]: e.target.value
        })
    }
    const addExerciseToWorkout = () => {
        console.log(exercise)
        if (exercise.name == '' || exercise.description == '' || exercise.sets == 0 || exercise.reps == 0 || exercise.imageFile == null) {
            toast.error("Please fill all the fields", {
                position: "top-center",
            });
            return;
        }
        setWorkout({
            ...workout,
            exercises: [...workout.exercises, exercise]
        })
        // setExercise({
        //     name: '',
        //     description: '',
        //     sets: 0,
        //     reps: 0,
        //     imageURL: '',
        //     imageFile: null
        // })
    }
    const deleteExerciseFromWorkout = (index: number) => {
        setWorkout({
            ...workout,
            exercises: workout.exercises.filter((exercise, i) => i !== index)
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
    const saveWorkout = async () => {
        await checkLogin();
        // console.log(workout)
        if (workout.name == '' || workout.description == '' || workout.durationInMinutes == 0 || workout.imageFile == null || workout.exercises.length == 0) {
            toast.error("please fill all the fields", {
                position: "top-center"
            });
            return;
        }

        const imageURL = await uploadImage(workout.imageFile)
        // console.log(imageURL)
        if (imageURL) {
            workout.imageURL = imageURL
        }

        for (let i = 0; i < workout.exercises.length; i++) {
            let tempimg = workout.exercises[i].imageFile
            if (tempimg) {
                let imgURL = await uploadImage(tempimg)
                // console.log(imgURL)
                workout.exercises[i].imageURL = imgURL
            }
        }

        console.log(workout)

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/workoutplans/workouts/${userid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workout),
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            console.log("Workout created successfully", data)
            toast.success("Workout created successfully", {
                position: 'top-center'
            })
        }
        else {
            console.error("Workout creation failed", response.statusText)
            toast.error("Workout creation failed", {
                position: 'top-center'
            })
        }
    }

    return (
        <div className="workout-popup">
            <div className="workout-wrapper">
                <div className="closebtn">
                    <Link className="close" href={'/pages/userData'}><AiOutlineClose /></Link>
                </div>
                <div className="workout-form-box">
                    <div className='Add-Workout'>
                        <h2 className='title'>ADD WORKOUT</h2>
                        <div className="input-box">
                        <label>Name</label>
                            <input type="text" name='name' value={workout.name} onChange={handleWorkoutChange} />
                        </div>
                        <div className="input-box">
                        <label>Description</label>
                            <input type='text' name='description' value={workout.description} onChange={(e) => setWorkout({
                                ...workout,
                                description: e.target.value
                            })} />
                        </div>
                        <div className="input-box">
                        <label>Workout Duration(in mins)</label>
                            <input type="number" name='durationInMinutes' value={workout.durationInMinutes} onChange={handleWorkoutChange} />
                        </div>
                        <div className="file-input">
                            <label>Workout Image</label>
                            <input type="file" name='workoutimage' onChange={(e) => setWorkout({
                                ...workout,
                                imageFile: e.target.files![0]
                            })} />
                        </div>
                        <button className='btn' onClick={(e) => {
                            saveWorkout()
                        }
                        }>Save Workout</button>
                    </div>
                    <div className='Add-Exercises'>
                        <h2 className='title'>ADD EXERCISES</h2>
                        <div className="input-box">
                        <label>Exercise Name</label>
                            <input type="text" name="name" value={exercise.name} onChange={handleExerciseChange} />
                        </div>
                        <div className="input-box">
                        <label>Description</label>
                            <input type='text' name="description" value={exercise.description} onChange={(e) => setExercise({
                                ...exercise,
                                description: e.target.value
                            })} />
                        </div>
                        <div className="input-box">
                        <label>Sets</label>
                            <input type="number" name="sets" value={exercise.sets} onChange={handleExerciseChange} />
                        </div>
                        <div className="input-box">
                        <label>Reps</label>
                            <input type="number" name="reps" value={exercise.reps} onChange={handleExerciseChange} />
                        </div>
                        <div className="file-input">
                            <label>Exercise Image</label>
                            <input type="file" name="exerciseImage" onChange={(e) => setExercise({
                                ...exercise,
                                imageFile: e.target.files![0]
                            })} />
                        </div>
                        <button className='btn' onClick={(e) => {
                            addExerciseToWorkout()
                        }}>Add Exercise</button>
                    </div>
                </div>
                <h2 className='title'>Exercises</h2>
                <div className="exercises">
                    {
                        workout.exercises.map((exercise, index) => {
                            return (
                                <div className="exercise" key={index}>
                                    <h2 className="ex-title">Name: {exercise.name}</h2>
                                    <p>Description: {exercise.description} </p>
                                    <p>Sets: {exercise.sets}</p>
                                    <p>Reps: {exercise.reps}</p>
                                    <Image src={
                                        exercise.imageFile ? URL.createObjectURL(exercise.imageFile) :
                                            exercise.imageURL
                                    } alt='' width={100} height={100} />
                                    <button className='btn' onClick={() => deleteExerciseFromWorkout(index)} >Delete</button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Page