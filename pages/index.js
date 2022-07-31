import React from 'react';
import styles from '../styles/index.module.css'
import Link from 'next/link';
import { useRef } from 'react';

export default function Register() {
  const email = useRef()
  const password = useRef()
  
  const clickLogin = (ev) => {
    if (email.current.value === "" && password.current.value === ""){
      alert("โปรดกรอกข้อมูลให้ครบถ้วน")
      return
    }else{
      console.log(email.current.value)  
      console.log(password.current.value)     
    }
  }
  
  return (
    <main className={styles.register}>
      <style jsx>{`
        main{
          font-family: 'Kanit', sans-serif;
        }
      `}</style>
      
      <main className={styles.block} >
        <div>
          <p className={styles.logo}>Barin Storm</p>
        </div>
        
        <div className='form-floating'>
          <input type="text" className="form-control" placeholder="email" id={styles.email} ref={email}/>
          <label className='form-label'>email</label>
        </div>
        
        <div className='form-floating'>
          <input type="text" className="form-control" placeholder="password" id={styles.password} ref={password}/>
          <label className='form-label'>password</label>
        </div>

        <div className='mt-5 d-flex justify-content-center'>
          <button className='btn btn-success' onClick={(ev) => clickLogin(ev)}>login</button>
          <Link href="/register"><button className='btn btn-danger ms-2'>register</button></Link>
        </div>
      
      </main> 
    </main>
  )
}
