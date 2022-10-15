import React from "react";
import { useEffect, useState, useRef } from "react";
import Review from "./reviewmodal";
import { get_student_pastclub } from "../../utils/student/student";
import Cookies from "universal-cookie";


export default function Pastclub({ schoolID,schedule }) {
	const clubName = useRef()
	const clubInfo = useRef()
	const groupID = useRef()
	const category = useRef()
	const limitStudent = useRef()
	const schoolYear = useRef()
	const scheduleStart = useRef()
	const scheduleEnd = useRef()

	const [displayError, setDisplayError] = useState(false)
	const [showData, setShowData] = useState([])
	
	useEffect(() => {
		const cookie = new Cookies()
		const token = cookie.get("token")
		get_student_pastclub(token, schoolID).then(res => {
			if (!res){
				setDisplayError(true)
			}else if (res.data.clubs.length === 0) {
				const tmp = (
					<div className="alert alert-warning mt-3">
						<h4 className="alert-heading">คุณไม่มีชุมนุมที่เคยเรียนมา</h4>
					</div>
				)
				setShowData(tmp)
			}else{
				const tmp = (
						<table className='table align-middle'>
							<thead>
								<tr>
									<th style={{ width: "100px" }}>รหัสวิชา</th>
									<th style={{ width: "400px" }}>ชื่อชุมนุม</th>
									<th style={{ width: "400px" }} className="text-end"><span className='me-2'></span></th>
								</tr>
							</thead>
							<tbody>
								{res.data.clubs.map((item, index) => {
									return (
										<tr key={index}>
											<td>{item.groupID}</td>
											<td>{item.clubName}</td>
											<td className="text-end">
												<button className='btn btn-info btn-sm'
													data-bs-toggle="modal"
													data-bs-target="#PastClubModal"
													onClick={(ev) => detailInfo(item)}
												>ดูรายละเอียด
												</button>
											</td>
											<td><Review item={item} schoolID={schoolID} schedule={schedule} /></td>
										</tr>
									)
								})}
							</tbody>
						</table>
					)
				setShowData(tmp)
			}
		})
	}, [])


	function detailInfo(item) {
		clubName.current.innerText = item.clubName
		clubInfo.current.innerText = item.clubInfo
		category.current.innerText = item.category
		limitStudent.current.innerText = item.limit + " คน"
		schoolYear.current.innerText = item.schoolYear
		groupID.current.innerText = item.groupID

		let [ schedule ] = item.schedule 
        let [ st ,en ] = schedule.split("-")
        scheduleStart.current.innerText = st + " นาฬิกา"
        scheduleEnd.current.innerText = en + " นาฬิกา"
	}

	if (displayError){
		return <div className="fs-4 text-center">เกิดข้อผิดพลาดไม่สามารถแสดงผลได้</div>
	}else{
		return (
			<>
				<div className="text-center fs-1">Past Club</div>
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
											<p>เวลาเรียน : &nbsp;
												<span ref={scheduleStart}></span>
											</p>
										</div>
										<div className="col-12">
											<p>เวลาเลิกเรียน: &nbsp;
												<span ref={scheduleEnd}></span>
											</p>
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
