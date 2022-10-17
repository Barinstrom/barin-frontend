import React from 'react';
import styles from '../styles/index.module.css'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef,useEffect } from 'react';
import { checkLogin } from "../utils/unauth";
import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';

export default function Login() {
  const spin = useRef()
  const email = useRef()
  const password = useRef()
  const router = useRouter()
  const cookie = new Cookies()
  
  useEffect(() => {
    cookie.remove("token", { path: "/" })
    cookie.remove("token", { path: "/system_admin" })
  },[])

  async function clickLogin(ev){
    ev.preventDefault();
    
    const email_check = email.current.value;
    const password_check = password.current.value;
		
    if (!email_check || !password_check) {
      Swal.fire({
				icon: 'warning',
				title: 'โปรดกรอกข้อมูลให้ครบถ้วน!',
				showConfirmButton: true,
				confirmButtonColor: "#f7a518",
				confirmButtonText: 'ok',
			})
      return
		}else{
      const body = {
        email: email_check ,
        password: password_check ,
      }
      
      spin.current.classList.remove("d-none");
      const [result,status] = await checkLogin(body);
      spin.current.classList.add("d-none");
      
      if (!status) {
        let content = ""
        if (result.response.data === "Email is not activated"){
          content = "โปรดทำการยืนยันอีเมลล์ก่อน"
        }else if (result.response.data === "Email or password is not correct."){
          content = "อีเมลล์หรือรหัสผ่านผิด"
        }

        Swal.fire({
						icon: 'error',
						title: content,
						showConfirmButton:true,
						confirmButtonColor:"#d1000a"
				})
        return
      }else {
        if (result.data.role === "host"){
          cookie.set("token",result.data.token)
          Swal.fire({
						icon: 'success',
						title: 'เข้าสู่ระบบสำเร็จ',
						showConfirmButton:true,
						confirmButtonColor:"#009431"
          }).then(() => {
            router.push("/" + "system_admin")
          })
        }else {
          Swal.fire({
            icon: 'info',
            title: 'เข้าสู่ระบบด้วยเส้นทางที่ไม่ถูกต้อง'+'\n'+'กำลังนำท่านสู่เส้นทางที่ถูกต้อง', 
            showConfirmButton:true,
            confirmButtonColor:"#0076d1"
          }).then(() => {
            router.push("/" + String(result.data.schoolID))
          })
        }
        // else {
        //   cookie.set("token",result.data.token)
        //   Swal.fire({
				// 		icon: 'success',
				// 		title: 'เข้าสู่ระบบสำเร็จ',
				// 		showConfirmButton:true,
				// 		confirmButtonColor:"#009431"
        //   })
        //   .then(() => {
        //     router.push("/" + String(result.data.schoolID) + "/admin_school")
        //   })
        // }
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
        <aside className={styles.block_left}>
          <div>
            <div className={styles.barin_strom}>
              <span>BARIN</span><br />
              <span>STROM</span>
            </div>
          </div>
        </aside>
          
        <aside className={styles.block_right}>
          <div className={styles.form}>
            <div className='form-floating'>
              <input type="text" className={`form-control`} placeholder="อีเมลล์" id={`${styles.block1}`} ref={email}/>
              <label className='form-label'>อีเมลล์</label>
            </div>
          
            <div className='form-floating mt-2'>
              <input type="password" className={`form-control`} placeholder="รหัสผ่าน" id={`${styles.block2}`} ref={password} />
              <label className='form-label'>รหัสผ่าน</label>
            </div>
          </div>
          
          <div className='mt-3 d-flex flex-column align-items-center'>
            <button className={styles.login_btn} onClick={(ev) => clickLogin(ev)}>เข้าสู่ระบบ</button>
            <Link href="/register"><button className={styles.register_btn}>สมัครสมาชิก</button></Link>
            <div className={styles.additional}>
              <Link href="/forgotPass"><a className={`mt-2 ${styles.forgotpass}`}>ลืมรหัสผ่าน</a></Link>
            </div>
          </div>
        </aside> 
      </section>
    </main>
  )
}
