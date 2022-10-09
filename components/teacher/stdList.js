import React from "react"
import { useState,useEffect} from "react"
import { get_teacher_ownclubs } from "../../utils/teacher/teacher_getdata";
import Cookies from "universal-cookie";
import { get_students_inclub } from "../../utils/auth";

export default function StdList({schoolID}){
	
    const [data,setData] = useState([])
    const [paginate,setPaginate] = useState([])
    const [dropdown, setDropDown] = useState(null)
    const [displayError,setDisplayError] = useState(false)
    const [reloadTable,setReloadTable] = useState(false)
    const [nowDisplayname,setNowDisplayname] = useState(null)

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

	useEffect(() => {
        setReloadTable(true)
        get_teacher_ownclubs(token,schoolID).then(result => {
			console.log(result.data)
            const clubs = result.data
            if (!result){
                setDisplayError(true)
                window.localStorage.removeItem("clubNameFromClick")
                window.localStorage.removeItem("clubidFromClick")
                window.localStorage.removeItem("displayComponent")
            }else{
                genetateDropdown(clubs)
                const formButtonOwnClubName = window.localStorage.getItem("clubNameFromClick")
                const formButtonOwnClubID = window.localStorage.getItem("clubidFromClick")
                
                window.localStorage.removeItem("clubNameFromClick")
                window.localStorage.removeItem("clubidFromClick")
                window.localStorage.removeItem("displayComponent")
                
                const clubID_tmp = clubs[0]._id
                const clubName_tmp = clubs[0].clubName
                let body
                
                if ((!formButtonOwnClubName || !formButtonOwnClubID)){
                    body = {
                        "page":1,
                        "clubID":clubID_tmp
                    }
                    setNowDisplayname("ชื่อชุมนุม " + clubName_tmp)
                    window.localStorage.setItem("clubidStdentListOwnTeacher",clubID_tmp)
                }else{
                    body = {
                        "page":1,
                        "clubID":formButtonOwnClubID
                    }
                    setNowDisplayname("ชื่อชุมนุม " + formButtonOwnClubName)
                    window.localStorage.setItem("clubidStdentListOwnTeacher",formButtonOwnClubID)
                }
                
                window.localStorage.setItem("pageStdentListOwnTeacher",1)
                
                get_students_inclub(body, token, schoolID).then(result => {
                    //console.log(result)
                    
                    if (!result){
                        setDisplayError(true)
                        setReloadTable(false)
                    }else{
                        const paginate_tmp = generate(result.data)
                        showData(result.data.docs)
                        showPaginate(paginate_tmp)
                        setReloadTable(false)
                    }
                })
            }
		})
	}, [])

	function detailTest(item){
		console.log(item)
	}
    
    function generate(result){
        const paginate_tmp = []
        if (result.hasPrevPage && result.page - 5 >= 1){
            paginate_tmp.push(<button className='page-link' onClick={()=> clickPage((1))}><i className="fa-solid fa-angles-left"></i></button>)    
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
			"clubID":window.localStorage.getItem("clubidStdentListOwnTeacher")
        }
        
        window.localStorage.setItem("pageStdentListOwnTeacher",page)

        setReloadTable(true)
        get_students_inclub(body, token, schoolID).then(result => {
            if (!result){
                setReloadTable(false)
                setDisplayError(true)
            }else{
                const paginate_tmp = generate(result.data)
                setReloadTable(false)
                showData(result.data.docs)
                showPaginate(paginate_tmp)
            }
        })
    }
    
    function showData(result){
        const tmp = (
            <table className='table align-middle'>
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
                                <td className="text-center"><button className='btn btn-sm btn-info' onClick={()=> detailTest(e)}>รายละเอียด</button></td>
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

    function genetateDropdown(clubs){
        const tmp = clubs.map((club, index) => {
            return <div key={index} style={{cursor:"pointer"}} className="dropdown-item" onClick={(ev) => changeDropDown(club._id,club.clubName)} data-bs-info={JSON.stringify(club)}>{club.clubName}</div>
        })
        setDropDown(tmp)
    }

    function changeDropDown(clubID,clubName){
		
        const body = {
            "page":1,
            "clubID":clubID
		}

        setNowDisplayname("ชื่อชุมนุม " + clubName)
        window.localStorage.setItem("clubidStdentListOwnTeacher",clubID)
        window.localStorage.setItem("pageStdentListOwnTeacher",1)

        get_students_inclub(body, token, schoolID).then(result => {
            if (!result){
                setDisplayError(true)
            }else{
                const paginate_tmp = generate(result.data)
                showData(result.data.docs)
                showPaginate(paginate_tmp)
            }
        })
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
                <div className="text-center fs-1 mb-5">StudentList</div>
                <div className="mb-4">
                    <div className="row">
                        <div className="col-4 col-md-2 text-center">
                            <div className="btn-group dropdown">
                                <button className='btn btn-dark'>ชุมนุม</button>
                                <button className="btn btn-dark dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"></button>
                                
                                <div className="dropdown-menu">
                                    {dropdown}
                                </div>
                            </div>
                        </div>
                        <div className="col-8 col-md-10 align-self-center">
                            <div className="fs-3">{nowDisplayname}</div> 
                        </div>
                    </div>
                </div>
                <div>
                    {reloadTable ? reload : data}
                </div>
                {paginate}
            </main>
        )
    }
    
}