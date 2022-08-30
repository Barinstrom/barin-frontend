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
			<style jsx>{`
				.contain_form {
					display: flex;
					flex-direction: row;
				}
				@media screen and (max-width: 900px) {
					.contain_form {
						flex-direction: column-reverse;
					}
				}
			`}</style>
			<div className="mt-5 text-center">
				<h2 className="text-center">สมัครสมาชิก</h2>
			</div>
			<div className="contain_form ps-3 pe-3">
				{/* ส่วนฝั่งซ้าย */}
				<div className="container p-5">
					{/* หัวข้อ */}
					<h2 className="text-center">แบบฟอร์มลงทะเบียน</h2>
					{/* ฟอร์ม */}
					<form className="row g-3" onSubmit={(ev) => submitForm(ev)} encType="multipart/form-data">
						{/* ชื่อโรงเรียน  */}
						<div className="col-lg-12">
							<label className="form-label">ชื่อโรงเรียน</label>
							<input type="text" className="form-control" name="school_name" id="school_name" ref={el => tagForm.current[0] = el} /> 
						</div>
						{/* ชื่อตัวแทน  */}
						<div className="col-lg-12">
							<label className="form-label">ชื่อ-สกุล ตัวแทนโรงเรียน</label>
							<input type="text" className="form-control" name="admin_name" id="admin_name" ref={el => tagForm.current[1] = el} />
						</div>
						{/* อีเมลล์  */}
						<div className="col-lg-12">
							<label className="form-label"> อีเมลล์ (สำหรับส่ง id password) </label>
							<input type="email" className="form-control" name="email" id="email" ref={el => tagForm.current[2] = el} />
						</div>
						{/* โทรศัพท์มือถือ */}
						<div className="col-lg-12">
							<label className="form-label"> เบอร์โทรศัพท์ที่สามารถติดต่อได้ </label>
							<input type="tel" className="form-control" name="school_tel" id="school_tel" ref={el => tagForm.current[3] = el} />
						</div>
						
						{/* เอกสารยืนยันโรงเรียน ใส่ multiple กรณีอัปโหลดได้หลายไฟล์*/}
						<div className="col-lg-12">
							<label className="form-label">  เอกสารยืนยันโรงเรียน </label>
							<br/>
							<FileBase64 className="form-control" onDone={(ev)=> getFiles(ev)}/>
						</div>
						
						{/* ปุ่มยืนยัน */}
						<div className="col-lg-12">
							<button className="btn btn-warning">ยืนยัน</button>
						</div>
					</form>
				</div>
				
				{/* ส่วนฝั่งขวา  */}
				<div className="container p-5">
					{/* หัวข้อ */}
					<h2 className="text-center mt-5">ข้อตกลง</h2>
					{/* ทดสอบ */}
					<div className="accordion" id="myparent">
						<div className="accordion-item">
							<h2 className="accordion-header">
								<button
									className="accordion-button collapsed"
									data-bs-toggle="collapse"
									data-bs-target="#mycollapse1"
								>
									text 1
								</button>
							</h2>
							<div
								className="accordion-collapse collapse"
								id="mycollapse1"
								data-bs-parent="#myparent"
							>
								<div className="accordion-body">
									<p>
										Lorem ipsum dolor sit amet consectetur
										adipisicing elit. Nulla consequatur
										perferendis tempore laudantium debitis
										fugiat at voluptate molestias vel sit?
									</p>
								</div>
							</div>
						</div>
						<div className="accordion-item">
							<h2 className="accordion-header">
								<button
									className="accordion-button collapsed"
									data-bs-toggle="collapse"
									data-bs-target="#mycollapse2"
								>
									text 2
								</button>
							</h2>
							<div
								className="accordion-collapse collapse"
								id="mycollapse2"
								data-bs-parent="#myparent"
							>
								<div className="accordion-body">
									<p>
										Lorem ipsum dolor sit amet consectetur
										adipisicing elit. Nulla consequatur
										perferendis tempore laudantium debitis
										fugiat at voluptate molestias vel sit?
									</p>
								</div>
							</div>
						</div>
						<div className="accordion-item">
							<h2 className="accordion-header">
								<button
									className="accordion-button collapsed"
									data-bs-toggle="collapse"
									data-bs-target="#mycollapse3"
								>
									text 3
								</button>
							</h2>
							<div
								className="accordion-collapse collapse"
								id="mycollapse3"
								data-bs-parent="#myparent"
							>
								<div className="accordion-body">
									<p>
										Lorem ipsum dolor sit amet consectetur
										adipisicing elit. Nulla consequatur
										perferendis tempore laudantium debitis
										fugiat at voluptate molestias vel sit?
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
