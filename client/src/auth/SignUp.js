import React from 'react'
import { signUpUser } from '../lib/auth'
import { useHistory } from 'react-router-dom'

import useForm from '../hooks/useForm'
import ImageUploadField from './ImageUploadField'
import profileIcon from '../assets/profile_icon.svg'
import emailIcon from '../assets/email_icon.svg'
import passIcon from '../assets/pass_icon.svg'
import RandomBlocks from '../components/RandomBlocks'

function SignUp(){
  const defaultProfImage = 'https://res.cloudinary.com/dcwxp0m8g/image/upload/v1612090815/image_upload_test/wuzrwkwj1e4qs24n2bg0.png'
  const history = useHistory()
  const [hover, setHover] = React.useState(null)
  const [animate, setAnimate] = React.useState(false)
  const { formdata, errors, handleChange, setErrors } = useForm({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    profileImage: defaultProfImage
  })
  

  const handleHover = e => setHover(e.target.name)
  const removeHover = () => setHover(null)


  const handleSubmit = async e => { 
    e.preventDefault()
    try {
      await signUpUser(formdata)
      e.target.classList.remove('sign_up')
      e.target.classList.add('accepted')
      setAnimate(true)
      setTimeout(()=>{
        history.push('/login')
      },1000)
    } catch (err) {
      setErrors(err.response.data)
    
      e.target.classList.remove('sign_up')
      e.target.classList.add('shake')
      setTimeout(()=>{
        e.target.classList.add('static')
        e.target.classList.remove('shake') 
      },500)
    }
  }  



  return (
    <div className={`wrapper ${animate ? 'animate' : '' }`}>
      <RandomBlocks />
      <form
        onSubmit={handleSubmit}
        className="sign_up"
      > 
        <div className="input_box column">
          <ImageUploadField 
            value={formdata.profileImage}
            defaultProfImage={defaultProfImage}
            name="profileImage"
            onChange={handleChange}
          />
          {errors.username && <p>{errors.profileImage}</p>}
        </div>


        <div className="input_box"
          onMouseEnter={handleHover} 
          onMouseLeave={removeHover}
        >
          <img src={profileIcon} 
            className={`${hover === 'username' ? 'hover' : ''}`}
            alt="username" />
          <input 
            placeholder="username"
            onChange={handleChange}
            name="username"
            type="text"
            value={formdata.username}
            className="pinkfocus"
          />
        </div>
        { errors.username && 
          <div className="error sign_up"><p>{errors.username}</p></div>
        }

        <div className="input_box"
          onMouseEnter={handleHover} 
          onMouseLeave={removeHover}
        >
          <img src={emailIcon} 
            className={`${hover === 'email' ? 'hover' : ''}`}
            alt="email" />
          <input 
            placeholder="email"
            type="text"
            onChange={handleChange}
            name="email"
            value={formdata.email}
            className="pinkfocus"
          />
        </div>
        { errors.email && 
          <div className="error sign_up"><p>{errors.email}</p></div>
        }
        
        <div className="input_box"
          onMouseEnter={handleHover} 
          onMouseLeave={removeHover}
        >
          <img src={passIcon} 
            className={`${hover === 'password' ? 'hover' : ''}`}
            alt="password" />
          <input 
            placeholder="password"
            type="password"
            onChange={handleChange}
            name="password"
            value={formdata.password}
            className="pinkfocus"
          />
        </div>
        { errors.password && 
          <div className="error sign_up"><p>{errors.password}</p></div>
        }
        

        <div className="input_box forty_px_bottom_margin"
          onMouseEnter={handleHover} 
          onMouseLeave={removeHover}
        >
          <img src={passIcon} 
            className={`${hover === 'passwordConfirmation' ? 'hover' : ''}`}
            alt="password confirmation" />
          <input 
            placeholder="confirm your password"
            type="password"
            onChange={handleChange}
            name="passwordConfirmation"
            value={formdata.passwordConfirmation}
            className="pinkfocus"
          />
        </div>
        { errors.passwordConfirmation && 
          <div className="error sign_up margin_adjusted_forty"><p>{errors.passwordConfirmation}</p></div>
        }
        

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