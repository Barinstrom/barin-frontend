import React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { register } from "../utils/unauth";
import Swal from "sweetalert2";

export default function Register() {
	const spin = useRef()
	const router = useRouter()
	const [file, setfile] = useState("");
	const tagForm = useRef([]);
	const click_check = useRef();
	const site_key = process.env.NEXT_PUBLIC_SITE_KEY




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
				html: '<div style="display:flex; justify-content:center; overflow-y:hidden"><div id="recaptcha" ></div> </div > ',
				didOpen: () => {
					grecaptcha.render('recaptcha', {
						'sitekey': site_key
					})
				},

				showConfirmButton: true,
				confirmButtonColor: "#0047a3",
				confirmButtonText: 'ยืนยัน',

				showCancelButton: true,
				cancelButtonText: "cancel",
				cancelButtonColor: "#d93333",

				showLoaderOnConfirm: true,
				preConfirm: () => {
					if (grecaptcha.getResponse().length === 0) {
						Swal.showValidationMessage(`Please verify that you're not a robot`)
					}
					else {
						return register(will_data);
					}

				},
				allowOutsideClick: false

			}).then((result) => {
				if (result.isConfirmed) {
					// console.log(result)
					if (!result.value[1]) {
						Swal.fire({
							icon: 'error',
							title: result.value[0].response.data,
							showConfirmButton: true,
							confirmButtonColor: "#ce0303"
						})
						return;
					}
					else {
						Swal.fire({
							icon: 'success',
							title: 'สมัครสมาชิกสำเร็จ' + '\n' + 'โปรดตรวจสอบอีเมล' + '\n' + 'เพื่อยืนยันอีเมล',
							showConfirmButton: true,
							confirmButtonColor: "#009431"
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

				.recaptcha {
					margin: 0 auto .5em;
				}

				#recaptcha{
					margin: 0 auto .5em;
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
								<p className="text-center mt-1 mb-1"><h5><strong>ข้อตกลงในการกรอกข้อมูล</strong></h5></p>
								<strong>1. ช่อง “ชื่อโรงเรียน” </strong>: เป็นช่องที่ไว้ใส่ชื่อโรงเรียนที่ทำการสมัคร<br />
								<strong>2. ช่อง “อีเมล” </strong>: เป็นช่องที่ไว้ใส่อีเมลของโรงเรียนที่ทำการสมัคร โดยอีเมลนั้นจะถือว่าเป็นอีเมลของ admin school ซึ่งมีความสำคัญมากที่สุดในการเข้าใช้เว็บไซต์ลงทะเบียนชุมนุมนี้ แต่อีเมลนี้ไม่สามารถใช้ซ้ำกับอีเมลของครูหรือนักเรียนได้ <strong>email นี้ไม่สามารถเปลี่ยนแปลงได้ในภายหลัง</strong><br />
								<strong>3. ช่อง “School ID” </strong>: สำหรับใส่ ID ของโรงเรียนที่มาสมัคร โดยผู้สมัครสามารถคิดได้เองตามใจชอบ แต่จะต้องไม่ซ้ำกับโรงเรียนอื่น และ ID นี้จะถูกใช้เป็น path สำหรับเข้าใช้งานเว้บไซต์ของโรงเรียนนั้นๆด้วย <strong>ID นี้ไม่สามารถเปลี่ยนแปลงได้ในภายหลัง</strong><br />
								<strong>4. ช่อง “password” </strong>: ใส่รหัสผ่านที่จะใช้ login ส่วนของ admin school<br />
								<strong>5. ช่อง “confirmPassword” </strong>: ใส่รหัสผ่านอีกครั้ง<br />
								<strong>6. ช่อง “เบอร์โทรศัพท์ที่สามารถติดต่อได้” </strong>: ใส่เบอร์โทรศัพท์ที่สะดวก เพื่อให้ system admin สามารถติดต่อไปหากต้องการข้อมูลบางอย่างเพิ่มเติมได้<br />
								<strong>7. ช่อง “เอกสารยืนยันโรงเรียน” </strong>: เป็นช่องสำหรับใส่รูปภาพเอกสารที่ยืนยันว่าผู้สมัครเป็นโรงเรียนจริงๆ หลักฐานนี้จะถูกใช้ในการพิจารณาการอนุมัติใช้งานเว็บ โดย system admin ซึ่งหลักฐานนี้สามารถมีได้หลายแบบ เช่น เอกสารก่อตั้งโรงเรียน หรืออาจจะเป็นหนังสือรับรองการขอสมัครเว็บไซต์ที่มีลายเซ็นของผู้อำนวยการ เป็นต้น<br />
							</div>
							<div id="tab2" className="tab-pane fade">
								<p className="text-center mt-1 mb-1"><h5><strong>ข้อตกลงในการชำระเงิน</strong></h5></p>
								การชำระเงินจะถูกเรียกเก็บใหม่ทุกๆปี โดยจะเรียกเก็บใหม่อีกครั้ง ในวันที่ท่านทำการสมัครครบ 1 ปี<br />
							</div>
							<div id="tab3" className="tab-pane fade">
								<p className="text-center mt-1 mb-1"><h5><strong>ข้อตกลงในการใช้งาน</strong></h5></p>
								<strong>1. </strong>ผู้สมัครจะใช้งานระบบได้ก็ต่อเมื่อ <strong>ทำการยืนยันอีเมล</strong> และ <strong>เข้าไปชำระเงินในเว็บไซต์</strong> เรียบร้อยแล้วเท่านั้น<br />
								<strong>2. </strong>การตัดสินใจอนุมัติ/ไม่อนุมัติ การเข้าใช้งานเว็บไซต์ เป็นดุลพินิจของ system admin. หาก system admin ไม่อนุมัติ จะมีเมลไปบอกผู้สมัครเสมอว่าเพราะเหตุใด และให้ผู้สมัครแก้ไขตาม mail นั้น<br />
								<strong>3. </strong>หากพบว่าผู้สมัครทำการละเมิดการใช้งานของผู้สมัครท่านอื่น system admin มีสิทธิที่จะปิดระบบการใช้งานของผู้สมัคร โดยที่ไม่จำเป็นต้องแจ้งล่วงหน้า<br />
								<strong>4. </strong>ผู้สมัครควรปฏิบัติตามคู่มือการใช้งานเว็บไซต์อย่างเคร่งครัด เพื่อลดความผิดพลาดที่จะเกิดขึ้น (คู่มืออยู่บริเวณมุมบนขวาของเว็บไซต์ หลังจากที่ผู้สมัครเข้าสุ่ระบบแล้ว)<br />

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

