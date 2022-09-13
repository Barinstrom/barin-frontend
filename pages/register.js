import React from "react";
import { useState,useRef } from "react";
import Router from "next/router";
import { register } from "../utils/unauth";

export default function Register() {
	/* state เก็บข้อมูลไฟล์ string base64 และชื่อไฟล์ */
	const [file, setfile] = useState();
	/* ตัวแปรผูกข้อมูลเพื่อเอาค่า value */
	const tagForm = useRef([]);
	const click_check = useRef();
	const spin = useRef();

	function checkFile(file, ev) {
		/* console.log(file)
		window.open(file, "_blank"); */
		window.open().document.write(`<img src="${file}"></img>`);
	}

	/* img to base64 */
	function encodeImageFileAsURL(ev) {
		//console.log(ev);
		var file = ev.target.files[0];
		var reader = new FileReader();
		reader.onloadend = function () {
			// console.log("RESULT", reader.result);
			setfile(reader.result);
		};
		reader.readAsDataURL(file);

		click_check.current.classList.remove("d-none");

	}

	/* ฟังชันก์เมื่อกดปุ่มยืนยัน */
	async function submitForm(ev) {
		/* ป้องกันกันส่งข้อมูลไป server โดยเราจะทำการ fetch post ข้อมูลไปทาง api แทน */
		ev.preventDefault();

		/* อ้างอิงถึงแต่ละ tag html แล้วนำค่ามา */
		const school_name = tagForm.current[0].value;
		const email = tagForm.current[1].value;
		const schoolID = tagForm.current[2].value;
		const password = tagForm.current[3].value;
		const confirmPassword = tagForm.current[4].value;
		const tel = tagForm.current[5].value;

		/* เช็คว่าใส่ข้อมูลครบไหม */
		if (!email || !schoolID || !password || !confirmPassword || !school_name || !tel || ( password!=confirmPassword )) {
			alert("โปรดกรอกข้อมูลให้ถูกต้องและครบถ้วน");
			return;
		} else if (!file) {
			alert("โปรดใส่เอกสารยืนยันโรงเรียน");
		} else {
			//console.log("ข้อมูลครบ");

			const will_data = {
				schoolName: school_name,
				email: email,
				schoolID: schoolID,
				certificate_doc: String(file),
				password: password,
				confirmPassword: confirmPassword,
				role: "admin",
			};
			console.log("gogo");
			spin.current.classList.remove("d-none");
			// window.localStorage.setItem("infomation", JSON.stringify(body));

			/* will call register api */
			const res = await register(will_data);

			console.log(res);
			spin.current.classList.add("d-none");
			/* ถ้าได้ res เป็น ... จะ ... */
			// Router.push({
			// 	pathname: "/",
			// });
		}
	}

	return (
		<>
			<style jsx>{`
			.spinnerX {
				position: fixed;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				text-align: center;
				background-color: rgba(255, 255, 255, 0.8);
				z-index: 2;
			}
			`}</style>
			
			<div className="spinnerX pt-5 d-none" ref={spin}>
				<div className="spinner-border text-primary" role="status">
				</div>
			</div>

			<div className="container p-3 mt-4">
				
				<div className="row">
					<div className="col-lg-6 mt-0 p-3">
						<div>
							<h2 className="text-center">
								ข้อตกลงในการสมัครสมาชิก
							</h2>
							<ul className="list-group list-group-flush">
								<li className="list-group-item mt-3">
									<span>1. โปรดกรอกข้อมูลให้ครบถ้วน</span>
								</li>
								<li className="list-group-item">
									<span>
										2.
										ในการกรอกข้อมูลแต่ละครั้งควรเช็คความถูกต้องให้เรียบร้อย
									</span>
								</li>
								<li className="list-group-item">
									<span>
										3.
										ตรวจสอบไฟล์ที่ต้องส่งว่าครบถ้วนและถูกต้องตามข้อกำหนดหรือไม่
									</span>
								</li>
							</ul>
						</div>
					</div>
					<div className="col-lg-6 mt-4 mt-lg-0 p-3">
						<h2 className="text-center">สมัครสมาชิก</h2>
						{/* ฟอร์ม */}
						<form
							className="row g-2"
							onSubmit={(ev) => submitForm(ev)}
							encType="multipart/form-data"
						>
							{/* ชื่อโรงเรียน  */}
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
							{/* อีเมลล์  */}
							<div className="col-12">
								<label className="form-label">
									{" "}
									อีเมลล์ (สำหรับ login และยืนยัน){" "}
								</label>
								<input
									type="email"
									className="form-control"
									name="email"
									id="email"
									ref={(el) => (tagForm.current[1] = el)}
								/>
							</div>
							{/* path  */}
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
							{/* path  */}
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
							{/* path  */}
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
							{/* โทรศัพท์มือถือ */}
							<div className="col-12">
								<label className="form-label">
									{" "}
									เบอร์โทรศัพท์ที่สามารถติดต่อได้{" "}
								</label>
								<input
									type="tel"
									className="form-control"
									name="school_tel"
									id="school_tel"
									ref={(el) => (tagForm.current[5] = el)}
								/>
							</div>

							{/* เอกสารยืนยันโรงเรียน ใส่ multiple กรณีอัปโหลดได้หลายไฟล์*/}
							<div className="col-12">
								<label className="form-label">
									{" "}
									เอกสารยืนยันโรงเรียน{" "}
								</label>
								<br />
								<input
									className="form-control"
									type="file"
									id="formFile"
									onChange={(ev) => encodeImageFileAsURL(ev)}
								/>
							</div>
							{/* ดูเอกสารยืนยันโรงเรียน */}
							<div className="col-12 d-none" ref={click_check}>
								<label className="form-label">
									กรุณากดเพื่อเช็คเอกสารยืนยันโรงเรียน :
									<p
										onClick={(ev) => checkFile(file, ev)}
										className="bg-info text-center rounded rounded-3"
									>
										check picture
									</p>
								</label>
							</div>
							{/* ปุ่มยืนยัน */}
							<div className="col-12">
								<button className="btn btn-warning">
									ยืนยัน
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
