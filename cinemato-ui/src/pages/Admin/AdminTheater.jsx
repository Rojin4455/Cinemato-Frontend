import React from 'react'
import Header from '../../components/Admin/Header/Header'
import ListTheaterOwners from '../../components/Admin/ThraterOwners/ListTheaterOwners'

function AdminTheater() {
  return (
    <div>
      <Header page="admin/theaters/"/>
      <div className='pt-20'>
      <ListTheaterOwners/>  
        </div>
      
    </div>
  )
}

export default AdminTheater
