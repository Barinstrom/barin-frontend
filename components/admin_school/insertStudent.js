import React from "react"
import { useState,useRef } from "react";
import ErrorPage from "next/error";
import Cookies from "universal-cookie";
import Swal from 'sweetalert2';
import { add_student, add_students } from "../../utils/school_admin/add_data";


export default function InsertTeacher({ school_data,schoolID }) {
	const [csvFile, setCsvFile] = useState("");
	const form = useRef()
	const cookies = new Cookies();
	const token = cookies.get("token");
	
	/* ส่วนของการแปลง string เป็น object */
	const stringtoObject = (text) => {
		const result = []
		text = text.trim()
        const tmp = text.split("\n")
        const heads = tmp[0].split(",")
        
        for (let i=1;i<tmp.length;i++){
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
	
	const submit = (ev) => {
        ev.preventDefault();
		if (!csvFile){
			Swal.fire({
				icon: 'warning',
				title: 'โปรดใส่ไฟล์ csv ด้วย',
				showConfirmButton: true,
				confirmButtonColor: "#f7a518",
				confirmButtonText: 'ok',
			})
			return
		}
		
		const fileSuccess = csvFile
        const reader = new FileReader()
        
		reader.readAsText(fileSuccess)
		reader.onloadend = async () => {
			const text = reader.result;
			const body = stringtoObject(text)
			console.log(body)
            if (body === "data is undefined"){
                Swal.fire({
					icon: 'warning',
					title: 'ใส่ข้อมูลในไฟล์ csv ไม่ครบ',
					showConfirmButton: true,
					confirmButtonColor: "#f7a518",
					confirmButtonText: 'ok',
				})
				return
            }else{
                const result = await add_students(body,token,schoolID);
				if (result){
					Swal.fire({
						icon: 'success',
						title: 'เพิ่มข้อมูลสำเร็จ',
						showConfirmButton:true,
						confirmButtonColor:"#009431"
					})
				}else{
					Swal.fire({
						icon: 'error',
						title: 'เพิ่มข้อมูลไม่สำเร็จ',
						showConfirmButton:true,
						confirmButtonColor:"#ce0303"
					})
				}
            }
        }
    }
	
	async function SubmitOneStudent(ev){
		ev.preventDefault()
		
		const form = new FormData(ev.target)
		const formSuccess = Object.fromEntries(form.entries())
		if (!formSuccess.firstname || !formSuccess.lastname || !formSuccess.email || !formSuccess.tel || !formSuccess.classYear || !formSuccess.enteredYear){
			Swal.fire({
				icon: 'warning',
				title: 'โปรดกรอกข้อมูลให้ครบถ้วน',
				showConfirmButton:true,
				confirmButtonColor:"#f7a518"
			})
			return
		}
		const body = {...formSuccess,"isActive":"Active"}
		const result = await add_student(body,token,schoolID);
		
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

	function clearInfo(){
		for (let i=0;i<form.current.elements.length;i++){
			if (form.current.elements[i].nodeName === "INPUT"){
				form.current.elements[i].value = ""
			}
		}
	}

	if (!school_data.paymentStatus) {
		return <ErrorPage statusCode={404} />;
	}
	return (
		<div>
			<div className="text-center fs-1">InsertStudent</div>
			
			{/* เพิ่มข้อมูลนักเรียนหลายคน */}
			<div className="card mt-5">
				<div className="card-body">
					<h5 className="card-title">เพิ่มข้อมูลของนักเรียนหลายคน</h5>
					<p className="card-text">ถ้าหากต้องการเพิ่มข้อมูลนักเรียนหลายคน สามารถนำรายชื่อที่มีจากไฟล์ csv และทำการใส่ไฟล์ในนี้ได้เลย</p>
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

			{/* ส่วนเพิ่มนักเรียน 1 คน */}
			<div className="card mt-5">
				<div className="card-body">
					<h5 className="card-title">เพิ่มข้อมูลของนักเรียน 1 คน</h5>
					<p className="card-text">ถ้าหากต้องการเพิ่มข้อมูลนักเรียนแค่ 1 คน คุณไม่จำเป็นต้องสร้างไฟล์ csv สามารถกรอกแบบฟอร์มได้เลย</p>
				</div>
				<div className="card-footer">
					<div className="d-flex justify-content-end">
						<button  className="btn btn-primary" data-bs-target="#insertModalStudent" data-bs-toggle="modal">ใส่ข้อมูล</button>
					</div>
				</div>
			</div>

			{/* modal กดแสดงตอนเพิ่มข้อมูล 1 คน */}
			<div className="modal fade" id="insertModalStudent">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h3 className="text-center">แบบฟอร์มเพิ่มข้อมูลนักเรียน</h3>
							<button className="btn-close" data-bs-dismiss="modal" onClick={clearInfo}></button>
						</div>
						<div className="modal-body">
							<form className="row gy-2 gx-3" onSubmit={(ev) => SubmitOneStudent(ev)} ref={form}>
								<div className="col-12">
									<label className="form-label">ชื่อ</label>
									<input type="text" className="form-control" name="firstname"/>
								</div>
								<div className="col-12">
									<label className="form-label">นามสกุล</label>
									<input type="text" className="form-control" name="lastname"/>
								</div>
								<div className="col-12">
									<label className="form-label">email</label>
									<input type="email" className="form-control" name="email"/>
								</div>
								<div className="col-sm-6">
									<label className="form-label">โทรศัพท์มือถือ</label>
									<input type="tel" className="form-control" name="tel"/>
								</div>
								<div className="col-sm-3">
									<label className="form-label">ชั้นปีที่</label>
									<input type="number" className="form-control" min="1" max="6" name="classYear"/>
								</div>
								<div className="col-sm-3">
									<label className="form-label">ปีการศึกษา</label>
									<input type="number" className="form-control" min={school_data.nowSchoolYear} name="enteredYear"/>
								</div>
								<div className="col-12 mt-4 text-center">
									<button type="submit" className="btn btn-success w-100">ตกลง</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}