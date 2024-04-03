import { Button } from '@mui/material'
import React, { useState } from 'react'
import Mod from './Mod'
import '../App.css'


function Docs( {firestore}) {
    const [open,setOpen] = React.useState(false)
    const handleOpen = ()=>setOpen(true)
    const [title,setTitle] = useState('')
  return (
    <>
      <div  style={{width:'100%'}} className='d-flex justify-content-center align-items-center flex-column' >
         <div className='bg-light p-4  rounded text-center '>
         <h2 className='mb-3 hd'>Document Hub</h2>
         <button className='btn' onClick={handleOpen}> <i class="fa-solid fa-plus"></i> Add One</button>
         <Mod open={open} setOpen={setOpen} title={title} setTitle={setTitle} />
        </div>
      </div>
    </>
  )
}

export default Docs