import React from 'react'
import { signUpUser } from '../lib/auth'
import { useHistory } from 'react-router-dom'

import ImageUploadField from './ImageUploadField'
import profileIcon from '../assets/profile_icon.svg'

function SignUp(){
  const history = useHistory()
  const [hover, setHover] = React.useState(null)
  const [formdata, setFormdata] = React.useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    profileImage: ''
  })

  const handleHover = e => setHover(e.target.name)
  const removeHover = () => setHover(null)

  const handleChange = e => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => { 
    e.preventDefault()
    try {
      await signUpUser(formdata)
      // console.log(data)
      e.target.classList.remove('sign_up')
      e.target.classList.add('accepted')
      setTimeout(()=>{
        // setToken(data.token)
        history.push('/')
      },1000)
    } catch (err) {
      console.log(err)
      e.target.classList.remove('sign_up')
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
        className="sign_up"
      > 
        <div className="input_box">
          <ImageUploadField 
            value={formdata.profileImage}
            name="profileImage"
            onChange={handleChange}
          />
        </div>

        <div className="input_box"
          onMouseEnter={handleHover} 
          onMouseLeave={removeHover}
        >
          <img src={profileIcon} 
            className={`${hover === 'username' ? 'hover' : ''}`}
            alt="smiley face" />
          <input 
            placeholder="username"
            onChange={handleChange}
            name="username"
            value={formdata.username}
          />
        </div>

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

        <div className="input_box"
          onMouseEnter={handleHover} 
          onMouseLeave={removeHover}
        >
          <img src={profileIcon} 
            className={`${hover === 'passwordConfirmation' ? 'hover' : ''}`}
            alt="smiley face" />
          <input 
            placeholder="confirm your password"
            onChange={handleChange}
            name="passwordConfirmation"
            value={formdata.passwordConfirmation}
          />
        </div>

        <div className="button_wrapper">
          <button 
            className="sign_up"
          >
            sign up
          </button>  
        </div>
      </form>
    </div> 

  )
}

export default SignUp