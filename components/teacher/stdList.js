import React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import ErrorPage from "next/error";
import OwnClub from "./ownClub";
import { parse } from "date-fns";
import { get_teacher_ownclubs } from "../../utils/teacher/teacher_getdata";
import Cookies from "universal-cookie";
import { get_students_inclub } from "../../utils/auth";
import { paginationStudent } from "../../utils/auth";

export default function StdList({schoolID}){
	console.log("stdlist SchID = " + schoolID)
    const [data,setData] = useState([])
    const [paginate,setPaginate] = useState([])
    const [dropdown, setDropDown] = useState("")
    const [clubname, setClubName] = useState("")
    const search = useRef()
    const [allclub, setAllClub] = useState([])

	useEffect(() => {
		console.log("useEffect stdlist")
		const cookie = new Cookies()
		const token = cookie.get("token")
		const fromclubid = localStorage.getItem("fromClubID")
		const fromclubname = localStorage.getItem("fromClubName")
		console.log(fromclubid + " and " + fromclubname)

		Promise.all([get_teacher_ownclubs(token,schoolID)]).then(result => {
			console.log(result)
			setAllClub(result[0].data.clubs)
			// console.log(allclub)
		})
		setClubName(fromclubname)
		localStorage.removeItem("fromClubID")
		localStorage.removeItem("fromClubName")
		if(fromclubid != undefined){
			paginationFirstPage(fromclubid)
		}
	}, [])

	async function paginationFirstPage(fclubid){
		console.log("Paginate first club")
		const cookie = new Cookies()
		const token = cookie.get("token")

		window.localStorage.setItem("pageListStudent",1)
    	window.localStorage.setItem("clubIDStudentList",fclubid)

		const body = {
			"page":1,
      		"clubID":String(fclubid)
		}

		await get_students_inclub(body, token, schoolID).then(result => {
			console.log("getstd = " + result)
			const paginate_tmp = generate(result.data)
			showData(result.data.docs)
			showPaginate(paginate_tmp)
		})
	}

    function detailTest(item){
		console.log(item)
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
        console.log(result)
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
			"clubID":window.localStorage.getItem("clubIDStudentList")
		  }
		  
		  window.localStorage.setItem("pageListStudent",page)
		  const result = await paginationStudent(body)
		  
		  if (!result){
			console.log("NO data")
			//   setDisplayError(true)
			//   setLoading(false)
		  }else{
			  const paginate_tmp = generate(result.data)
			//   setDisplayError(false)
			  showData(result.data.docs)
			  showPaginate(paginate_tmp)
			//   setLoading(false)
		  }
    }
    
    function showData(result){
        const template = (
            <tbody>
                {result.map((std, index) => {
                    return (
                        <tr key={index}>
                            <td>{std.userID}</td>
                            <td>{std.firstname} {std.lastname}</td>
                            {/* <td>{changeDate(item.birthday)}</td>
                            <td>{item.detail}</td> */}
                            <td><button className='btn btn-info' onClick={()=> detailTest(item)}>รายละเอียด</button></td>
                        </tr>
                    )
                })}
            </tbody>
        )
        setData(template)
    }

    function showPaginate(paginate){
        const template = (
            <ul className='pagination'>
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

    function changeDropDown(ev){
		const cookie = new Cookies()
		const token = cookie.get("token")

        const club = JSON.parse(ev.target.getAttribute("data-bs-info"))
        console.log(ev.target)
        console.log(club)
        setClubName(club.clubName)
		paginationFirstPage(club._id)
    }
    
    return (
        
        <div>
            <div className="text-center fs-1 mb-3">EditClub</div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <div className="dropdown">
                        <button className="btn btn-dark dropdown-toggle" id="stdListDropDown" data-bs-toggle="dropdown"><span className="h5 text-light">ชุมนุม</span></button>
                        <div className="dropdown-menu">
                            {allclub.map((club, index) => {
                                return <div key={index} className="dropdown-item" onClick={(ev) => changeDropDown(ev)} data-bs-info={JSON.stringify(club)}>{club.clubName}</div>
                            })}
                        </div>
                    </div>
                </div>
                <input type="text" className="form-control text-dark" placeholder="ชื่อชุมนุม" value={clubname} onChange={(ev) => setClubName(ev.target.value)}></input>
            </div>
            <div className='row'>
                <div className='col-12'>
                    {/* <form className='mb-3'>
                        <div className='input-group'>
                            <span className="input-group-text">ค้นหา</span>
                            <input type="text" className='form-control' ref={search}></input>
                            <button className='btn btn-success' onClick={(ev) => clickAccept(ev)}>ยืนยัน</button>
                            <button className='btn btn-danger' onClick={(ev) => clickReset(ev)}>รีเซต</button>
                        </div>
                    </form> */}
                    <table className='table table-bordered text-center'>
                        <thead className='table-dark'>
                            <tr>
                                <th>userID</th>
                                <th>ชื่อ-นามสกุล</th>
                                <th>extra</th>
                            </tr>
                        </thead>
                        {data}
                    </table> 
                </div>
            </div>
            {paginate}
        </div>
    )
}