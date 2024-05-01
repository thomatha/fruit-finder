import UserProfile from '@/components/Profile'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const Profile = () => {

  return (
    <UserProfile />
  )
}

export default Profile