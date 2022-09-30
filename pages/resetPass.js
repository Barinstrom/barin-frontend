import React from "react"
import { useRef } from "react"
import { useRouter } from "next/router"
import styles from '../styles/index.module.css'
import axios from "axios"
import Swal from "sweetalert2"
import { reset_password } from "../utils/unauth"


// Path = 
// http://localhost:54321/forgot_password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5lZ29tb3I2NzFAeGl0dWR5LmNvbSIsImlhdCI6MTY2MjEzMjQwMSwiZXhwIjoxNjYyMTMzMzAxfQ.yHBUBpMvOax-_NPPKwUHw3HyWwYtunR7RhxnUNtAbLk

export default function ForgotPass() {
  const spin = useRef()
  const pass = useRef()
  const conf_pass = useRef()
  const router = useRouter()
  // console.log("query = ",router.query)

  async function clickForm(ev){
    ev.preventDefault()
    
    if (!pass.current.value || !conf_pass.current.value){
      Swal.fire(
        'โปรดกรอกรหัสผ่านให้ครบถ้วน',
      )
      return
    }

    if (pass.current.value != conf_pass.current.value){
      Swal.fire(
        'รหัสผ่านไม่ตรงกัน',
      )
      return
    }

    const form = new FormData(ev.target)
    const body = Object.fromEntries(form.entries())
    body.token = router.query.token;
    
    console.log(body)
    spin.current.classList.remove("d-none");

    const response = await reset_password(body);

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
        title: 'เปลี่ยนรหัสผ่านสำเร็จ',
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
            <label className='form-label'>กรุณาใส่รหัสผ่านใหม่</label>
            <input type="password" name="newPassword" className="form-control" placeholder={'รหัสผ่านใหม่'} ref={pass} />
          </div>
          <div className="col-12 mt-2">
            <label className='form-label'>กรุณาใส่รหัสผ่านใหม่ อีกครั้ง</label>
            <input type="password" name="confirmNewPassword" className="form-control" placeholder={'ยืนยันรหัสผ่านใหม่'} ref={conf_pass} />
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

