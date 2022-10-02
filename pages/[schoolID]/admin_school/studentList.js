import React from 'react'
import { useRouter } from 'next/router'
import { useEffect,useState} from 'react'
import Cookies from 'universal-cookie'
import {get_students_inclub } from '../../../utils/auth'
import Reload from '../../../components/reload'
import { get_all_schoolID } from '../../../utils/unauth'
import { get_name_clubs } from '../../../utils/school_admin/get_data'

export default function StudentList({schoolID}) {
  const router = useRouter()
  const [loading,setLoading] = useState(true)
  const [dropdown,setDropdown] = useState([])
  const [data,setData] = useState(null)
  const [paginate,setPaginate] = useState(null)
  const [displayError,setDisplayError] = useState(false)
  const [reloadTable,setReloadTable] = useState(false)
  const [clubName,setClubName] = useState(null)

  const cookies = new Cookies();
	const token = cookies.get("token");

  const reload = (
    <main style={{height:"400px"}}>
        <div className="d-flex justify-content-center h-100 align-items-center">
            <div className="fs-4">loading ...</div>
            <div className="spinner-border ms-3"></div>
        </div>
    </main>
  )
  
  useEffect(() => {
    window.localStorage.removeItem("pageListStudent")
    window.localStorage.removeItem("clubIDStudentList")
    
    //console.log(router.query)
    window.localStorage.setItem("pageListStudent",1)
    window.localStorage.setItem("clubIDStudentList",router.query.clubID)
    const body = {
      "page":1,
      "clubID":String(window.localStorage.getItem("clubIDStudentList"))
    }
    
    Promise.all([get_name_clubs(token,schoolID),get_students_inclub(body,token,schoolID)])
    .then(result => {
      generateDropdown(result[0].data)
      //console.log(result[1])
      
      if (!result[1]){
        setDisplayError(true)
        setLoading(false)
      }else{
        const paginate_tmp = generate(result[1].data)
        setDisplayError(false)
        showData(result[1].data.docs)
        showPaginate(paginate_tmp)
        setClubName(router.query.clubName)
        setLoading(false)
      }
    })
  },[])

  // fetch ข้อมูลใหม่ตาม club
  function chooseFetchClub(clubID) {
    //console.log(clubID)
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
        showPaginate(paginate_tmp)

        for (e of result[0].data){
          if (clubID === e.clubID){
            setClubName(e.clubName)
            break
          }
        }
        setLoading(false)
      }
    })
  }

  function generateDropdown(clubs){
    const tmp = (
      <div>
        {clubs.map((e,i) => {
          return <li style={{cursor:"pointer"}} key={i} className='dropdown-item' onClick={() => chooseFetchClub(`${e._id}`)}>{e.clubName}</li>
        })}
      </div>
    )
    setDropdown(tmp)
  }

  function generate(result){
      const paginate_tmp = []
      if (result.hasPrevPage && result.page - 5 >= 1){
          paginate_tmp.push(<button className='page-link' onClick={()=> clickPage(1)}><i className="fa-solid fa-angles-left"></i></button>)    
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
          paginate_tmp.push(<button className='page-link' onClick={()=> clickPage((result.totalPages))}><i className="fa-solid fa-angles-right"></i></button>)    
      }else{
          paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angles-right"></i></button>)
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
    const result = await paginationStudent(body)
    setReloadTable(false)
    
    if (!result){
        setDisplayError(true)
        setLoading(false)
    }else{
        const paginate_tmp = generate(result.data)
        setDisplayError(false)
        showData(result.data.docs)
        showPaginate(paginate_tmp)
        setLoading(false)
    }
  }

  function showData(result){
    const template = (
      <table className='table text-center'>
        <thead className='table-dark'>
          <tr>
            <th>ชื่อ</th>
            <th>นามสกุล</th>
          </tr>
        </thead>

        <tbody>
          {result.map((item,index) => {
            return (
              <tr key={index}>
                  <td>{item.firstname}</td>
                  <td>{item.lastname}</td>
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
        <h3 className='text-center'>ดูรายชื่อนักเรียนของชุมนุม {clubName}</h3>
        <div className='btn-group dropdown'>
          <button className='btn btn-secondary'>ชุมนุม</button>
          <button className='btn btn-secondary dropdown-toggle dropdown-toggle-split' data-bs-toggle="dropdown"></button>
          <ul className='dropdown-menu'>
            {dropdown}
          </ul>
        </div>
  
        <div className='mt-4'>
          {reloadTable ? reload : data}
        </div>
        {paginate}
      </main>
    )
  }
  
}

export async function getStaticPaths() {
  const schoolPathAll = await get_all_schoolID();
  
  const schoolPathGenerate = schoolPathAll.data
  const all_path = schoolPathGenerate.map((e) => {
		return { params: e }
	})
  
  return {
		paths: all_path,
		fallback: false,
	};
}

export async function getStaticProps(context) {
	const schoolID = context.params.schoolID
	
  return {
		props: { schoolID},
		revalidate: 1,
	};
}
