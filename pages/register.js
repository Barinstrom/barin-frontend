import React from "react";
import { useState,useRef,useEffect } from "react";
import { useRouter } from "next/router";
import { register } from "../utils/unauth";
// import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';

import Swal from "sweetalert2";

export default function Register() {
	const spin = useRef()
	const router = useRouter()
	const [file, setfile] = useState("");
	const tagForm = useRef([]);
	const click_check = useRef();
	// const captcha = useRef();

	// useEffect(() => {
	// 	loadCaptchaEnginge(6); 
	// })

	function checkFile(file) {
		window.open().document.write(`<img src="${file}"></img>`);
	}

	function encodeImageFileAsURL(ev) {
		let file = ev.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = function () {
			setfile(reader.result);
		};
		click_check.current.classList.remove("d-none");
	}

	
	async function submitForm(ev) {
		ev.preventDefault();

		const school_name = tagForm.current[0].value;
		const email = tagForm.current[1].value;
		const schoolID = tagForm.current[2].value;
		const password = tagForm.current[3].value;
		const confirmPassword = tagForm.current[4].value;
		const tel = tagForm.current[5].value;
		const characterEnglish = /^[A-Za-z0-9]*$/;

		// let user_captcha = captcha.current.value;

		// if (validateCaptcha(user_captcha)===true) {
		// 		// alert('Captcha Matched');
		// 		// loadCaptchaEnginge(6); 
		// 		// document.getElementById('user_captcha_input').value = "";
		// }

		// else {
		// 	Swal.fire({
		// 		icon: 'warning',
		// 		title: 'captcha ไม่ถูกต้อง',
		// 		showConfirmButton: true,
		// 		confirmButtonColor: "#f7a518",
		// 		confirmButtonText: 'ok',
		// 	})
		// 	captcha.current.value = "";
		// 	return;
		// }

		if (!characterEnglish.test(schoolID)) {
			Swal.fire({
				icon: 'warning',
				title: 'โปรดใส่ School ID  เป็นตัวอักษรภาษาอังกฤษเท่านั้น',
				showConfirmButton: true,
				confirmButtonColor: "#f7a518",
				confirmButtonText: 'ok',
			})
			return;
		} else if (!email || !schoolID || !password || !confirmPassword || !school_name || !tel || (password != confirmPassword)) {
			Swal.fire({
				icon: 'warning',
				title: 'โปรดกรอกข้อมูลให้ถูกต้องและครบถ้วน',
				showConfirmButton: true,
				confirmButtonColor: "#f7a518",
				confirmButtonText: 'ok',
			})
			return;
		} else if (!file) {
			Swal.fire({
				icon: 'warning',
				title: 'โปรดใส่เอกสารยืนยันโรงเรียน',
				showConfirmButton: true,
				confirmButtonColor: "#f7a518",
				confirmButtonText: 'ok',
			})
		}
		else {
			const will_data = {
				schoolName: school_name,
				email: email,
				schoolID: schoolID,
				certificate_doc: String(file),
				password: password,
				confirmPassword: confirmPassword,
				tel: tel,
				role: "admin",
			};

			Swal.fire({
				title: 'คุณตรวจสอบข้อมูลเรียบร้อย และต้องการสมัครสมาชิก',
				showConfirmButton: true,
				confirmButtonColor: "#0047a3",
				confirmButtonText: 'ยืนยัน',

				showCancelButton: true,
				cancelButtonText: "cancel",
				cancelButtonColor: "#d93333",
						
				showLoaderOnConfirm: true,
				preConfirm: () => {
					return register(will_data);
				},
				allowOutsideClick: false
		
			}).then((result) => {
				if (result.isConfirmed) {
					console.log(result)
					if (!result.value[1]) {
						Swal.fire({
							icon: 'error',
							title: result.value[0].response.data,  
							showConfirmButton:true,
							confirmButtonColor:"#ce0303"
						})
						return;
					}
					else {
						Swal.fire({
							icon: 'success',
							title: 'สมัครสมาชิกสำเร็จ' + '\n' + 'โปรดตรวจสอบอีเมล' + '\n' + 'เพื่อยืนยันอีเมล',
							showConfirmButton:true,
							confirmButtonColor:"#009431"
						}).then(() => {
							router.push("/");
						})
					}
				}
			})
			
			
		}
	}
	
	return (
		<div className="position-relative">
			<style jsx>{`
				.background-spinner{
					background-color:rgb(0, 0, 0,0.3);
					position: absolute;
					top: 0;
					left: 0;
					right:0;
					bottom:0;
					width:100%;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					z-index: 100;
				}
			`}</style>
			<div className='background-spinner d-none' ref={spin}>
				<div className="spinner-border text-primary"></div>
			</div>
			<div className="container p-1 mt-4">
				<div className="row">
					<div className="col-lg-6 mt-0 p-3">
						<h2 className="text-center">ข้อตกลงในการสมัครสมาชิก</h2>
						<ul className="nav nav-tabs">
							<li className="nav-item">
								<a className="nav-link active" data-bs-toggle="tab" href="#tab1">1</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" data-bs-toggle="tab" href="#tab2">2</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" data-bs-toggle="tab" href="#tab3">3</a>
							</li>
						</ul>
						<div className="tab-content">
							<div id="tab1" className="tab-pane fade show active">
								ในการสมัครสมาชิกโปรดกรอกข้อมูลให้ครบถ้วน
							</div>
							<div id="tab2" className="tab-pane fade">
								เมื่อกรอกข้อมูลเสร็จแล้ว โปรดตรวจสอบความถูกต้องก่อนยืนยัน
							</div>
							<div id="tab3" className="tab-pane fade">
								เมื่อกรอกข้อมูลเสร็จแล้ว โปรดตรวจสอบความถูกต้องก่อนยืนยัน
							</div>
						</div>
					</div>
					<div className="col-lg-6 mt-4 mt-lg-0 p-3">
						<h2 className="text-center">สมัครสมาชิก</h2>
						
						<form
							className="row g-2"
							onSubmit={(ev) => submitForm(ev)}
							encType="multipart/form-data"
						>
							<div className="">
								<label className="form-label">
									ชื่อโรงเรียน
								</label>
								<input
									type="text"
									className="form-control"
									name="school_name"
									id="school_name"
									ref={(el) => (tagForm.current[0] = el)}
								/>
							</div>
							
							<div className="col-12">
								<label className="form-label">
									อีเมล (สำหรับ login และยืนยัน)
								</label>
								<input
									type="email"
									className="form-control"
									name="email"
									id="email"
									ref={(el) => (tagForm.current[1] = el)}
								/>
							</div>
							
							<div className="col-12">
								<label className="form-label">
									School ID (สำหรับกำหนด path ของเว็ปโรงเรียน)
								</label>
								<input
									type="text"
									className="form-control"
									name="admin_name"
									id="admin_name"
									ref={(el) => (tagForm.current[2] = el)}
								/>
							</div>
							
							<div className="col-12">
								<label className="form-label">password</label>
								<input
									type="password"
									className="form-control"
									name="admin_name"
									id="admin_name"
									ref={(el) => (tagForm.current[3] = el)}
								/>
							</div>
							
							<div className="col-12">
								<label className="form-label">
									confirmPassword
								</label>
								<input
									type="password"
									className="form-control"
									name="admin_name"
									id="admin_name"
									ref={(el) => (tagForm.current[4] = el)}
								/>
							</div>
							
							<div className="col-12">
								<label className="form-label">
									เบอร์โทรศัพท์ที่สามารถติดต่อได้
								</label>
								<input
									type="tel"
									className="form-control"
									name="school_tel"
									id="school_tel"
									ref={(el) => (tagForm.current[5] = el)}
								/>
							</div>

							<div className="col-12">
								<label className="form-label">
									เอกสารยืนยันโรงเรียน (ไฟล์รูปภาพ jpeg)
								</label>
								<br />
								<input
									className="form-control"
									type="file"
									id="formFile"
									onChange={(ev) => encodeImageFileAsURL(ev)}
								/>
							</div>
							
							<div className="col-12 d-none" ref={click_check}>
								<label className="form-label">
									กรุณากดเพื่อเช็คเอกสารยืนยันโรงเรียน :
									<p
										onClick={() => checkFile(file)}
										className="bg-dark text-white text-center rounded rounded-2"
									>
										check picture
									</p>
								</label>
							</div>
							{/* <div className="col-12">
									<LoadCanvasTemplate />
							</div>

							<div className="col-12">
									<input className="form-control" placeholder="Enter Captcha Value" type="text" ref={captcha} />
							</div> */}
							<div className="col-12">
								<button className="btn btn-success">
									ยืนยัน
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

