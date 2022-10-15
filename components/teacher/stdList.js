import React from "react"
import { useState,useEffect} from "react"
import { get_teacher_ownclubs, get_all_stdlist } from "../../utils/teacher/teacher_getdata";
import { update_study_status } from "../../utils/teacher/edit_data";
import Cookies from "universal-cookie";
import { get_students_inclub } from "../../utils/auth";
import { CSVLink } from "react-csv";
import Swal from "sweetalert2";

export default function StdList({schoolID}){
    
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
    const [allDataErr, setAllDataErr] = useState(false)
    const [csvReport, setCsvReport] = useState({
        data: tmpdata,
        headers: headers,
        filename: 'tmpdata.csv'
    })

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

    const noDownload = (
        <main style={{ height: "400px" }}>
            <div className="d-flex justify-content-center h-100 align-items-center">
                <div className="fs-3">ดึงข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง</div>
            </div>
        </main>
    )

    const download = (
        <main style={{ height: "400px" }}>
            <div className="d-flex justify-content-center h-100 align-items-center">
                <div className="btn btn-outline-secondary">
                    <CSVLink {...csvReport}>Export to CSV</CSVLink>
                </div>
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
                    setNowDisplayname(clubName_tmp)
                    window.localStorage.setItem("clubidStdentListOwnTeacher",clubID_tmp)
                }else{
                    body = {
                        "page":1,
                        "clubID":formButtonOwnClubID
                    }
                    setNowDisplayname(formButtonOwnClubName)
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

        setNowClubID(clubID)
        setNowDisplayname(clubName)
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

    function getAllStdList(clubID) {
        setAllDataErr("loading")
        // console.log(clubID)
        if (!clubID) {
            clubID = window.localStorage.getItem("clubidStdentListOwnTeacher")
        }
        
        const data = {
            clubID : clubID
        }
        get_all_stdlist(data, token, schoolID).then((res) => {
            console.log(res)
            if (res[0]) {
                // console.log(res[1].data)
                // console.log(tmpdata)
                setCsvReport ({
                    data: res[1].data,
                    headers: headers,
                    filename: clubID + '.csv'
                })
                setAllDataErr(false)
            }
            else {
                setAllDataErr(true)
            }
        })
    }
    
    /* ส่วนของการแปลง string เป็น object */
    const stringtoObject = (text) => {
        try {
            console.log(text)
            const result = []
            text = text.trim()
            const tmp = text.split("\n")
            const heads = tmp[0].split(",")
            // console.log(heads)
            for (let i = 1; i < tmp.length; i++) {
                const line = tmp[i].split(",")
                const object = {}
                for (let j = 0; j < heads.length; j++) {
                    // console.log(j,line[j])
                    if (line[j] === "") {
                        return "data is undefined"
                    } else {
                        let header = heads[j].trim()
                        // header = header.replaceAll('"', '');
                        // header = header.replaceAll("'", '');
                        let hdata = line[j].trim()
                        // hdata = hdata.replaceAll('"', '');
                        // hdata = hdata.replaceAll("'", '');
                        object[header] = hdata
                    }
                }
                // console.log(line,i)
                result.push(object)
            }
            // console.log("test")
            return result
        }
        catch(err){
            console.log(err)
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
            // console.log(doc)
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
                // console.log(body)
                const result = await update_study_status(body, token, schoolID);
                console.log(result)
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
                <div className="text-center fs-1 mb-5">StudentList</div>
                <div className="mb-4">
                    <div className="d-flex flex-column align-items-center flex-sm-row">
                        <div className="text-center">
                            <div className="btn-group dropdown">
                                <button className='btn btn-dark'>ชุมนุม</button>
                                <button className="btn btn-dark dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"></button>
                                
                                <div className="dropdown-menu">
                                    {dropdown}
                                </div>
                            </div>
                        </div>
                        <div className="text-left">
                            <span className="fs-3 ms-sm-4">{nowDisplayname}</span> 
                        </div>
                        <div className="ms-sm-auto ">
                            <button className='btn btn-secondary me-2' data-bs-target="#stdalllist" data-bs-toggle="modal"  onClick={() => { getAllStdList(nowClubID) }}>csv รายชื่อ</button>
                            <button className='btn btn-secondary' data-bs-target="#gradestd" data-bs-toggle="modal">ตัดเกรด</button>
                        </div>
                    </div>
                </div>
                <div>
                    {reloadTable ? reload : data}
                </div>
                {paginate}

                <div className="modal fade" id="stdalllist">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="text-center">CSV - รายชื่อ</h3>
                                <button className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="text-center">
                                    <div className="fs-3">{nowDisplayname}</div>
                                    {allDataErr=="loading" ? reload : 
                                        allDataErr ? noDownload :
                                            download }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="gradestd">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="text-center">CSV - รายชื่อ</h3>
                                <button className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="text-center">
                                    <div className="fs-3">{nowDisplayname}</div>
                                    <div className="fs-3">ใส่ข้อมูล csv ตัดเกรด</div>
                                    <form>
                                        <div className="input-group">
                                            <input className="form-control"
                                                type='file'
                                                accept='.csv'
                                                onChange={(ev) => {
                                                    setCsvFile(ev.target.files[0])
                                                }} />
                                            <button type="submit" className="btn btn-success" onClick={(ev) => submit(ev, nowClubID)}>ยืนยัน</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        
        )
    }
    
}