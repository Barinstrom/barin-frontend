import React, {useState, useRef, useEffect} from "react";
import { get_teacher_ownclubs } from "../../utils/teacher/teacher_getdata";
import { update_club } from "../../utils/teacher/edit_data";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";
import Review from "../student/reviewmodal_seeonly";

export default function OwnClub({ schoolID, data_school }) {
	const clubName = useRef()
	const clubInfo = useRef()
	const clubLimit = useRef()
	const scheduleStart = useRef()
	const scheduleEnd = useRef()
	const groupID = useRef()
	const category = useRef()
	const day = useRef()

	const clubName2 = useRef()
	const clubInfo2 = useRef()
	const clubLimit2 = useRef()
	const scheduleStart2 = useRef()
	const scheduleEnd2 = useRef()
	const groupID2 = useRef()
	const category2 = useRef()
	const day2 = useRef()
	const [clubImg2, setClubImg2] = useState("")
	
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
			} else {
				console.log(result.data)
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

		const [ dayx ,StartandEnd ] = club.schedule[0].split(" ")
		day.current.value = dayx
		// console.log(dayx ,StartandEnd)
		const [ startTime ,endTime ] = StartandEnd.split("-")
		scheduleStart.current.value = startTime
		scheduleEnd.current.value = endTime
		
		if (club.urlPicture){
			setClubImg(club.urlPicture)
		}else{
			setClubImg("https://dummyimage.com/300x300")
		}
	}

	function clickModal2(club) {
		console.log(club)
		clubName2.current.setAttribute("club-id", club._id)
		clubName2.current.value = club.clubName
		clubInfo2.current.value = club.clubInfo
		category2.current.value = club.category
		groupID2.current.value = club.groupID
		clubLimit2.current.value = club.limit

		const [dayx, StartandEnd] = club.schedule[0].split(" ")
		day2.current.value = dayx
		// console.log(dayx ,StartandEnd)
		const [startTime, endTime] = StartandEnd.split("-")
		scheduleStart2.current.value = startTime
		scheduleEnd2.current.value = endTime

		if (club.urlPicture) {
			setClubImg2(club.urlPicture)
		} else {
			setClubImg2("https://dummyimage.com/300x300")
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
				schedule: [String(day.current.value) + " " +String(scheduleStart.current.value) + "-" + String(scheduleEnd.current.value)],
			}
			
			Swal.fire({
				title: "คุณต้องการแก้ไข" + '\n' + "ข้อมูลชุมนุมใช่หรือไม่",
				showConfirmButton: true,
				confirmButtonColor: "#0208bb",
				confirmButtonText: 'ok',
	
				showCancelButton: true,
				cancelButtonText: "cancel",
				cancelButtonColor: "#d93333",

				showLoaderOnConfirm: true,
				preConfirm: () => {
					return update_club(body_update, token, schoolID);
				},
				allowOutsideClick: false

			}).then((res) => {
				if (res.isConfirmed) {
					const result_update = res.value === "true" ? true : false
					if (!result_update) {
							Swal.fire({
								icon: 'error',
								title: 'แก้ไขข้อมูลไม่สำเร็จ',
								showConfirmButton: true,
								confirmButtonColor: "#d1000a",
								confirmButtonText: 'ok',
							})
							return
						}else{
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
				}
			})
		}
	
  	function displayStudentList(e){
		window.localStorage.setItem("clubNameFromClick",e.clubName)
			window.localStorage.setItem("clubidFromClick", e._id)
			window.localStorage.setItem("clubYearFromClick", e.schoolYear)
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
				<div className="text-center display-6 mb-3">OwnClub</div>
				<div className="alert alert-dismissible fade show border">
					<button className="btn-close" data-bs-dismiss="alert"></button>
					<div className="alert-text">
						<label className="form-label">ปุ่มรายละเอียดสี</label>
						<input type="color" className="form-control-color form-control-sm ms-2" value="#404040" disabled/>
						<label className="form-label ms-1">เป็นปุ่มดูรายละเอียดชุมนุมในอดีต ซึ่งไม่สามารถแก้ไขรายละเอียดได้</label>
					</div>
					<div className="alert-text">
						<label className="form-label">ปุ่มรายละเอียดสี</label>
						<input type="color" className="form-control-color form-control-sm ms-2" value="#004d99" disabled/>
						<label className="form-label ms-1">เป็นปุ่มดูรายละเอียดชุมนุมในปัจจุบัน สามารถแก้ไขรายละเอียดได้</label>
						</div>
				</div>
				<div className="table-responsive">
					<style jsx>{`
						.detailinfo_btn{
							border:none;
							background-color:#004d99;
							color:white;
							border-radius:4px;
						}

						.detailinfo_notbtn{
							border:none;
							background-color:#404040;
							color:white;
							border-radius:4px;
						}

						.liststudent_btn{
							border:none;
							background-color:#9c4d0d;
							color:white;
							border-radius:4px;
						}
					`}</style>
					<table className="table align-middle">
						<thead>
							<tr>
								<th style={{width: "10%"}}>ปีการศึกษา</th>
								<th style={{width: "40%"}}>ชื่อชุมนุม</th>
								<th style={{width: "20%"}} className="text-center">รายชื่อนักเรียน</th>
								<th style={{width: "20%"}} className="text-center">รายละเอียดชุมนุม</th>
								<th style={{width: "10%"}} className="text-center">รีวิว</th>
							</tr>
						</thead>
						<tbody>
							{data.map((e, i) => {
								return (
									<tr key={i}>
										<td>{e.schoolYear}</td>
										<td>{e.clubName}</td>
										<td className="text-center">
											<button className="btn btn-sm liststudent_btn" 
												onClick={(ev) => displayStudentList(e,ev)}>
												ดูรายชื่อ
											</button>
										</td>
										<td className="text-center">
											{ 
												data_school.nowSchoolYear != e.schoolYear ?
													<button className="btn btn-sm detailinfo_notbtn"
														data-bs-toggle="modal"
														data-bs-target="#modalOwnClubTeacher2"
														onClick={(ev) => clickModal2(e, ev)}>
														รายละเอียด
													</button> :
													<button className="btn btn-sm detailinfo_btn"
														data-bs-toggle="modal"
														data-bs-target="#modalOwnClubTeacher"
														onClick={(ev) => clickModal(e, ev)}>
														รายละเอียด
													</button>
													
											}
												
										</td>
										<td className="text-center">
											<Review item={e} schoolID={schoolID} nowSchoolYear={data_school.nowSchoolYear} />
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				
				
				<div className="modal fade" id="modalOwnClubTeacher">
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

									<div className="col-12">
										<label className="form-label">วันที่สอน</label>
										<select className="form-select" aria-label="Default select example" ref={day}>
											<option value="วันจันทร์">วันจันทร์</option>
											<option value="วันอังคาร">วันอังคาร</option>
											<option value="วันพุธ">วันพุธ</option>
											<option value="วันพฤหัสบดี">วันพฤหัสบดี</option>
											<option value="วันศุกร์">วันศุกร์</option>
											<option value="วันเสาร์">วันเสาร์</option>
											<option value="วันอาทิตย์">วันอาทิตย์</option>
										</select>
									</div>
									<div className="col-sm-6">
										<label className="form-label">เวลาเริ่ม</label>
                    <input type="time" className="form-control" name="startTime" ref={scheduleStart}></input>
									</div>
									<div className="col-sm-6">
										<label className="form-label">เวลาจบ</label>
										<input type="time" className="form-control" name="endTime" ref={scheduleEnd}></input>
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
								<button className="btn" style={{ backgroundColor:"#11620e",color:"#fff"}}  onClick={() => Submit()}>แก้ไข</button>
							</div>
						</div>
					</div>
				</div>

				<div className="modal fade" id="modalOwnClubTeacher2">
					<div className="modal-dialog modal-dialog-scrollable">
						<div className="modal-content">

							<div className="modal-header">
								<div className="modal-title fs-3">Club Info</div>
								<button className="btn-close" data-bs-dismiss="modal"></button>
							</div>

							<div className="modal-body">
								<div className="alert alert-warning">
									ข้อมูลคลับในอดีต ไม่สามารถแก้ไขได้
								</div>
								<div className="row">
									<div className="col-12">
										<label className="form-label">Club Name:</label>
										<input type="text" className="form-control" ref={clubName2} disabled></input>
									</div>

									<div className="col-12">
										<label className="form-label">วันที่สอน</label>
										<select className="form-select" aria-label="Default select example" ref={day2} disabled>
											<option value="วันจันทร์">วันจันทร์</option>
											<option value="วันอังคาร">วันอังคาร</option>
											<option value="วันพุธ">วันพุธ</option>
											<option value="วันพฤหัสบดี">วันพฤหัสบดี</option>
											<option value="วันศุกร์">วันศุกร์</option>
											<option value="วันเสาร์">วันเสาร์</option>
											<option value="วันอาทิตย์">วันอาทิตย์</option>
										</select>
									</div>
									<div className="col-sm-6">
										<label className="form-label">เวลาเริ่ม</label>
										<input type="time" className="form-control" name="startTime" ref={scheduleStart2} disabled></input>
									</div>
									<div className="col-sm-6">
										<label className="form-label">เวลาจบ</label>
										<input type="time" className="form-control" name="endTime" ref={scheduleEnd2} disabled></input>
									</div>

									<div className="col-12">
										<label className="form-label">รหัสวิชา</label>
										<input type="text" className="form-control" ref={groupID2} disabled />
									</div>

									<div className="col-12">
										<label className="form-label">category</label>
										<input type="text" className='form-control' ref={category2} disabled />
									</div>

									<div className="col-12 mt-2">
										<label className="form-label">Description:</label>
										<textarea cols={5} row={5} className="form-control" ref={clubInfo2} disabled></textarea>
									</div>

									<div className="col-12 mt-2">
										<label className="form-label">Picture:</label>
										<img src={clubImg2} className="form-control" />
										<input className="form-control mt-2" type="file" disabled />
									</div>

									<div className="col-12 mt-2">
										<label className="form-label">Limit:</label>
										<input type="text" className="form-control" ref={clubLimit2} disabled></input>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}
}