/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect,useState,useRef} from 'react';
import {useRouter} from 'next/router';
import Cookies from "universal-cookie";
import Link from 'next/link';
import Swal from 'sweetalert2';
import { get_approved,sys_edit_school } from '../../utils/system_admin/system';


export default function Aprroved() {
	const router = useRouter()
	const [reloadTable, setReloadTable] = useState(true)
	const [data, setData] = useState([])
	const [paginate, setPaginate] = useState([])
	const [displayError, setDisplayError] = useState(false)
	const [notShowAlert, setNotShowAlert] = useState(0)

	
	const search = useRef()
	const schoolName = useRef()
	const urlLogo = useRef()
	const editUrlCertificateDocument = useRef()
	
	const headCertificateDocument = useRef()
	const urlCertificateDocument = useRef()

	const cookies = new Cookies();
	const token = cookies.get("token");

	useEffect(() => {
		window.localStorage.removeItem("searchAprroved")
		window.localStorage.removeItem("pageAprroved")

		const body = {"page": 1}
		window.localStorage.setItem("pageAprroved", 1)

		get_approved(body, token).then(result => {
			setReloadTable(false)
			if (!result) {
				setDisplayError(true)
			} else {
				const paginate_tmp = generate(result.data)
				setDisplayError(false)
				showData(result.data.docs)
				showPaginate(paginate_tmp)
				setNotShowAlert(result.data.totalDocs)
			}
		})
	}, [])

	const reload = (
		<main style={{ height: "350px" }}>
			<div className="d-flex justify-content-center h-100 align-items-center">
				<div className="fs-4">loading ...</div>
                <div className="spinner-border ms-3"></div>
			</div>
		</main>
	)

	const alert = (
		<div className="alert alert-dark" role="alert">
			ไม่พบโรงเรียน
		</div>
	)

	async function clickReset(ev) {
		ev.preventDefault()
		window.localStorage.removeItem("searchAprroved")
		window.localStorage.setItem("pageAprroved", 1)
		search.current.value = ""

		setReloadTable(true)
		const result = await get_approved({ "page": 1 }, token)
		setReloadTable(false)

		if (!result) {
			setDisplayError(true)
		} else {
			const paginate_tmp = generate(result.data)
			setDisplayError(false)
			showData(result.data.docs)
			showPaginate(paginate_tmp)
			setNotShowAlert(result.data.totalDocs)
		}
	}
	
	async function clickAccept(ev) {
		ev.preventDefault()
		let body

		if (!search.current.value) {
			window.localStorage.removeItem("searchAprroved")
			window.localStorage.setItem("pageAprroved", 1)
			body = { "page": 1 }
		} else {
			window.localStorage.setItem("searchAprroved", search.current.value)
			window.localStorage.setItem("pageAprroved", 1)
			body = {
				"page": 1,
				"query": window.localStorage.getItem("searchAprroved")
			}
		}

		setReloadTable(true)
		const result = await get_approved(body, token)
		setReloadTable(false)

		if (!result) {
			setDisplayError(true)
		} else {
			// console.log(result.data)
			const paginate_tmp = generate(result.data)
			setDisplayError(false)
			showData(result.data.docs)
			showPaginate(paginate_tmp)
			setNotShowAlert(result.data.totalDocs)
		}
	}

	function generate(result) {
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

	async function clickPage(page) {
		const body = {
			"page": page,
			"query": window.localStorage.getItem("searchAprroved")
		}
		window.localStorage.setItem("pageAprroved", page)

		setReloadTable(true)
		const result = await get_approved(body, token)
		setReloadTable(false)

		if (!result) {
			setDisplayError(true)
		} else {
			const paginate_tmp = generate(result.data)
			setDisplayError(false)
			showData(result.data.docs)
			showPaginate(paginate_tmp)
			setNotShowAlert(result.data.totalDocs)
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

					.all_taga{
						border:none;
						background-color:#2f3d20;
						color:white;
						border-radius:3px;
						text-decoration:none;
						padding:0 5px;
					}

					.edit_btn{
						border:none;
						background-color:#7c3d09;
						color:white;
						border-radius:4px;
					}

				`}</style>
				
				<div className='table-responsive'>
					<table className='table table-striped align-middle'>
						<thead>
							<tr>
								<th style={{ width: "100px" }}>schoolID</th>
								<th style={{ width: "400px" }}>schoolName</th>
								<th style={{ width: "150px" }} className="text-center"><span>certificate</span></th>
								<th style={{ width: "150px" }} className="text-center"><span className='ms-0 ms-xl-5'>จัดการโรงเรียน</span></th>
							</tr>
						</thead>
						<tbody>
							{result.map((item, index) => {
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
											<button className='edit_btn me-0 me-lg-2'
												onClick={() => getDetails(item)}
												data-bs-toggle="modal"
												data-bs-target="#approveModal"
											>
												แก้ไขข้อมูล
											</button>
											<Link href={{
												pathname: `/system_admin/${item.schoolID}`,
											}}>
												<a className='all_taga text-center mt-1 mt-lg-0'>สวมรอย</a>
											</Link>
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
						<li key={index} className="page-item">
							{item}
						</li>
					)
				})}
			</ul>
		)
		setPaginate(template)
	}

	function getDetails(item) {
		schoolName.current.value = item.schoolName
		schoolName.current.setAttribute("data-schoolID",item.schoolID)
		urlLogo.current.src = item.urlLogo
		editUrlCertificateDocument.current.src = item.urlCertificateDocument
	}

	function getUrlCertificateDocument(item) {
		urlCertificateDocument.current.src = item.urlCertificateDocument
		headCertificateDocument.current.innerText = "Certificate Doc of " + String(item.schoolName)
	}

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

	function update_school(ev) {
		ev.preventDefault();
		if (schoolName.current.getAttribute("data-schoolID") === "" || schoolName.current.value === "" || urlLogo.current.src === "" || editUrlCertificateDocument.current.src === " ") {
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
			schoolID: schoolName.current.getAttribute("data-schoolID"),
			schoolName: schoolName.current.value,
			urlLogo: urlLogo.current.src,
			urlCertificateDocument: editUrlCertificateDocument.current.src
		}
		Swal.fire({
			title: 'คุณต้องการแก้ไขข้อมูลโรงเรียนนี้ใช่หรือไม่',
			showConfirmButton: true,
			confirmButtonColor: "#0047a3",
			confirmButtonText: 'ยืนยัน',

			showCancelButton: true,
			cancelButtonText: "cancel",
			cancelButtonColor: "#d93333",

			showLoaderOnConfirm: true,
			preConfirm: () => {
				return sys_edit_school(token, body)
			},
			allowOutsideClick: false

		}).then((result) => {
			if (result.isConfirmed) {
				// console.log(result)
				const result_update = result.value === "true" ? true : false
				if (result_update) {
					Swal.fire({
						icon: 'success',
						title: 'ทำการแก้ไขสำเร็จ',
						showConfirmButton: true,
						confirmButtonColor: "#0047a3"
					}).then(() => {
						router.reload()
					})
				}
				else {
					Swal.fire({
						icon: 'error',
						title: 'ทำการแก้ไขไม่สำเร็จ',
						showConfirmButton: true,
						confirmButtonColor: "#00a30b"
					}).then(() => {
						router.reload()
					})
				}

			}
		})
		
		// sys_edit_school(token,body).then(result => {
		// 	if (result==='true'){
		// 		Swal.fire({
		// 			icon: 'success',
		// 			title: 'แก้ไขข้อมูลสำเร็จ',
		// 			showConfirmButton: true,
		// 			confirmButtonColor: "#009431",
		// 			confirmButtonText: 'ok',
		// 		}).then(() => {
		// 			router.reload()
		// 		})
		// 	}else{
		// 		Swal.fire({
		// 			icon: 'error',
		// 			title: 'แก้ไขข้อมูลไม่สำเร็จ',
		// 			showConfirmButton: true,
		// 			confirmButtonColor: "#d1000a",
		// 			confirmButtonText: 'ok',
		// 		}).then(() => {
		// 			router.reload()
		// 		})
		// 	}
		// })
	}

	if (displayError) {
		return <div className='text-center'>ระบบเกิดข้อผิดพลาดไม่สามารถแสดงข้อมูลได้</div>
	} else {
		return (
			<>
				<div>
					<div className="text-center fs-1 mb-3">
						<span className=''>Approve</span>
						
					</div>
					<div className='row mb-4'>
						<div className='col-12'>
							<form className='mb-5'>
								<div className='input-group'>
									<span className="input-group-text">ค้นหา</span>
									<input type="text" placeholder="ค้นหาด้วย schoolID" className='form-control' ref={search}></input>
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

				<div className="modal fade" id="approveModal">
					<div className="modal-dialog modal-dialog-scrollable">
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
								<button className='btn' style={{backgroundColor:"#11620e",color:"#fff"}} onClick={(ev) => update_school(ev)}>แก้ไขข้อมูล</button>
								<button className='btn btn-danger' style={{backgroundColor:"#881b1b",color:"#fff"}} data-bs-dismiss="modal">ยกเลิก</button>
							</div>
						</div>
					</div>
				</div>

				<div className="modal fade" id="urlCertificateDocument">
					<div className="modal-dialog modal-dialog-scrollable">
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