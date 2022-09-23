/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { get_pending } from '../../utils/system';
import Cookies from "universal-cookie";
import Swal from 'sweetalert2';


export default function Pending() {
	const [data,setData] = useState([])
    const [paginate,setPaginate] = useState([])
    const [displayError,setDisplayError] = useState(false)
    const search = useRef()

    useEffect(()=>{
        window.localStorage.removeItem("searchPending")
        window.localStorage.removeItem("pagePending")
        
        const body = {
            "page" : 1
        }
        window.localStorage.setItem("pagePending",1)
        
        const cookies = new Cookies();
		const token = cookies.get("token");
        
        get_pending(body,token).then(result => {
            console.log(result)
            if (!result){
                setDisplayError(true)
            }else{
                const paginate_tmp = generate(result)
                setDisplayError(false)
                showData(result.docs)
                showPaginate(paginate_tmp)
            }
        })
    },[])

    async function clickReset(ev){
        ev.preventDefault()
        window.localStorage.removeItem("searchPending")
        search.current.value = ""

        const cookies = new Cookies();
		const token = cookies.get("token");
        const result = await get_pending({"page":1},token)
        
        if (!result){
            setDisplayError(true)
        }else{
            const paginate_tmp = generate(result)
            setDisplayError(false)
            showData(result.docs)
            showPaginate(paginate_tmp)
        }
    }
    
    async function clickAccept(ev){
        ev.preventDefault()
        let body
        
        if (!search.current.value){
            window.localStorage.removeItem("searchPending")
            body = {"page":1}
        }else{
            window.localStorage.setItem("searchPending",search.current.value)
            body = {
                "page":1,
                "query":window.localStorage.getItem("searchPending")
            }
        }
        
        const cookies = new Cookies();
		const token = cookies.get("token");
        const result = await get_pending(body,token)
        
        if (!result){
            setDisplayError(true)
        }else{
            const paginate_tmp = generate(result)
            setDisplayError(false)
            showData(result.docs)
            showPaginate(paginate_tmp)
        }
    }
    
    function generate(result){
        const paginate_tmp = []
        if (result.hasPrevPage && result.page - 5 >= 1){
            paginate_tmp.push(<button className='page-link' onClick={()=> clickPage((result.page-5))}><i className="fa-solid fa-angles-left"></i></button>)    
        }else{
            paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angles-left"></i></button>)
        }
        
        if (result.hasPrevPage){
            paginate_tmp.push(<button className='page-link' onClick={()=> clickPage((result.page-1))}><i className="fa-solid fa-angle-left"></i></button>)    
        }else{
            paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angle-left"></i></button>)
        }
        
        paginate_tmp.push(<button className='page-link disabled'>{result.page}</button>)
        
        if (result.hasNextPage){
            paginate_tmp.push(<button className='page-link' onClick={()=> clickPage((result.page+1))}><i className="fa-solid fa-angle-right"></i></button>)    
        }else{
            paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angle-right"></i></button>)
        }

        if (result.hasNextPage && result.page + 5 <= result.totalPages){
            paginate_tmp.push(<button className='page-link' onClick={()=> clickPage((result.page+5))}><i className="fa-solid fa-angles-right"></i></button>)    
        }else{
            paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angles-right"></i></button>)
        }
        return paginate_tmp
    }

    
    async function clickPage(page){
        const body = {
            "page" : page,
            "query":window.localStorage.getItem("searchPending")
        }
        window.localStorage.setItem("pagePending",page)
        
        const cookies = new Cookies();
		const token = cookies.get("token");
        const result = await get_pending(body,token)
        
        if (!result){
            setDisplayError(true)
        }else{
            const paginate_tmp = generate(result)
            setDisplayError(false)
            showData(result.docs)
            showPaginate(paginate_tmp)
        }
    }

    function showData(result){
        const template = (
            <>
                {result.map((item,index) => {
                    return (
                        <tr key={index}>
                            <td className='pt-3'><span>{item.schoolID}</span></td>
                            <td className='pt-3'><span>{item.schoolName}</span></td>
                            <td className='py-2 text-end'>
                                <button className='btn btn-secondary' 
                                    onClick={()=> approveSchool(item)}>
                                    approve
                                </button>
                            </td>
                        </tr>
                    )
                })}
            </>
        )
        setData(template)
    }

    function showPaginate(paginate){
        const template = (
            <ul className='pagination justify-content-center'>
                {paginate.map((item,index)=>{
                    return (
                        <li key={index} className="page-item">
                            {item}
                        </li>
                    )
                })}
            </ul>
        )
        setPaginate(template)
    }

    function approveSchool(item){
        //console.log(item)
		Swal.fire({
            title: 'คุณต้องการยืนยันว่า approve โรงเรียนนี้ใช่หรือไม่',
            showConfirmButton: true,
            confirmButtonColor:"#3085d6",
            confirmButtonText:'ยืนยัน',
            
            showCancelButton: true,
            cancelButtonText:"ยกเลิก",
            cancelButtonColor:"#d93333",
        }).then((result) => {
            console.log(result)
            if (result.isConfirmed) {
              Swal.fire('ทำรายการสำเร็จ', '', 'success')
            }
          })
	}

    if (displayError){
        return <div className='text-center'>ระบบเกิดข้อผิดพลาดไม่สามารถแสดงข้อมูลได้</div>
    }else{
        return (
            <>
                <div>
                    <div className="text-center fs-1 mb-3">Pending</div>
                    <div className='row mb-4'>
                        <div className='col-12'>
                            <form className='mb-5'>
                                <div className='input-group'>
                                    <span className="input-group-text">ค้นหา</span>
                                    <input type="text" className='form-control' ref={search}></input>
                                    <button className='btn btn-success' onClick={(ev) => clickAccept(ev)}>ยืนยัน</button>
                                    <button className='btn btn-danger' onClick={(ev) => clickReset(ev)}>รีเซต</button>
                                </div>
                            </form>
                            <table className='table table-sm'>
                                <thead>
                                    <tr>
                                        <td>SchoolID</td>
                                        <td>ชื่อโรงเรียน</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data}
                                </tbody>
                                
                            </table> 
                        </div>
                    </div>
                    {paginate}
                </div>
            </>
        )
    }
    
}