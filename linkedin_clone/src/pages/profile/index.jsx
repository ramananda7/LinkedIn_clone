import { changingNameAndEmail, getAboutUser } from '@/config/redux/action/authAction'; 
import UserLayout from '@/layout/UserLayout';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../dashboardLayout';
import styles from "./index.module.css";
import { BASE_URL, clientServer } from '@/config';
import { useRouter } from 'next/router';
import { allPosts, delete_post, deleteComment, getAllComments, increment_likes, postComment } from '@/config/redux/action/postAction';
import { resetPostId } from '@/config/redux/reducer/postReducer';

function ProfileView() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const [userPosts, setUserPost] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [changingName, setChangingName] = useState('');
  const [changingEmail, setChangingEmail] = useState('');
  const [company, setCompany] = useState('');
const [position, setPosition] = useState('');
const [years, setYears] = useState('');
const [showWorkForm, setShowWorkForm] = useState(false);
const [school, setSchool] = useState('');
const [degree, setDegree] = useState('');
const [fieldOfStudy, setFieldOfStudy] = useState('');
const [showSchoolForm, setShowSchoolForm] = useState(false);
const [bioInput, setBioInput] = useState(authState.user.bio || "");
const [showBioForm, setShowBioForm] = useState(false);
const [commentValue, setcommentValue] = useState(" ");

commentValue

const router = useRouter();
const username = typeof router.query.username === "string" ? router.query.username : "";
// Fetch user and posts only once
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    dispatch(getAboutUser({ token }));
    dispatch(allPosts({ token }));
    console.log(postState.posts)
console.log("router.query.username:", router.query.username);

  }
}, [dispatch]);

