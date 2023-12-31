import { useDispatch } from "react-redux";
import { useState } from "react";
import { thunkCreatePost, thunkAllCurrPosts, thunkEditPost } from "../../store/post";
import { useModal } from "../../context/Modal";

const PostForm = ({post, formType}) => {
    const dispatch = useDispatch()
    const [body, setBody] = useState(post?.body)
    const [title, setTitle] = useState(post?.title)
    const [category, setCategory] = useState(post?.category)
    const [anonymous, setAnonymous] = useState(post?.anonymous)
    const [validationErrors, setValidationErrors] = useState("")
    const { closeModal } = useModal()
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        let errors = {}

        if(title.length < 5) errors.title = "Please enter 5 characters or more"
        if(title.length > 30) errors.title = "You cannot exceed 30 characters"
        if(body.length < 10) errors.body = "Please enter 10 characters or more"
        if(body.length > 1300) errors.body = "You cannot exceed 1300 characters"
        if(!category.length) errors.category = "Please select Beautiful or Horrible"
        if(!anonymous.length) errors.anonymous = "Please select yes or no."
        setValidationErrors(errors)
        if(Object.keys(errors).length) return
        
        post = {
            ...post,
            title,
            body,
            category,
            anonymous
        }

        if (formType === 'Create Post') {
            await dispatch(thunkCreatePost(post))
            .then(closeModal)
            dispatch(thunkAllCurrPosts())
        }

        if (formType === 'Edit Post') {
            await dispatch(thunkEditPost(post))
            .then(closeModal)
            dispatch(thunkAllCurrPosts())
        }
    }

    return (
        <div>
        <form onSubmit={handleSubmit}>
            <div className='errors' >

            {validationErrors.title}
            </div>
            <div>
                <div className='createPostTitle'>Title</div>
                <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className='errors' >

            {validationErrors.body}
            </div>
            <div>
                <div className='createPostBody'>Body</div>
                <textarea
                type='text'
                value={body}
                onChange={(e) => setBody(e.target.value)}
                />
            </div>
        <div class='selectPost'>
            {formType === 'Edit Post' ? null : 
            <>
            <div className='errors' >
            {validationErrors.category}
            </div>
            <select onChange={(e) => setCategory(e.target.value)}>
                <option value="">--Select Category--</option>
                <option value = "Beautiful" > Beautiful </option>
                <option value = "Horrible" > Horrible </option>
            </select>
            </>
            }
            <div className='errors' >

            {validationErrors.anonymous}
            </div>
            <select onChange={(e) => setAnonymous(e.target.value)}>
                    <option value = "">--Anonymous?--</option>
                    <option value = {true}> Yes </option>
                    <option value = {false}> No </option>
            </select>
            </div>
            <div className='submitButtCont'>

            <button type='submit'> Submit </button>
            </div>
        </form>
        </div>
    )

}

export default PostForm