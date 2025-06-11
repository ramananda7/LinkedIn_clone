import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import style from './style.module.css'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { registerUser,login } from '@/config/redux/action/authAction';
import { emptyMessgae } from '@/config/redux/reducer/authReducer';

export default function loginComponent() {
    const dispatch = useDispatch();
    const authState =  useSelector((state) => (state.auth));
    const router = useRouter();
    const [userLoginMethod , setUserLoginMethod] = useState(false); 
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    useEffect(() => {
          if (authState.isLoggedIn) {
             router.push("/dashboard");
           }
    }, [authState.isLoggedIn]);

    useEffect(() => {
          if (localStorage.getItem("token")) {
             router.push("/dashboard");
           }
    }, []);

    useEffect(() => {
          dispatch(emptyMessgae());
    }, [userLoginMethod])

    const handleRegister = ()=>{
      console.log("registered");
      dispatch(registerUser({username,password,email,name}));
    }
    const handleLoggedIn =()=>{
      console.log("loggedIn");
      dispatch(login({email,password}));
    }

  return (
    <UserLayout>
        <div className={style.container}>
          <div className={style.cardContainer}>
            <div className={style.cardContainer_left}>
                <p className={style.cardleft_heading}>{userLoginMethod ? "signIn" : "signUp"}</p>
                {authState.message}
                <div className={style.inputDiv}>
                 {!userLoginMethod && <div>
                        <input onChange={(e)=>setName(e.target.value)} type="text" placeholder='name' className={style.inputField} />
                        <input onChange={(e)=>setUsername(e.target.value)} type="text" placeholder='username' className={style.inputField} />
                  </div>}                
                   <input onChange={(e)=>setEmail(e.target.value)} type="text" placeholder='email' className={style.inputField} />
                   <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='password' className={style.inputField} />
                   <button onClick={()=>{
                     if(userLoginMethod){
                         handleLoggedIn();
                    }else{
                      handleRegister();
                    } 
                   }                   
                   } className={style.submit_button}>{userLoginMethod ? "signIn" : "signUp"}
                   </button>
                </div>
            </div>
            <div className={style.cardContainer_right}>
                {userLoginMethod ? <p>Don't have account . </p>: <p>Already have an Account ?</p>}
               
                <button onClick={()=>{setUserLoginMethod(!userLoginMethod)}                   
                   } className={style.submit_button_right}>{!userLoginMethod ? "signIn" : "signUp"}
                   </button>
            </div>
          </div>

        </div>
    </UserLayout>
  )
}
