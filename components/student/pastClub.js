import React from "react";
import { useEffect, useState, useRef } from "react";
import ReviewEdit from "./reviewmodal_canedit";
import Review from "./reviewmodal_seeonly";
import { get_student_pastclub } from "../../utils/student/student";
import { getTeacherName } from "../../utils/auth";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";

export default function Pastclub({ schoolID, schedule, nowSchoolYear }) {
	const clubName = useRef()
	const clubInfo = useRef()
	const groupID = useRef()
	const category = useRef()
	const limitStudent = useRef()
	const schoolYear = useRef()
	const scheduleStart = useRef()
	const scheduleEnd = useRef()
	const teacherName = useRef()
	const teacherEmail = useRef()
	const day = useRef()
	const cookie = new Cookies()
	const token = cookie.get("token")

	const [displayError, setDisplayError] = useState(false)
	const [showData, setShowData] = useState([])
	const [clubImg, setClubImg] = useState("")


	useEffect(() => {
		get_student_pastclub(token, schoolID).then(res => {
			if (!res) {
				setDisplayError(true)
			} else if (res.data.clubs.length === 0) {
				const tmp = (
					<div className="alert alert-warning mt-3">
						<h4 className="alert-heading">คุณไม่มีชุมนุมที่เคยเรียนมา</h4>
					</div>
				)
				setShowData(tmp)
			} else {
				
				const tmp = (
					<div className="table-responsive">
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
									<th style={{ width: "100px" }}>รหัสวิชา</th>
									<th style={{ width: "500px" }}>ชื่อชุมนุม</th>
									<th style={{ width: "120px" }} className="text-center"><span>ลงทะเบียน</span></th>
									<th style={{ width: "80px" }} className="text-center"><span>รีวิว</span></th>
								</tr>
							</thead>
							<tbody>
								{res.data.clubs.map((item, index) => {
									// console.log(item)
									return (
										<tr key={index}>
											<td>{item.groupID}</td>
											<td>{item.clubName}</td>
											<td className="text-center">
												<button className='btn detailinfo_btn btn-sm'
													data-bs-toggle="modal"
													data-bs-target="#PastClubModal"
													data-bs-clubid={item._id}
													onClick={(ev) => detailInfo(item, ev)}
												>ดูรายละเอียด
												</button>
											</td>
											<td className="text-center">
												{/* {item.status} */}
												{item.status == "Pass" ? <ReviewEdit item={item} schoolID={schoolID} nowSchoolYear={nowSchoolYear} /> :
													<Review item={item} schoolID={schoolID} nowSchoolYear={nowSchoolYear} />
												}
												
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				)
				setShowData(tmp)
			}
		})
	}, [])

	function cantreview(ev) {
		Swal.fire({
			icon: 'error',
			title: "ต้องได้รับสถานะ Pass ชุมนุม\nจึงสามารถรีวิวได้",
			showConfirmButton: true,
			confirmButtonColor: "#d1000a"
		}).then(() => {
			return
		})
	}

	function detailInfo(item, ev) {
		// console.log(item)
		if (item.urlPicture) {
			setClubImg(item.urlPicture)
		} else {
			setClubImg("https://dummyimage.com/300x300")
		}
		clubName.current.setAttribute("data-clubid", ev.target.getAttribute("data-bs-clubid"))
		clubName.current.innerText = item.clubName
		clubInfo.current.innerText = item.clubInfo
		category.current.innerText = item.category
		limitStudent.current.innerText = item.limit + " คน"
		schoolYear.current.innerText = item.schoolYear
		groupID.current.innerText = item.groupID
		teacherEmail.current.innerText = item.teacherEmail


		let [day_tmp, schedule] = item.schedule[0].split(" ") // [ "17.02.00-18.02.00"]
		day.current.innerText = day_tmp

		let [st, en] = schedule.split("-")
		scheduleStart.current.innerText = st + " นาฬิกา"
		scheduleEnd.current.innerText = en + " นาฬิกา"
		getTeacherName(item, token, schoolID).then(result => {
			if (!result) {
				teacherName.current.innerText = "ไม่มีชื่อครูผู้สอน"
			}
			else if (!result.data) {
				teacherName.current.innerText = "ไม่มีชื่อครูผู้สอน"
			}
			else if (result.data) {
				const { firstname, lastname } = result.data._teacher
				teacherName.current.innerText = `${firstname} ${lastname}`
			} else {
				teacherName.current.innerText = "ไม่มีชื่อครูผู้สอน"
			}
		})
	}

	if (displayError) {
		return <div className="fs-4 text-center">เกิดข้อผิดพลาดไม่สามารถแสดงผลได้</div>
	} else {
		return (
			<>
				<div className="text-center display-6">
					<span className=''>Past Club</span>
					
				</div>
				<div className='row'>
					<div className='col-12'>
						{showData}
					</div>

					<div className="modal fade" id="PastClubModal">
						<div className="modal-dialog">
							<div className='modal-content'>
								<div className='modal-header'>
									<h3 className="modal-title">รายละเอียดชุมนุม</h3>
									<button className='btn-close' data-bs-dismiss="modal"></button>
								</div>
								<div className='modal-body'>
									<div className="row">
										<div className="col-12">
											<p>ชื่อคลับ : &nbsp;
												<span ref={clubName}></span>
											</p>
										</div>
										<div className="col-12">
											<p>รหัสวิชา : &nbsp;
												<span ref={groupID}></span>
											</p>
										</div>
										<div className="col-12">
											<p>อีเมลผู้สอน : &nbsp;
												<span ref={teacherEmail}></span>
											</p>
										</div>
										<div className="col-12">
											<p>category : &nbsp;
												<span ref={category}></span>
											</p>
										</div>
										<div className="col-12">
											<p>รายละเอียดคลับ : &nbsp;
												<span ref={clubInfo}></span>
											</p>
										</div>
										<div className="col-12">
											<p>จำนวนที่รับ : &nbsp;
												<span ref={limitStudent}></span>
											</p>
										</div>
										<div className="col-12">
											<p>ปีการศึกษา : &nbsp;
												<span ref={schoolYear}></span>
											</p>
										</div>
										<div className="col-12">
											<p>วันที่เรียน : &nbsp;
												<span ref={day}></span>
											</p>
										</div>
										<div className="col-12">
											<p>เวลาเรียน : &nbsp;
												<span ref={scheduleStart}></span>
											</p>
										</div>
										<div className="col-12">
											<p>เวลาเลิกเรียน: &nbsp;
												<span ref={scheduleEnd}></span>
											</p>
										</div>
										<div className="col-12">
											<p>ชื่อนามสกุลผู้สอน : &nbsp;
												<span ref={teacherName}></span>
											</p>
										</div>
										<div className="col-12">
											<p>รูปภาพประกอบ</p>
											<img src={clubImg} className="form-control" ></img>
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
