import React from "react"
import { useState,useRef } from "react";
import ErrorPage from "next/error";
import Cookies from "universal-cookie";
import Swal from 'sweetalert2';
import { add_teacher, add_teachers } from "../../utils/school_admin/add_data";
import { CSVLink } from "react-csv";

export default function InsertTeacher({ school_data,schoolID }) {
	const [csvFile, setCsvFile] = useState("");
	const form = useRef()
	const cookies = new Cookies();
	const token = cookies.get("token");

	const headers = [
		{ label: "firstname", key: "firstname" },
		{ label: "lastname", key: "lastname" },
		{ label: "email", key: "email" },
		{ label: "tel", key: "tel" },
	];
	const tmpdata = [
		{ firstname: "", lastname: "", email: "",tel: "" }
	];
	const csvReport = {
		data: tmpdata,
		headers: headers,
		filename: 'teachers_example.csv'
	};

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
		
		const fileSuccess = csvFile;
		const reader = new FileReader();
		
		reader.readAsText(fileSuccess)
		reader.onloadend = async () => {
			const text = reader.result;
			const body = stringtoObject(text)
				
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
				const result = await add_teachers(body,token,schoolID);
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
	
	async function SubmitOneTeacher(ev){
		ev.preventDefault()
		const form = new FormData(ev.target)
		const formSuccess = Object.fromEntries(form.entries())
		
		if (!formSuccess.firstname || !formSuccess.lastname || !formSuccess.email || !formSuccess.tel){
			Swal.fire({
				icon: 'warning',
				title: 'โปรดกรอกข้อมูลให้ครบถ้วน',
				showConfirmButton:true,
				confirmButtonColor:"#f7a518"
			})
			return
		}

		const body = {...formSuccess,"schoolID":schoolID}
		const result = await add_teacher(body,token,schoolID);

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
			<style jsx>{`
				.submit_btn{
					border:none;
					background-color:#11620e;
					color:white;
					border-radius:4px;
				}

				.insertinfo_btn{
					border:none;
					background-color:#004d99;
					color:white;
					border-radius:4px;
				}
			`}</style>
			<div className="text-center display-6">เพิ่มข้อมูลของคุณครู</div>
			{/* เพิ่มข้อมูลคุณครูหลายคน */}
			<div className="card mt-5">
				<div className="card-body">
					<h4 className="card-title">เพิ่มข้อมูลของคุณครูหลายคน</h4>
					<p className="card-text">ถ้าหากต้องการเพิ่มข้อมูลคุณครูหลายคน สามารถนำรายชื่อที่มีจากไฟล์ csv และทำการอัพโหลดไฟล์ใส่ในนี้ได้เลย</p>
					<div className="card-text">สามารถดาวโหลดไฟล์ CSV ตัวอย่างโดยทำการกดลิงค์ด้านล่าง</div>
					<div>
						<CSVLink {...csvReport}>ตัวอย่างไฟล์ CSV</CSVLink>
					</div>
				</div>
				<div className="card-footer">
					<form>
						<div className="input-group">
							<input className="form-control" 
								type='file'
								accept='.csv'
								onChange={(ev) => setCsvFile(ev.target.files[0])}
							/>
							<button type="submit" className="btn submit_btn" onClick={(ev) => submit(ev)}>ยืนยัน</button>
						</div>
					</form>
				</div>
			</div>

			<div className="card mt-5">
				<div className="card-body">
					<h4 className="card-title">เพิ่มข้อมูลของคุณครู 1 คน</h4>
					<p className="card-text">ถ้าหากต้องการเพิ่มข้อมูลคุณครูแค่ 1 คน คุณไม่จำเป็นต้องสร้างไฟล์ csv สามารถกรอกแบบฟอร์มได้เลย</p>
				</div>
				<div className="card-footer">
					<div className="d-flex justify-content-end">
						<button  className="btn insertinfo_btn" data-bs-target="#insertModalTeacher" data-bs-toggle="modal">ใส่ข้อมูล</button>
					</div>
				</div>
			</div>

			{/* modal กดแสดงตอนเพิ่มข้อมูล 1 คน */}
			<div className="modal fade" id="insertModalTeacher">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h3 className="text-center">แบบฟอร์มเพิ่มข้อมูลคุณครู</h3>
							<button className="btn-close" data-bs-dismiss="modal" onClick={clearInfo}></button>
						</div>
						<div className="modal-body">
							<form className="row gy-2 gx-3" onSubmit={(ev) => SubmitOneTeacher(ev)} ref={form}>
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
								<div className="col-12">
									<label className="form-label">โทรศัพท์มือถือ</label>
									<input type="tel" className="form-control" name="tel"/>
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