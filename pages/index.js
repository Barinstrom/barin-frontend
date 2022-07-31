import React from 'react';
import styles from '../styles/index.module.css'
import Link from 'next/link';
import { useRef } from 'react';

export default function Register() {
  /* อ้างอิงค่า tag ด้วย useRef */
  const email = useRef()
  const password = useRef()
  
  /* function ในการเช็คว่าใส่ข้อมูลครบไหม */
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
      {/* กำหนด style แบบ nextjs jsx */}
      <style jsx>{`
        
      `}</style>
      
      <main className={styles.block} >
        {/* ชื่อเว็บไซต์ใส่ไปก่อนเฉยๆ */}
        <div>
          <p className={styles.logo}>Barin Storm</p>
        </div>
        
        {/* อีเมลล์ */}
        <div className='form-floating'>
          <input type="text" className="form-control" placeholder="อีเมลล์" id={styles.email} ref={email}/>
          <label className='form-label'>อีเมลล์</label>
        </div>
        
        {/* รหัสผ่าน */}
        <div className='form-floating'>
          <input type="text" className="form-control" placeholder="รหัสผ่าน" id={styles.password} ref={password}/>
          <label className='form-label'>รหัสผ่าน</label>
        </div>

        <div className='mt-5 d-flex justify-content-center'>
          {/* เมื่อกดปุ่มจะเกิด event */}
          <button className='btn btn-success' onClick={(ev) => clickLogin(ev)}>เข้าสู่ระบบ</button>
          {/* ไปหน้า register */}
          <Link href="/register"><button className='btn btn-danger ms-2'>ลงทะเบียน</button></Link>
        </div>
      
      </main> 
    </main>
  )
}