// Filter posts after posts and router are ready
useEffect(() => {
  if (!router.isReady || !router.query.username) return;

  const username = router.query.username;
  const posts = postState.posts || [];

  const filteredPosts = posts.filter(
    (post) => post.userId?.username === username
  );
  setUserPost(filteredPosts);
}, [router.isReady, router.query.username, postState.posts]);


  useEffect(() => {
    if (authState?.user && authState.user.userId) {
      setUserProfile(authState.user);
      setChangingName(authState.user.userId.name || '');
      setChangingEmail(authState.user.userId.email || '');
    }
  }, [authState.user]);


  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    formData.append("token", localStorage.getItem("token"));

    try {
      await clientServer.post("/uploads_profile_picture", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  // ✅ Prevent render until data is ready
if (!authState.user || !authState.user.userId) {
    return <div>Loading...</div>;
  }
  return (
    <UserLayout>
      <DashboardLayout>
        
        <div className={styles.container}>
          <div className={styles.upper}>
            <div
              className={styles.photos}
              style={{
                backgroundImage: `url(${BASE_URL}/pexels-optical-chemist-340351297-15597164.jpg)`
              }}
            >
              <div className={styles.profileImg}>
                <img  src={`${BASE_URL}/${authState.user?.userId?.profilePicture}`} alt="Profile"
                  className={styles.profilePic}
                />
                <label htmlFor='pp' className={styles.editOverlay}>Edit</label>
                <input type="file"  id='pp'  hidden  onChange={(e) => updateProfilePicture(e.target.files[0])}
                />
              </div>
            </div>
          </div>

          <div className={styles.secondLevel}>
            <br />
            <div className={styles.second_1}>
              <div className={styles.firstHalf}>
                <hr />
                <h1>{authState.user?.userId?.name}</h1> @{authState.user?.userId?.username}
                <div ><p>{authState.user?.bio}</p>  </div>
                {authState.user?.currentpost && (
                  <div><h5>Currently working At: {authState.user.currentpost}</h5></div>
                )}
              </div>
              <div className={styles.wildcard}><hr />
               {showBioForm && (
  <div className={styles.editForm}>
    <h3>Update Bio</h3>
    <form onSubmit={(e) => {
      e.preventDefault();
      dispatch(changingNameAndEmail({
        token: localStorage.getItem("token"),
        bio: bioInput,  // send the updated bio here
      }));
      setShowBioForm(false);
    }}>
      <textarea 
        value={bioInput} 
        onChange={(e) => setBioInput(e.target.value)} 
        rows={4} 
        cols={50}
      />
      <button type="submit">Save</button>
    </form>
  </div>
)}
              {showEditForm && (
                  <div className={styles.editForm}>
                    
                    <h3>Update Your Profile</h3>
                        <form onSubmit={(e) => {  e.preventDefault();
                        dispatch(changingNameAndEmail({
                            token: localStorage.getItem("token"),
                            name: changingName,
                            email: changingEmail
                        }));
                        setShowEditForm(false);
                        }}>
                      <input type="text"  placeholder="Name" value={changingName} onChange={(e) => setChangingName(e.target.value)}  />
                      <input type="email"  placeholder="Email" value={changingEmail}  onChange={(e) => setChangingEmail(e.target.value)} />
                      <button type="submit">Save</button>
                    </form>
                  </div>
                )}
              </div>
              <div className={styles.second}>
                <hr />
                <div
                  onClick={async () => {
                    const response = await clientServer.get(`/user/download_resume?id=${userProfile?.userId?._id}`);
                    window.open(`${BASE_URL}/${response.data.message}`, "_blank");
                  }}
                  className={styles.btndownload}
                ><h4>Download_Resume</h4>
                  <svg width={30} xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </div>
              </div>

              <div className={styles.mmm}>
                <hr />
                <button className={styles.connectBtn} onClick={() => setShowBioForm(prev => !prev)}>
                  update Bio 
                </button>
                <button className={styles.connectBtn} onClick={() => setShowEditForm(prev => !prev)}>
                  Edit Details
                </button>
        
              </div>
            </div>

           
          </div>

          <div className={styles.third}>
            <div className={styles.worlDetails}>
              <div className={styles.work_first}>
                <hr />
                <h4>Work History</h4>
                <div className={styles.third_container}>
                  {authState.user?.PastWork?.map((work, index) => (
                    <div key={index} className={styles.workHistoryCard}>
                      <p>Company : {work.company}</p>
                      <p style={{ fontWeight: "bold" }}> position : {work.position}</p>
                      <p>experience {work.years}</p>
                      <br />
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.work_2nd}>
                <hr />
                
               <button className={styles.connectBtn}  onClick={() => setShowWorkForm(prev => !prev)}> Edit Work History</button>

              </div>
            </div>

            <div className={styles.schoolDetails}>
              <div className={styles.school_left}>
                <hr />
                {authState.user?.education?.map((ed, index) => (
                  <div key={index} className={styles.workHistoryCard}>
                    <p>school name :{ed.school}</p>
                    <p>degree :{ed.degree}</p>
                    <p>fieldOfStudy: {ed.fieldOfStudy}</p>
                    <br />
                  </div>
                ))}
              </div>
              <div className={styles.school_right}>
                <hr />
                <button className={styles.connectBtn} onClick={() => setShowSchoolForm(prev => !prev)}> Edit School History</button>

              </div>
            </div>
   
          </div>
          
              <div className={styles.wildcard}><hr />
             
                  {showWorkForm && (
  <div className={styles.editForm}>
    <h3>Update Work History</h3>
    <form
     onSubmit={(e) => {
  e.preventDefault();
  dispatch(changingNameAndEmail({
    token: localStorage.getItem("token"),
    PastWork: [{ company, position, years }]
  }));
  setShowWorkForm(false);
}}

    >
      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <input
        type="text"
        placeholder="Position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
      />
      <input
        type="text"
        placeholder="Years"
        value={years}
        onChange={(e) => setYears(e.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  </div>
)}

{/* school editting form */}
</div>     
{showSchoolForm && (
  <div className={styles.editForm}>
    <h3>Update Education</h3>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch(changingNameAndEmail({
          token: localStorage.getItem("token"),
          education: [{ school, degree, fieldOfStudy }]
        }));
        setShowSchoolForm(false);
      }}
    >
      <input
        type="text"
        placeholder="School"
        value={school}
        onChange={(e) => setSchool(e.target.value)}
      />
      <input
        type="text"
        placeholder="Degree"
        value={degree}
        onChange={(e) => setDegree(e.target.value)}
      />
      <input
        type="text"
        placeholder="Field of Study"
        value={fieldOfStudy}
        onChange={(e) => setFieldOfStudy(e.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  </div>
)}
    <div className={styles.userpost}>
  <hr />
  <h3>Recent Interactions</h3>
   
   <div className={styles.postContainer}>
              {postState.posts.filter(
    (post) => post.userId?.username === authState.user?.userId?.username
  ).map((post)=>{
                   return (
                 
                      <div key={post._id} className={styles.pContainer}>
                         <div className={styles.postHeader}>
                             <div className={styles.imagee}>
                               <img  src={`${BASE_URL}/${post.userId.profilePicture}`} alt="" />                                                                                       
                             </div>
                             
                             <div className={styles.middle}>
                               
                               <h2> {post.userId.name}</h2> 
                               <hr />
                               <p>Post On {new Date(post.createdAt).toLocaleString()}</p>
                               <p>BIO : {post.body}</p>
                             </div>
                              
                             <div className={styles.deleteIcon} >  
                              {post.userId && authState.user && post.userId.username === authState.user.userId.username &&
                              <div  className={styles.IIcon} onClick={async()=>{
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
                        
                         <div className={styles.postImg}>
                             <img style={{ width: "100%" }}  src={`${BASE_URL}/${post.media}`} alt="" />
                         </div>
                         <div className={styles.postFooter}>
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

        </div>
{postState.postId !== "" && (
  <div className={styles.commentsContainer} onClick={() => dispatch(resetPostId())}>
    <div className={styles.inside} onClick={(e) => e.stopPropagation()}>
      <h2 style={{ textAlign: "center", marginTop: "2vh" }}>Comments</h2>
      <hr />
      <div className={styles.commentsList}>
        {postState.comments.map((cmt) => (
          <div key={cmt._id} className={styles.mainCommentBox}>
            <div className={styles.cmtBox}>
              <div className={styles.cmtprofile}>
                <img
                  src={`${BASE_URL}/${cmt.userId?.profilePicture}`}
                  alt="Profile"
                />
              </div>
              <div className={styles.content}>
                <h4>{cmt.userId?.name}</h4>
                <h3>{cmt.body}</h3>
              </div>
              <div  className={styles.deleteCmtIcon} onClick={async()=>{
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

      <div className={styles.cmtFooter}>
        <textarea className={styles.textArea} placeholder="Add a comment..." value={commentValue} onChange={(e)=>{setcommentValue(e.target.value)}}/>
        <button className={styles.submitBtn} onClick={async()=>{
          
          await dispatch(postComment({post_id : postState.postId , body : commentValue}))
          await dispatch(getAllComments({post_id : postState.postId}))
          setcommentValue("");
        }}>Submit</button>
      </div>
    </div>
  </div>
)}
      </DashboardLayout>
    </UserLayout>
  );
}

export default ProfileView;
