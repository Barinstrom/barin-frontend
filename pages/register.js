import React from "react";
import FileBase64 from 'react-file-base64';
import { useState } from "react";
import { useRef } from "react";
import Router from "next/router";

export default function Register() {
	/* state เก็บข้อมูลไฟล์ string base64 และชื่อไฟล์ */
	const [file,setfile] = useState()
	const [nameFile,setNameFile] = useState()
	/* ตัวแปรผูกข้อมูลเพื่อเอาค่า value */
	const tagForm = useRef([])
	
	/* ฟังชันก์ในการ set ข้อมูลต่างๆของไฟล์ที่จะส่ง */
	function getFiles(ev){
		//console.log(ev)
		const base64file = ev.base64
		const namefile = ev.name
		/* set ค่า state */
		setfile(base64file);
		setNameFile(namefile);
	}
	

	/* ฟังชันก์เมื่อกดปุ่มยืนยัน */
	async function submitForm(ev) {
		/* ป้องกันกันส่งข้อมูลไป server โดยเราจะทำการ fetch post ข้อมูลไปทาง api แทน */
		ev.preventDefault();
		
		/* อ้างอิงถึงแต่ละ tag html แล้วนำค่ามา */
		const school_name = tagForm.current[0].value;
		const email = tagForm.current[2].value;
		const admin_name = tagForm.current[1].value;
		const school_tel = tagForm.current[3].value;
		
		/* เช็คว่าใส่ข้อมูลครบไหม */
		if (!email || !school_name || !admin_name || !school_tel) {
			alert("โปรดกรอกข้อมูลให้ครบถ้วน");
			return
		} else if (!file) {
			alert("โปรดใส่เอกสารยืนยันโรงเรียน");
		} else {
			//console.log("ข้อมูลครบ");
			
			const body = {
				school_name: school_name,
				admin_name: admin_name,
				email: email,
				school_tel: school_tel,
				nameFile: nameFile,
				school_document: String(file),
				userId:email,
				password: "12345",
				confirmPassword: "12345",
				role:"admin"
			}
			console.log(body)
			window.localStorage.setItem("infomation",JSON.stringify(body))
			
			/* ถ้าส่งข้อมูลครบแล้วเด้งไปหน้า omise */
			Router.push({
				pathname: "/omise",
			})
			
		}
		
		
		
	}	

	return (
		<>
			<div className="container p-3 mt-4">
				<div className="row">
					<div className="col-lg-6 mt-0 p-3">
						<div>
							<h2 className="text-center">ข้อตกลงในการสมัครสมาชิก</h2>
							<ul className="list-group list-group-flush">
								<li className="list-group-item mt-3">
									<span>1. โปรดกรอกข้อมูลให้ครบถ้วน</span>
								</li>
								<li className="list-group-item">
									<span>2. ในการกรอกข้อมูลแต่ละครั้งควรเช็คความถูกต้องให้เรียบร้อย</span>
								</li>
								<li className="list-group-item">
									<span>3. ตรวจสอบไฟล์ที่ต้องส่งว่าครบถ้วนและถูกต้องตามข้อกำหนดหรือไม่</span>
								</li>
							</ul>
						</div>
					</div>
					<div className="col-lg-6 mt-4 mt-lg-0 p-3">
						<h2 className="text-center">สมัครสมาชิก</h2>
						{/* ฟอร์ม */}
						<form className="row g-2" onSubmit={(ev) => submitForm(ev)} encType="multipart/form-data">
							{/* ชื่อโรงเรียน  */}
							<div className="">
								<label className="form-label">ชื่อโรงเรียน</label>
								<input type="text" className="form-control" name="school_name" id="school_name" ref={el => tagForm.current[0] = el} /> 
							</div>
							{/* ชื่อตัวแทน  */}
							<div className="col-12">
								<label className="form-label">ชื่อ-สกุล ตัวแทนโรงเรียน</label>
								<input type="text" className="form-control" name="admin_name" id="admin_name" ref={el => tagForm.current[1] = el} />
							</div>
							{/* อีเมลล์  */}
							<div className="col-12">
								<label className="form-label"> อีเมลล์ (สำหรับส่ง id password) </label>
								<input type="email" className="form-control" name="email" id="email" ref={el => tagForm.current[2] = el} />
							</div>
							{/* โทรศัพท์มือถือ */}
							<div className="col-12">
								<label className="form-label"> เบอร์โทรศัพท์ที่สามารถติดต่อได้ </label>
								<input type="tel" className="form-control" name="school_tel" id="school_tel" ref={el => tagForm.current[3] = el} />
							</div>
							
							{/* เอกสารยืนยันโรงเรียน ใส่ multiple กรณีอัปโหลดได้หลายไฟล์*/}
							<div className="col-12">
								<label className="form-label">  เอกสารยืนยันโรงเรียน </label>
								<br/>
								<FileBase64 className="form-control" onDone={(ev)=> getFiles(ev)}/>
							</div>
							
							{/* ปุ่มยืนยัน */}
							<div className="col-12">
								<button className="btn btn-warning">ยืนยัน</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
