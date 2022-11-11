/* eslint-disable react-hooks/exhaustive-deps */
import React ,{ useEffect,useRef,useState } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';
import ErrorPage from "next/error";
import { paginationStudent } from '../../utils/auth';
import { update_student } from '../../utils/school_admin/edit_data';

export default function EditStudent({ school_data,schoolID }) {

    const [data,setData] = useState(null)
    const [paginate,setPaginate] = useState(null)
    const [displayError,setDisplayError] = useState(false)
    const [reloadTable, setReloadTable] = useState(false)
    const [notShowAlert, setNotShowAlert] = useState(0)

    const search = useRef()

    const firstname = useRef()
    const lastname = useRef()
    const email = useRef()
    const tel = useRef()
    const classYear = useRef()
    const enteredYear = useRef()

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
            ไม่พบข้อมูลนักเรียน
        </div>
    )

    useEffect(()=>{
        window.localStorage.removeItem("searchEditStudent")
        window.localStorage.removeItem("pageEditStudent")
        const body = {
            "page":1,
        }
        window.localStorage.setItem("pageEditStudent",1)
        
        setReloadTable(true)
        paginationStudent(body, token, schoolID).then(result => {
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

    function detailInfo(item,ev){
        firstname.current.setAttribute("user-id",ev.target.getAttribute("data-bs-id"))
        firstname.current.value = item.firstname
        lastname.current.value = item.lastname
        email.current.value = item.email
        tel.current.value = item.tel
        classYear.current.value = item.classYear
        enteredYear.current.value = item.enteredYear
    }

    async function updateStudent(){
        if (firstname.current.value === "" || lastname.current.value === "" || tel.current.value === "" || classYear.current.value === "" || enteredYear.current.value === ""){
            Swal.fire({
				icon: 'warning',
				title: 'โปรดกรอกข้อมูลให้ครบถ้วน!',
				showConfirmButton: true,
				confirmButtonColor: "#f7a518",
				confirmButtonText: 'ok',
			})
            return
        }
        const body = {
            userID:firstname.current.getAttribute("user-id"),
            firstname:firstname.current.value,
            lastname:lastname.current.value,
            tel:tel.current.value,
            classYear:classYear.current.value,
            enteredYear:enteredYear.current.value,
        }
        
        try {
            Swal.fire({
                icon: 'question',
                title: "ยืนยันการแก้ไข",
                showConfirmButton: true,
                confirmButtonColor: "#0208bb",
                confirmButtonText: 'ok',

                showCancelButton: true,
                cancelButtonText: "cancel",
                cancelButtonColor: "#d93333",

                showLoaderOnConfirm: true,
                preConfirm: () => {
                    return update_student(body, token, schoolID)
                },
                allowOutsideClick: false

            }).then((res) => {
                //console.log(res)
                if (res.isConfirmed) { 
                    const result_update = res.value === "true" ? true : false
                    
                    if (!result_update) {
                        Swal.fire({
                            icon: 'error',
                            title: 'แก้ไขข้อมูลไม่สำเร็จ',
                            showConfirmButton: true,
                            confirmButtonColor: "#d1000a"
                        })
                        return
                    }else{
                        Swal.fire({
                            icon: 'success',
                            title: 'แก้ไขข้อมูลสำเร็จ',
                            showConfirmButton: true,
                            confirmButtonColor: "#009431"
                        }).then(() => {
                            const body = {
                                "page": window.localStorage.getItem("pageEditStudent"),
                                "query": window.localStorage.getItem("searchEditStudent")
                            }
    
                            paginationStudent(body, token, schoolID).then((result) => {
                                if(!result) {
                                    setDisplayError(true)
                                } else {
                                    if(result.data.docs.length === 0) {
                                        window.localStorage.setItem("pageEditStudent", result.data.totalPages)
                                        const body = {
                                            "page": window.localStorage.getItem("pageEditStudent"),
                                            "query": window.localStorage.getItem("searchEditStudent")
                                        }
    
                                        paginationStudent(body, token, schoolID).then((result_new) => {
                                            if (!result_new) {
                                                setDisplayError(true)
                                            } else {
                                                const paginate_tmp = generate(result_new.data)
                                                setDisplayError(false)
                                                showData(result_new.data.docs)
                                                showPaginate(paginate_tmp)
                                                setNotShowAlert(result_new.data.totalDocs)
                                            }
                                        })
                                    } else {
                                        const paginate_tmp = generate(result.data)
                                        setDisplayError(false)
                                        showData(result.data.docs)
                                        showPaginate(paginate_tmp)
                                        setNotShowAlert(result.data.totalDocs)
                                    }
                                }
                            })
                        })
                    }
                }
            })            
        }catch(err){
            console.log(err)
        }
    }

    async function clickReset(ev){
        ev.preventDefault()
        window.localStorage.removeItem("searchEditStudent")
        window.localStorage.setItem("pageEditStudent",1)

        search.current.value = ""
        
        const body = {
            "page":1
        }
        
        setReloadTable(true)
        const result = await paginationStudent(body,token,schoolID)
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
            window.localStorage.removeItem("searchEditStudent")
            body = {"page":1}
        }else{
            window.localStorage.setItem("pageEditStudent",1)
            window.localStorage.setItem("searchEditStudent",search.current.value)
            body = {
                "page":1,
                "query":window.localStorage.getItem("searchEditStudent")
            }
        }
        
        setReloadTable(true)
        const result = await paginationStudent(body,token,schoolID)
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
            "query":window.localStorage.getItem("searchEditStudent")
        }
        
        window.localStorage.setItem("pageEditStudent",page)
        
        setReloadTable(true)
        const result = await paginationStudent(body,token,schoolID)
        setReloadTable(false)
        
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
            <div className='table-responsive'>
                <style jsx>{`
					.detailinfo_btn{
						border:none;
						background-color:#004d99;
						color:white;
						border-radius:4px;
					}
				`}</style>
                <table className='table align-middle'>
                    <thead>
                        <tr>
                            <th style={{width:"500px"}}>ชื่อ-นามสกุล</th>
                            <th className='text-end' style={{width:"500px",marginRight:"10px"}}><span style={{marginRight:"3px"}}>รายละเอียด</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.map((item,index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.firstname} {item.lastname}</td>
                                    <td className='text-end'>
                                        <button className='btn detailinfo_btn btn-sm' 
                                            onClick={(ev) => detailInfo(item,ev)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#editStudentModal"
                                            data-bs-id={item.userID}
                                            >รายละเอียด
                                        </button>
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
        return <div className='text-center fs-3'>ระบบเกิดข้อผิดพลาดไม่สามารถแสดงข้อมูลได้</div>
    }else{
        return (
            <>
                <div>
                    <div className="text-center display-6 mb-3">
                        <span className=''>แก้ไขข้อมูลของนักเรียน</span>
                        
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <form className='mb-3'>
                                <div className='input-group'>
                                    <span className="input-group-text">ค้นหา</span>
                                    <input type="text" placeholder="ค้นหาด้วย ชื่อนามสกุล" className='form-control' ref={search}></input>
                                    <button className='btn' style={{backgroundColor:"#11620e",color:"#fff"}} onClick={(ev) => clickAccept(ev)}>ยืนยัน</button>
									<button className='btn' style={{backgroundColor:"#881b1b",color:"#fff"}} onClick={(ev) => clickReset(ev)}>รีเซต</button>
                                </div>
                            </form>
                        </div>
                        <div className='col-12'>
                            {reloadTable ? reload :
                                notShowAlert ? data : alert}
                        </div>
                    </div>
                    {reloadTable ? null :
                        notShowAlert ? paginate : null}
                </div>
    
                <div className="modal fade" id="editStudentModal">
                    <div className="modal-dialog">
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h3 className="modal-title">แบบฟอร์มแก้ไขข้อมูลนักเรียน</h3>
                                <button className='btn-close' data-bs-dismiss="modal"></button>
                            </div>
                            <div className='modal-body'>
                                <form className="row gy-2 gx-3">
                                    <div className="col-12">
                                        <label className="form-label">ชื่อ</label>
                                        <input type="text" className="form-control" ref={firstname}/>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">นามสกุล</label>
                                        <input type="text" className="form-control" ref={lastname}/>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">อีเมลล์</label>
                                        <input type="email" className="form-control" ref={email} disabled/>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="form-label">โทรศัพท์มือถือ</label>
                                        <input type="tel" className="form-control" ref={tel}/>
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="form-label">ชั้นปีที่</label>
                                        <input type="number" className="form-control" min="1" max="6" ref={classYear}/>
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="form-label">ปีการศึกษา</label>
                                        <input type="number" className="form-control" min={school_data.nowSchoolYear} ref={enteredYear}/>
                                    </div>
                                </form>
                            </div>
                            <div className='modal-footer'>
                                <button className='btn' style={{backgroundColor:"#881b1b",color:"#fff"}} data-bs-dismiss="modal">ยกเลิก</button>
                                <button className='btn' style={{backgroundColor:"#11620e",color:"#fff"}} data-bs-dismiss="modal" onClick={()=> updateStudent()}>แก้ไข</button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </>
        )
    }
}