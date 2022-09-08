import React from "react"
import { useRef } from "react"
import { useRouter } from "next/router"
import styles from '../styles/index.module.css'
import axios from "axios"
import Swal from "sweetalert2"


// Path = 
// http://localhost:54321/forgot_password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5lZ29tb3I2NzFAeGl0dWR5LmNvbSIsImlhdCI6MTY2MjEzMjQwMSwiZXhwIjoxNjYyMTMzMzAxfQ.yHBUBpMvOax-_NPPKwUHw3HyWwYtunR7RhxnUNtAbLk

export default function ForgotPass(){
  const pwd = useRef([])
  const router = useRouter()
  console.log(router.query)

  async function editPwd(ev){
    ev.preventDefault()
    console.log(pwd.current[0].value);
    console.log(pwd.current[1].value);
    
    if (pwd.current[0].value != pwd.current[1].value){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'ใส่รหัสผ่านให้เหมือนกัน',
      })
      return 
    }

    const form = new FormData(ev.target)
    const body = Object.fromEntries(form.entries())
    console.log(body)

    const url = `www.google.com/?token=${router.query.token}`
    //const t = "https://jsonplaceholder.typicode.com/posts"
    //console.log(url)
    try{
      const result = await axios({
        method:"get",
        url:t,
        timeout:2000
      })
      
      console.log(result)
    }catch(err){
      console.log(err.message)
    }
  } 
  
  return (
    <main className={styles.register}>
      <main className={styles.block} >
        <div>
          <p className={styles.logo}>Barin Storm</p>
        </div>
        <form onSubmit={(ev)=> editPwd(ev)}>
          <div className='form-floating'>
            <input type="text" name="confirmNewPassword" className={`form-control`} id={`${styles.block1}`} placeholder="รหัสผ่านเดิม" ref={(el) => pwd.current[0] = el}/>
            <label className='form-label'>รหัสผ่านใหม่</label>
          </div>
          
          <div className='form-floating'>
            <input type="text" name="newPassword" className={`form-control`} id={`${styles.block2}`} placeholder="รหัสผ่านใหม่" ref={(el) => pwd.current[1] = el}/>
            <label className='form-label'>ยืนยันรหัสผ่าน</label>
          </div>
          
          <div className='mt-5 d-flex justify-content-center align-items-center'>
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


