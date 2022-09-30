/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { get_not_approved } from '../../utils/system_admin/system';
import Cookies from "universal-cookie";
import Swal from 'sweetalert2';


export default function NotApproved() {
    const [reloadTable,setReloadTable] = useState(false)
	const [data,setData] = useState([])
    const [paginate,setPaginate] = useState([])
    const [displayError,setDisplayError] = useState(false)
    const search = useRef()

    useEffect(()=>{
        window.localStorage.removeItem("searchNotApproved")
        window.localStorage.removeItem("pageNotApproved")
        
        const body = {
            "page" : 1
        }
        window.localStorage.setItem("pageNotApproved",1)
        
        const cookies = new Cookies();
		const token = cookies.get("token");
        
        get_not_approved(body,token).then(result => {
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
    }, [])
    
    const reload = (
        <main style={{height:"400px"}}>
            <div className="d-flex justify-content-center h-100 align-items-center">
                <div className="fs-4">loading ...</div>
                <div className="spinner-border ms-3"></div>
            </div>
        </main>
    )

    async function clickReset(ev){
        ev.preventDefault()
        window.localStorage.removeItem("searchNotApproved")
        search.current.value = ""

        const cookies = new Cookies();
		const token = cookies.get("token");
        const result = await get_not_approved({"page":1},token)
        
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
            window.localStorage.removeItem("searchNotApproved")
            body = {"page":1}
        }else{
            window.localStorage.setItem("searchNotApproved",search.current.value)
            body = {
                "page":1,
                "query":window.localStorage.getItem("searchNotApproved")
            }
        }
        
        const cookies = new Cookies();
		const token = cookies.get("token");
        const result = await get_not_approved(body,token)
        
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
            "query":window.localStorage.getItem("searchNotApproved")
        }
        window.localStorage.setItem("pageNotApproved",page)
        
        const cookies = new Cookies();
        const token = cookies.get("token");
        
        setReloadTable(true)
        const result = await get_not_approved(body, token)
        setReloadTable(false)
        
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
                <table className='table table-striped align-middle'>
                <thead>
                    <tr>
                        <th style={{width:"100px"}}>schoolID</th>
                        <th style={{width:"400px"}}>schoolName</th>
                        <th style={{width:"400px"}} className="text-end"><span className='me-2'>Approve</span></th>
                    </tr>
                </thead>
                <tbody>
                    {result.map((item,index) => {
                        return (
                            <tr key={index}>
                            <td><span>{item.schoolID}</span></td>
                            <td><span>{item.schoolName}</span></td>
                            <td className="text-end">
                                <button className='btn btn-primary' 
                                    onClick={()=> approveSchool(item)}>
                                    approve
                                </button>
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </table> 
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
                    <div className="text-center fs-1 mb-3">Not Approve</div>
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
                            {reloadTable ? reload  : data}
                        </div>
                    </div>
                    {paginate}
                </div>
            </>
        )
    }
    
}