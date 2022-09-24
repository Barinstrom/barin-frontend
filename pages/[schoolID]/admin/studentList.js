import React from 'react'
import { useRouter } from 'next/router'
import { useEffect,useState} from 'react'
import { get_data } from '../../../utils/auth'
import Cookies from 'universal-cookie'
import { paginationStudent } from '../../../utils/auth'
import Reload from '../../../components/reload'


export default function StudentList() {
  const router = useRouter()
  const [loading,setLoading] = useState(true)
  const [dropdown,setDropdown] = useState([])
  const [data,setData] = useState(null)
  const [paginate,setPaginate] = useState(null)
  const [displayError,setDisplayError] = useState(false)
  
  useEffect(() => {
		const cookies = new Cookies();
		const token = cookies.get("token");
    
    get_data(token)
    .then(result => {
      const clubTest = ["บาสเกตบอล","ฟุตบอล","ปิงปอง","แบตมินตัน","ยิมนาสติก","หมากรุก","กอล์ฟ","ว่ายน้ำ","กระโดดเชือก","วิ่ง"]
      console.log(result.data)
      generateDropdown(clubTest)
      fetchData()
      setLoading(false)
    })
		
	},[])

  // fetch ข้อมูลใหม่ตาม club
  function  chooseFetchClub(ev){
    console.log(ev.target.innerText)
  }


  function generateDropdown(clubs){
    const tmp = (
      <>
        {clubs.map((e,i) => {
          return <li key={i} className=' dropdown-item' onClick={(ev) => chooseFetchClub(ev)}>{e}</li>
        })}
      </>
    )
    setDropdown(tmp)
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
    }
    
    window.localStorage.setItem("page",page)
    
    const result = await paginationStudent(body)
    
    if (!result){
        setDisplayError(true)
    }else{
        const paginate_tmp = generate(result.data)
        setDisplayError(false)
        showData(result.data.docs)
        showPaginate(paginate_tmp)
    }
  }

  async function fetchData(){
    const body = {
        "page":1,
    }
    window.localStorage.setItem("page",1)
    
    const result = await paginationStudent(body)

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
                        <td>{item.user}</td>
                        <td>{item.age}</td>
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
        <h3 className='text-center'>ดูรายชื่อนักเรียน</h3>
        <div className='btn-group dropdown'>
          <button className='btn btn-secondary'>ชุมนุม</button>
          <button className='btn btn-secondary dropdown-toggle dropdown-toggle-split' data-bs-toggle="dropdown"></button>
          <ul className='dropdown-menu'>
            {dropdown}
          </ul>
        </div>
  
        <div className='mt-4'>
          <table className='table text-center'>
            <thead className='table-dark'>
              <tr>
                <th>ชื่อ</th>
                <th>นามสกุล</th>
              </tr>
            </thead>
            {data}
          </table>
        </div>
        {paginate}
      </main>
    )
  }
  
}

export async function getStaticPaths() {
	let a = [
		{ params: { schoolID: "1" } },
		{ params: { schoolID: "2" } },
		{ params: { schoolID: "3" } },
		{ params: { schoolID: "stamp" } },
		{ params: { schoolID: "teststamp" } },
	];

	return {
		paths: a,
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
