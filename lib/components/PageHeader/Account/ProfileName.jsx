import { useState, useEffect } from 'react'
import { useUsersAddress } from '@pooltogether/hooks'
import { shorten } from '@pooltogether/utilities'

const { getProfile } = require('3box/lib/api')

export function ProfileName(props) {
  const [profile, setProfile] = useState()

  const usersAddress = useUsersAddress()

  useEffect(() => {
    const get3BoxProfile = async () => {
      const boxProfile = await getProfile(usersAddress)
      setProfile(boxProfile)
    }

    if (usersAddress) {
      get3BoxProfile()
    }
  }, [usersAddress])

  const name = profile && profile.name ? profile.name : shorten(usersAddress)

  return name
}
