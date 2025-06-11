import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '../dashboardLayout'
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '@/config/redux/action/authAction';
import styles from "./styles.module.css"
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';
function Discover() {
    const dispatch = useDispatch();
    const authState =useSelector((state)=>state.auth);
    const router = useRouter();
    useEffect(()=>{
        if(!authState.all_profiles_fetched){
            dispatch(getAllUsers());
        }
    })
  return (
     <UserLayout>
        <DashboardLayout>
           <h1>discover</h1>
            {authState.all_profiles_fetched && authState.all_users.map((profile)=>{
                    return (
                      <div key={profile._id} onClick={()=>{router.push(`/view_profile/${profile.userId.username}`)}} className={styles.extraContainer_profile}> 
                         <div className={styles.image}>
                            <img width={100} src={`${BASE_URL}/${profile.userId.profilePicture}`} alt="" />
                         </div>
                         <div className={styles.middle}>
                            <p>{profile.userId.name}</p>
                            <p>@{profile.userId.username}</p>
                         </div>
                         <div className={styles.last}>
                           <svg width={30} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                           </svg>

                         </div>
                      </div>
                        
                    )
                })
                }
        </DashboardLayout>
    </UserLayout>
  )
}

export default Discover
