/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';
import ErrorPage from "next/error";
import { paginationStudent , update_student } from '../../utils/auth';

export default function EditStudent({ school_data,schoolID }) {

    const [data,setData] = useState(null)
    const [paginate,setPaginate] = useState(null)
    const [displayError,setDisplayError] = useState(false)
    const [reloadTable,setReloadTable] = useState(false)
    const search = useRef()

    const firstname = useRef()
    const lastname = useRef()
    //const email = useRef()
    const tel = useRef()
    const classYear = useRef()
    const enteredYear = useRef()

    const cookie = new Cookies()
    const token = cookie.get("token")
    
    const reload = (
        <main style={{height:"400px"}}>
            <div className="d-flex justify-content-center h-100 align-items-center">
                <div className="fs-4">loading ...</div>
                <div className="spinner-border ms-3"></div>
            </div>
        </main>
    )

    useEffect(()=>{
        window.localStorage.removeItem("searchEditStudent")
        window.localStorage.removeItem("pageEditStudent")
        const body = {
            "page":1,
        }
        window.localStorage.setItem("pageEditStudent",1)
        
        paginationStudent(body,token,schoolID).then(result => {
            //console.log(result.data)
            if (!result){
                setDisplayError(true)
            }else{
                const paginate_tmp = generate(result.data)
                setDisplayError(false)
                showData(result.data.docs)
                showPaginate(paginate_tmp)
            }
        })
    },[])

    function detailInfo(item,ev){
		firstname.current.setAttribute("user-id",ev.target.getAttribute("data-bs-id"))
        firstname.current.value = item.firstname
        lastname.current.value = item.lastname
        //email.current.value = item.email
        tel.current.value = item.tel
        classYear.current.value = item.classYear
        enteredYear.current.value = item.enteredYear
    }

    async function updateStudent(){
        const body = {
            userID:firstname.current.getAttribute("user-id"),
            firstname:firstname.current.value,
            lastname:lastname.current.value,
            tel:tel.current.value,
            classYear:classYear.current.value,
            enteredYear:enteredYear.current.value,
        }
        
        try{
            const result_update = await update_student(body,token,schoolID)
            if (!result_update){
                Swal.fire({
                    icon: 'error',
                    title: 'แก้ไขข้อมูลไม่สำเร็จ',
                    showConfirmButton:true,
                    confirmButtonColor:"#ce0303"
                })
                return
            }else if (result_update.status === 200){
                Swal.fire({
                    icon: 'success',
                    title: 'แก้ไขข้อมูลเสร็จสิ้น',
                    showConfirmButton:true,
                    confirmButtonColor:"#009431"
                })
                const body = {
                    "page":window.localStorage.getItem("pageEditStudent"),
                    "info":window.localStorage.getItem("searchEditStudent")
                }
                
                const result = await paginationStudent(body,token,schoolID)
                
                if (!result){
                    setDisplayError(true)
                }else{
                    
                    if (result.data.docs.length === 0){
                        window.localStorage.setItem("pageEditStudent",result.data.totalPages)
                        const body = {
                            "page":window.localStorage.getItem("pageEditStudent"),
                            "info":window.localStorage.getItem("searchEditStudent")
                        }
                        
                        const result_new = await paginationStudent(body,token,schoolID)
                        
                        if (!result_new){
                            setDisplayError(true)
                        }else{
                            const paginate_tmp = generate(result_new.data)
                            setDisplayError(false)
                            showData(result_new.data.docs)
                            showPaginate(paginate_tmp)
                        }
                    }else{
                        const paginate_tmp = generate(result.data)
                        setDisplayError(false)
                        showData(result.data.docs)
                        showPaginate(paginate_tmp)
                    }
                }
            }
        }catch(err){
            console.log(err)
        }
    }

    async function clickReset(ev){
        ev.preventDefault()
        window.localStorage.removeItem("searchEditStudent")
        window.localStorage.setItem("pageEditStudent",1)

        search.current.value = ""
        
        const body = {
            "page":1
        }
        
        const result = await paginationStudent(body,token,schoolID)
        
        if (!result){
            setDisplayError(true)
        }else{
            const paginate_tmp = generate(result.data)
            setDisplayError(false)
            showData(result.data.docs)
            showPaginate(paginate_tmp)
        }
    }
    
    /* กรณี search ข้อมูลต่างๆ */
    async function clickAccept(ev){
        ev.preventDefault()
        let body
        
        if (!search.current.value){
            window.localStorage.removeItem("searchEditStudent")
            body = {"page":1}
        }else{
            window.localStorage.setItem("pageEditStudent",1)
            window.localStorage.setItem("searchEditStudent",search.current.value)

            body = {
                "page":1,
                "query":window.localStorage.getItem("searchEditStudent")
            }
        }
        
        const result = await paginationStudent(body,token,schoolID)
        
        if (!result){
            setDisplayError(true)
        }else{
            const paginate_tmp = generate(result.data)
            setDisplayError(false)
            showData(result.data.docs)
            showPaginate(paginate_tmp)
        }
    }
    
    function generate(result){
        const paginate_tmp = []
        if (result.hasPrevPage && result.page - 5 >= 1){
            paginate_tmp.push(<button className='page-link' onClick={()=> clickPage(parseInt(result.page)-5)}><i className="fa-solid fa-angles-left"></i></button>)    
        }else{
            paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angles-left"></i></button>)
        }
        
        if (result.hasPrevPage){
            paginate_tmp.push(<button className='page-link' onClick={()=> clickPage(parseInt(result.page)-1)}><i className="fa-solid fa-angle-left"></i></button>)    
        }else{
            paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angle-left"></i></button>)
        }
        
        paginate_tmp.push(<button className='page-link disabled'>{result.page}</button>)
        
        if (result.hasNextPage){
            paginate_tmp.push(<button className='page-link' onClick={()=> clickPage(parseInt(result.page)+1)}><i className="fa-solid fa-angle-right"></i></button>)    
        }else{
            paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angle-right"></i></button>)
        }

        if (result.hasNextPage && result.page + 5 <= result.totalPages){
            paginate_tmp.push(<button className='page-link' onClick={()=> clickPage(parseInt(result.page)+5)}><i className="fa-solid fa-angles-right"></i></button>)    
        }else{
            paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angles-right"></i></button>)
        }
        return paginate_tmp
    }

    
    async function clickPage(page){
        
        const body = {
            "page":page,
            "query":window.localStorage.getItem("searchEditStudent")
        }
        
        
        window.localStorage.setItem("pageEditStudent",page)
        
        setReloadTable(true)
        const result = await paginationStudent(body,token,schoolID)
        setReloadTable(false)
        
        if (!result){
            setDisplayError(true)
        }else{
            const paginate_tmp = generate(result.data)
            setDisplayError(false)
            showData(result.data.docs)
            showPaginate(paginate_tmp)
        }
    }

    function showData(result){
        const template = (
            <table className='table align-middle'>
                <thead>
                    <tr>
                        <th style={{width:"500px"}}>ชื่อ-นามสกุล</th>
                        <th className='text-end' style={{width:"500px",marginRight:"10px"}}><span style={{marginRight:"3px"}}>รายละเอียด</span></th>
                    </tr>
                </thead>
                <tbody>
                    {result.map((item,index) => {
                        return (
                            <tr key={index}>
                                <td>{item.firstname} {item.lastname}</td>
                                <td className='text-end'>
                                    <button className='btn btn-info btn-sm' 
                                        onClick={(ev) => detailInfo(item,ev)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#editStudentModal"
                                        data-bs-id={item.userID}
                                        >รายละเอียด
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            
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

    if (!school_data.paymentStatus) {
        return <ErrorPage statusCode={404} />;
    }else if (displayError){
        return <div className='text-center'>ระบบเกิดข้อผิดพลาดไม่สามารถแสดงข้อมูลได้</div>
    }else{
        return (
            <>
                <div>
                    <h3 className="text-center fs-1 mb-3">แก้ไขข้อมูลนักเรียน</h3>
                    <div className='row'>
                        <div className='col-12'>
                            <form className='mb-3'>
                                <div className='input-group'>
                                    <span className="input-group-text">ค้นหา</span>
                                    <input type="text" className='form-control' ref={search}></input>
                                    <button className='btn btn-success' onClick={(ev) => clickAccept(ev)}>ยืนยัน</button>
                                    <button className='btn btn-danger' onClick={(ev) => clickReset(ev)}>รีเซต</button>
                                </div>
                            </form>
                        </div>
                        <div className='col-12'>
                            {reloadTable ? reload : data}
                        </div>
                    </div>
                    {paginate}
                </div>
    
                <div className="modal fade" id="editStudentModal">
                    <div className="modal-dialog">
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h3 className="modal-title">แบบฟอร์มแก้ไขข้อมูลนักเรียน</h3>
                                <button className='btn-close' data-bs-dismiss="modal"></button>
                            </div>
                            <div className='modal-body'>
                                <form className="row gy-2 gx-3">
                                    <div className="col-12">
                                        <label className="form-label">ชื่อ</label>
                                        <input type="text" className="form-control" ref={firstname}/>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">นามสกุล</label>
                                        <input type="text" className="form-control" ref={lastname}/>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="form-label">โทรศัพท์มือถือ</label>
                                        <input type="tel" className="form-control" ref={tel}/>
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="form-label">ชั้นปีที่</label>
                                        <input type="number" className="form-control" min="1" max="6" ref={classYear}/>
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="form-label">ปีการศึกษา</label>
                                        <input type="number" className="form-control" min={school_data.nowSchoolYear} ref={enteredYear}/>
                                    </div>
                                </form>
                            </div>
                            <div className='modal-footer'>
                                <button className='btn btn-danger' data-bs-dismiss="modal">ยกเลิก</button>
                                <button className='btn btn-success' data-bs-dismiss="modal" onClick={()=> updateStudent()}>ตกลง</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}