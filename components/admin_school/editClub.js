/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import ErrorPage from "next/error";
import { useRouter } from 'next/router';
import { paginationClub, get_teachers_inclub, getTeacherName } from '../../utils/auth';
import { update_club } from '../../utils/school_admin/edit_data';
import ReviewDelete from '../student/reviewmodal_candelete';
import Cookies from 'universal-cookie';
import Swal from "sweetalert2";

export default function EditClub({ school_data,schoolID }) {
    const router = useRouter()
    const [reloadTable,setReloadTable] = useState(false)
    
    const [data,setData] = useState(null)
    const [paginate,setPaginate] = useState(null)
    const [displayError, setDisplayError] = useState(false)
    const [notShowAlert, setNotShowAlert] = useState(0)

    const search = useRef()

    const clubName = useRef()
    const clubInfo = useRef()
    const groupID = useRef()
    const category = useRef()
    const limitStudent = useRef()
    const schoolYear = useRef()
    const scheduleStart = useRef()
    const scheduleEnd = useRef()
    const teacherName = useRef()
    const day = useRef()
    const teacherEmail = useRef()
    
    const cookie = new Cookies()
    const token = cookie.get("token")
    
    const reload = (
        <main style={{ height: "400px" }}>
            <div className="d-flex justify-content-center h-100 align-items-center">
                <div className="fs-4">loading ...</div>
                <div className="spinner-border ms-3"></div>
            </div>
        </main>
    )

    const alert = (
        <div className="alert alert-dark" role="alert">
            ไม่พบชุมนุม
        </div>
    )

    useEffect(()=>{
        window.localStorage.removeItem("searchEditClub")
        window.localStorage.removeItem("pageEditClub")
        const body = {
            "page":1,
        }
        window.localStorage.setItem("pageEditClub",1)

        setReloadTable(true)
        paginationClub(body, token, schoolID).then(result => {
            setReloadTable(false)
            if (!result){
                setDisplayError(true)
            }else{
                const paginate_tmp = generate(result.data)
                setDisplayError(false)
                showData(result.data.docs)
                showPaginate(paginate_tmp)
                setNotShowAlert(result.data.totalDocs)
            }
        })
    },[])

    function detailInfo(item, ev) {
        console.log(item)
        clubName.current.setAttribute("data-clubid",ev.target.getAttribute("data-bs-clubid"))
        clubName.current.value = item.clubName
        clubInfo.current.value = item.clubInfo
        category.current.value = item.category
        limitStudent.current.value = item.limit
        schoolYear.current.value = item.schoolYear
        groupID.current.value = item.groupID
        teacherEmail.current.value = item.teacherEmail
        
        let [day_tmp, schedule] = item.schedule[0].split(" ") // [ "17.02.00-18.02.00"]
        const english_day = {
            "วันจันทร์":"monday",
            "วันอังคาร":"tuesday",
            "วันพุธ":"wednesday",
            "วันพฤหัสบดี": "thurday",
            "วันศุกร์": "friday",
            "วันเสาร์": "saturday",
            "วันอาทิตย์": "sunday"
        }

        day.current.value = String(english_day[day_tmp]) //"วันจันทร์"
        let [ startTime ,endTime ] = schedule.split("-")
        scheduleStart.current.value = startTime
        scheduleEnd.current.value = endTime

        teacherName.current.innerText = ""
        getTeacherName(item, token, schoolID).then(result => {
            if (!result){
                teacherName.current.innerText = "ไม่มีชื่อครูผู้สอน"
            }
            else if (!result.data) {
                teacherName.current.innerText = "ไม่มีชื่อครูผู้สอน"
            }
            else if (result.data) {
                const {firstname , lastname} = result.data._teacher
                teacherName.current.innerText = `${firstname} ${lastname}`
            }else {
                teacherName.current.innerText = "ไม่มีชื่อครูผู้สอน"
            }
        })
		
    }

    async function updateClub() {
        if (clubName.current.value === "" || clubInfo.current.value === "" || groupID.current.value === "" || category.current.value === "" || limitStudent.current.value === "" || schoolYear.current.value === "" || scheduleStart.current.value === "" || scheduleEnd.current.value === "" || day.current.value === ""){
            Swal.fire({
				icon: 'warning',
				title: 'โปรดกรอกข้อมูลให้ครบถ้วน!',
				showConfirmButton: true,
				confirmButtonColor: "#f7a518",
				confirmButtonText: 'ok',
			})
            return
        }
        const th_day = {
            "monday": "วันจันทร์",
            "tuesday": "วันอังคาร",
            "wednesday": "วันพุธ",
            "thurday": "วันพฤหัสบดี",
            "friday": "วันศุกร์",
            "saturday": "วันเสาร์",
            "sunday": "วันอาทิตย์"
        }
        
        const body_update = {
            clubID: clubName.current.getAttribute("data-clubid"),
            clubName:clubName.current.value,
            clubInfo:clubInfo.current.value ,
            category:category.current.value ,
            limit: limitStudent.current.value ,
            schoolYear: schoolYear.current.value ,
            groupID: groupID.current.value,
            teacherEmail: teacherEmail.current.value,
            schedule: [th_day[String(day.current.value)] + " " + String(scheduleStart.current.value)  + "-" + String(scheduleEnd.current.value) ],
        }
        
        Swal.fire({
            icon:"question",
            title: "ยืนยันการแก้ไข",
            showConfirmButton: true,
            confirmButtonColor: "#0208bb",
            confirmButtonText: 'ok',

            showCancelButton: true,
            cancelButtonText: "cancel",
            cancelButtonColor: "#d93333",

            showLoaderOnConfirm: true,
            preConfirm: () => {
                return update_club(body_update,token,schoolID)
            },
            allowOutsideClick: false

        }).then((res) => {
            if (res.isConfirmed) {
                const result_update = res.value === "true" ? true : false
                if (!result_update) {
                    Swal.fire({
                        icon: 'error',
                        title: 'แก้ไขข้อมูลไม่สำเร็จ',
                        showConfirmButton: true,
                        confirmButtonColor: "#d1000a",
                        confirmButtonText: 'ok',
                    })
                    return
                }else {
                    Swal.fire({
                        icon: 'success',
                        title: 'แก้ไขข้อมูลสำเร็จ',
                        showConfirmButton:true,
                        confirmButtonColor:"#009431"
                    }).then(() => {
                        const body = {
                            "page":window.localStorage.getItem("pageEditClub"),
                            "query":window.localStorage.getItem("searchEditClub")
                        }
                        
                        paginationClub(body, token, schoolID).then((result) => {
                            if (!result){
                                setDisplayError(true)
                            }else{
                                if (result.data.docs.length === 0){
                                    window.localStorage.setItem("pageEditClub",result.data.totalPages)
                                    
                                    const body = {
                                        "page":window.localStorage.getItem("pageEditClub"),
                                        "query":window.localStorage.getItem("searchEditClub")
                                    }
                                    paginationClubEdit(body).then((result_new) => {
                                        if (!result_new){
                                            setDisplayError(true)
                                        }else{
                                            const paginate_tmp = generate(result_new.data)
                                            setDisplayError(false)
                                            showData(result_new.data.docs)
                                            setNotShowAlert(result_new.data.totalDocs)
                                            showPaginate(paginate_tmp)
                                        }
                                    })
                                }else{
                                    const paginate_tmp = generate(result.data)
                                    setDisplayError(false)
                                    showData(result.data.docs)
                                    setNotShowAlert(result.data.totalDocs)
                                    showPaginate(paginate_tmp)
                                }
                            }
                        })
                    })
                }
            }
        })
    }

    async function clickReset(ev){
        ev.preventDefault()
        window.localStorage.removeItem("searchEditClub")
        window.localStorage.setItem("pageEditClub",1)

        search.current.value = ""
        
        const body = {
            "page":1
        }
        
        setReloadTable(true)
        const result = await paginationClub(body,token,schoolID)
        setReloadTable(false)
        
        if (!result){
            setDisplayError(true)
        }else{
            const paginate_tmp = generate(result.data)
            setDisplayError(false)
            showData(result.data.docs)
            setNotShowAlert(result.data.totalDocs)
            showPaginate(paginate_tmp)
        }
    }
    
    async function clickAccept(ev){
        ev.preventDefault()
        let body
        
        if (!search.current.value){
            window.localStorage.removeItem("searchEditClub")
            window.localStorage.setItem("pageEditClub",1)
            body = {"page":1}
        }else{
            window.localStorage.setItem("pageEditClub",1)
            window.localStorage.setItem("searchEditClub",search.current.value)
            body = {
                "page":1,
                "query":window.localStorage.getItem("searchEditClub")
            }
        }
        
        setReloadTable(true)
        const result = await paginationClub(body,token,schoolID)
        setReloadTable(false)
        
        if (!result){
            setDisplayError(true)
        }else{
            const paginate_tmp = generate(result.data)
            setDisplayError(false)
            showData(result.data.docs)
            setNotShowAlert(result.data.totalDocs)
            showPaginate(paginate_tmp)
        }
    }
    
    function generate(result){
        const paginate_tmp = []
        if (result.totalPages <= 6){
			for (let i=1;i<=result.totalPages;i++){
				if (parseInt(result.page) === i){
					paginate_tmp.push(<button className='page-link disabled bg-primary bg-opacity-75 text-white'>{parseInt(result.page)}</button>)
				}else{
					paginate_tmp.push(<button className='page-link' onClick={() => clickPage((i))}>{i}</button>)
				}
			}
		}else{
			if (result.hasPrevPage) {
				paginate_tmp.push(<button className='page-link' onClick={() => clickPage(1)}><i className="fa-solid fa-angles-left"></i></button>)
				paginate_tmp.push(<button className='page-link' onClick={() => clickPage((parseInt(result.page) - 1))}><i className="fa-solid fa-angle-left"></i></button>)
			} else {
				paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angles-left"></i></button>)
				paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angle-left"></i></button>)
			}
	
			if (parseInt(result.page) > 3){
				paginate_tmp.push(<button className='page-link' onClick={() => clickPage((1))}>1</button>)
				paginate_tmp.push(<button className='page-link disabled'>...</button>)
			}

			paginate_tmp.push(<button className='page-link bg-primary bg-opacity-75 text-white disabled'>{parseInt(result.page)}</button>)
			for (let i=1;i<=2;i++){
				if (parseInt(result.page) + i < result.totalPages){
					paginate_tmp.push(<button className='page-link' onClick={() => clickPage((parseInt(result.page))+i)}>{parseInt(result.page)+i}</button>)
				}
			}
			
			if (parseInt(result.page) + 3 <= result.totalPages){
				paginate_tmp.push(<button className='page-link disabled'>...</button>)
			}

			if (parseInt(result.page) !== result.totalPages){
				paginate_tmp.push(<button className='page-link' onClick={() => clickPage((result.totalPages))}>{result.totalPages}</button>)
			}
			
			if (result.hasNextPage) {
				paginate_tmp.push(<button className='page-link' onClick={() => clickPage((parseInt(result.page) + 1))}><i className="fa-solid fa-angle-right"></i></button>)
				paginate_tmp.push(<button className='page-link' onClick={() => clickPage(result.totalPages)}><i className="fa-solid fa-angles-right"></i></button>)
			} else {
				paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angle-right"></i></button>)
				paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angles-right"></i></button>)
			}
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
            setNotShowAlert(result.data.totalDocs)
            showPaginate(paginate_tmp)
        }
    }

    function goStudentList(item,ev){
        const params_clubID = String(item._id)
        router.push(`/${schoolID}/admin_school/studentList/?clubID=${params_clubID}&clubName=${item.clubName}`)
    }

    function showData(result){
        const template = (
            <div className='table-responsive'>
                <style jsx>{`
					.detailinfo_btn{
						border:none;
						background-color:#004d99;
						color:white;
						border-radius:4px;
					}

                    .liststudent_btn{
						border:none;
						background-color:#9c4d0d;
						color:white;
						border-radius:4px;
					}
				`}</style>
                <table className='table align-middle'>
                    <thead>
                        <tr>
                            <th style={{width:"100px"}}>รหัสวิชา</th>
                            <th style={{width:"250px"}}>ชื่อชุมนุม</th>
                            <th style={{width:"150px"}}>ปีการศึกษา</th>
                            <th className='text-center ' style={{width:"100px"}}>รายชื่อนักเรียน</th>
                            <th className='text-center ' style={{ width: "80px" }}>แก้ไขข้อมูล</th>
                            <th className='text-center ' style={{ width: "80px" }}>จัดการรีวิว</th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.groupID}</td>
                                    <td>{item.clubName}</td>
                                    <td>{item.schoolYear}</td>
                                    <td className='text-center '>
                                        <button className='btn liststudent_btn btn-sm '
                                            onClick={(ev)=> goStudentList(item,ev)}
                                        >รายชื่อ
                                        </button>
                                    </td>
                                    <td className='text-center '>
                                        <button className='btn detailinfo_btn btn-sm ' 
                                            onClick={(ev) => detailInfo(item,ev)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#editClubModal"
                                            data-bs-clubid={item._id}
                                        >แก้ไข
                                        </button>
                                    </td>
                                    <td className="text-center">
                                        <ReviewDelete item={item} schoolID={schoolID} nowSchoolYear={school_data.nowSchoolYear} />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table> 
            </div>
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
                    <div className="text-center display-6 mb-3">
                        <span className=''>แก้ไขข้อมูลของชุมนุม</span>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <form className='mb-3'>
                                <div className='input-group'>
                                    <span className="input-group-text">ค้นหา</span>
                                    <input type="text" placeholder="ค้นหาด้วย ชื่อชุมนุม" className='form-control' ref={search}></input>
                                    <button className='btn' style={{backgroundColor:"#11620e",color:"#fff"}} onClick={(ev) => clickAccept(ev)}>ยืนยัน</button>
									<button className='btn' style={{backgroundColor:"#881b1b",color:"#fff"}} onClick={(ev) => clickReset(ev)}>รีเซต</button>
                                </div>
                            </form>
                            {reloadTable ? reload :
                                notShowAlert ? data : alert}
                        </div>
                    </div>
                    {reloadTable ? null :
                        notShowAlert ? paginate : null}
                </div>
    
                <div className="modal fade" id="editClubModal">
                    <div className="modal-dialog">
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h3 className="modal-title">แบบฟอร์มแก้ไขข้อมูลชุมนุม</h3>
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
                                        <label className="form-label">อีเมลผู้สอน</label>
                                        <input type="text" className="form-control" ref={teacherEmail} disabled/>
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
                                    <div className="col-12">
                                        <label className="form-label">วันที่สอน</label>
                                        <select className="form-select" ref={day}>
                                            <option value="monday">วันจันทร์</option>
                                            <option value="tuesday">วันอังคาร</option>
                                            <option value="wednesday">วันพุธ</option>
                                            <option value="thurday">วันพฤหัสบดี</option>
                                            <option value="friday">วันศุกร์</option>
                                            <option value="saturday">วันเสาร์</option>
                                            <option value="sunday">วันอาทิตย์</option>
                                        </select>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="form-label">เวลาเริ่ม</label>
                                        <input type="time" className="form-control mt-3" name="startTime" ref={scheduleStart}></input>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="form-label">เวลาจบ</label>
                                        <input type="time" className="form-control mt-3" name="endTime" ref={scheduleEnd}></input>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">ชื่อนามสกุลผู้สอน : &nbsp;<span ref={teacherName}></span></label>
                                    </div>
                                </form>
                            </div>
                            <div className='modal-footer'>
                                <button className='btn' style={{ backgroundColor:"#881b1b",color:"#fff"}} data-bs-dismiss="modal">ยกเลิก</button>
                                <button className='btn' style={{ backgroundColor:"#11620e",color:"#fff"}} data-bs-dismiss="modal" onClick={()=> updateClub()}>ตกลง</button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </>
        )
    }
}