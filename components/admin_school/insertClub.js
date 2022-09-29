import React from "react"
import { useState } from "react";
import ErrorPage from "next/error";
import { add_club,add_clubs } from "../../utils/add_data";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";

export default function InsertClub({ school_data,schoolID }) {
	const [csvFile, setCsvFile] = useState("");

	/* ส่วนของการแปลง string เป็น object */
    const stringtoObject = (text) => {
        const result = []
        const tmp = text.split("\n")
        const heads = tmp[0].split(",")
        
        for (let i=1;i<tmp.length-1;i++){
            const line = tmp[i].split(",")
            const object = {}
            for (let j=0;j<heads.length;j++){
                if (line[j] === ""){
                    return "data is undefined"
                }else{
                    object[heads[j].trim()] = line[j].trim()
                }
            }
            result.push(object)
        }
        return result
    }
    
    
    /* เมื่อกดปุ่มทำการอ่านข้อมูลจากไฟล์ csv */
    const submit = (ev) => {
        ev.preventDefault();
			if (csvFile === ""){
				alert("โปรดเลือกไฟล์ที่ต้องการส่งด้วย")
				return
			}
			
			const fileSuccess = csvFile
			//console.log(fileSuccess)
			
			// ใช้ FileReader ในการอ่านไฟล์
			const reader = new FileReader()
			reader.readAsText(fileSuccess)

			// เมื่อทำการอ่านข้อมูลสำเร็จให้จะเกิด event นี้และได้ค่าที่อ่านมาเป็น string
			reader.onload = (ev) => {
					const text = ev.target.result;
					//console.log(text)
					const result = stringtoObject(text)
					if (result === "data is undefined"){
							alert("ใส่ข้อมูลในไฟล์ csv ไม่ครบ")
							return
					}else{
							console.log(result)
					}
			}
		}
	
		async function SubmitOneClub(ev){
			ev.preventDefault()

			const form = new FormData(ev.target)
			const formSuccess = Object.fromEntries(form.entries())
			
			const currentDate = new Date()
			const successCurrentDate = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}`
			
			const startTime = Date.parse(`${successCurrentDate} ${formSuccess.startTime}`)
			const endTime = Date.parse(`${successCurrentDate} ${formSuccess.endTime}`)
			
			if (!(startTime < endTime)) {
				Swal.fire({
					icon: 'warning',
					title: 'ข้อมูล schedule ไม่ถูกต้อง',
					showConfirmButton:true,
					confirmButtonColor:"#e3c21c"
				})
				return
			}
			else {
				
				formSuccess.schedule = [formSuccess.startTime + "-" + formSuccess.endTime]
				console.log(formSuccess)
				
				const cookies = new Cookies();
				const token = cookies.get("token");
				const result = await add_club(formSuccess,token,schoolID);
				
				if (!result){
					Swal.fire({
						icon: 'error',
						title: 'เพิ่มข้อมูลไม่สำเร็จ',
						showConfirmButton:true,
						confirmButtonColor:"#ce0303"
					})
				}else{
					Swal.fire({
						icon: 'success',
						title: 'เพิ่มข้อมูลเสร็จสิ้น',
						showConfirmButton:true,
						confirmButtonColor:"#009431"
					})
				}
			}
		}
		
		if (!school_data.paymentStatus) {
			return <ErrorPage statusCode={404} />;
		}

   	return (
		<>
			<div className="text-center fs-1">InsertClub</div>
			<div className="card mt-5">
				<div className="card-body">
					<h5 className="card-title">เพิ่มข้อมูลของคลับหลายคลับ</h5>
					<p className="card-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
				</div>
				<div className="card-footer">
					<form>
						<div className="input-group">
							<input className="form-control" 
								type='file'
								accept='.csv'
								onChange={(ev) => {setCsvFile(ev.target.files[0])
							}}/>
							<button type="submit" className="btn btn-success" onClick={(ev) => submit(ev)}>ยืนยัน</button>
						</div>
					</form>
				</div>
			</div>

			<div className="card mt-5">
				<div className="card-body">
					<h5 className="card-title">เพิ่มข้อมูลของคลับ 1 คลับ</h5>
					<p className="card-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
				</div>
				<div className="card-footer">
					<div className="d-flex justify-content-end">
						<button  className="btn btn-primary" data-bs-target="#mymodal" data-bs-toggle="modal">ใส่ข้อมูล</button>
					</div>
				</div>
			</div>
			
			{/* modal กดแสดงตอนเพิ่มข้อมูล 1 คน */}
			<div className="modal fade" id="mymodal">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<div className="w-100 mt-1">
								<h3 className="text-center">แบบฟอร์มเพิ่มข้อมูลชุมนุม</h3>
							</div>
						</div>
						<div className="modal-body">
							<form className="row gy-2 gx-3" onSubmit={(ev) => SubmitOneClub(ev)}>
								<div className="col-12">
									<label className="form-label">ชื่อคลับ</label>
									<input type="text" className="form-control" name="clubName"/>
								</div>
								<div className="col-12">
									<label className="form-label">รหัสวิชา</label>
									<input type="text" className="form-control" name="groupID"/>
								</div>
								<div className="col-12">
									<label className="form-label">category</label>
									<input type="text" className="form-control" name="category"/>
								</div>
								<div className="col-12">
									<label className="form-label">รายละเอียดคลับ</label>
									<textarea className="form-control" rows="3" name="clubInfo"></textarea>
								</div>
								<div className="col-sm-6">
									<label className="form-label">จำนวนนักเรียนสูงสุด</label>
									<input type="number" className="form-control" name="limit"/>
								</div>
								<div className="col-sm-6">
									<label className="form-label">ปีการศึกษา</label>
									<input type="number" className="form-control" min={school_data.nowSchoolYear} name="schoolYear"/>
								</div>
								<div className="col-sm-6">
									<label className="form-label">เวลาเริ่ม</label>
									<input type="time" className="form-control mt-3" name="startTime"></input>
								</div>
								<div className="col-sm-6">
									<label className="form-label">เวลาจบ</label>
									<input type="time" className="form-control mt-3" name="endTime"></input>
								</div>
								<div className="col-12 mt-4 text-center">
									<input type="submit" className="btn btn-success w-100" value="ตกลง"/>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
					
		</>
	);
}