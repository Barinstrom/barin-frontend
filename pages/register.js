import React from "react";
import { useRef } from "react";
import { register } from "../utils/auth"

export default function Register() {
	const form = useRef();
	async function submitForm(ev) {
		/* ป้องกันกันส่งข้อมูลไป server โดยเราจะทำการ fetch post ข้อมูลไปทาง api แทน */
		ev.preventDefault();
		const email = document.querySelector("#email").value;
		const school_name = document.querySelector("#school_name").value;
		const admin_name = document.querySelector("#admin_name").value;
		const school_tel = document.querySelector("#school_tel").value;
		const school_document = document.querySelector("#school_document");
		// ไว้เก็บชื่อไฟล์
		const nameFile = []
		
		/* เช็คว่าใส่ข้อมูลไหม */
		if (!email || !school_name || !admin_name || !school_tel) {
			alert("โปรดกรอกข้อมูลให้ครบถ้วน");
			return;
		} else if (school_document.files.length == 0) {
			alert("โปรดใส่เอกสารยืนยันโรงเรียน");
		} else {
			console.log("ข้อมูลครบ");
			// /* เช็คไฟล์ */
			console.log(school_document.files);
			for (let i = 0; i < school_document.files.length; i++) {
				//console.log(school_document.files[i].name)
				nameFile.push(school_document.files[i].name);
			}
			console.log(nameFile);
			// /* ข้อมูล json ที่จะส่งไป */
			// const f = new FormData(form.current);
			// const body = Object.fromEntries(f.entries());
			// console.log(body);
			const body = {
				userId:email,
				password: "12345",
				confirmPassword: "12345",
				email: email,
				role:"admin"
			}

			let is_can = await register(body);
			//console.log(is_can)
			if (is_can == false) {
				alert("register ผิดพลาด กรุณาลองใหม่อีกครั้ง");
			} else {
				alert("register เสร็จสิ้น");
			}
		}
		
		
		
	}	
		/* ส่วนในการ post ส่งค่าไป backend */
		/* const response = await fetch(url,{
			method:"post",
			headers:{"Content-Type":"application/json"},
			body:JSON.stringify(information)
		  })
		  const data = await response.json()
		  console.log(data)
		} */

	return (
		<div className="container p-3">
			{/* หัวข้อ */}
			<h2 className="text-center mt-5">แบบฟอร์มลงทะเบียน</h2>
			{/* ฟอร์ม */}
			<form className="row g-3" onSubmit={(ev) => submitForm(ev)} ref={form} encType="multipart/form-data">
				{/* ชื่อโรงเรียน  */}
				<div className="col-lg-12">
					<label className="form-label">ชื่อโรงเรียน</label>
					<input type="text" className="form-control" name="school_name" id="school_name"/>
				</div>
				{/* ชื่อตัวแทน  */}
				<div className="col-lg-12">
					<label className="form-label">ชื่อ-สกุล ตัวแทนโรงเรียน</label>
					<input type="text" className="form-control" name="admin_name" id="admin_name"/>
				</div>
				{/* อีเมลล์  */}
				<div className="col-lg-12">
					<label className="form-label">อีเมลล์ (สำหรับส่ง id password)</label>
					<input type="email" className="form-control" name="email" id="email"/>
				</div>
				{/* โทรศัพท์มือถือ */}
				<div className="col-lg-12">
					<label className="form-label">เบอร์โทรศัพท์ที่สามารถติดต่อได้</label>
					<input type="tel" className="form-control" name="school_tel"  id="school_tel"/>
				</div>
				{/* เอกสารยืนยันโรงเรียน ใส่ multiple กรณีอัปโหลดได้หลายไฟล์*/}
				<div className="col-lg-12">
					<label className="form-label">เอกสารยืนยันโรงเรียน</label>
					<input type="file" className="form-control" multiple name="school_document" id="school_document"/>
				</div>
				{/* ปุ่มยืนยัน */}
				<div className="col-lg-12">
					<button className="btn btn-warning">ยืนยัน</button>
				</div>
			</form>
		</div>
	);
}
