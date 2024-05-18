"use client"
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./userData.css"
import Link from "next/link";
import Image from "next/image";
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/react";
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai';

const Page = () => {
    //Fetch User Data
    const [data, setData] = React.useState<any[] | null>(null)
    const getData = async () => {
        fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/userData/users', {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                if (data.ok) {
                    setData(data.data)
                }
                else {
                    setData([])
                }
            })
            .catch(err => {
                console.log(err)
                setData([])
            })
    }
    React.useEffect(() => {
        getData()
    }, [])

    const deleteWorkout = async (userId: any, workoutId: any) => {
        console.log(userId)
        console.log(workoutId)
        fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/workoutplans/workouts', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                userId: userId,
                workoutId: workoutId
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    toast.success("Workout deleted sucessfully")
                    console.log("Workout deleted sucessfully")
                    getData()
                }
                else {
                    toast.error('Error in deleting Workout')
                }
            })
            .catch(err => {
                toast.error('Error in deleting Workout')
                console.log(err)
            })
    }
    // Fetch Trainer
    const [trainerData, setTrainerData] = React.useState<any[] | null>(null)
    // const [trainerId, setTrainerId] = React.useState<number>(0)
    const getTrainerData = async () => {
        fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/trainerData/trainers', {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.ok) {
                    setTrainerData(data.data)
                }
                else {
                    setTrainerData([])
                }
            })
            .catch(err => {
                console.log(err)
                setTrainerData([])
            })
    }
    React.useEffect(() => {
        getTrainerData()
    }, [])
    // Allocate Trainer to particular user
    const allocateTrainer = async (trainerId: string, userId: number) => {
        // console.log("userId=", userId)
        // console.log("trainerId=", trainerId)
        if (trainerId == null) {
            toast.error("please provide trainer Id", {
                position: "top-center"
            });
            return;
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/trainerData/allocatetrainer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                trainerId: trainerId,
                userId: userId
            }),
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            console.log("Trainer Allocated successfully", data)
            toast.success(data.message, {
                position: 'top-center'
            })
        }
        else {
            console.error("Trainer Allocated failed", response.statusText)
            toast.error("Trainer Allocated failed", {
                position: 'top-center'
            })

        }
    }
    return (
        <div className="user-table">
            <Table isStriped aria-label="Example static collection table">
                <TableHeader className='table-header'>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>EMAIL</TableColumn>
                    <TableColumn>WEIGHT(in Kgs)</TableColumn>
                    <TableColumn>HEIGHT(in Cms)</TableColumn>
                    <TableColumn>GENDER</TableColumn>
                    <TableColumn>DATE OF BIRTH</TableColumn>
                    <TableColumn>GOAL</TableColumn>
                    <TableColumn>TRAINER</TableColumn>
                    <TableColumn>WORKOUTS</TableColumn>
                    <TableColumn>ADD WORKOUT</TableColumn>
                </TableHeader>
                <TableBody className='table-body'>
                    {
                        data &&
                        data.map((item, index) => {
                            return (
                                <TableRow className='row' key={index}>
                                    <TableCell className='cell'>{item.name}</TableCell>
                                    <TableCell className='cell'>{item.email}</TableCell>
                                    <TableCell className='cell'>{item.weight}</TableCell>
                                    <TableCell className='cell'>{item.height}</TableCell>
                                    <TableCell className='cell'>{item.gender}</TableCell>
                                    <TableCell className='cell'>{item.dob}</TableCell>
                                    <TableCell className='cell'>{item.goal}</TableCell>
                                    <TableCell className='cell'>
                                        <select
                                            className='select_dropdown'
                                            // onChange={(
                                            //     _event: React.SyntheticEvent | null,
                                            //     newValue: string | null,) => {
                                            //     allocateTrainer(newValue, item._id)
                                            // }}
                                            onChange={e => (
                                                allocateTrainer(e.target.value, item._id)
                                            )}
                                        >
                                                    <option className='dropdown_option' selected>{item.trainerName}</option>
                                            {
                                                trainerData && trainerData.map((item2, index2) => {
                                                    return (
                                                        item.trainerName !== item2.name &&
                                                        <option key={index2} className='dropdown_option' value={item2._id}>{item2.name}</option>
                                                    )
                                                })
                                            }

                                        </select>
                                    </TableCell>
                                    <TableCell className='cell'>
                                        {
                                            item.workouts.map((item1: any, index1: any) => {
                                                return (
                                                    <div className='workoutsData' key={index1}>
                                                        <p>{item1.name}</p>
                                                        <button className='table-btns' onClick={() => deleteWorkout(item._id, item1._id)}><AiFillDelete /></button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </TableCell>
                                    <TableCell className='cell'>
                                        <Link className='link-btn' href={`/pages/addworkout?id=${item._id}`}>Add</Link>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </div >
    )
}

export default Page