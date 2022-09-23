import React from 'react';
import styles from '../styles/index.module.css'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { checkLogin } from "../utils/unauth";
import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';


export default function Login() {
  const spin = useRef()
  const email = useRef()
  const password = useRef()

  const router = useRouter()
  
  
  async function clickLogin(ev){
    ev.preventDefault();
    
    const email_check = email.current.value;
	  const password_check = password.current.value;
		
    if (!email_check || !password_check) {
		  Swal.fire(
        'โปรดกรอกข้อมูลให้ครบถ้วน!',
        '',
        'warning',
      )
      return
		}else{
        const body = {
			    email: email_check ,
			    password: password_check ,
        }
      
      spin.current.classList.remove("d-none");
      
      // เรียกฟังชันก์จาก unauth
      const result = await checkLogin(body);
      console.log(result)
      
      spin.current.classList.add("d-none");
      
      console.log(result)
      if (!result) {
        Swal.fire(
          'เข้าสู่ระบบไม่สำเร็จ โปรดตรวจสอบ อีเมลและรหัสผ่าน!',   
          '',
          'error',
        )
        return
      } else {
        
        
        if (result.data.role === "host"){
          const cookie = new Cookies()
		      cookie.set("token",result.data.token)
          Swal.fire(
            'เข้าสู่ระบบสำเร็จ',      
            '',
            'success',
          )
          router.push("/" +"system_admin")
        }

        else if((result.data.role === "teacher" || result.data.role ===  "student")){
          Swal.fire(
            'เข้าสู่ระบบด้วยเส้นทางที่ไม่ถูกต้อง'+'\n'+'กำลังนำท่านสูงเส้นทางที่ถูกต้อง',      
            '',
            'error',
          )
          router.push("/" + String(result.data.schoolID))
        }
        
        else {
          const cookie = new Cookies()
		      cookie.set("token",result.data.token)
          Swal.fire(
            'เข้าสู่ระบบสำเร็จ',      
            '',
            'success',
          )
          router.push("/" + String(result.data.schoolID) + "/admin_school")
        }
      }
		}
  }
  
  return (
    <main className={styles.register}>

      <style jsx>{`
			.background-spinner{
          background-color:rgb(0, 0, 0,0.3);
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
      }
      
      `}</style>
			
      <div className='background-spinner d-none' ref={spin}>
        <div className="spinner-border text-primary"></div>
        
      </div>
      <section className={styles.block} >
        {/* ชื่อเว็บไซต์ใส่ไปก่อนเฉยๆ */}
        <div>
          <p className={styles.logo}>Barin Storm</p>
        </div>
        
        {/* อีเมลล์ */}
        <div className='form-floating'>
          <input type="text" className={`form-control`} placeholder="อีเมลล์" id={`${styles.block1}`} ref={email}/>
          <label className='form-label'>อีเมลล์</label>
        </div>
        
        {/* รหัสผ่าน */}
        <div className='form-floating'>
          <input type="password" className={`form-control`} placeholder="รหัสผ่าน" id={`${styles.block2}`} ref={password} />
          <label className='form-label'>รหัสผ่าน</label>
        </div>

        <div className='mt-5 d-flex flex-column justify-content-between align-items-center '>
          <div className='d-flex flex-column align-items-center w-100'>
            <button className='btn btn-success w-50 mt-2' onClick={(ev) => clickLogin(ev)}>เข้าสู่ระบบ</button>
            {/* ไปหน้า register */}
            <Link href="/register"><button className='btn btn-info w-50 mt-2'>ลงทะเบียน</button></Link>
          </div>
          <Link href="/forgotPass"><a className='mt-2'>ลืมรหัสผ่าน</a></Link>
        </div>
      </section> 
    </main>
  )
}
