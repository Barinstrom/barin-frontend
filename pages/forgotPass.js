import React from "react"
import { useRef } from "react"
import { useRouter } from "next/router"
import Swal from "sweetalert2"
import { forget_password } from "../utils/unauth"
import styles from '../styles/index.module.css'
import Link from "next/link"

// Path = 
// http://localhost:54321/forgot_password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5lZ29tb3I2NzFAeGl0dWR5LmNvbSIsImlhdCI6MTY2MjEzMjQwMSwiZXhwIjoxNjYyMTMzMzAxfQ.yHBUBpMvOax-_NPPKwUHw3HyWwYtunR7RhxnUNtAbLk


export default function ForgotPass() {
  const spin = useRef()
  const email = useRef()
  const router = useRouter()
  console.log(router.query)

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

    const form = new FormData(ev.target)
    const body = Object.fromEntries(form.entries())
    //console.log(body)
    
    spin.current.classList.remove("d-none");

    const response = await forget_password(body);

    spin.current.classList.add("d-none");
    
    //console.log(response)
    
    if (!response) {
      Swal.fire({
						icon: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
						title: result,  
						showConfirmButton:true,
						confirmButtonColor:"#ce0303",
          })
    }
    else {
      Swal.fire({
        icon: 'success',
        title: 'ส่งช่องทางการเปลี่ยนรหัสไปทาง email'+'\n'+'กรุณาตรวจสอบ email',
        showConfirmButton:true,
        confirmButtonColor:"#009431"
      })
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


