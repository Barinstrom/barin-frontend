import React from "react";
import { useEffect,useState } from "react";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { get_student_ownclub, drop_club } from "../../utils/student/student";
import Swal from "sweetalert2";

export default function Nowclub({schoolID}) {
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
			if (res.isConfirmed){
				if (!res.value){
					Swal.fire({
						icon: 'error',
						title: "ถอนชุมนุมไม่สำเร็จ",
						showConfirmButton:true,
						confirmButtonColor:"#d1000a"
					}).then(() => {
						router.reload()
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
		
		get_student_ownclub(token,schoolID).then(result => {
			console.log(result)
			let clubs;
			if (!result){
				clubs = (
					<div  className="card mt-3">
						<div className="card-body">
							<h5 className="card-title">เกิดข้อผิดพลาดไม่สามารถแสดงข้อมูลได้</h5>
						</div>
					</div>
				)
			}
			else if (result.data.clubs.length === 0){
				clubs = (
					<div  className="card mt-3">
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
			}
			else {
				clubs = result.data.clubs.map((e, i) => {
						return (
							<div key={i} className="card mt-3">
								<div className="card-body">
									<p className="card-text">ชื่อชุมนุม: {e.clubName}</p>
									<p className="card-text">เวลาเรียน: {e.schedule[0]}</p>
									<p className="card-text">รายละเอียด: {e.clubInfo}</p>
									<p className="card-text">อาจารย์ผู้สอน: {e.teachers[0].firstname} {e.teachers[0].lastname}</p>
								</div>
								<div className="card-footer text-end">
									<button className='btn btn-warning' onClick={() => dropClub(e._id)}>ถอนชุมนุม</button>
								</div>
							</div>
						)
					})
				}
			setdisplayOwnclub(clubs)
		})
	}, [])

	return (
		<div>
			<div className="text-center fs-1">ชุมนุมปัจจุบัน</div>
			{displayOwnclub}
		</div>
	)
}
