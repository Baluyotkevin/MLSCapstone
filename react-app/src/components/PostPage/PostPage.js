import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { thunkAllPosts, thunkOnePost } from "../../store/post";
import { useParams } from "react-router-dom";
import { thunkAllUsers } from "../../store/user";
import OpenModalButton from "../OpenModalButton";
import CreatePostOnPost from "../Posts/CreatePostOnPost";
import EditPostOnPost from "../Posts/EditPostOnPost";
import DeletePost from "../Posts/DeletePost";
import EditPost from "../Posts/EditPost";

const PostPage = () => {
    const dispatch = useDispatch()
    const onePost = useSelector(state => state.post.singlePost)
    const currUser = useSelector(state => state.session.user)
    const root = onePost.root
    const children = onePost.children
    const { postId } = useParams()
    useEffect(() => {
        dispatch(thunkOnePost(postId))
        dispatch(thunkAllPosts())
        // dispatch(t)
    }, [dispatch])

    return (
        <div className='postBody'>
            {currUser?.id === root?.user_id && !children.length ? <OpenModalButton
            buttonText='Continue your love story!'
            modalComponent={<CreatePostOnPost postId={postId}/>}
            /> : null}
            <ul class='postCont'>
                <li className='singlePostCont'> 
                    <div>
                        {/* hello */}
                        {root?.title}
                    </div>
                    <div>
                        {root?.category}
                    </div>
                    <div>
                        {root?.body}
                    </div>
                    <div>
                    {root?.anonymous ? 'Anonymous' : root?.user.first_name} - {root?.created_at.slice(0, 16)}
                    </div>
                </li>
                {children?.length ? Object.values(children).map(post => {
                    return (
                        <li className='singlePostCont'>
                            <div className='modalCont'>
                               <OpenModalButton 
                               buttonText='Edit'
                               modalComponent={<EditPostOnPost post={post}/>}
                               />
                                <OpenModalButton
                                buttonText='Delete'
                                modalComponent={<DeletePost post={post} />}
                                />
                            </div>
                        <div className='title'>
                                {post.title}
                            </div>

                            <div>
                                {post.category}
                            </div>
                            <br />

                            <div className='body'>
                                {post.body}
                            </div>
                            <div>
                                {post.created_at?.slice(0, 16)}
                            </div>
                        <br />
                        </li>
                        
                    )
                }) : null}
            </ul>
        </div>
    )

}

export default PostPage