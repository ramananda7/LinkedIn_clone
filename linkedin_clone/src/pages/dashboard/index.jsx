import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction';
import { allPosts, createPost, delete_post, deleteComment, getAllComments, increment_likes, postComment } from '@/config/redux/action/postAction';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '../dashboardLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style from './styles.module.css';
import { BASE_URL } from '@/config';
import { resetPostId } from '@/config/redux/reducer/postReducer';

function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const [postComponent , setComponent] = useState("");
  const [fileContent , setFileContent] = useState();
  const [commentValue , setCommentValue] = useState();

  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(allPosts());
      dispatch(getAboutUser({ token: localStorage.getItem('token') }));
    }
  }, [authState.isTokenThere, dispatch]);

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profiles_fetched, dispatch]);
  
const handleUpdate = async () => {
  if (!postComponent || !fileContent) {
    alert("Please enter post text and select a file");
    return;
  }

  try {
    await dispatch(createPost({ file: fileContent, body: postComponent }));
    setComponent("");
    setFileContent(null);
    dispatch(allPosts());
    alert("Post uploaded!");
  } catch (error) {
    console.error("Post upload failed:", error);
    alert("Upload failed.");
  }
};

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={style.scrollComponent}>
          {!authState.profileFetched ? (
            <p>Loading profile...</p>
          ) : (
            <div className={style.craetePostContainer}>
              <img   className={style.profileImage}
                src={`${BASE_URL}/${authState.user?.userId?.profilePicture}`}
                alt="Profile"
              />
              <textarea onChange={(e)=>setComponent(e.target.value)} value={postComponent} name="" id=""></textarea>
              <label htmlFor="fileUpload">
                <div className={style.fab}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M15 13.5H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>


                </div>
              </label>
               <input onChange={(e) => setFileContent(e.target.files[0])} type="file" hidden id="fileUpload" />
 
              <div className={style.upload} onClick={handleUpdate}>
              {postComponent.length>0 && <div className='inner'> <svg width={40} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                 </svg>  </div>}
               </div>
            </div>
          )}
          <div className={style.postContainer}>
              {postState.posts.map((post)=>{
                   return (
                      
                      <div key={post._id} className={style.pContainer}>
                         <div className={style.postHeader}>
                             <div className={style.imagee}>
                               <img  src={`${BASE_URL}/${post.userId.profilePicture}`} alt="" />                                                                                       
                             </div>
                             
                             <div className={style.middle}>
                               
                               <h2> {post.userId.name}</h2> 
                               <hr />
                               <p>Post On {new Date(post.createdAt).toLocaleString()}</p>
                               <p>BIO : {post.body}</p>
                             </div>
                              
                             <div className={style.deleteIcon} >  
                              {post.userId && authState.user && post.userId.username === authState.user.userId.username &&
                              <div  className={style.IIcon} onClick={async()=>{
                                 dispatch(delete_post({post_id : post._id}) , 
                                 dispatch(allPosts()))
                              }}>
                                <svg  width={25} height={25}  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                               </svg> 
                               </div> 
                              }
                                                                                                                       
                             </div>
              
                            
                         </div>
                        
                         <div className={style.postImg}>
                             <img style={{ width: "100%" }}  src={`${BASE_URL}/${post.media}`} alt="" />
                         </div>
                         <div className={style.postFooter}>
                            <div onClick={()=>{dispatch(increment_likes({token :localStorage.getItem('token'),post_id : post._id}))}}>
                                  <svg width={25} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                  </svg>                    
                            </div>
                            <p> {post.likes} </p>
                            <div onClick={()=>{dispatch(getAllComments({post_id : post._id}))}}>
                              <svg width={25} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                               </svg>
                            </div>
                             <p>{postState.comments.length}</p>
                         </div>
                          
                      </div>
                        
                    )
              })}
          </div>
        </div>
{postState.postId !== "" && (
  <div className={style.commentsContainer} onClick={() => dispatch(resetPostId())}>
    <div className={style.inside} onClick={(e) => e.stopPropagation()}>
      <h2 style={{ textAlign: "center", marginTop: "2vh" }}>Comments</h2>
      <hr />
      <div className={style.commentsList}>
        {postState.comments.map((cmt) => (
          <div key={cmt._id} className={style.mainCommentBox}>
            <div className={style.cmtBox}>
              <div className={style.cmtprofile}>
                <img
                  src={`${BASE_URL}/${cmt.userId?.profilePicture}`}
                  alt="Profile"
                />
              </div>
              <div className={style.content}>
                <h4>{cmt.userId?.name}</h4>
                <h3>{cmt.body}</h3>
              </div>
              <div  className={style.deleteCmtIcon} onClick={async()=>{
                 dispatch(deleteComment({cmt_id : cmt._id})); 
                 dispatch(getAllComments({post_id : postState.postId}))}}>
                 <svg width={25} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                 </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={style.cmtFooter}>
        <textarea className={style.textArea} placeholder="Add a comment..." value={commentValue} onChange={(e)=>{setCommentValue(e.target.value)}}/>
        <button className={style.submitBtn} onClick={async()=>{
          
          await dispatch(postComment({post_id : postState.postId , body : commentValue}))
          await dispatch(getAllComments({post_id : postState.postId}))
          setCommentValue("");
        }}>Submit</button>
      </div>
    </div>
  </div>
)}

      </DashboardLayout>
    </UserLayout>
  );
}

export default Dashboard;
