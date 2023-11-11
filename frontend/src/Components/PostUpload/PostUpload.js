import React, { useState } from 'react'
import "./PostUpload.scss"
import { useDispatch } from 'react-redux'
import { CreatePost } from '../../ReduxToolKit/Slice/PostSlice'
import { FetchMyProfile } from '../../ReduxToolKit/Slice/UserSlice'
import { toast } from 'react-toastify'

const PostUpload = () => {
    const [caption, setCaption] = useState()
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState();
    const dispatch = useDispatch()
    const handleImageChange = async(e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
        if (selectedImage) {
            const imageURL = URL.createObjectURL(selectedImage);
            setImagePreview(imageURL);
          } else {
            setImagePreview("");
          }
    }
    const submitHandler = async(e) => {
        e.preventDefault()
        if(image){
  await dispatch(CreatePost({caption, image}))
    dispatch(FetchMyProfile())
    setCaption('')
    setImage(null)
    setImagePreview('')
    toast.success("Post uploaded successfully")
        }else{
          toast.warning("please select image to post")
        }
   }
  return (
    <div className='post-upload'>
      <div className="new-post">
        <h2>New Post</h2>
      {imagePreview &&   <div className="img">
            <img src={imagePreview} alt="" />
        </div>}
        <form className="newPostForm" onSubmit={submitHandler}>
      <div className="form-control">
      <input type="file"  onChange={handleImageChange} name='photo'/>
        <input
          type="text"
          placeholder="Caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>
        <button  type="submit" >
          Post
        </button>
      </form>
      </div>
    </div>
  )
}

export default PostUpload
