import React from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'

import { getUserInfo } from '../lib/api'
import { logout, isAuthenticated } from '../lib/auth'

function Nav(){
  const loggedIn = isAuthenticated()
  const { pathname } = useLocation()
  const history = useHistory()
  const [userData, setUserData] = React.useState(null)

  React.useEffect(() => {
    if (!loggedIn) return
    const getData = async () => {
      try {
        const { data } = await getUserInfo()
        setUserData(data)
      } catch (err) {
        console.log(err)
      }
    }
    getData()
  }, [pathname])

  const handleLogout = () => {
    logout()
    history.push('/login')
    setUserData(null)
    // setuserMenuDisplay(false)
    // window.location.reload()
  }

  // if (userData) console.log(userData)

  return (
    <nav>
      <Link to="/">
        <p>16</p>
      </Link>
      <div className="link_menu">
        {
          userData ?
            <>
              <img 
                className="small_artist_icon"
                src={userData.profileImage} 
                alt="profile image" 
                onClick={()=>history.push(`/artistpage/${userData.id}`)}
              />
              <button className="nav logout" onClick={handleLogout}>
                logout
              </button>
            </>
            :
            <>
              <Link to="/signup">
                <button className="nav sign_up">
                  sign up
                </button>
              </Link>
              <Link to="/login">
                <button className="nav login">
                  login
                </button>
              </Link>
            </>
        }
    
        <Link to="/pics/new">
          <button className="nav draw">
            draw
          </button>  
        </Link>
      </div>
    </nav>
  )
}

export default Nav