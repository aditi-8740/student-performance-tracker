import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react'

const StudentsPage = () => {
    const [studentsList, setstudentsList] = useState([]);

  return (
    <>
    <div className='flex '>
      <div className="text-2xl ">Students</div>
      <div></div>
    </div>
      <Separator />
    </>
  )
}

export default StudentsPage

