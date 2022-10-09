import React from "react"
import { useRef } from "react"
import { useRouter } from "next/router"
import Swal from "sweetalert2"
import { forget_password } from "../utils/unauth"
import styles from '../styles/index.module.css'

// Path = 
// http://localhost:54321/forgot_password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5lZ29tb3I2NzFAeGl0dWR5LmNvbSIsImlhdCI6MTY2MjEzMjQwMSwiZXhwIjoxNjYyMTMzMzAxfQ.yHBUBpMvOax-_NPPKwUHw3HyWwYtunR7RhxnUNtAbLk


export default function ForgotPass() {
  const spin = useRef()
  const email = useRef()
  const router = useRouter()
  //console.log(router.query)

  async function clickForm(ev){
    ev.preventDefault()
    
    if (!email.current.value){
      Swal.fire(
        'โปรดกรอกอีเมลล์ของท่าน',
        '',
        'warning'
      )
      return
    }

    const body = {
      "email":email.current.value
    }

    spin.current.classList.remove("d-none");

    const result = await forget_password(body);

    spin.current.classList.add("d-none");
    
    if (!result) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง',
        showConfirmButton: true,
        confirmButtonColor: "#d1000a",
        confirmButtonText: 'ok',
      })
    } else {
      Swal.fire({
        icon: 'success',
        title: 'ส่งช่องทางการเปลี่ยนรหัสเรียบร้อย' + '\n' + 'กรุณาตรวจสอบ email',
        showConfirmButton: true,
        confirmButtonColor: "#009431",
        confirmButtonText: 'ok',
      })
    }
  } 
  
  return (
    <main className={styles.register}>

      <style jsx>{`
        .background-spinner{
            background-color:rgb(0, 0, 0,0.4);
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
              <input type="text" className={`form-control`} placeholder="อีเมลล์" ref={email}/>
              <label className='form-label'>อีเมลล์</label>
            </div>
          </div>
          
          <div className='mt-3 d-flex flex-column align-items-center'>
            <button className={styles.login_btn} onClick={(ev) => clickForm(ev)}>ลืมรหัสผ่าน</button>
          </div>
        </aside> 
      </section>
    </main>
  )
}


export async function getServerSideProps(){
  return {
    props:{}
  }
}


