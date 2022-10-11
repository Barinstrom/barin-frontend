import React from 'react'
import Link from 'next/link'

export default function Homepage() {
  return (
    <>
    <style jsx>
      {`
        .homepage{
          animation: up-down 2s ease-in-out infinite alternate-reverse both;
        }

        #about {
          margin-top: 100px;
          padding-top: 100px;
          background-color: white;
          padding-bottom: 100px;
          color: black;
          position:relative;
        }

        #about::after{
          content:"";
          background-color:rgb(0, 0, 0,0.1);
          top:0;
          bottom:0;
          left:0;
          right:0;
          position:absolute;
        }

        #price {
          margin-top: 150px;
          padding-bottom: 50px;
          position:relative;
        }

        .navbar-color{
          background-color:#fff;
          opacity:0.8;
        }

        @media screen and (max-width:650px) {
          #about {
            margin-top: 50px;
            padding-top: 50px;
            padding-bottom: 50px;
          }

          #price {
            margin-top: 100px;
          }
        }
        
        @keyframes up-down{
          0% {
            transform: translateY(10px);
          }
          100% {
            transform: translateY(-10px);
          }
        }

        .btn-register{
          text-decoration:none;
          background-color:#fff;
          border-radius:20px;
          padding:8px 15px;
          font-size:20px;
          color:#fff;
          box-shadow:0 2px 5px #5a96d3;
        }

        .btn-register:hover{
          border:1px solid #5a96d3;
        }
    `}
    </style>

    <main className='main' style={{backgroundColor:"#1c73ca"}}>
    <header>
          <nav className={`navbar-color fixed-top navbar navbar-light navbar-expand-sm text-black`}>
            <div className="container">
              <a href="#about" className="navbar-brand"><img src="logo.jpg" style={{"height":"50px"}} /><span className="ms-3">BarinStrom</span></a>
              <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#mycollapse">
                  <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="mycollapse">
                <ul className="navbar-nav ms-auto">
                  {/* <li className="nav-item me-2"><a className='nav-link' href='#price'>สมัครสมาชิก</a></li> */}
                  <li className="nav-item me-2"><Link href='/login'><a className='nav-link' >เข้าสู่ระบบ</a></Link></li>
                </ul>
              </div>
            </div>
            
          </nav>
    </header>
      
      <section>
        <div style={{"height":"100px"}}></div>
        <div className='container'>
          <div className='row'>
            <div className="col-md-6">
              <div className="d-flex justify-content-center align-items-center h-100">
                  <div>
                    <h1 className="text-white">เว็บลงทะเบียนชุมนุม</h1>
                    <p className='text-white fs-4 mb-4'>หากคุณต้องการจัดการสมัครชุมนุมในโรงเรียน แอพของเราตอบโจทย์สำหรับคุณ
                      มีการจัดการต่างๆที่ดี มีฟีเจอร์ต่างๆ ที่ทำให้ผู้ใช้ไม่ว่าจะเป็นครูหรือนักเรียนใช้งานได้ง่ายและสะดวก
                    </p>
                    <Link href='#price'>
                      <a className='btn-register text-black'>สมัครสมาชิก</a>
                    </Link>
                    
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <img className='img-fluid homepage' src="homepage.png"/>
            </div>
          </div>
        </div>
      </section>

    <section id="about">
          <div className="container">
            <div className="row ">
              <h1 className='text-center display-4'>
                เกี่ยวกับเรา
              </h1>
            </div>
        <div className="row mt-3">
            <div className="col-md-6 ">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                magna aliqua.
              </p>
              <ul>
                  <li>Ullamco laboris nisi ut aliquip ex ea commodo consequat</li>
                  <li>Duis aute irure dolor in reprehenderit in voluptate velit</li>
                  <li>Ullamco laboris nisi ut aliquip ex ea commodo consequat</li>
              </ul>
            </div>
            <div className="col-md-6">
                <p className="text-center mt-3">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Reprehenderit adipisci distinctio quibusdam eos ut accusantium,
                dignissimos ab eveniet debitis nihil sequi, neque autem expedita voluptas molestiae.
                Hic itaque dolor eveniet?
              </p>
            </div>
          </div>
      </div>
    </section>
        
    <section id="price">
      <div className="container">
          <div className="row d-flex justify-content-center">
              <div className="col-10 text-white">
                  <h1 className="text-center">Pricing</h1>
                    <p className="text-center mt-3">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit adipisci distinctio quibusdam eos ut accusantium, dignissimos ab eveniet debitis nihil sequi, neque autem expedita voluptas molestiae. Hic itaque dolor eveniet?</p>
                </div>
            </div>
        </div>
    </section>


    <section className="mt-3 ">
        <div className="container d-flex justify-content-center">
            <div className="row" style={{"maxWidth":"900px","width":"100%" , "height":"400px"}}>
            
                <div className="col-lg-4 mt-3 mt-lg-0 mx-auto">
                    <div className="card text-black">
                        <div className="card-header">
                            <p className="text-center card-title">ปกติ</p>
                        </div>
                        <div className="card-body">
                            <p className="text-center">ค่าบำรุงรักษา <b>2500</b> บาท/ปี</p>
                            <p className="text-center">
                                มีค่าสมัครสมาชิก 5000 บาท<br />
                                <b>ปีแรก</b>ไม่มีค่าบำรุงรักษา<br />
                                ใช้งานระบบได้ทุกส่วน<br />
                            </p>
                        </div>
                        <div className="d-flex justify-content-center pb-3">
                          <Link href='/register'><a className="btn btn-primary d-block w-75" >สมัครสมาชิก</a></Link>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </section>
</main>
    </>
  )
}
