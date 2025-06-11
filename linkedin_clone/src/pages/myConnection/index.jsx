import React, { useEffect, useState } from 'react'
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '../dashboardLayout'
import { useDispatch, useSelector } from 'react-redux';
import { accecptConnectionRequest, getConnected, user_me_ConnectionreqUest } from '@/config/redux/action/authAction';
import styles from "./index.module.css"
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';
import { connection } from 'next/server';
function Myconnections() {
   const dispatch =  useDispatch();
   const router = useRouter();
   const authState = useSelector((state) =>state.auth);
   const [requstedUser,setRequstedUser] = useState([]);
   
   useEffect(()=>{
       dispatch(user_me_ConnectionreqUest({token : localStorage.getItem('token')}))
   },[]);
   useEffect(()=>{
      dispatch(getConnected({token : localStorage.getItem('token')}))
   })
  return (
     <UserLayout>
        <DashboardLayout>
           <h1>Myconnections</h1>
           {authState.connectionRequest.length === 0  && <h3>No Request Pending</h3>}
           <div className={styles.mainContainer}>
                 {authState.connectionRequest.filter((connection) =>connection.status_accepted ===null).map((detail)=>{
                  return (
                     <div key={detail.id} className={styles.card} onClick={()=>{router.push(`/view_profile/${detail.userId.username}`)}}>
                         <div className={styles.image}>
                            <img  src={`${BASE_URL}/${detail.userId.profilePicture}`} alt="" />
                         </div>
                         <div className={styles.middle}>
                              <p><strong>{detail.userId.name}</strong></p>
                              <p>@  {detail.userId.username}</p>
                              <p>Email : {detail.userId.email}</p>
                         </div>
                        <div className={styles.last}>
                             <button onClick={(e)=>{
                                e.stopPropagation();
                                dispatch(accecptConnectionRequest({token : localStorage.getItem('token') , requestId: detail._id , action : "accepted"}))
                                dispatch(getConnected({token : localStorage.getItem('token')}))
                             }} 
                             className={styles.acceptBtn}>Accept</button>
                        </div>
                     </div>
                  )
                 })}
           </div>
            <hr />
            {authState.connected.length === 0  ?  <h3>No Connection</h3> :<h1>Connected To : </h1>}
            
             <div className={styles.mainContainer}>
               
                 {authState.connected.map((detail)=>{
                  return (
                     <div key={detail.id} className={styles.card} onClick={()=>{router.push(`/view_profile/${detail.userId.username}`)}}>
                         <div className={styles.image}>
                            <img  src={`${BASE_URL}/${detail.userId.profilePicture}`} alt="" />
                         </div>
                         <div className={styles.middle}>
                              <p><strong>{detail.userId.name}</strong></p>
                              <p>@  {detail.userId.username}</p>
                              <p>Email : {detail.userId.email}</p>
                         </div>
                       
                     </div>
                  )
                 })}
           </div>
           <div>

           </div>
           
        </DashboardLayout>
    </UserLayout>
  )
}

export default Myconnections
