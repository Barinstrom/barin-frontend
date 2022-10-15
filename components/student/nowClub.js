import React from "react";
import { useEffect,useState } from "react";
import Cookies from "universal-cookie";
import { get_student_ownclub, drop_club } from "../../utils/student/student";
import Swal from "sweetalert2";

export default function Nowclub({schoolID}) {
	const [ displayOwnclub, setdisplayOwnclub ] = useState(null)
	
	const cookie = new Cookies()
	const token = cookie.get("token")
    
	async function dropClub(clubID) {
		console.log(clubID)
		const body = {
			"clubID": clubID
		}

		Swal.fire({
			title: 'คุณต้องการ drop club นี้ใช่หรือไม่',
			showConfirmButton: true,
			confirmButtonColor: "#3085d6",
			confirmButtonText: 'ยืนยัน',

			showCancelButton: true,
			cancelButtonText: "ยกเลิก",
			cancelButtonColor: "#d93333",
		}).then(async(result) => {
			if (result.isConfirmed) {
				const result = await drop_club(body, token, schoolID)

				if (!result) {
					Swal.fire(
						'drop ไม่สำเร็จ!',
						'',
						'warning',
					).then(() => {
						window.location.reload();
					})
				} else {
					Swal.fire(
						'drop เสร็จสิ้น',
						'',
						'success',
					).then(() => {
						window.location.reload();
					})
				}
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
					<div  className="alert alert-info mt-2">
						<p className="alert-heading fs-3">เกิดข้อผิดพลาดไม่สามารถแสดงข้อมูลได้</p>
					</div>
				)
			}
			else if (result.data.clubs.length === 0){
				clubs = (
					<div  className="alert alert-info mt-2">
						<p className="alert-heading fs-3">No club</p>
						<p>temp</p>
						<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut rem magnam id aperiam eaque adipisci error. Temporibus perspiciatis explicabo totam quidem, provident, voluptatibus magnam error nulla laudantium inventore odio non?</p>
					</div>
				)
			}
			else {
				// result.data.clubs.map((e, i) => {
				// 	console.log(i)
				// })
				// console.log("have")
				const data_club = result.data.clubs
				clubs = result.data.clubs.map((e, i) => {
						return (
							<div key={i} className="alert alert-info mt-2">
								<p className="alert-heading fs-3">{e.clubName }</p>
								<p>เวลาเรียน: {e.schedule }</p>
								<p>{e.clubInfo}</p>
								<button className='btn btn-warning' onClick={(ev) => dropClub(e._id)}>ยกเลิกการสมัครชุมนุม</button>
							</div>
						)
					})
				console.log(clubs)
			}
			setdisplayOwnclub(clubs)
		})
	}, [])

	return (
		<div>
			<div className="text-center fs-1">Now Club</div>
			<div>
				{displayOwnclub}
			</div>
		</div>
	)
}
