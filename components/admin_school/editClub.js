/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import ErrorPage from "next/error";
import { useRouter } from 'next/router';
import { paginationClub } from '../../utils/auth';
import { update_club } from '../../utils/school_admin/edit_data';
import Cookies from 'universal-cookie';

const reload = (
    <main style={{height:"400px"}}>
        <div className="d-flex justify-content-center h-100 align-items-center">
            <div className="fs-4">loading ...</div>
            <div className="spinner-border ms-3"></div>
        </div>
    </main>
)

export default function EditClub({ school_data,schoolID }) {
    const router = useRouter()
    const [reloadTable,setReloadTable] = useState(false)
    
    const [data,setData] = useState(null)
    const [paginate,setPaginate] = useState(null)
    const [displayError,setDisplayError] = useState(false)
    const search = useRef()

    const clubName = useRef()
    const clubInfo = useRef()
    const groupID = useRef()
    const category = useRef()
    const limitStudent = useRef()
    const schoolYear = useRef()
    const scheduleStart = useRef()
    const scheduleEnd = useRef()
    
    const cookie = new Cookies()
    const token = cookie.get("token")
    // console.log(token)

    useEffect(()=>{
        window.localStorage.removeItem("searchEditClub")
        window.localStorage.removeItem("pageEditClub")
        const body = {
            "page":1,
        }
        window.localStorage.setItem("pageEditClub",1)
        
        
        paginationClub(body, token, schoolID).then(result => {
            console.log(result.data)
            
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
		clubName.current.setAttribute("data-clubid",ev.target.getAttribute("data-bs-clubid"))
        clubName.current.value = item.clubName
        clubInfo.current.value = item.clubInfo
        category.current.value = item.category
        limitStudent.current.value = item.limit
        schoolYear.current.value = item.schoolYear
        groupID.current.value = item.groupID
        
            
        let [ schedule ] = item.schedule // [ "17.02.00-18.02.00"]
        let [ startTime ,endTime ] = schedule.split("-")
        scheduleStart.current.value = startTime
        scheduleEnd.current.value = endTime
    }

    async function updateStudent(){
        const body_update = {
            clubID: clubName.current.getAttribute("data-clubid"),
            clubName:clubName.current.value,
            clubInfo:clubInfo.current.value ,
            category:category.current.value ,
            limit: limitStudent.current.value ,
            schoolYear: schoolYear.current.value ,
            groupID: groupID.current.value,
            schedule: [ String(scheduleStart.current.value)  + "-" + String(scheduleEnd.current.value) ]
        }
        
        try{
            const result_update = await update_club(body_update,token,schoolID)
            
            if (result_update.status === 200){
                const body = {
                    "page":window.localStorage.getItem("pageEditClub"),
                    "query":window.localStorage.getItem("searchEditClub")
                }
                
                const result = await paginationClub(body,token,schoolID)
                
                if (!result){
                    setDisplayError(true)
                }else{
                    if (result.data.docs.length === 0){
                        window.localStorage.setItem("pageEditClub",result.data.totalPages)
                        
                        const body = {
                            "page":window.localStorage.getItem("pageEditClub"),
                            "query":window.localStorage.getItem("searchEditClub")
                        }
                        const result_new = await paginationClubEdit(body)
                        
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
        window.localStorage.removeItem("searchEditClub")
        window.localStorage.setItem("pageEditClub",1)

        search.current.value = ""
        
        const body = {
            "page":1
        }
        
        const result = await paginationClub(body,token,schoolID)
        
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
            window.localStorage.removeItem("searchEditClub")
            body = {"page":1}
        }else{
            window.localStorage.setItem("pageEditClub",1)
            window.localStorage.setItem("searchEditClub",parseInt(search.current.value))
            body = {
                "page":1,
                "query":window.localStorage.getItem("searchEditClub")
            }
        }
        
        const result = await paginationClub(body,token,schoolID)
        
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
            "page":page,
            "query":window.localStorage.getItem("searchEditClub")
        }
        
        window.localStorage.setItem("pageEditClub",page)
        
        setReloadTable(true)
        const result = await paginationClub(body,token,schoolID)
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
                        <th style={{width:"100px"}}>รหัสวิชา</th>
                        <th style={{width:"250px"}}>ชื่อชุมนุม</th>
                        <th className='text-center text-sm-end' style={{width:"250px"}}>รายชื่อนักเรียน</th>
                        <th className='text-center text-sm-end' style={{width:"100px"}}>แก้ไขข้อมูล</th>
                    </tr>
                </thead>
                <tbody>
                    {result.map((item,index) => {
                        return (
                            <tr key={index}>
                                <td>{item.groupID}</td>
                                <td>{item.clubName}</td>
                                <td className='text-center text-sm-end'>
                                    <button className='btn btn-warning btn-sm me-0 me-sm-3'
                                        onClick={()=> router.push(`/${schoolID}/admin/studentList`)}
                                    >รายชื่อ
                                    </button>
                                </td>
                                <td className='text-center text-sm-end'>
                                    <button className='btn btn-info btn-sm me-0 me-sm-2' 
                                        onClick={(ev) => detailInfo(item,ev)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#editClubModal"
                                        data-bs-clubid={item._id}
                                    >แก้ไข
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
        return (
            <>
                <div className='text-center'>ระบบเกิดข้อผิดพลาดไม่สามารถแสดงข้อมูลได้</div>
            </>
        )
    }else{
        return (
            <>
                <div>
                    <div className="text-center fs-1 mb-3">แก้ไขข้อมูลคลับ</div>
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
                            {reloadTable ? reload  : data}
                        </div>
                    </div>
                    {paginate}
                </div>
    
                <div className="modal fade" id="editClubModal">
                    <div className="modal-dialog">
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h3 className="modal-title">แบบฟอร์มเพิ่มข้อมูลชุมนุม</h3>
                                <button className='btn-close' data-bs-dismiss="modal"></button>
                            </div>
                            <div className='modal-body'>
                                <form className="row gy-2 gx-3">
                                <div className="col-12">
									<label className="form-label">ชื่อคลับ</label>
									<input type="text" className="form-control" ref={clubName}/>
								</div>
								<div className="col-12">
									<label className="form-label">รหัสวิชา</label>
									<input type="text" className="form-control" ref={groupID}/>
								</div>
								<div className="col-12">
									<label className="form-label">category</label>
                                    <input type="text" className='form-control' ref={category}/>
								</div>
								<div className="col-12">
									<label className="form-label">รายละเอียดคลับ</label>
									<textarea className="form-control" rows="3" ref={clubInfo} />
								</div>
								<div className="col-sm-6">
									<label className="form-label">จำนวนนักเรียนสูงสุด</label>
									<input type="number" className="form-control" ref={limitStudent}/>
								</div>
								<div className="col-sm-6">
									<label className="form-label">ปีการศึกษา</label>
									<input type="number" className="form-control" min={school_data.nowSchoolYear} ref={schoolYear}/>
								</div>
								<div className="col-sm-6">
									<label className="form-label">เวลาเริ่ม</label>
                                    <input type="time" className="form-control mt-3" name="startTime" ref={scheduleStart}></input>
								</div>
								<div className="col-sm-6">
									<label className="form-label">เวลาจบ</label>
                                    <input type="time" className="form-control mt-3" name="endTime" ref={scheduleEnd}></input>
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