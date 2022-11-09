import React from "react";
import { useEffect,useState } from "react";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { get_student_ownclub, drop_club } from "../../utils/student/student";
import Swal from "sweetalert2";

export default function Nowclub({ schoolID, inschedule, nowSchoolYear }) {
	const [ displayOwnclub, setdisplayOwnclub ] = useState(null)
	
	const cookie = new Cookies()
	const token = cookie.get("token")
	const router = useRouter()
    
	async function dropClub(clubID) {
		const body = {
			"clubID": clubID
		}

		Swal.fire({
            title: 'คุณต้องการถอนชุมนมุนี้ใช่หรือไม่',
            showConfirmButton: true,
            confirmButtonColor: "#0047a3",
            confirmButtonText: 'ยืนยัน',

            showCancelButton: true,
            cancelButtonText: "ยกเลิก",
            cancelButtonColor: "#d93333",
			showLoaderOnConfirm: true,
			preConfirm: async () => {
				const result = await drop_club(body, token, schoolID)
				return result
			},
			allowOutsideClick: false,
		}).then(res => {
			const [result,status] = res.value
			if (res.isConfirmed){
				if (!status){
					let content = ""
					if (result.response.data.error === "not in register time"){
						content = "ไม่อยู่ในช่วงเวลาถอนชุมนุม"
					}else{
						content = "ถอนชุมนุมไม่สำเร็จ"
					}
					Swal.fire({
						icon: 'error',
						title: content,
						showConfirmButton:true,
						confirmButtonColor:"#d1000a"
					}).then(() => {
						return
					})
				}else{
					Swal.fire({
						icon: 'success',
						title: 'ถอนชุมนุมสำเร็จ',
						showConfirmButton:true,
						confirmButtonColor:"#009431"
					}).then(() => {
						router.reload()
					})
				}
			}else{
				return
			}
		})
	}

	useEffect(() => {
		const  cookie = new Cookies()
		const token = cookie.get("token")
		const body = {
			nowSchoolYear : nowSchoolYear
		}
		
		get_student_ownclub(body,token, schoolID).then(result => {
			console.log(result)
			let clubs;
			let clubs_notin
			if (!result) {
				clubs = (
					<div className="card mt-3">
						<div className="card-body">
							<h5 className="card-title">เกิดข้อผิดพลาดไม่สามารถแสดงข้อมูลได้</h5>
						</div>
					</div>
				)
				clubs_notin = (
					<div className="card mt-3">
						<div className="card-body">
							<h5 className="card-title">เกิดข้อผิดพลาดไม่สามารถแสดงข้อมูลได้</h5>
						</div>
					</div>
				)
			}
			else if (result.data.clubs.length === 0) {
				clubs = (
					<div className="card mt-3">
						<div className="card-body">
							<h5 className="card-title">คุณยังไม่ได้ลงทะเบียนชุมนุม</h5>
							<p className="card-text mt-3">
								คุณสามารถกดเลือก <mark>ค้นหาชุมนุม</mark> เพื่อสมัครชุมนุมที่ต้องการได้ ถ้าหากว่าคุณอยู่ใน
								ช่วงเวลาลงทะเบียนชุมนุม คุณควรจะตัดสินใจให้ดีว่าคุณต้องการอยู่ชุมนุมใด และ ควรจะรีบเลือกชุมนุม
								ก่อนที่ชุมนุมจะเต็ม
							</p>
						</div>
					</div>
				)
				clubs_notin = (
					<div className="card mt-3">
						<div className="card-body">
							<h5 className="card-title">คุณยังไม่ได้ลงทะเบียนชุมนุม</h5>
							<p className="card-text mt-3">
								ขณะนี้ ไม่ได้อยู่ในช่วงเวลาลงทะเบียน กรุณาตรวจสอบกับอาจารย์ที่ปรึกษา
							</p>
						</div>
					</div>
				)
			}
			else {
				console.log(result)
				clubs = result.data.clubs.map((e, i) => {
					return (
						<>
							<style jsx>{`
									.drop_btn{
										border:none;
										background-color:#c3971d;
										color:white;
										border-radius:4px;
									}
								`}</style>
								
							<div key={i} className="card mt-3">
								<div className="card-body">
									<p className="card-text">ชื่อชุมนุม: {e.clubName}</p>
									<p className="card-text">เวลาเรียน: {e.schedule[0]}</p>
									<p className="card-text">รายละเอียด: {e.clubInfo}</p>
									<p className="card-text">อาจารย์ผู้สอน: {e.teachers[0].firstname} {e.teachers[0].lastname}</p>
									<p className="card-text">อีเมลผู้สอน: {e.teacherEmail}</p>
									<p className="card-text">สถานะ: {e.status}</p>
								</div>
								<div className="card-footer text-end">
									<button className='btn drop_btn' onClick={() => dropClub(e._id)}>ถอนชุมนุม</button>
								</div>
							</div>
						</>
					)
				})
			
				clubs_notin = result.data.clubs.map((e, i) => {
					return (
						<>
							<style jsx>{`
									.drop_btn{
										border:none;
										background-color:#c3971d;
										color:white;
										border-radius:4px;
									}
								`}</style>

							<div key={i} className="card mt-3">
								<div className="card-body">
									<p className="card-text">ชื่อชุมนุม: {e.clubName}</p>
									<p className="card-text">เวลาเรียน: {e.schedule[0]}</p>
									<p className="card-text">รายละเอียด: {e.clubInfo}</p>
									<p className="card-text">อาจารย์ผู้สอน: {e.teachers[0].firstname} {e.teachers[0].lastname}</p>
								</div>
							</div>
						</>
					)
				})
			}
			if (inschedule) setdisplayOwnclub(clubs)
			else setdisplayOwnclub(clubs_notin)
		
		})
	}, [])

	return (
		<div>
			<div className="text-center display-6">
				<span className='me-2'>ชุมนุมปัจจุบัน</span>
				<h4 className="fa-solid fa-circle-info"
					data-bs-toggle="modal"
					data-bs-target="#helpmodal"
					type="button" ></h4>
			</div>
			{displayOwnclub}
			<div className="modal fade" id="helpmodal">
				<div className="modal-dialog modal-lg">
					<div className='modal-content'>
						<div className='modal-header'>
							<h3 className="modal-title" >คู่มือการใช้งาน</h3>
						</div>
						<div className='modal-body'>
							รอใส่ user manual
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
