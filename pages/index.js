import React from 'react';
import styles from '../styles/index.module.css'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { checkLogin } from "../utils/auth";
import Swal from 'sweetalert2';


export default function Login() {

  const spin = useRef()

  /* กำหนดตัวแปร route ขึ้นมาเพื่อไปโยงไปอีกลิงค์*/
  const router = useRouter()
  
  /* ใช้ useRef ผูกค่าไว้กับ tag html ตัวนั้น */
  const email = useRef()
  const password = useRef()
  
  /* function ในการเช็คว่าใส่ข้อมูลครบไหม */
  async function clickLogin(ev){
    /* ป้องกันกันส่งข้อมูลไป server */
    ev.preventDefault();
    
    /* นำค่าที่ได้มาเก็บในตัวแปร สองตัวดังนี้ */
    const email_check = email.current.value;
	  const password_check = password.current.value;
		
    /* เช็คข้อมูลปกติ */
    if (email_check === "" && password_check === "") {
		  alert("โปรดกรอกข้อมูลให้ครบถ้วน");
      /* เรียกฟังชันก์ checkLogin แล้วส่ง body เป็น parameter ไป  */
      return;
		
    } else {
      /*ถ้าหากใส่ข้อมูลครบถ้วน ให้นำค่ามากำหนดเป็น object */
      const body = {
			  email: email_check ,
			  password: password_check ,
      }
      
      spin.current.classList.remove("d-none");
      /* เรียกฟังชัน checkLogin แล้วส่ง body ไป  */
      const result = await checkLogin(body);

      spin.current.classList.add("d-none");
      
      /* ถ้าหากว่า status_login == false  */
      if (!result.status) {
        alert("ข้อมูลไม่ถูกต้อง")
        return
      /* ถ้าหากว่า status_login == true  */
      } else {
        console.log(result.result)
        // router.push("/getData")
      }
		}
  }
  
  return (
    <main className={styles.register}>

      <style jsx>{`
			.spinnerX {
				position: fixed;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				text-align: center;
				background-color: rgba(255, 255, 255, 0.8);
				z-index: 2;
			}
			`}</style>
			
			<div className="spinnerX pt-5 d-none" ref={spin}>
				<div className="spinner-border text-primary" role="status">
				</div>
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

        <div className='mt-5 d-flex flex-column justify-content-center align-items-center'>
          <button className='btn btn-success w-25' onClick={(ev) => clickLogin(ev)}>เข้าสู่ระบบ</button>
          {/* ไปหน้า register */}
          <Link href="/register"><button className='btn btn-info mt-2 w-25'>ลงทะเบียน</button></Link>
          <Link href="/forgotPass"><button className='btn btn-warning mt-2 w-25'>ลืมรหัสผ่าน</button></Link>
        </div>
      </section> 
    </main>
  )
}
