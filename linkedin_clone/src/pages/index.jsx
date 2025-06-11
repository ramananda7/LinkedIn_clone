import Head from "next/head";
import {Inter } from "next/font/google";
const inter = Inter({subsets:["latin"]});
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
              <p>connect with friend</p>
              <p>A true social media platform with stories no blufs !</p>
              <div onClick={()=>{router.push("/login")}} className={styles.buttonjoin}>
                  <p>join now </p>
              </div>
          </div>
          <div className="mainContainer_right">
            <img src="images/bg.jpg" alt="" />
          </div>
        </div>
      </div>  
    </UserLayout>
  );
}
