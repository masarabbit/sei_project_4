import React from 'react'

import profileIcon from '../assets/profile_icon.svg'
import cross from '../assets/cross.svg'

import { createComment } from '../lib/api'


function CommentForm ( { history, displayComment, setDisplayComment, pic, id, userId }){

  const [hover, setHover] = React.useState(null)
  const [formdata, setFormdata] = React.useState({
    text: '',
    rating: 50,
    pic: ''
  })

  const handleSubmit = async e => {
    e.preventDefault()

    if (!formdata.owner) return  //! stop making it possible to comment without logging in

    console.log('trigger submit')
    try {
      await createComment(formdata)
      commentFormCloseEffect(e.target)

      setTimeout(()=>{
        history.push(`/pics/${id}/c`) //? pathname used to trigger rerender.
      },1000)
    
    } catch (err) {
      console.log('error', err.response)
      
      //! hide comment button if already commented?
      // if (err.response.data.message === 'You have already commented') {
      //   setAlreadyCommented(true)
      // }

      // if (err.response.data.errors) {
      //   console.log('Rating way too high')
      //   setRatingTooHigh(true)
      // }
    }
  }

  const addUserAndArtistIdToFormData = () =>{
    setFormdata({ ...formdata, pic: pic.id, owner: userId })
  }

  const handleHover = e => setHover(e.target.name)
  const removeHover = () => setHover(null)


  const handleChange = e => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value })
  }


  


  React.useEffect(() => {
    if (!pic) return
    addUserAndArtistIdToFormData()
  }, [pic])

  const closeCommentForm = e =>{
    // console.log(e.target.parentNode.parentNode)
    // e.target.parentNode.parentNode.classList.remove('comment')
    // e.target.parentNode.parentNode.classList.add('accepted')
    // setTimeout(()=>{
    //   setDisplayComment(false)
    //   e.target.parentNode.parentNode.classList.remove('accepted')
    // },1000)
    commentFormCloseEffect(e.target.parentNode.parentNode)
  }

  const commentFormCloseEffect = target => {
    target.classList.add('accepted')
    setTimeout(()=>{
      setDisplayComment(false)
      target.classList.remove('accepted')
    },1000)
  }
  
  return (
    <div 
      className={`comment_menu_wrapper ${displayComment ? 'display' : ''}`}
    >
      <form className="comment" onSubmit={handleSubmit}>
        <div className="cross">
          <img src={cross} alt="cross" 
            onClick={closeCommentForm}
          />
        </div>  
        <div className="input_box" onMouseEnter={handleHover} onMouseLeave={removeHover}>
          <img src={profileIcon} 
            className={`${hover === 'text' ? 'hover' : ''}`}
            alt="smiley face" />
          <textarea 
            name="text"
            onChange={handleChange}
            value={formdata.text}
          />
        </div>  

        <div className="input_box" onMouseEnter={handleHover} onMouseLeave={removeHover}>
          <img src={profileIcon} 
            className={`range ${hover === 'rating' ? 'hover' : ''}`}
            alt="smiley face" />
          <input
            type="range"
            name="rating"
            onChange={handleChange}
            value={formdata.rating}
          />
          <div className="range_display">
            {formdata.rating}
          </div>  
        </div>  

        <button className="submit">
        submit
        </button>  
      </form>  
    </div>
  )

}

export default CommentForm