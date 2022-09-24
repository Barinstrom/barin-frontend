import React from "react"
import { useRef } from "react"
import { useRouter } from "next/router"
import styles from '../styles/index.module.css'
import axios from "axios"
import Swal from "sweetalert2"
import { forget_password } from "../utils/unauth"


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
        'You clicked the button!',
        'warning'
      )
      return
    }

    const form = new FormData(ev.target)
    const body = Object.fromEntries(form.entries())
    console.log(body)
    spin.current.classList.remove("d-none");

    const response = await forget_password(body);

    spin.current.classList.add("d-none");
    console.log(response)
    if (!response) {
      Swal.fire({
						icon: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
						title: result,  
						showConfirmButton:true,
						confirmButtonColor:"#ce0303"
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

      <main className={styles.block} >
        <div>
          <p className={styles.logo}>Barin Storm</p>
        </div>
        <form className="row" onSubmit={(ev)=> clickForm(ev)}>
          <div className="col-12">
            <label className='form-label'>อีเมลล์ที่ใช้เปลี่ยนรหัสผ่าน</label>
            <input type="text" name="email" className="form-control" placeholder={'อีเมลล์'} ref={email}/>
          </div>
          <div className='mt-4 col-12 text-center'>
            <button className='btn btn-success w-25'>ยืนยัน</button>
          </div>
        </form>
      </main> 
    </ main>
  )
}


export async function getServerSideProps(){
  return {
    props:{}
  }
}


