/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect,useState,useRef} from 'react';
import {useRouter} from 'next/router';
import Cookies from "universal-cookie";
import Swal from 'sweetalert2';
import { get_pending,sys_edit_school } from '../../utils/system_admin/system';

export default function Pending() {
	const router = useRouter()
	
	const [reloadTable, setReloadTable] = useState(false)
	const [data, setData] = useState([])
	const [paginate, setPaginate] = useState([])
	const [displayError, setDisplayError] = useState(false)
	const [schoolID,setSchoolID] = useState()
	
	const search = useRef()
	const schoolName = useRef()
	const urlCertificateDocument = useRef()
	const editUrlCertificateDocument = useRef()
	const urlLogo = useRef()
	const headCertificateDocument = useRef()

	const cookies = new Cookies();
	const token = cookies.get("token");

	useEffect(() => {
		window.localStorage.removeItem("searchPending")
		window.localStorage.removeItem("pagePending")

		const body = {"page": 1}
		window.localStorage.setItem("pagePending", 1)
		
		get_pending(body, token).then(result => {
			console.log(result)
			if (!result) {
				setDisplayError(true)
			} else {
				const paginate_tmp = generate(result.data)
				setDisplayError(false)
				showData(result.data.docs)
				showPaginate(paginate_tmp)
			}
		})
	}, [])

	function editUrlCertificateDocumentencodeImageFileAsURL(ev) {
		let file = ev.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			editUrlCertificateDocument.current.src = reader.result;
		};
	}

	function urlLogoencodeImageFileAsURL(ev) {
		let file = ev.target.files[0];
		let reader = new FileReader();
		
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			urlLogo.current.src = reader.result;
		};
	}

	async function clickReset(ev) {
		ev.preventDefault()
		window.localStorage.removeItem("searchPending")
		search.current.value = ""

		const result = await get_pending({ "page": 1 }, token)

		if (!result) {
			setDisplayError(true)
		} else {
			const paginate_tmp = generate(result)
			setDisplayError(false)
			showData(result.docs)
			showPaginate(paginate_tmp)
		}
	}

	async function clickAccept(ev) {
		ev.preventDefault()
		let body

		if (!search.current.value) {
			window.localStorage.removeItem("searchPending")
			body = { "page": 1 }
		} else {
			window.localStorage.setItem("searchPending", search.current.value)
			body = {
				"page": 1,
				"query": window.localStorage.getItem("searchPending")
			}
		}

		const result = await get_pending(body, token)

		if (!result) {
			setDisplayError(true)
		} else {
			const paginate_tmp = generate(result)
			setDisplayError(false)
			showData(result.docs)
			showPaginate(paginate_tmp)
		}
	}

	function generate(result) {
		const paginate_tmp = []
		if (result.hasPrevPage) {
			paginate_tmp.push(<button className='page-link' onClick={() => clickPage(1)}><i className="fa-solid fa-angles-left"></i></button>)
			paginate_tmp.push(<button className='page-link' onClick={() => clickPage((result.page - 1))}><i className="fa-solid fa-angle-left"></i></button>)
		} else {
			paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angles-left"></i></button>)
			paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angle-left"></i></button>)
		}

		paginate_tmp.push(<button className='page-link disabled'>{result.page}</button>)

		if (result.hasNextPage) {
			paginate_tmp.push(<button className='page-link' onClick={() => clickPage((result.page + 1))}><i className="fa-solid fa-angle-right"></i></button>)
			paginate_tmp.push(<button className='page-link' onClick={() => clickPage(result.totalPages)}><i className="fa-solid fa-angles-right"></i></button>)
		} else {
			paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angle-right"></i></button>)
			paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angles-right"></i></button>)
		}
		return paginate_tmp
	}


	async function clickPage(page) {
		const body = {
			"page": page,
			"query": window.localStorage.getItem("searchPending")
		}
		window.localStorage.setItem("pagePending", page)

		setReloadTable(true)
		const result = await get_pending(body, token)
		setReloadTable(false)

		if (!result) {
			setDisplayError(true)
		} else {
			const paginate_tmp = generate(result)
			setDisplayError(false)
			showData(result.docs)
			showPaginate(paginate_tmp)
		}
	}

	function showData(result) {
		const template = (
			<>
				<style jsx>{`
					.certificate{
						cursor: pointer;
						color:#4794e1;
					}
					.certificate:hover{
						text-decoration: underline;
					}
				`}</style>
				
				<div className='table-responsive'>
					<table className='table table-striped align-middle'>
					<thead>
						<tr>
							<th style={{ width: "100px" }}>schoolID</th>
							<th style={{ width: "300px" }}>schoolName</th>
							<th style={{ width: "150px" }} className="text-center"><span className=''>certificate</span></th>
							<th style={{ width: "200px" }} className="text-center"><span className=''>จัดการโรงเรียน</span></th>
						</tr>
					</thead>
					<tbody>
						{result.map((item, index) => {
							//console.log(item)
							return (
								<tr key={index}>
									<td><span>{item.schoolID}</span></td>
									<td><span>{item.schoolName}</span></td>
									<td className="text-center">
										<span className={`certificate`}
											onClick={() => getUrlCertificateDocument(item)}
											data-bs-toggle="modal"
											data-bs-target="#urlCertificateDocument"
										>กดเพื่อดู certificate</span>
									</td>
									<td className="d-flex flex-column flex-lg-row justify-content-end">
										<button className="btn btn-sm btn-warning me-1 mt-1 mt-md-0"
											onClick={() => getDetails(item)}
											data-bs-toggle="modal"
											data-bs-target="#approveModal"
										>แก้ไขข้อมูล</button>
										<button className='btn btn-sm btn-success me-1 mt-1 mt-md-0'
											onClick={() => approveSchool(item)}
										>
											approve
										</button>
										<button className='btn btn-sm btn-danger me-1 mt-1 mt-md-0'
											onClick={() => notApproveSchool(item)}
										>
											not approve
										</button>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
				</div>
				
			</>
		)
		setData(template)
	}

	function showPaginate(paginate) {
		const template = (
			<ul className='pagination justify-content-center'>
				{paginate.map((item, index) => {
					return (
						<li key={index} className="page-item">{item}</li>
					)
				})}
			</ul>
		)
		setPaginate(template)
	}

	function getDetails(item) {
		schoolName.current.value = item.schoolName
		setSchoolID(item.schoolID)
		urlLogo.current.src = item.urlLogo
		editUrlCertificateDocument.current.src = item.urlCertificateDocument
	}

	function getUrlCertificateDocument(item) {
		// console.log(item)
		urlCertificateDocument.current.src = item.urlCertificateDocument
		headCertificateDocument.current.innerText = "Certificate Doc of " + String(item.schoolName)
    }
    
    function approveSchool(item) {
        console.log(item)
        Swal.fire({
            title: 'คุณต้องการยืนยันว่า Approve โรงเรียนนี้ใช่หรือไม่',
            showConfirmButton: true,
            confirmButtonColor: "#0047a3",
            confirmButtonText: 'ยืนยัน',

            showCancelButton: true,
            cancelButtonText: "cancel",
            cancelButtonColor: "#d93333",
		}).then((result) => {
			if (result.isConfirmed){
				const body = {
					schoolID: item.schoolID,
					schoolName: item.schoolName,
					status:"approve"
				}
				
				sys_edit_school(token,body).then(result => {
					if (result){
						Swal.fire({
							icon: 'success',
							title: 'ทำการ approve สำเร็จ',  
							showConfirmButton:true,
							confirmButtonColor:"#00a30b"
						}).then(res => {
							router.reload()
					})
					}else{
						Swal.fire({
							icon: 'error',
							title: 'ทำการ approve ไม่สำเร็จ',  
							showConfirmButton:true,
							confirmButtonColor:"#00a30b"
						}).then(res => {
							router.reload()
					})
					}
				})
			}
		})
	}
	
	function notApproveSchool(item) {
        //console.log(item)
        Swal.fire({
            title: 'คุณต้องการยืนยันว่า Not approve โรงเรียนนี้ใช่หรือไม่',
            showConfirmButton: true,
            confirmButtonColor: "#0047a3",
            confirmButtonText: 'ยืนยัน',

            showCancelButton: true,
            cancelButtonText: "ยกเลิก",
            cancelButtonColor: "#d93333",
        }).then((result) => {
            if (result.isConfirmed){
				const body = {
					schoolID: item.schoolID,
					schoolName: item.schoolName,
					status:"not_approve"
				}
				
				sys_edit_school(token,body).then(result => {
					if (result){
						Swal.fire({
							icon: 'success',
							title: 'ทำการ not approve สำเร็จ',  
							showConfirmButton:true,
							confirmButtonColor:"#0047a3"
					}).then(res => {
							router.reload()
					})
					}else{
						Swal.fire({
							icon: 'error',
							title: 'ทำการ not approve ไม่สำเร็จ',  
							showConfirmButton:true,
							confirmButtonColor:"#00a30b"
						}).then(res => {
							router.reload()
					})
					}
				})
			}
        })
    }

	function Edit_school(ev) {
		ev.preventDefault();
		const body = {
			schoolID: schoolID,
			schoolName: schoolName.current.value,
			urlLogo: urlLogo.current.src,
			urlCertificateDocument: editUrlCertificateDocument.current.src
		}
		sys_edit_school(token,body).then(result => {
			if (result){
				Swal.fire({
					icon: 'success',
					title: 'แก้ไขข้อมูลสำเร็จ',
					showConfirmButton: true,
					confirmButtonColor: "#009431",
					confirmButtonText: 'ok',
				}).then(() => {
					router.reload()
				})
			}else{
				Swal.fire({
					icon: 'error',
					title: 'แก้ไขข้อมูลไม่สำเร็จ',
					showConfirmButton: true,
					confirmButtonColor: "#d1000a",
					confirmButtonText: 'ok',
				}).then(() => {
					router.reload()
				})
			}
		})
	}

  const reload = (
		<main style={{ height: "400px" }}>
			<div className="d-flex justify-content-center h-100 align-items-center">
				<div className="fs-4">loading ...</div>
				<div className="spinner-border ms-3"></div>
			</div>
		</main>
	)

	if (displayError) {
		return <div className='text-center'>ระบบเกิดข้อผิดพลาดไม่สามารถแสดงข้อมูลได้</div>
	} else {
		return (
			<>
				<div>
					<div className="text-center fs-1 mb-3">Pending</div>
					<div className='row mb-4'>
						<div className='col-12'>
							<form className='mb-5'>
								<div className='input-group'>
									<span className="input-group-text">ค้นหา</span>
									<input type="text" className='form-control' ref={search}></input>
									<button className='btn btn-success' onClick={(ev) => clickAccept(ev)}>ยืนยัน</button>
									<button className='btn btn-danger' onClick={(ev) => clickReset(ev)}>รีเซต</button>
								</div>
							</form>
							{reloadTable ? reload : data}
						</div>
					</div>
					{paginate}
				</div>

				<div className="modal fade" id="approveModal">
					<div className="modal-dialog">
						<div className='modal-content'>
							<div className='modal-header'>
								<h3 className="modal-title">รายละเอียดโรงเรียน</h3>
								<button className='btn-close' data-bs-dismiss="modal"></button>
							</div>
							<div className='modal-body'>
								<div className="row">
									<div className="col-12">
										<label className="form-label">School Name</label>
										<input type="text" className='form-control' ref={schoolName} />
									</div>
									<div className="col-12 mt-3">
										<div className='d-flex justify-content-center'>
											<img className='img-fluid d-block' style={{width:"300px"}} ref={urlLogo} />
										</div>
										
										<label className="form-label">UrL Logo</label>
										<input
											className="form-control"
											type="file"
											onChange={(ev) => urlLogoencodeImageFileAsURL(ev)}
										/>
									</div> 
									<div className="col-12 mt-3">
										<div className='d-flex justify-content-center'>
											<img className='img-fluid' style={{width:"100%"}} ref={editUrlCertificateDocument} />
										</div>
										
										<label className="form-label">Url CertificateDocument</label>
										<input
											className="form-control" type="file"
											onChange={(ev) => editUrlCertificateDocumentencodeImageFileAsURL(ev)}
										/>
									</div> 

								</div>
							</div>
							<div className='modal-footer'>
								<button className='btn btn-success' onClick={(ev) => Edit_school(ev)}>แก้ไขข้อมูล</button>
								<button className='btn btn-danger' data-bs-dismiss="modal">ยกเลิก</button>
							</div>
						</div>
					</div>
				</div>

				<div className="modal fade" id="urlCertificateDocument">
					<div className="modal-dialog">
						<div className='modal-content'>
							<div className='modal-header'>
								<h3 className="modal-title" ref={headCertificateDocument}></h3>
								<button className='btn-close' data-bs-dismiss="modal"></button>
							</div>
							<div className='modal-body'>
								<div className="row">
									<div className="col-12">
										<div className='d-flex flex-column align-items-center'>
											<img className='img-fluid' ref={urlCertificateDocument} />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}

}