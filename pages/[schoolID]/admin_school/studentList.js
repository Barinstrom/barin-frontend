import React from 'react'
import { useRouter } from 'next/router'
import { useEffect, useState , useRef} from 'react'
import Cookies from 'universal-cookie'
import {get_students_inclub } from '../../../utils/auth'
import Reload from '../../../components/reload'
import { get_all_schoolID } from '../../../utils/unauth'
import { get_name_clubs } from '../../../utils/school_admin/get_data'
import { get_all_stdlist } from '../../../utils/teacher/teacher_getdata'
import { get_data } from '../../../utils/auth'
import { CSVLink } from "react-csv";

export default function StudentList({schoolID}) {
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

  const router = useRouter()
  const [loading,setLoading] = useState(true)
  const [dropdown,setDropdown] = useState([])
  const [data,setData] = useState(null)
  const [paginate,setPaginate] = useState(null)
  const [displayError,setDisplayError] = useState(false)
  const [reloadTable,setReloadTable] = useState(false)
  const [clubName,setClubName] = useState(null)
  const [csvData,setCsvData] = useState()
  const [allDataErr, setAllDataErr] = useState(true)
  const [notShowAlert, setNotShowAlert] = useState(0)

  let csvReport = {
    data: tmpdata,
    headers: headers,
    filename: 'tmpdata.csv'
}
  
  const cookies = new Cookies();
	const token = cookies.get("token");

  const still_loding = (
    <div className="py-2">
        <div className="d-inline-block">กำลังดาวโหลด โปรดรอสักครู่</div>
    </div>
)

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
      ไม่พบนักเรียน
    </div>
  )
  
  useEffect(() => {
    if (schoolID) {
      window.localStorage.removeItem("pageListStudent")
      window.localStorage.removeItem("clubIDStudentList")
      window.localStorage.setItem("pageListStudent", 1)
      window.localStorage.setItem("clubIDStudentList", router.query.clubID)
      const body = {
        "page": 1,
        "clubID": String(window.localStorage.getItem("clubIDStudentList"))
      }
      
      setReloadTable(true)
      Promise.all([get_name_clubs(token, schoolID), get_students_inclub(body, token, schoolID), get_data(token)])
        .then(result => {
          setReloadTable(false)
          const nowSchoolYear = result[2][0].data._doc.nowSchoolYear
          generateDropdown(result[0].data , nowSchoolYear)
          
          if (!result[1]) {
            setDisplayError(true)
            setLoading(false)
          }else {
            const paginate_tmp = generate(result[1].data)
            setDisplayError(false)
            showData(result[1].data.docs)
            setNotShowAlert(result[1].data.totalDocs)
            showPaginate(paginate_tmp)
            setClubName(router.query.clubName)
            setLoading(false)
          }
        })
    }
  },[schoolID])

  // fetch ข้อมูลใหม่ตาม club
  function chooseFetchClub(e) {
    const clubID = e._id
    const clubName = e.clubName
    router.push(`/${schoolID}/admin_school/studentList?clubID=${clubID}&clubName=${clubName}`)
    
    const body = {"page":1,"clubID":clubID}
    
    window.localStorage.setItem("pageListStudent",1)
    window.localStorage.setItem("clubIDStudentList",clubID)
    
    setLoading(true)
    Promise.all([get_name_clubs(token,schoolID),get_students_inclub(body,token,schoolID)])
    .then(result => {
      if (!result[1]){
        setDisplayError(true)
        setLoading(false)
      }else{
        const paginate_tmp = generate(result[1].data)
        setDisplayError(false)
        showData(result[1].data.docs)
        setNotShowAlert(result[1].data.totalDocs)
        showPaginate(paginate_tmp)
        
        for (let e of result[0].data){
          if (clubID === e._id){
            setClubName(e.clubName)
            break
          }
        }
        setLoading(false)
      }
    })
  }

  function generateDropdown(clubs, nowSchoolYear){
    const clubsAfterfilter = clubs.filter((e) => {
      return e.schoolYear === nowSchoolYear
    })

    const tmp = (
      <>
        {clubsAfterfilter.map((e,i) => {
          return <li style={{cursor:"pointer"}} key={i} className='dropdown-item' onClick={() => chooseFetchClub(e)}>{e.clubName}</li>
        })}
      </>
    )
    setDropdown(tmp)
  }

  function generate(result){
      //console.log(result)
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
      "clubID":window.localStorage.getItem("clubIDStudentList")
    }
    
    window.localStorage.setItem("pageListStudent",page)
    setReloadTable(true)
    const result = await get_students_inclub(body, token, schoolID)
    setReloadTable(false)
    
    if (!result){
        setDisplayError(true)
        setLoading(false)
    }else{
        const paginate_tmp = generate(result.data)
        setDisplayError(false)
      showData(result.data.docs)
      setNotShowAlert(result.data.totalDocs)
        showPaginate(paginate_tmp)
        setLoading(false)
    }
  }

  function showData(result){
    const template = (
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
                          <td className="text-center"><button className='btn btn-sm detailinfo_btn' onClick={()=> detailTest(e)} data-bs-toggle="modal" data-bs-target="#modalStudentListbyAdmin">รายละเอียด</button></td>
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

function detailTest(item) {
  firstname.current.innerText = "ชื่อ: " + item.firstname
  lastname.current.innerText = "นามสกุล: " + item.lastname
  classYear.current.innerText = "ชั้นปีที่: " + item.classYear
  enteredYear.current.innerText = "ปีที่เข้ารับการศึกษา: " + item.enteredYear
  tel.current.innerText = "เบอร์โทรศัพท์: " + item.tel
}

function getAllStdList() {
  setAllDataErr(true)
  //console.log(String(window.localStorage.getItem("clubIDStudentList")))
  const data = {
    clubID : String(window.localStorage.getItem("clubIDStudentList"))
  }
  
  get_all_stdlist(data, token, schoolID).then((res) => {
      if (res[0]) {
          //console.log(res[1])
          if (res[1].data.length === 0){
            setCsvData(<div className="fs-5">ไม่มีข้อมูลนักเรียน</div>)
            setAllDataErr(false)
          }else{
              csvReport = {
                  data: res[1].data,
                  headers: headers,
                filename: 'รายชื่อนักเรียน_' + clubName + '.csv'
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

if (loading){
  return <Reload/>
}else if (displayError){
  return (
    <main className='container p-3'>
      <div className='text-center'>ระบบเกิดข้อผิดพลาดไม่สามารถแสดงข้อมูลได้</div>
    </main>
  )
}else{
  return (
    <main className='container p-3'>
        <style jsx>{`
          .comeback_btn{
						border:none;
						background-color:#18a5af;
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
      <div className='text-center display-6 mb-3 mt-3'>
        <span className=''>รายชื่อนักเรียนชุมนุม {clubName}</span>
        
      </div>
      <div className="d-flex flex-column flex-sm-row p-1 align-items-start align-items-sm-center">
        <div className='btn-group dropdown d-sm-block order-3 order-sm-1 mt-2 mt-sm-0'>
          <button className='btn btn-dark dropdown-toggle' data-bs-toggle="dropdown">ชุมนุม</button>
          <ul className='dropdown-menu'>
            {dropdown}
          </ul>
        </div>
        <div className="btn-group d-sm-block order-1 order-sm-2 ms-sm-2">
          <button className='btn comeback_btn' onClick={() => router.push(`/${schoolID}/admin_school`)}>กลับหน้า admin</button>
        </div>
        <div className="btn-group d-sm-block order-2 order-sm-3 mt-2 mt-sm-0 ms-sm-2">
          { !notShowAlert ? null :
            <button className='btn csv_btn' data-bs-target="#modal_csvAdmin" data-bs-toggle="modal" onClick={() => getAllStdList()}>csv รายชื่อ</button>
          }
        </div>
        
      </div>
      

      <div className='mt-4'>
        {reloadTable ? reload :
          notShowAlert ? data : alert}
      </div>
					{
            reloadTable ? null :
              notShowAlert ? paginate : null
          }
      <div className="modal fade" id="modalStudentListbyAdmin">
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

      <div className="modal fade" id="modal_csvAdmin">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
                <h3 className="text-center">ดาวโหลด csv รายชื่อนักเรียน</h3>
                <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="fs-5">ชุมนุม {clubName}</div>
                  {allDataErr ? still_loding : csvData }
            </div>
          </div>
        </div>
      </div>

      
    </main>
  )
}
  
}

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: true,
	};
}

export async function getStaticProps(context) {
	const schoolID_param = context.params.schoolID
	const schoolPathAll = await get_all_schoolID();
	console.log(schoolPathAll)
	
	const school_path_data = schoolPathAll.data.find(e => e.schoolID === schoolID_param)
	if (school_path_data) {
		let schoolID = school_path_data.schoolID
		return {
			props: { schoolID },
			revalidate: 1,
		}
	}
	else {
		return {
			notFound: true,
			revalidate: 1,
		}
	}
}
