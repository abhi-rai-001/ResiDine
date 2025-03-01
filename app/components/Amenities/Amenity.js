import React from 'react'

const Amenity = ({children}) => {
  return (
    <div className='flex items-center gap-2'>
      {children}
    </div>
  )
}

export default Amenity;
