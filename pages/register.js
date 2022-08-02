import React from "react";
import { useRef } from "react";

export default function Register() {
	const form = useRef();
	async function submitForm(ev) {
		/* ป้องกันกันส่งข้อมูลไป server โดยเราจะทำการ fetch post ข้อมูลไปทาง api แทน */
		ev.preventDefault();
		const email = ev.target.elements[0].value;
		const fname = ev.target.elements[1].value;
		const sname = ev.target.elements[2].value;
		const school_name = ev.target.elements[3].value;
		const tel = ev.target.elements[4].value;
		const school_document = ev.target.elements[5];
		// ไว้เก็บชื่อไฟล์
		const nameFile = []
		
		/* เช็คว่าใส่ข้อมูลไหม */
		if (!email || !fname || !sname || !school_name || !tel){
			alert("โปรดกรอกข้อมูลให้ครบถ้วน")
			return
		}else if (school_document.files.length == 0){
			alert("โปรดใส่เอกสารยืนยันโรงเรียน")
		}
		else{
			console.log("ข้อมูลครบ")
			/* เช็คไฟล์ */
			console.log(school_document.files)
			for (let i=0;i<school_document.files.length;i++){
				//console.log(school_document.files[i].name)
				nameFile.push(school_document.files[i].name)
			}
		}
		/* ข้อมูล json ที่จะส่งไป */
		const information = {
			"email":email,
			"fname":fname,
			"sname":sname,
			"school_name":school_name,
			"tel":tel,
			"school_document":nameFile
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
			<form
				className="row g-3"
				onSubmit={(ev) => submitForm(ev)}
				ref={form}
			>
				{/* อีเมลล์  */}
				<div className="col-lg-12">
					<label className="form-label">อีเมลล์</label>
					<input type="email" className="form-control" />
				</div>
				{/* ชื่อ  */}
				<div className="col-lg-6">
					<label className="form-label">ชื่อ</label>
					<input type="text" className="form-control" />
				</div>
				{/* นามสกุล */}
				<div className="col-lg-6">
					<label className="form-label">นามสกุล</label>
					<input type="text" className="form-control" />
				</div>
				{/* ชื่อโรงเรียน  */}
				<div className="col-lg-12">
					<label className="form-label">ชื่อโรงเรียน</label>
					<input type="text" className="form-control" />
				</div>
				{/* โทรศัพท์มือถือ */}
				<div className="col-lg-12">
					<label className="form-label">โทรศัพท์มือถือ</label>
					<input type="tel" className="form-control" />
				</div>
				{/* เอกสารยืนยันโรงเรียน ใส่ multiple กรณีอัปโหลดได้หลายไฟล์*/}
				<div className="col-lg-12">
					<label className="form-label">เอกสารยืนยันโรงเรียน</label>
					<input type="file" className="form-control" multiple />
				</div>
				{/* ปุ่มยืนยัน */}
				<div className="col-lg-12">
					<button className="btn btn-warning">ยืนยัน</button>
				</div>
			</form>
		</div>
	);
}
