import React from 'react'
import { loginUser, setToken } from '../lib/auth'
import { useHistory } from 'react-router-dom'
import useForm from '../hooks/useForm'

import emailIcon from '../assets/email_icon.svg'
import passIcon from '../assets/pass_icon.svg'
import RandomBlocks from '../components/RandomBlocks'



function Login (){
  const history = useHistory()
  const [hover, setHover] = React.useState(null)
  const [animate, setAnimate] = React.useState(false)
  const [error, setError] = React.useState(false)
  const { formdata, handleChange } = useForm({
    email: '',
    password: ''
  })

  const handleHover = e => setHover(e.target.name)
  const removeHover = () => setHover(null)


  const handleSubmit = async e => { 
    e.preventDefault()
    try {
      const { data } = await loginUser(formdata)

      e.target.classList.remove('sign_in')
      e.target.classList.add('accepted')
      setAnimate(true)
      setTimeout(()=>{
        setToken(data.token)
        history.push('/pics/all/1')
        // history.push(`/artistpage/${getUserId()}`)
      },1000)
    } catch (err) {
      setError(true)

      e.target.classList.remove('sign_in')
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
        className="sign_in"
      >
        <div className="input_box"
          onMouseEnter={handleHover} 
          onMouseLeave={removeHover}
        >
          <img src={emailIcon} 
            className={`${hover === 'email' ? 'hover' : ''}`}
            alt="email" />
          <input 
            placeholder="email"
            onChange={handleChange}
            name="email"
            type="text"
            value={formdata.email}
            className="pinkfocus"
          />
        </div>
        
        <div className="input_box thirty_px_bottom_margin"
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
        {error && 
          <div className="error">
            <p>hmm, username and/or password is incorrect...</p>
          </div>
        }

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