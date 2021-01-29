import React from 'react'
import axios from 'axios'


const uploadUrl = process.env.REACT_APP_CLOUDINARY_URL
const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

// console.log('upload',uploadUrl)
// console.log(uploadPreset)


function ImageUploadField( { value, name, onChange } ) {
  const [ hover, setHover] = React.useState(false)


  const handleUpload = async e => {
    const data = new FormData()  
    data.append('file', e.target.files[0])
    data.append('upload_preset', uploadPreset)
    const res = await axios.post(uploadUrl, data)
    onChange({ target: { name, value: res.data.url } }) //* handleChange triggered
  }
  
  const handleHover = () =>{
    setHover(!hover)
  }



  return (
    <>
      {
        value ?
          <div className="profile_preview">
            <img src={value} alt="profileImage" style={{ width: '100%', height: 'auto' }}/>
          </div>
          :
          <div className="upload_button_wrapper">
            <div className="input_wrapper" onMouseEnter={handleHover} onMouseLeave={handleHover}>
              <label className={`upload_button ${hover ? 'hover' : ''}`} htmlFor="upload" > 
                upload profile image
              </label>
              <input
                id="upload"
                type="file"
                accept="jpg"
                onChange={handleUpload}
                name={name}
              />
            </div>  
          </div>
      }

      
    </>
  )
}

export default ImageUploadField