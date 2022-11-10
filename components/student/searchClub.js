/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect , useState , useRef} from 'react';
import { useRouter } from 'next/router';
import { paginationClub, getTeacherName } from '../../utils/auth';
import { register_club,get_student_ownclub} from '../../utils/student/student';
import Cookies from 'universal-cookie';
import Swal from 'sweetalert2';
import Review from './reviewmodal_seeonly';


export default function EditClub({ schoolID, scheduled, inschedule, nowSchoolYear}) {
    const [reloadTable,setReloadTable] = useState(false)
    const [data,setData] = useState(null)
    const [paginate,setPaginate] = useState(null)
    const [displayError, setDisplayError] = useState(false)
    const [haveClubs, setHaveClubs] = useState(false)
    const [notShowAlert, setNotShowAlert] = useState(0)
    const [clubImg, setClubImg] = useState("")


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
    const teacherEmail = useRef()
    const day = useRef()
    
    const router = useRouter()
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
        window.localStorage.removeItem("studentSearchClub")
        window.localStorage.removeItem("studentPageClub")
        const body = {
            "page":1,
        }
        window.localStorage.setItem("studentPageClub", 1)
        const sc_Year = {
            nowSchoolYear : nowSchoolYear
        }

        setReloadTable(true)
        Promise.all([paginationClub(body, token, schoolID), get_student_ownclub(sc_Year,token, schoolID)])
            .then(result => {
                console.log(result)
                setReloadTable(false)
                if (!result[0]){
                    setDisplayError(true)
                }else{
                    result[1].data.clubs.length!=0 ? setHaveClubs(true) : setHaveClubs(false)
                    const paginate_tmp = generate(result[0].data)
                    setDisplayError(false)
                    showData(result[0].data.docs)
                    setNotShowAlert(result[0].data.totalDocs)
                    showPaginate(paginate_tmp)
                }
            })
        },[])

    function detailInfo(item,ev){
        console.log(item)
        if (item.urlPicture) {
            setClubImg(item.urlPicture)
        } else {
            setClubImg("https://dummyimage.com/300x300")
        }
        clubName.current.setAttribute("data-clubid",ev.target.getAttribute("data-bs-clubid"))
        clubName.current.innerText = item.clubName
        clubInfo.current.innerText = item.clubInfo
        category.current.innerText = item.category
        limitStudent.current.innerText = item.limit + " คน"
        schoolYear.current.innerText = item.schoolYear
        groupID.current.innerText = item.groupID
        teacherEmail.current.innerText = item.teacherEmail
        
        
        let [day_tmp, schedule] = item.schedule[0].split(" ") // [ "17.02.00-18.02.00"]
        day.current.innerText = day_tmp
        
        let [ st ,en ] = schedule.split("-")
        scheduleStart.current.innerText = st + " นาฬิกา"
        scheduleEnd.current.innerText = en + " นาฬิกา"
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

    async function applyClub(){
        const body = {
            "clubID":clubName.current.getAttribute("data-clubid")
        }
        const result = await register_club(body,token,schoolID)
        
        if (!result){
            Swal.fire({
                icon: 'error',
                title: 'สมัครไม่สำเร็จ',
                showConfirmButton:true,
                confirmButtonColor:"#d1000a"
            }).then(() => {
                router.reload()
            })
        }else{
            Swal.fire({
                icon: 'success',
                title: 'สมัครสำเร็จ',
                showConfirmButton:true,
                confirmButtonColor:"#009431"
            }).then(() => {
                router.reload()
            })
        }
    }

    async function clickReset(ev){
        ev.preventDefault()

        window.localStorage.removeItem("studentSearchClub")
        window.localStorage.setItem("studentPageClub",1)

        search.current.value = ""
        
        const body = {"page":1}
        
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
            setNotShowAlert(result.data.totalDocs)
        }
    }
    
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
            setNotShowAlert(result.data.totalDocs)
        }
    }
    
    function generate(result){
        const paginate_tmp = []
        
        if (result.totalPages <= 6){
			for (let i=1;i<=result.totalPages;i++){
				if (result.page === i){
					paginate_tmp.push(<button className='page-link disabled bg-primary bg-opacity-75 text-white'>{result.page}</button>)
				}else{
					paginate_tmp.push(<button className='page-link' onClick={() => clickPage((i))}>{i}</button>)
				}
			}
		}else{
			if (result.hasPrevPage) {
				paginate_tmp.push(<button className='page-link' onClick={() => clickPage(1)}><i className="fa-solid fa-angles-left"></i></button>)
				paginate_tmp.push(<button className='page-link' onClick={() => clickPage((result.page - 1))}><i className="fa-solid fa-angle-left"></i></button>)
			} else {
				paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angles-left"></i></button>)
				paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angle-left"></i></button>)
			}
	
			if (result.page > 3){
				paginate_tmp.push(<button className='page-link' onClick={() => clickPage((1))}>1</button>)
				paginate_tmp.push(<button className='page-link disabled'>...</button>)
			}

			paginate_tmp.push(<button className='page-link bg-primary bg-opacity-75 text-white disabled'>{result.page}</button>)
			for (let i=1;i<=2;i++){
				if (result.page + i < result.totalPages){
					paginate_tmp.push(<button className='page-link' onClick={() => clickPage((result.page)+i)}>{result.page+i}</button>)
				}
			}
			
			if (result.page + 3 <= result.totalPages){
				paginate_tmp.push(<button className='page-link disabled'>...</button>)
			}

			if (result.page !== result.totalPages){
				paginate_tmp.push(<button className='page-link' onClick={() => clickPage((result.totalPages))}>{result.totalPages}</button>)
			}
			
			if (result.hasNextPage) {
				paginate_tmp.push(<button className='page-link' onClick={() => clickPage((result.page + 1))}><i className="fa-solid fa-angle-right"></i></button>)
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
            "query":window.localStorage.getItem("studentSearchClub")
        }
        
        window.localStorage.setItem("studentPageClub",page)
        
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
            setNotShowAlert(result.data.totalDocs)
        }
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
                `}</style>
            <table className='table table-striped align-middle'>
                <thead>
                    <tr>
                        <th style={{width:"100px"}}>รหัสวิชา</th>
                        <th style={{width:"600px"}}>ชื่อชุมนุม</th>
                        <th style={{width:"120px"}} className="text-center"><span>ลงทะเบียน</span></th>
                        <th style={{width:"80px"}} className="text-center"><span>ดูรีวิว</span></th>
                    </tr>
                </thead>
                <tbody>
                        {result.map((item, index) => {
                        console.log(item)
                        return (
                            <tr key={index}>
                                <td>{item.groupID}</td>
                                <td>{item.clubName}</td>
                                <td className="text-center">
                                    <button className='btn detailinfo_btn btn-sm ' 
                                        onClick={(ev) => detailInfo(item,ev)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#editClubModal"
                                        data-bs-clubid={item._id}
                                    >ดูรายละเอียด
                                    </button>
                                    
                                </td>
                                <td className="text-center">
                                    <Review item={item} schoolID={schoolID} nowSchoolYear={nowSchoolYear} />
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

    const applyBtn = (
        <div className='modal-footer'>
            <button className='btn btn-success' data-bs-dismiss="modal" onClick={() => applyClub()}>สมัครชุมนุม</button>
        </div>
    )

    const in_sc = (
        <div className="alert alert-primary">
            ขณะนี้อยู่ในช่วงเวลาลงทะเบียนชุมนุม
        </div>
    )

    const out_sc = (
        <div className="alert alert-danger">
            ขณะนี้ไม่อยู่ในช่วงเวลาลงทะเบียนชุมนุม
        </div>
    )

    const ha_sc = (
        <div className="alert alert-warning">
            คุณได้ทำการลงทะเบียนชุมนุมไปแล้ว
        </div>
    )

    if (displayError){
        return (
            <div className='text-center'>ระบบเกิดข้อผิดพลาดไม่สามารถแสดงข้อมูลได้</div>
        )
    }else{
        return (
            <>
                <div>
                    <div className="text-center display-6 mb-3">
                        <span className='me-2'>searchClub</span>
                        <h4 className="fa-solid fa-circle-info"
                            data-bs-toggle="modal"
                            data-bs-target="#helpmodal"
                            type="button" ></h4>
                    </div>
                    {!inschedule ? out_sc : 
                        haveClubs ? ha_sc : in_sc}
                    <div className='row'>
                        <div className='col-12'>
                            <form className='mb-3'>
                                <div className='input-group'>
                                    <span className="input-group-text">ค้นหา</span>
                                    <input placeholder="ค้นหาด้วย ชื่อชุมนุม" type="text" className='form-control' ref={search}></input>
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
                                        <p>อีเมลผู้สอน : &nbsp;
                                            <span ref={teacherEmail}></span>
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
                                        <p>วันที่เรียน : &nbsp;
                                            <span ref={day}></span>
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
                                    <div className="col-12">
                                        <label className="form-label">ชื่อนามสกุลผู้สอน : &nbsp;<span ref={teacherName}></span></label>
                                    </div>
                                    <div className="col-12">
                                        <p>รูปภาพประกอบ</p>
                                        <img src={clubImg} className="form-control" ></img>
                                    </div>
                                </div>
                            </div>
                            {haveClubs || !inschedule ? null : applyBtn}
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="helpmodal">
                    <div className="modal-dialog modal-lg">
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h3 className="modal-title" >คู่มือการใช้งาน</h3>
                            </div>
                            <div className='modal-body'>
                                รอใส่ user manual
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}