import React from 'react'
import styles from "./styles.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';
import { useRouter } from 'next/router';
function NavbarComponent() {
  const authState = useSelector((state)=>(state.auth));
  const dispatch =useDispatch();
  const router = useRouter();
  const handleLogout = () => {
     localStorage.removeItem("token");
     dispatch(reset());    
     router.push("/login");
};
  return (

    <div className={styles.container}>
        <div className={styles.navbar}>
            <h1 style={{cursor: "pointer"}} onClick={()=>{router.push("/")}}>LinkedIn</h1> 
             <div  className={styles.navbarOptionContainer}>
              
              {  authState.profileFetched &&
                  <div style={{display : "flex" , gap :"1.2rem"}}>
                      
                     <p onClick={()=>{router.push("/profile")}} style={{fontWeight : "bold" ,cursor:"pointer" }}>Profile </p>
                      {authState.isTokenThere && 
                         <div onClick={handleLogout} className={styles.buttonNavbar}>
                         <p>log out</p>
                       </div>
              }
                  </div>
                }
              {!authState.profileFetched && 
               <div onClick={()=>{router.push("/login")}} className={styles.buttonNavbar}>
                  <h3>be a part</h3>
               </div>
              }
             
              
             </div>
        </div>
    </div>
  )
}

export default NavbarComponent;
