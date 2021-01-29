import React from 'react'
import { loginUser, setToken } from '../lib/auth'
import { useHistory } from 'react-router-dom'

import profileIcon from '../assets/profile_icon.svg'

function Login (){
  const history = useHistory()
  const [hover, setHover] = React.useState(null)
  const [formdata, setFormdata] = React.useState({
    email: '',
    password: ''
  })

  const handleHover = e => setHover(e.target.name)
  const removeHover = () => setHover(null)

  const handleChange = e => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => { 
    e.preventDefault()
    try {
      const { data } = await loginUser(formdata)
      // if (data.message === 'Unauthorized') {
      //   e.target.classList.remove('float_up')
      //   e.target.classList.add('shake')
      //   setTimeout(()=>{
      //     e.target.classList.remove('shake') 
      //   },500)
      //   console.log(data.message)
      //   return 
      // }

      e.target.classList.remove('sign_in')
      e.target.classList.add('accepted')
      setTimeout(()=>{
        setToken(data.token)
        history.push('/')
      },1000)
    } catch (err) {
      console.log(err)
      e.target.classList.remove('sign_in')
      e.target.classList.add('shake')
      setTimeout(()=>{
        e.target.classList.remove('shake') 
      },500)
    }
  }  


  return (
    <div className="wrapper">
      <form
        onSubmit={handleSubmit}
        className="sign_in"
        // className="accepted"
      >
        <div className="input_box"
          onMouseEnter={handleHover} 
          onMouseLeave={removeHover}
        >
          <img src={profileIcon} 
            className={`${hover === 'email' ? 'hover' : ''}`}
            alt="smiley face" />
          <input 
            placeholder="email"
            onChange={handleChange}
            name="email"
            value={formdata.email}
          />
        </div>
        
        <div className="input_box"
          onMouseEnter={handleHover} 
          onMouseLeave={removeHover}
        >
          <img src={profileIcon} 
            className={`${hover === 'password' ? 'hover' : ''}`}
            alt="smiley face" />
          <input 
            placeholder="password"
            onChange={handleChange}
            name="password"
            value={formdata.password}
          />
        </div>

        <div className="button_wrapper">
          <button 
            className="sign_in"
          >
            sign in
          </button>  
        </div>
      </form>
    </div> 

  )
}

export default Login