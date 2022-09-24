/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import ErrorPage from "next/error";
import { useRouter } from 'next/router';
import { paginationClub,edit_club } from '../../utils/auth';
import Cookies from 'universal-cookie';

export default function EditClub({ school_data,schoolID }) {
    const router = useRouter()

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
        
        // console.log("Club ",token)
        paginationClub(body, token, schoolID).then(result => {
            console.log(result.data.docs)
            
            if (!result){
                setDisplayError(true)
            }else{
                const paginate_tmp = generate(result.data)
                setDisplayError(false)
                showData(result.data.docs)
                showPaginate(paginate_tmp)
            }
        })
        // console.log(school_data)
    },[])

    function detailInfo(item,ev){
		//console.log(ev.target.getAttribute("data-bs-id"))
        clubName.current.setAttribute("data-clubid",ev.target.getAttribute("data-bs-clubid"))
        clubName.current.value = item.clubName
        clubInfo.current.value = item.clubInfo
        category.current.value = item.category
        limitStudent.current.value = item.limit
        schoolYear.current.value = item.schoolYear
        groupID.current.value = item.groupID
        
            
        let [ schedule ] = item.schedule // [ "17.02.00-18.02.00"]
        let [ st ,en ] = schedule.split("-")
        scheduleStart.current.value = st
        scheduleEnd.current.value = en
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
        //console.log(body_update)
        
        try{
            const result_update = await edit_club(body_update,token,schoolID)
            //console.log(result_update)
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
    
    function changeDate(k){
        const t = new Date(Date.parse(k))
        const d = t.getDate() > 10 ? t.getDate(): '0'+t.getDate()
        const m = t.getMonth()+1 > 10 ? t.getMonth()+1: '0'+(t.getMonth()+1)
        return (
            <>
                {d}-{m}-{t.getFullYear()}
            </>
        )
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

    function showData(result){
        const template = (
            <tbody>
                {result.map((item,index) => {
                    return (
                        <tr key={index}>
                            <td>{item.clubName}</td>
                            <td>{item.groupID}</td>
                            <td>
                                <button className='btn btn-warning'
                                    onClick={()=> router.push(`/${schoolID}/admin/studentList`)}
                                >รายชื่อนักเรียน
                                </button>
                            </td>
                            <td>
                                <button className='btn btn-info' 
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
                    <div className="text-center fs-1 mb-3">EditClub</div>
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
                            <table className='table table-striped text-center align-middle'>
                                <thead>
                                    <tr>
                                        <th width="25%">ชื่อชุมนุม</th>
                                        <th width="25%">รหัสวิชา</th>
                                        <th width="25%">รายชื่อนักเรียน</th>
                                        <th width="25%">แก้ไข</th>
                                    </tr>
                                </thead>
                                {data}
                            </table> 
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
                                    <input type="time" className="form-control mt-3" name="endTime" ref={scheduleEnd }></input>
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