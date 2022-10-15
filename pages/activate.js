import React from 'react'
import { useRouter } from "next/router"
import Error from "next/error";
import { useEffect } from 'react';
import Reload from '../components/reload';
import { is_activate } from '../utils/unauth';
import { useState } from 'react';

export default function CheckStatus() {
    const router = useRouter()
    const [status,setStatus] = useState("loading")

    useEffect(() => {
        const body = {token: router.query.token}
        
        is_activate(body).then((res) => {
            if (res[1]) {
                setStatus(res[0].data.status)
            }
            else {
                setStatus("error")
            }
        })
    },[])

    function comeback(){
        router.push("/")
    }

    const success_page = (
    <>
        <style jsx>{`
            main{
                min-height: 100vh;
                display:flex;
                justify-content: center;
                align-items: center;
            }
            
            .status {
                color: #88B04B;
                font-weight: bold;
                font-size: 50px;
                margin-bottom: 10px;
                margin-top:10px
            }
            p {
                color: #404F5E;
                font-size:24px;
                text-align:center;
            }
            
            i{
                color: #9ABC66;
                font-size: 100px;
            }
            
            .block {
                max-width:500px;
                width:100%;
                background-color: white;
                padding: 60px;
                border-radius: 4px;
                box-shadow: 2px 2px 5px #C8D0D8;
                display:flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .circle {
                border-radius: 50%;
                height:200px; 
                width:200px;
                background: #F8FAF5;
                display:flex;
                justify-content: center;
                align-items: center;
            }

            .comeback_login{
                border:none;
                background-color:#9ABC66;
                color:white;
                padding:10px;
                border-radius:8px
            }

            @media screen and (max-width:500px){
                .block {
                    background-color: white;
                    padding: 60px;
                    border-radius: 0;
                    box-shadow: 0 0 0 #ffff;
                }
            }
        
        `}</style>
        <main>
            <div className="block">
                <div className="circle">
                    <i>✓</i>
                </div>
                <h1 className="status">Success</h1>
                <p>คุณยืนยันอีเมลล์เสร็จสิ้น</p>
                <button className='comeback_login' onClick={comeback}>กลับหน้าหลัก</button>
            </div>
        </main>
        
    </>
    )
    
    const fail_page = (
        <>
            <style jsx>{`
                main{
                    min-height: 100vh;
                    display:flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .status {
                    color: rgb(253, 93, 93);
                    font-weight: bold;
                    font-size: 50px;
                    margin-bottom: 10px;
                    margin-top:10px
                }
                p {
                    color: #404F5E;
                    font-size:24px;
                    text-align:center;
                }
                
                i{
                    color: rgb(253, 93, 93);
                    font-size: 100px;
                }
                
                .block {
                    max-width:500px;
                    width:100%;
                    background-color: white;
                    padding: 60px;
                    border-radius: 4px;
                    box-shadow: 2px 2px 5px #C8D0D8;
                    display:flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .circle {
                    border-radius: 50%;
                    height:200px; 
                    width:200px;
                    background: #F8FAF5;
                    display:flex;
                    justify-content: center;
                    align-items: center;
                }

                .comeback_login{
                    border:none;
                    background-color:rgb(253, 93, 93);
                    color:white;
                    padding:10px;
                    border-radius:8px
                }

                @media screen and (max-width:500px){
                    .block {
                        background-color: white;
                        padding: 60px;
                        border-radius: 0;
                        box-shadow: 0 0 0 #fff;
                    }
                }
            `}</style>
            
            <main>
                <div className="block">
                    <div className="circle">
                        <i>✗</i>
                    </div>
                    <h1 className="status">fail</h1>
                    <p>ยืนยันอีเมลล์ไม่สำเร็จ</p>
                    <button className='comeback_login' onClick={comeback}>กลับหน้าหลัก</button>
                </div>
            </main>

        </>
    )
    
    if (status === "loading") {
        return <Reload />
    }
    else if (status === "error") {
        return <Error statusCode={404}/>
    }
    else if (!status) {
        return fail_page
    }
    else{
        return success_page
    }
    
}

export async function getServerSideProps() {
    return {
        props: {}
    }
}
