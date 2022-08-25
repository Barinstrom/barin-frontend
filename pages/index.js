import React from 'react';
import styles from '../styles/index.module.css'
import Link from 'next/link';
import { useRef } from 'react';
import { login } from "../utils/auth";

export default function Login() {
  /* อ้างอิงค่า tag ด้วย useRef */
  const email = useRef()
  const password = useRef()
  
  /* function ในการเช็คว่าใส่ข้อมูลครบไหม */
  const clickLogin = async (ev) => {
		if (email.current.value === "" && password.current.value === "") {
			alert("โปรดกรอกข้อมูลให้ครบถ้วน");
			return;
		} else {
			//console.log(email.current.value);
			//console.log(password.current.value);

      /*axios เรียก api จากหลังบ้าน สำหรับ login*/
      const body = {
			  userId: email.current.value,
			  password: password.current.value,
      };
      console.log(body);
      let is_can = await login(body);
      //console.log(is_can)
      if (is_can==false) {
        alert("ข้อมูลไม่ถูกต้อง");
      }
		}
  };
  
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
          <input type="password" className="form-control" placeholder="รหัสผ่าน" id={styles.password} ref={password}/>
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
