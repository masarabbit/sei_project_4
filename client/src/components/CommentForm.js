import React from 'react'

import commentIcon from '../assets/comment_icon.svg'
import scoreIcon from '../assets/score_icon.svg'
import cross from '../assets/cross.svg'

import useForm from '../hooks/useForm'
import { createComment } from '../lib/api'


function CommentForm ( { displayComment, setDisplayComment, pic, userId }){

  const [hover, setHover] = React.useState(null)
  const { formdata, setFormdata, errors, handleChange, setErrors } = useForm({
    text: '',
    rating: 50,
    pic: ''
  })

  const handleSubmit = async e => {
    e.preventDefault()

    if (!formdata.owner) return  //! stop making it possible to comment without logging in

    try {
      await createComment(formdata)
      commentFormCloseEffect(e.target)
      // setTimeout(()=>{
      //   history.push(`/pics/${id}/c`) //? pathname used to trigger rerender.
      // },1000)
    } catch (err) {
      setErrors(err.response.data)

      e.target.classList.remove('comment')
      e.target.classList.add('shake')
      setTimeout(()=>{
        e.target.classList.add('static')
        e.target.classList.remove('shake') 
      },500)
    }
  }

  const addUserAndArtistIdToFormData = () =>{
    setFormdata({ ...formdata, pic: pic.id, owner: userId })
  }

  const handleHover = e => setHover(e.target.name)
  const removeHover = () => setHover(null)


  React.useEffect(() => {
    if (!pic) return
    addUserAndArtistIdToFormData()
  }, [pic])

  const closeCommentForm = e =>{
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
          <img src={commentIcon} 
            className={`${hover === 'text' ? 'hover' : ''}`}
            alt="comment" />
          <textarea 
            name="text"
            onChange={handleChange}
            value={formdata.text}
            placeholder='comment'
          />
        </div>  
        { errors.text && 
          <div className="error comment"><p>{errors.text}</p></div>
        }

        
        <div className="input_box twenty_px_bottom_margin" 
          onMouseEnter={handleHover} onMouseLeave={removeHover}>
          <img src={scoreIcon} 
            className={`range ${hover === 'rating' ? 'hover' : ''}`}
            alt="score" />
          
          <div className="rating_wrapper">
            <label>
              score
            </label> 
            
            <div className="rating_inner_wrapper">
              <input
                type="range"
                name="rating"
                onChange={handleChange}
                value={formdata.rating}
                // className="pinkfocus"
              /> 
              <div className="range_display">
                {formdata.rating}
              </div>  
            </div>
          </div>
        </div>  
        
        <div className="button_wrapper">
          <button className="submit">
          submit
          </button>  
        </div>
      </form>  
    </div>
  )

}

export default CommentForm