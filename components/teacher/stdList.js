import React from "react"
import { useState,useEffect,useRef} from "react"
import { get_teacher_ownclubs, get_all_stdlist } from "../../utils/teacher/teacher_getdata";
import { update_study_status } from "../../utils/teacher/edit_data";
import Cookies from "universal-cookie";
import { get_students_inclub } from "../../utils/auth";
import { CSVLink } from "react-csv";
import Swal from "sweetalert2";

export default function StdList({ schoolID, school_data }){
    const firstname = useRef()
    const lastname = useRef()
    const classYear = useRef()
    const enteredYear = useRef()
    const tel = useRef()
    
    const headers = [
        { label: "firstname", key: "firstname" },
        { label: "lastname", key: "lastname" },
        { label: "classYear", key: "classYear" },
        { label: "status", key: "status" },
    ];

    const tmpdata = [
        { firstname: "tmp", lastname: "tmp", classYear: 0 }
    ];

    const [csvFile, setCsvFile] = useState("");
    const [data,setData] = useState([])
    const [paginate,setPaginate] = useState([])
    const [dropdown, setDropDown] = useState(null)
    const [displayError,setDisplayError] = useState(false)
    const [reloadTable,setReloadTable] = useState(false)
    const [nowDisplayname, setNowDisplayname] = useState(null)
    const [nowClubID, setNowClubID] = useState(null)
    const [nowClubYear, setNowClubYear] = useState(null)
    const [allDataErr, setAllDataErr] = useState(true)
    const [notShowAlert, setNotShowAlert] = useState(0)

    let csvReport = {
        data: tmpdata,
        headers: headers,
        filename: 'tmpdata.csv'
    }
    const [csvData,setCsvData] = useState()

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

    const alert = (
        <div className="alert alert-dark" role="alert">
            ยังไม่มีนักเรียนมาลงทะเบียน
        </div>
    )

    const still_loding = (
        <div className="py-2">
            <div className="d-inline-block">กำลังดาวโหลด โปรดรอสักครู่</div>
        </div>
    )

    useEffect(() => {
        // console.log(school_data)
        setReloadTable(true)
        get_teacher_ownclubs(token,schoolID).then(result => {
			// console.log(result.data)
            const clubs = result.data
            if (!result){
                setDisplayError(true)
                window.localStorage.removeItem("clubNameFromClick")
                window.localStorage.removeItem("clubidFromClick")
                window.localStorage.removeItem("displayComponent")
                window.localStorage.removeItem("clubYearFromClick")
            }else{
                genetateDropdown(clubs)
                const formButtonOwnClubName = window.localStorage.getItem("clubNameFromClick")
                const formButtonOwnClubID = window.localStorage.getItem("clubidFromClick")
                const formButtonOwnClubYear = window.localStorage.getItem("clubYearFromClick")
                
                window.localStorage.removeItem("clubYearFromClick")
                window.localStorage.removeItem("clubNameFromClick")
                window.localStorage.removeItem("clubidFromClick")
                window.localStorage.removeItem("displayComponent")
                
                const clubID_tmp = clubs[0]._id
                const clubName_tmp = clubs[0].clubName
                const clubYear_tmp = clubs[0].schoolYear
                let body
                
                if ((!formButtonOwnClubName || !formButtonOwnClubID)){
                    body = {
                        "page":1,
                        "clubID":clubID_tmp
                    }
                    setNowDisplayname(clubName_tmp)
                    setNowClubYear(clubYear_tmp)
                    window.localStorage.setItem("clubidStdentListOwnTeacher",clubID_tmp)
                }else{
                    body = {
                        "page":1,
                        "clubID":formButtonOwnClubID
                    }
                    setNowDisplayname(formButtonOwnClubName)
                    setNowClubYear(formButtonOwnClubYear)
                    window.localStorage.setItem("clubidStdentListOwnTeacher",formButtonOwnClubID)
                }
                
                window.localStorage.setItem("pageStdentListOwnTeacher",1)
                
                setReloadTable(true)
                get_students_inclub(body, token, schoolID).then(result => {
                    setReloadTable(false)
                    if (!result){
                        setDisplayError(true)
                    }else{
                        const paginate_tmp = generate(result.data)
                        setNotShowAlert(result.data.totalDocs)
                        showData(result.data.docs)
                        showPaginate(paginate_tmp)
                    }
                })
            }
		})
	}, [])

    function detailTest(item) {
        firstname.current.innerText = "ชื่อ: " + item.firstname
        lastname.current.innerText = "นามสกุล: " + item.lastname
        classYear.current.innerText = "ชั้นปีที่: " + item.classYear
        enteredYear.current.innerText = "ปีที่เข้ารับการศึกษา: " + item.enteredYear
        tel.current.innerText = "เบอร์โทรศัพท์: " + item.tel
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
			"clubID":window.localStorage.getItem("clubidStdentListOwnTeacher")
        }
        
        window.localStorage.setItem("pageStdentListOwnTeacher",page)

        setReloadTable(true)
        get_students_inclub(body, token, schoolID).then(result => {
            setReloadTable(false)
            if (!result){
                setDisplayError(true)
            }else{
                const paginate_tmp = generate(result.data)
                setNotShowAlert(result.data.totalDocs)
                showData(result.data.docs)
                showPaginate(paginate_tmp)
            }
        })
    }
    
    function showData(result){
        const tmp = (
            <table className='table align-middle'>
                <style jsx>{`
					.detailinfo_btn{
						border:none;
						background-color:#004d99;
						color:white;
						border-radius:4px;
					}
                `}</style>
                <thead>
                    <tr>
                        <th style={{width:"1000px"}}><span className="ms-0 ms-md-4">ชื่อ-นามสกุล</span></th>
                        <th className="text-center" style={{width:"200px"}}>รายละเอียด</th>
                    </tr>
                </thead>
                <tbody>
                    {result.map((e,i) => {
                        return (
                            <tr key={i}>
                                <td>{e.firstname} {e.lastname}</td>
                                <td className="text-center"><button className='btn btn-sm detailinfo_btn' onClick={()=> detailTest(e)} data-bs-toggle="modal" data-bs-target="#modalStudentListbyTeacher">รายละเอียด</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table> 
        )
        setData(tmp)
    }

    function showPaginate(paginate){
        const tmp = (
            <ul className='pagination justify-content-center'>
                {paginate.map((item,index)=>{
                    return (
                        <li key={index} className="page-item">{item}</li>
                    )
                })}
            </ul>
        )
        setPaginate(tmp)
    }

    function genetateDropdown(clubs) {
        // console.log(clubs)
        const tmp = clubs.map((club, index) => {
            return <div key={index} style={{ cursor: "pointer" }} className="dropdown-item" onClick={(ev) => changeDropDown(club._id, club.clubName,club.schoolYear)}>
                {club.clubName} ปี {club.schoolYear}
            </div>
        })
        setDropDown(tmp)
    }

    function changeDropDown(clubID,clubName,clubYear){
	    const body = {
            "page":1,
            "clubID":clubID
		}

        setNowClubYear(clubYear)
        setNowClubID(clubID)
        setNowDisplayname(clubName)
        window.localStorage.setItem("clubidStdentListOwnTeacher",clubID)
        window.localStorage.setItem("pageStdentListOwnTeacher",1)

        setReloadTable(true)
        get_students_inclub(body, token, schoolID).then(result => {
            setReloadTable(false)
            if (!result){
                setDisplayError(true)
            }else{
                const paginate_tmp = generate(result.data)
                setNotShowAlert(result.data.totalDocs)
                showData(result.data.docs)
                showPaginate(paginate_tmp)
            }
        })
    }

    function getAllStdList() {
        setAllDataErr(true)
        const data = {
            clubID : window.localStorage.getItem("clubidStdentListOwnTeacher")
        }
        
        get_all_stdlist(data, token, schoolID).then((res) => {
            if (res[0]) {
                // console.log(res[1])
                if (res[1].data.length === 0){
                    setCsvData(<div className="fs-5">ไม่มีข้อมูลนักเรียน</div>)
                    setAllDataErr(false)
                } else {
                    // console.log(res[1].data)
                    csvReport = {
                        data: res[1].data,
                        headers: headers,
                        filename: 'รายชื่อนักเรียน_' + nowDisplayname + '.csv'
                    }
                    
                    setCsvData(<CSVLink {...csvReport}>Export to CSV</CSVLink>)
                    setAllDataErr(false)
                }
            }
            else {
                
                setCsvData(<div className="fs-5">ดึงข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง</div>)
                setAllDataErr(false)
            }
        })
    }
    
    //* ส่วนของการแปลง string เป็น object
    const stringtoObject = (text) => {
        try {
            // console.log(text)
            const result = []
            text = text.trim()
            const tmp = text.split("\n")
            const heads = tmp[0].split(",")
            for (let i = 1; i < tmp.length; i++) {
                const line = tmp[i].split(",")
                const object = {}
                for (let j = 0; j < heads.length; j++) {
                    if (line[j] === "") {
                        return "data is undefined"
                    } else {
                        let header = heads[j].trim()
                        let hdata = line[j].trim()
                        object[header] = hdata
                    }
                }
                result.push(object)
            }
            return result
        }
        catch(err){
            // console.log(err)
        }
    }


    const submit = (ev,clubID) => {
        ev.preventDefault();
        if (!clubID) {
            clubID = window.localStorage.getItem("clubidStdentListOwnTeacher")
        }
        if (!csvFile) {
            Swal.fire({
                icon: 'warning',
                title: 'โปรดใส่ไฟล์ csv ด้วย',
                showConfirmButton: true,
                confirmButtonColor: "#f7a518",
                confirmButtonText: 'ok',
            })
            return
        }

        const fileSuccess = csvFile
        const reader = new FileReader()

        reader.readAsText(fileSuccess)
        reader.onloadend = async () => {
            const text = reader.result;
            const doc = stringtoObject(text)
            if (doc === "data is undefined") {
                Swal.fire({
                    icon: 'warning',
                    title: 'ใส่ข้อมูลในไฟล์ csv ไม่ครบ',
                    showConfirmButton: true,
                    confirmButtonColor: "#f7a518",
                    confirmButtonText: 'ok',
                })
                return
            } else {
                const body = {
                    clubID: clubID,
                    doc : doc
                }
                const result = await update_study_status(body, token, schoolID);
                // console.log(result)
                if (result) {
                    Swal.fire({
                        icon: 'success',
                        title: 'ตัดเกรดสำเร็จ',
                        showConfirmButton: true,
                        confirmButtonColor: "#009431"
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'ตัดเกรดไม่สำเร็จ',
                        showConfirmButton: true,
                        confirmButtonColor: "#ce0303"
                    })
                }
            }
        }
    }

    if (displayError){
        return (
            <main>
                <h4 className="text-center mt-4">เกิดข้อผิดพลาดไม่สามารถแสดงผลได้</h4>
            </main>
        )
    }else{
        return (
            <main>
                <style jsx>{`
                    .submitgrade_btn{
						border:none;
						background-color:#11620e;
						color:white;
						border-radius:4px;
					}
                    
					.detailinfo_btn{
						border:none;
						background-color:#004d99;
						color:white;
						border-radius:4px;
					}

                    .grade_btn{
						border:none;
						background-color:#af1868;
						color:white;
						border-radius:4px;
					}
                    .csv_btn{
						border:none;
						background-color:#9d18af;
						color:white;
						border-radius:4px;
					}
                `}</style>
                
                <div className="text-center display-6 mb-3">
                    <span className=''>รายชื่อนักเรียน</span>
                    
                </div>
                <div className="mb-4">
                    <div className="d-flex flex-column align-items-center flex-sm-row">
                        <div className="text-center">
                            <div className="btn-group dropdown">
                                <button className="btn btn-dark btn-sm dropdown-toggle" data-bs-toggle="dropdown">ชุมนุม</button>
                                <div className="dropdown-menu">
                                    {dropdown}
                                </div>
                            </div>
                        </div>
                        <div className="text-left">
                            <span className="fs-3 ms-sm-4">{nowDisplayname}</span> 
                        </div>
                        <div className="ms-sm-auto">
                            {
                                reloadTable ? null : notShowAlert ?
                                <button className='btn csv_btn me-2 btn-sm mt-2 mt-sm-0' data-bs-target="#modal_csv" data-bs-toggle="modal" onClick={() => getAllStdList()}>csv รายชื่อ</button>
                                : null
                            }
                            {
                                reloadTable ? null : !notShowAlert ? null :
                                nowClubYear != school_data.nowSchoolYear ? null :
                                <button className='btn grade_btn btn-sm mt-2 mt-sm-0' data-bs-target="#modal_grade" data-bs-toggle="modal">ตัดเกรด</button>
                            }
                        </div>
                    </div>
                </div>
                <div>
                    {reloadTable ? reload :
                        notShowAlert ? data : alert}
                </div>
                {reloadTable ? null :
                    notShowAlert ? paginate : null}

                <div className="modal fade" id="modal_csv">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="text-center">ดาวโหลด csv รายชื่อนักเรียน</h3>
                                <button className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="fs-5">ชุมนุม {nowDisplayname}</div>
                                    {allDataErr ? still_loding : csvData }
                                </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modal_grade">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                                <h3 className="text-center">csv รายชื่อนักเรียน</h3>
                                <button className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <label className="form-label mt-1">ใส่ข้อมูล csv เพื่อตัดเกรดของชุมนุม {nowDisplayname}</label>
                                    <div className="input-group">
                                        <input className="form-control"
                                            type='file'
                                            accept='.csv'
                                            onChange={(ev) => {setCsvFile(ev.target.files[0])
                                        }} />
                                        <button type="submit" className="btn submitgrade_btn" onClick={(ev) => submit(ev, nowClubID)}>ยืนยัน</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modalStudentListbyTeacher">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="text-center">ข้อมูลนักเรียน</h3>
                                <button className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <p ref={firstname}></p>
                                    <p ref={lastname}></p>
                                    <p ref={classYear}></p>
                                    <p ref={enteredYear}></p>
                                    <p ref={tel}></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
            </main>
        )
    }
    
}