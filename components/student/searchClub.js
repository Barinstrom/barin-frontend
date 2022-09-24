/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useRouter } from 'next/router';
import { paginationClub} from '../../utils/auth';
import Cookies from 'universal-cookie';

export default function EditClub({schoolID }) {
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
        window.localStorage.removeItem("studentSearchClub")
        window.localStorage.removeItem("studentPageClub")
        const body = {
            "page":1,
        }
        window.localStorage.setItem("studentPageClub",1)
        
        // console.log("Club ",token)
        paginationClub(body, token, schoolID).then(result => {
            console.log(result)
            
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

    function detailInfo(item){
		//console.log(ev.target.getAttribute("data-bs-id"))
        //clubName.current.setAttribute("data-clubid",ev.target.getAttribute("data-bs-clubid"))
        clubName.current.innerText = item.clubName
        clubInfo.current.innerText = item.clubInfo
        category.current.innerText = item.category
        limitStudent.current.innerText = item.limit + " คน"
        schoolYear.current.innerText = item.schoolYear
        groupID.current.innerText = item.groupID
        
            
        let [ schedule ] = item.schedule // [ "17.02.00-18.02.00"]
        let [ st ,en ] = schedule.split("-")
        scheduleStart.current.innerText = st + " นาฬิกา"
        scheduleEnd.current.innerText = en + " นาฬิกา"
    }

    async function applyClub(){
        /* const body = {
            clubID: clubName.current.getAttribute("data-clubid"),
            clubName:clubName.current.value,
            clubInfo:clubInfo.current.value ,
            category:category.current.value ,
            limit: limitStudent.current.value ,
            schoolYear: schoolYear.current.value ,
            groupID: groupID.current.value,
            schedule: [ String(scheduleStart.current.value)  + "-" + String(scheduleEnd.current.value) ]
        }
        
        console.log(body)
        try{
            const result = await edit_club(body,token,schoolID)

            if (result.status === 200){
                const body = {
                    "page":window.localStorage.getItem("studentPageClub"),
                    "query":window.localStorage.getItem("studentSearchClub")
                }
                
                const result = await paginationClub(body,token,schoolID)
                
                if (!result){
                    setDisplayError(true)
                }else{
                    if (result.data.docs.length === 0){
                        window.localStorage.setItem("studentPageClub",result.data.totalPages)
                        
                        const body = {
                            "page":window.localStorage.getItem("studentPageClub"),
                            "query":window.localStorage.getItem("studentSearchClub")
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
        } */
    }

    async function clickReset(ev){
        ev.preventDefault()
        window.localStorage.removeItem("studentSearchClub")
        window.localStorage.setItem("studentPageClub",1)

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
            window.localStorage.removeItem("studentSearchClub")
            body = {"page":1}
        }else{
            window.localStorage.setItem("studentPageClub",1)
            window.localStorage.setItem("studentSearchClub",search.current.value)
            body = {
                "page":1,
                "query":window.localStorage.getItem("studentSearchClub")
            }
        }
        
        const result = await paginationClub(body,token,schoolID)
        console.log(result)
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
            "query":window.localStorage.getItem("studentSearchClub")
        }
        
        window.localStorage.setItem("studentPageClub",page)
        
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
                                <button className='btn btn-info' 
                                    onClick={(ev) => detailInfo(item,ev)}
                                    data-bs-toggle="modal"
                                    data-bs-target="#editClubModal"
                                    data-bs-clubid={item._id}
                                >ดูรายละเอียด
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

    if (displayError){
        return (
            <>
                <div className='text-center'>ระบบเกิดข้อผิดพลาดไม่สามารถแสดงข้อมูลได้</div>
            </>
        )
    }else{
        return (
            <>
                <div>
                    <div className="text-center fs-1 mb-3">searchClub</div>
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
                            <table className='table table-striped text-center align-middle table-bordered'>
                                <thead>
                                    <tr>
                                        <th style={{width:"400px"}}>ชื่อชุมนุม</th>
                                        <th style={{width:"400px"}}>รหัสวิชา</th>
                                        <th style={{width:"200px"}}>ลงทะเบียน</th>
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
                                <h3 className="modal-title">รายละเอียดชุมนุม</h3>
                                <button className='btn-close' data-bs-dismiss="modal"></button>
                            </div>
                            <div className='modal-body'>
                                <div className="row">
                                    <div className="col-12">
                                        <p>ชื่อคลับ : &nbsp;
                                            <span ref={clubName}></span>
                                        </p>
                                    </div>
                                    <div className="col-12">
                                        <p>รหัสวิชา : &nbsp;
                                            <span ref={groupID}></span>
                                        </p>
                                    </div>
                                    <div className="col-12">
                                        <p>category : &nbsp;
                                            <span ref={category}></span>
                                        </p>
                                    </div>
                                    <div className="col-12">
                                        <p>รายละเอียดคลับ : &nbsp;
                                            <span ref={clubInfo}></span>
                                        </p>
                                    </div>
                                    <div className="col-12">
                                        <p>จำนวนที่รับ : &nbsp;
                                            <span ref={limitStudent}></span>
                                        </p>
                                    </div>
                                    <div className="col-12">
                                        <p>ปีการศึกษา : &nbsp;
                                            <span ref={schoolYear}></span>
                                        </p>
                                    </div>
                                    <div className="col-12">
                                        <p>เวลาเรียน : &nbsp;
                                            <span ref={scheduleStart}></span>
                                        </p>
                                    </div>
                                    <div className="col-12">
                                        <p>เวลาเลิกเรียน: &nbsp;
                                            <span ref={scheduleEnd}></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='modal-footer'>
                                <button className='btn btn-danger' data-bs-dismiss="modal">ยกเลิก</button>
                                <button className='btn btn-success' data-bs-dismiss="modal" onClick={()=> applyClub()}>สมัครชุมนุม</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}