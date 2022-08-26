import React from "react";
import { register } from "../utils/auth"
import Router from "next/router";

export default function Register() {
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
			/* เช็คไฟล์ */
			console.log(school_document.files);
			for (let i = 0; i < school_document.files.length; i++) {
				//console.log(school_document.files[i].name)
				nameFile.push(school_document.files[i].name);
			}
			console.log(nameFile);
			
			const body = {
				userId:email,
				password: "12345",
				confirmPassword: "12345",
				email: email,
				role:"admin"
			}

			/* เรียกฟังชัน checkLogin แล้วส่ง body ไป  */
			let status_register = await register(body);
      
			/* ถ้าหากว่า status_register == false  */
			if (!status_register) {
			  alert("ข้อมูลไม่ถูกต้อง")
			  return
			/* ถ้าหากว่า status_register == true  */
			}else{
			  Router.push("/")
			}
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
				<div className="container p-5">
					{/* หัวข้อ */}
					<h2 className="text-center">แบบฟอร์มลงทะเบียน</h2>
					{/* ฟอร์ม */}
					<form
						className="row g-3"
						onSubmit={(ev) => submitForm(ev)}
						encType="multipart/form-data"
					>
						{/* ชื่อโรงเรียน  */}
						<div className="col-lg-12">
							<label className="form-label">ชื่อโรงเรียน</label>
							<input
								type="text"
								className="form-control"
								name="school_name"
								id="school_name"
							/>
						</div>
						{/* ชื่อตัวแทน  */}
						<div className="col-lg-12">
							<label className="form-label">
								ชื่อ-สกุล ตัวแทนโรงเรียน
							</label>
							<input
								type="text"
								className="form-control"
								name="admin_name"
								id="admin_name"
							/>
						</div>
						{/* อีเมลล์  */}
						<div className="col-lg-12">
							<label className="form-label">
								อีเมลล์ (สำหรับส่ง id password)
							</label>
							<input
								type="email"
								className="form-control"
								name="email"
								id="email"
							/>
						</div>
						{/* โทรศัพท์มือถือ */}
						<div className="col-lg-12">
							<label className="form-label">
								เบอร์โทรศัพท์ที่สามารถติดต่อได้
							</label>
							<input
								type="tel"
								className="form-control"
								name="school_tel"
								id="school_tel"
							/>
						</div>
						{/* เอกสารยืนยันโรงเรียน ใส่ multiple กรณีอัปโหลดได้หลายไฟล์*/}
						<div className="col-lg-12">
							<label className="form-label">
								เอกสารยืนยันโรงเรียน
							</label>
							<input
								type="file"
								className="form-control"
								multiple
								name="school_document"
								id="school_document"
							/>
						</div>
						{/* ปุ่มยืนยัน */}
						<div className="col-lg-12">
							<button className="btn btn-warning">ยืนยัน</button>
						</div>
					</form>
				</div>
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
