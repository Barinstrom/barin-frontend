import React from "react"
import { useRef } from "react"
import { useRouter } from "next/router"
import styles from '../styles/index.module.css'
import Swal from "sweetalert2"
import { reset_password } from "../utils/unauth"

// Path = 
// http://localhost:54321/forgot_password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5lZ29tb3I2NzFAeGl0dWR5LmNvbSIsImlhdCI6MTY2MjEzMjQwMSwiZXhwIjoxNjYyMTMzMzAxfQ.yHBUBpMvOax-_NPPKwUHw3HyWwYtunR7RhxnUNtAbLk

export default function ForgotPass() {
  const spin = useRef()
  const pass = useRef()
  const confirm_pass = useRef()
  const router = useRouter()
  // console.log("query = ",router.query)

  async function clickForm(ev){
    ev.preventDefault()
    
    if (!pass.current.value || !confirm_pass.current.value){
      Swal.fire(
        'โปรดกรอกรหัสผ่านให้ครบถ้วน',
      )
      return
    }

    if (pass.current.value != confirm_pass.current.value){
      Swal.fire(
        'รหัสผ่านไม่ตรงกัน',
      )
      return
    }

    const body = {
      "newPassword":pass.current.value,
      "confirmNewPassword":confirm_pass.current.value
    }
    
    //body.token = router.query.token;
    
    Object.assign(body,{
      token:router.query.token
    })
    
    spin.current.classList.remove("d-none");

    const result = await reset_password(body);

    spin.current.classList.add("d-none");
    //console.log(result[1])
    
    if (!result[1]) {
      Swal.fire({
						icon: 'error',
						title: "เปลี่ยนรหัสผ่านไม่สำเร็จ",  
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
              <input type="password" className={`form-control`} placeholder="รหัสผ่านใหม่" ref={pass} />
              <label className='form-label'>กรุณาใส่รหัสผ่านใหม่</label>
            </div>
            <div className='form-floating'>
              <input type="password" className={`form-control mt-1`} placeholder="ยืนยันรหัสผ่านใหม่" ref={confirm_pass} />
              <label className='form-label'>ยืนยันรหัสผ่านใหม่</label>
            </div>
          </div>
          
          <div className='mt-3 d-flex flex-column align-items-center'>
            <button className={styles.login_btn} onClick={(ev) => clickForm(ev)}>เปลี่ยนรหัสผ่าน</button>
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


