import { BASE_URL, clientServer } from '@/config';
import UserLayout from '@/layout/UserLayout';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../dashboardLayout';
import styles from  "./index.module.css"
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { allPosts } from '@/config/redux/action/postAction';
import { getConnectionRequest, sendConnectionRequest } from '@/config/redux/action/authAction';
export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const authState = useSelector((state) =>state.auth);
  const postState = useSelector((state)=>state.posts) 
const [userPosts, setUserPost] = useState([]);
const [isCurrentInConnection, setIsCurrentInConnection] = useState(false);
const [isConnectionNull, setIsConnectionNull] = useState(true);

const getUserPost = async () => {
  await dispatch(allPosts());
  await dispatch(getConnectionRequest({ token: localStorage.getItem('token') }));
};

useEffect(() => {
  getUserPost();
}, []); // Run once on mount

useEffect(() => {
  const filteredPosts = postState.posts.filter(
    (post) => post.userId?.username === router.query.username
  );
  setUserPost(filteredPosts);
}, [postState.posts, router.query.username]);

useEffect(() => {
  if (
    Array.isArray(authState.connections) &&
    userProfile?.userId?._id
  ) {
    const foundConnection = authState.connections.find(
      (user) => user.connectionId?._id === userProfile.userId._id
    );

    if (foundConnection) {
      setIsCurrentInConnection(true);
      setIsConnectionNull(!foundConnection.status_accepted);
    } else {
      setIsCurrentInConnection(false);
    }
  }
}, [authState.connections, userProfile?.userId?._id]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}  >
          <div className={styles.upper} > 
            {/* style={{ backgroundColor: "rgb(222, 215, 215)" }} */}
            <div className={styles.photos}
             style={{ backgroundImage: `url(${BASE_URL}/pexels-coppertist-wu-313365563-15863788.jpg)` }}
            >
              <div className={styles.profileImg}>
                <img  width={200} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="" />
              </div>
            </div>
          </div>
          <div className={styles.secondLevel}>
            <br />
            <div className={styles.second_1}>
              <hr />
              <h3>  {userProfile.userId.name}  @{userProfile.userId.username}</h3>
              <p></p>
              <div style={{display:"flex" ,gap : "1.2rem"}}>
                {
  isCurrentInConnection ? (
    <button className={styles.connectBtn}>
      {isConnectionNull ? "Pending" : "Connected"}
    </button>
  ) : (
    <button
      className={styles.connectBtn}
      onClick={() => {
        dispatch(sendConnectionRequest({
          token: localStorage.getItem('token'),
          connectionId: userProfile?.userId?._id
        }));
        dispatch(getConnectionRequest({
          token: localStorage.getItem('token')
        }));
      }}
    >
      Connect
    </button>
  )
}
  
              <div onClick={async()=>{
                const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`)
                window.open(`${BASE_URL}/${response.data.message}`,"_blank")
              }}
               className={styles.btndownload}>
                <svg width={30} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>

              </div>
              </div>                  
             
             <div><p>{userProfile.bio}</p></div>        
            </div>
            <div className={styles.second_2}>
                <hr />
                <h3>recent Interaction</h3>
                {userPosts.map((post)=>{
                  return (
                    <div key={post._id} className={styles.card}>
                      {post.media !== "" ? <img width={100} src={`${BASE_URL}/${post.media}`} alt="media" /> : null}
                        <p>{post.body}</p>

                    </div>
                  )
                })}
            </div>
            
           </div>
           <div className={styles.third}>
            { userProfile.currentpost!=null && <div> <h5>Currently working At : {userProfile.currentpost} </h5> </div> }
             
             <h4>Work History</h4>

        <div className={styles.third_container}>
  {
    userProfile.PastWork.map((work, index) => (
      <div key={index} className={styles.workHistoryCard}>
        <p>{work.company}</p>        
        <p style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>{work.position} </p>
        <p>{work.years}</p>
        <br />
      </div>
    ))}
    
</div>
<div>
   {
    userProfile.education.map((ed, index) => (
      <div key={index} className={styles.workHistoryCard}>
        <p>{ed.school}</p> 
        <p>{ed.degree}</p> 
        <p>{ed.fieldOfStudy}</p>
        <br />
      </div>
    ))}
</div>

           </div>

        </div>       
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  try {
    const request = await clientServer.get("/user/getUserByUsername", {
      params: {
        username: context.query.username
      }
    });
    const response = request.data;


    return { props: {
        userProfile: response.profile
      }
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { props: { userProfile: null } };
  }
}
