import React, {useState, useRef, useEffect} from "react";
import { get_teacher_ownclubs } from "../../utils/teacher/teacher_getdata";
import { update_club } from "../../utils/teacher/edit_data";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";

export default function OwnClub({schoolID}) {
	const clubName = useRef()
	const clubInfo = useRef()
	const clubLimit = useRef()
	const scheduleStart = useRef()
	const scheduleEnd = useRef()
	const groupID = useRef()
	const category = useRef()
	
	const [clubImg, setClubImg] = useState("")
	const [data, setData] = useState([])
	const [loading,setLoading] = useState(true)
	const [displayError, setDisplayError] = useState(false)
	
	const cookies = new Cookies()
	const token = cookies.get("token")

	useEffect(() => {
		setLoading(true)
		get_teacher_ownclubs(token,schoolID).then(result => {
			if (!result){
				setLoading(false)
				setDisplayError(true)
			}else{
				const clubs = result.data
				setData(clubs)
				setDisplayError(false)
				setLoading(false)
			}
		})
	},[])

	function encodeImageFileAsURL(ev) {
		let file = ev.target.files[0];
		let reader = new FileReader();
		
		reader.readAsDataURL(file);
		reader.onloadend = function () {
			setClubImg(reader.result);
		};
	}

	function clickModal(club){
		console.log(club)
		clubName.current.setAttribute("club-id",club._id)
		clubName.current.value = club.clubName
		clubInfo.current.value = club.clubInfo
		category.current.value = club.category
		groupID.current.value = club.groupID
		clubLimit.current.value = club.limit
		
		const [ startTime ,endTime ] = club.schedule[0].split("-")
		scheduleStart.current.value = startTime
		scheduleEnd.current.value = endTime
		
		if (club.urlPicture){
			setClubImg(club.urlPicture)
		}else{
			setClubImg("https://dummyimage.com/300x300")
		}
	}

		function Submit(){
			const body_update = {
				clubID: clubName.current.getAttribute("club-id"),
				clubName:clubName.current.value,
				clubInfo:clubInfo.current.value ,
				category:category.current.value ,
				limit: clubLimit.current.value,
				groupID: groupID.current.value,
				schedule: [String(scheduleStart.current.value) + "-" + String(scheduleEnd.current.value)],
			}
			
			Swal.fire({
				title: "คุณต้องการแก้ไข" + '\n' + "ข้อมูลชุมนุมใช่หรือไม่",
				showConfirmButton: true,
				confirmButtonColor: "#0208bb",
				confirmButtonText: 'ok',
	
				showCancelButton: true,
				cancelButtonText: "cancel",
				cancelButtonColor: "#d93333",
			}).then((res) => {
				if (res.isConfirmed){
					update_club(body_update, token, schoolID).then(result => {
						if (!result) {
							Swal.fire({
								icon: 'error',
								title: 'แก้ไขข้อมูลไม่สำเร็จ',
								showConfirmButton: true,
								confirmButtonColor: "#d1000a",
								confirmButtonText: 'ok',
							})
							return
						}else if(result.data.success){
							Swal.fire({
								icon: 'success',
								title: 'แก้ไขข้อมูลสำเร็จ',
								showConfirmButton:true,
								confirmButtonColor:"#009431"
							}).then(() => {
								get_teacher_ownclubs(token,schoolID).then(result => {
									if (!result){
										setLoading(false)
										setDisplayError(true)
									}else{
										const clubs = result.data
										setData(clubs)
										setDisplayError(false)
										setLoading(false)
									}
								})
							})
						}
					})	
				}
			})
		}

    function displayStudentList(e){
		//console.log(e)
		window.localStorage.setItem("clubNameFromClick",e.clubName)
		window.localStorage.setItem("clubidFromClick",e._id)
		window.localStorage.setItem("displayComponent",1)
		window.location.href = `/${schoolID}/teacher`
	}
	
	if(loading){
		return (
			<div className="d-flex justify-content-center align-items-center" style={{minHeight:"600px"}}>
				<div className="fs-4">loading ...</div>
				<div className="spinner-border ms-3"></div>
			</div>
		)
	}else if (displayError){
		return (
			<div className='text-center'>ระบบเกิดข้อผิดพลาดไม่สามารถแสดงข้อมูลได้</div>
		)
	}else{
		return (
			<main>
				<div className="text-center fs-1">OwnClub</div>
				<div className="table-responsive">
					<table className="table align-middle">
						<thead>
							<tr>
								<th style={{width: "60%"}}>ชื่อชุมนุม</th>
								<th style={{width: "20%"}} className="text-center">รายชื่อนักเรียน</th>
								<th style={{width: "20%"}} className="text-center">รายละเอียดชุมนุม</th>
							</tr>
						</thead>
						<tbody>
							{data.map((e, i) => {
								return (
									<tr key={i}>
										<td>{e.clubName}</td>
										<td className="text-center">
											<button className="btn btn-sm btn-success" 
												onClick={(ev) => displayStudentList(e,ev)}>
												ดูรายชื่อ
											</button>
										</td>
										<td className="text-center">
											<span>
												<button className="btn btn-sm btn-info" 
													data-bs-toggle="modal" 
													data-bs-target="#modalOwnClubTeacher" 
													onClick={(ev) => clickModal(e,ev)}>
													รายละเอียด
												</button>
											</span>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				
				
				<div className="modal" id="modalOwnClubTeacher">
					<div className="modal-dialog modal-dialog-scrollable">
						<div className="modal-content">
							
							<div className="modal-header">
								<div className="modal-title fs-3">Club Info</div>
								<button className="btn-close" data-bs-dismiss="modal"></button>
							</div>
							
							<div className="modal-body">
								<div className="row">
									<div className="col-12">
										<label className="form-label">Club Name:</label>
										<input type="text" className="form-control" ref={clubName}></input>
									</div>
									
									<div className="col-sm-6">
									<label className="form-label">เวลาเริ่ม</label>
                                    <input type="time" className="form-control mt-3" name="startTime" ref={scheduleStart}></input>
									</div>
									<div className="col-sm-6">
										<label className="form-label">เวลาจบ</label>
										<input type="time" className="form-control mt-3" name="endTime" ref={scheduleEnd}></input>
									</div>

									<div className="col-12">
										<label className="form-label">รหัสวิชา</label>
										<input type="text" className="form-control" ref={groupID}/>
									</div>
                                
									<div className="col-12">
										<label className="form-label">category</label>
										<input type="text" className='form-control' ref={category}/>
									</div>
									
									<div className="col-12 mt-2">
										<label className="form-label">Description:</label>
										<textarea cols={5} row={5} className="form-control" ref={clubInfo}></textarea>
									</div>
									
									<div className="col-12 mt-2">
										<label className="form-label">Picture:</label>
										<img src={clubImg} className="form-control" />
										<input className="form-control mt-2" type="file" onChange={(ev) => encodeImageFileAsURL(ev)}/>
									</div>
									
									<div className="col-12 mt-2">
										<label className="form-label">Limit:</label>
										<input type="text" className="form-control" ref={clubLimit}></input>
									</div>
								</div>
							</div>
							
							<div className="modal-footer">
								<button className="btn btn-success" id="submitbtn"  onClick={() => Submit()}>Submit</button>
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}
}