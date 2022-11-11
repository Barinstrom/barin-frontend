import React from 'react';
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
      // console.log("return = ",result)
      if (result[1]){
        window.location.replace( "/"+ result[0].data._doc.schoolID + "/admin_school")
      } else {
        router.replace("/")
      }
    })
  }

  useEffect(() => {
    get_status(token)
			.then(result => {
				// console.log(result)
        if (result) {
        //   get_data(token)
        //     .then(checkstatus => {
        //       console.log(checkstatus)
        //       const data_tmp = checkstatus.data
        //       const payment_st = data_tmp.paymentStatus
        //       if (payment_st!="success") {
        //         setDisplayFirst("fail")
        //         setData(result.data.message)
        //       }
        //       else {
        //         setDisplayFirst("success")
        //         setData(result.data.message)
        //       }
        //     })
          if (result.data.success) {
            setDisplayFirst("success")
            setData("Payment done.")
          }
          else {
            if (result.data.message == "You had already paid."){
              setDisplayFirst("success")
              setData(result.data.message)
            }
            else {
              setDisplayFirst("fail")
              setData(result.data.message)
            }
            
          }
          
        } else {
          router.push("/login")
					// setDisplayFirst(false)
				}
		})

  },[])

  const paymentST_page_paid = (
    <>
      <style jsx>{`
           
       body
          {
              background:#f2f2f2;
          }

          .payment
        {
          border:1px solid #f2f2f2;
          height:280px;
              border-radius:20px;
              background:#fff;
        }
        .payment_header
        {
          background:green;
          padding:20px;
            border-radius:20px 20px 0px 0px;
          
        }
        
        .check
        {
          margin:0px auto;
          width:50px;
          height:50px;
          border-radius:100%;
          background:#fff;
          text-align:center;
        }
        
        .check i
        {
          vertical-align:middle;
          line-height:50px;
          font-size:30px;
        }

          .content 
          {
              text-align:center;
          }

          .content  h1
          {
              font-size:25px;
              padding-top:25px;
          }

          .content a
          {
              width:200px;
              height:35px;
              color:#fff;
              border-radius:30px;
              padding:5px 10px;
              background:green;
              transition:all ease-in-out 0.3s;
          }

          .content a:hover
          {
              text-decoration:none;
              background:#000;
          }
      `}</style>
      <div className="container">
        <div className="row">
            <div className="col-md-6 mx-auto mt-5">
              <div className="payment">
                  <div className="payment_header">
                    <div className="check"><i className="fa fa-check" aria-hidden="true"></i></div>
                  </div>
                  <div className="content">
                    <h1>Payment Status</h1>
                    <p>{data}</p>
                    <button onClick={(ev)=>return_page(ev,token)} className="btn btn-success">กลับหน้าหลัก</button>
                  </div>
                  
              </div>
            </div>
        </div>
      </div>
    </>
  )

  const paymentST_page_unpaid = (
    <>
      <style jsx>{`
           
       body
          {
              background:#f2f2f2;
          }

          .payment
        {
          border:1px solid #f2f2f2;
          height:280px;
              border-radius:20px;
              background:#fff;
        }
        .payment_header
        {
          background:red;
          padding:20px;
            border-radius:20px 20px 0px 0px;
          
        }
        
        .check
        {
          margin:0px auto;
          width:50px;
          height:50px;
          border-radius:100%;
          background:#fff;
          text-align:center;
        }
        
        .check i
        {
          vertical-align:middle;
          line-height:50px;
          font-size:30px;
        }

          .content 
          {
              text-align:center;
          }

          .content  h1
          {
              font-size:25px;
              padding-top:25px;
          }

          .content a
          {
              width:200px;
              height:35px;
              color:#fff;
              border-radius:30px;
              padding:5px 10px;
              background:orange;
              transition:all ease-in-out 0.3s;
          }

          .content a:hover
          {
              text-decoration:none;
              background:#000;
          }
      `}</style>
      <div className="container">
        <div className="row">
            <div className="col-md-6 mx-auto mt-5">
              <div className="payment">
                  <div className="payment_header">
                    <div className="check"><i className="fa fa-xmark" aria-hidden="true"></i></div>
                  </div>
                  <div className="content">
                    <h1>Payment Status</h1>
                    <p>{data}</p>
                    <button onClick={(ev)=>return_page(ev,token)} className="btn btn-warning">กลับหน้าหลัก</button>
                  </div>
                  
              </div>
            </div>
        </div>
      </div>
    </>
  )

  if (displayFirst === "loading") { 
		return <Reload />
	}
	else if (displayFirst === "success") {
		return paymentST_page_paid
  }
  else if (displayFirst === "fail") {
		return paymentST_page_unpaid
  }
  else {
		return <Error statusCode={404}/>
	}
	
}
