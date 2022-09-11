import React from "react"
import { useRef } from "react"
import { useRouter } from "next/router"
import styles from '../styles/index.module.css'
import axios from "axios"
import Swal from "sweetalert2"


// Path = 
// http://localhost:54321/forgot_password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5lZ29tb3I2NzFAeGl0dWR5LmNvbSIsImlhdCI6MTY2MjEzMjQwMSwiZXhwIjoxNjYyMTMzMzAxfQ.yHBUBpMvOax-_NPPKwUHw3HyWwYtunR7RhxnUNtAbLk

export default function ForgotPass(){
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

    const url = `www.google.com/?token=${router.query.token}`
    //const t = "https://jsonplaceholder.typicode.com/posts"
    //console.log(url)
    /* try{
      const result = await axios({
        method:"get",
        url:t,
        timeout:2000
      })
      
      console.log(result)
    }catch(err){
      console.log(err.message)
    } */
  } 
  
  return (
    <main className={styles.register}>
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


