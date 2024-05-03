import React from 'react'
import UserBadge from './UserBadge'

const UserProfileCard = () => {
  return (
    <div className='upc'>
        <div className='gradient'></div>
        <div className='profile-down'>
            <UserBadge />
            <div className='profile-title'></div>
            <div className='profile-description'></div>
            {/* Eventually, make this Dynamic/editable */}
            I am a user of Fruit Finder! This is where my Bio will go!
        </div>
        <button className='btn btn-info'>Connect with me</button>
    </div>
  )
}

export default UserProfileCard
