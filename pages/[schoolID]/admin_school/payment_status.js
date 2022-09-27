import React from 'react';
import styles from '../../../styles/index.module.css'
import { useRef, useState, useEffect} from 'react';
import Cookies from 'universal-cookie';
import Reload from '../../../components/reload';
import { get_status } from '../../../utils/payment';
import { get_data } from '../../../utils/auth';
import { useRouter } from 'next/router';
import Error from 'next/error';



export default function Payment_Status() {
  const [displayFirst, setDisplayFirst] = useState("loading")
  const [data, setData] = useState()
  const router = useRouter()
  const cookie = new Cookies()
  const token = cookie.get("token")

  function return_page(ev, token) {
    ev.preventDefault();
    setDisplayFirst("loading")
    get_data(token).then(result => {
      console.log(result)
      if (result.data){
        router.replace( "http://localhost:3000/" + result.data.schoolID + "/admin_school")
      } else {
        router.replace("http://localhost:3000/")
      }
    })
  }

  useEffect(() => {
    get_status(token)
			.then(result => {
				console.log(result)
				if (result){
          setDisplayFirst(true)
          setData(result.data.message)
				}else{
					setDisplayFirst(false)
				}
		})

  },[])

  const paymentST_page = (
    <div>
      <p className={styles.logo}>success_page</p>
      <p className={styles.logo}>{data}</p>
      <button onClick={(ev)=>return_page(ev,token)} className="btn btn-primary">กลับหน้าหลัก</button>
    </div>
  )

  if (displayFirst === "loading") { 
		return <Reload />
	}
	else if (displayFirst) {
		return paymentST_page
  }
  else {
		return <Error statusCode={404}/>
	}
	
}
