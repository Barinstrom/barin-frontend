import React, { useEffect, useState } from "react";
import Script from "react-load-script";
import { register } from "../utils/auth"
import {useRouter} from "next/router";
import Swal from 'sweetalert2';

let OmiseCard;

export default function CreditCard(req, res) {
	const [data,setData] = useState({})
	const router = useRouter()
	/* กรณี user กดปุ่มไฟล์เพื่อจะเช็ค */
	function checkFile(file,ev){
		/* console.log(file)
		window.open(file, "_blank"); */
		window.open().document.write(`<img src="${file}"></img>`)
	}
	
	useEffect(() => {
		/* ทำการดึงข้อมูลจาก localStorage */
		setData(JSON.parse(window.localStorage.getItem("infomation")))
	},[])

	/* ส่วนนี้รอแตมป์เขียนนะ คะน้าน่าจะต้องอ่านก่อน */
	const handleLoadScript = () => {
		OmiseCard = window.OmiseCard;
		OmiseCard.configure({
			publicKey: "pkey_test_5sxm3dmpgp2amagk9bh",
			currency: "THB",
			frameLabel: "Barinstrom Shop",
			submitLabel: "Pay NOW",
			buttonLabel: "Pay with Omise",
		});
	};
	
	/* ส่วนนี้รอแตมป์เขียนนะ คะน้าน่าจะต้องอ่านก่อน */
	const creditCardConfigure = () => {
		OmiseCard.configure({
			defaultPaymentMethod: "credit_card",
			otherPaymentMethods: [],
		});
		OmiseCard.configureButton("#credit-card");
		OmiseCard.attach();
	};

	/* ส่วนนี้รอแตมป์เขียนนะ คะน้าน่าจะต้องอ่านก่อน */ 
	const omiseCardHandler = () => {
		OmiseCard.open({
			amount: "10000",
			onCreateTokenSuccess: async (token) => {
				console.log("token =", token);
				const omise_data = {
					email: data.email,
					name: data.admin_name,
					amount: "10000",
					token: token,
				};
				
				const res = await fetch("/api/payment", {
					method: "POST",
					headers: {"Content-Type": "application/json;charset=UTF-8",},
					body: JSON.stringify(omise_data),
				})
				
				const result = await res.json()
				console.log(result)
				
				/* ถ้าชำระเงินสำเร็จ  */
				if (result.status == "successful") {
					const Toast = Swal.mixin({
  					toast: true,
					position: 'top-end',
					showConfirmButton: false,
					timer: 3000,
					timerProgressBar: true,
					didOpen: (toast) => {
						toast.addEventListener('mouseenter', Swal.stopTimer)
						toast.addEventListener('mouseleave', Swal.resumeTimer)
					}
					})
					Toast.fire({
					icon: 'success',
					title: 'Payment Successful'
					})
					/* เรียกฟังชันก์ checkLogin แล้วส่ง body เป็น parameter ไป  */
					const body = {
						userId: data.email,
						password: "12345",
						confirmPassword: "12345",
						email: data.email,
						role: "admin",
						certificate_doc:data.school_document
					};
					/* รอข้อมูลว่า true / false */
					const status_register = await register(body)
					
					/* ถ้าหากว่า status_register == false  */
					if (!status_register) {
						// alert("เกิดข้อผิดพลาดระหว่างการสมัคร โปรดติดต่อ supporter เพื่อทำการสมัครให้เสร็จสมบูรณ์ โทร xxx-xxx-xxx")
						Swal.fire({
							icon: 'error',
							title: 'Error...',
							text: 'Please contract support Tel.xxx-xxx-xxx',
							})
						return
						
						/* ถ้าหากว่า status_register == true  */
					} else {
						// alert("สมัครเสร็จสิ้น");
						Swal.fire({
							icon: 'success',
							title: 'Registeration Successful'
							})
						/* ทำการลบข้อมูลจาก localStorage */
						window.localStorage.removeItem("infomation")
						/* เด้งไปหน้านี้ก่อน หน้ารอยังไม่ได้ทำเพิ่ม */
						router.push("/register")
					}
				/* ถ้าชำระเงินไม่สำเร็จ  */
				}else {
					Swal.fire({
						icon: 'error',
						title: 'Payment Failed' + '\n' + result.status
					
						})
				}
				//console.log(data);
					
			},
			onFormClosed: () => {},
		});
	};
	
	/* ส่วนนี้รอแตมป์เขียนนะ คะน้าน่าจะต้องอ่านก่อน */ 
	const handleClick = (e) => {
		e.preventDefault();
		creditCardConfigure();
		omiseCardHandler();
	};

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
			<Script
				url="https://cdn.omise.co/omise.js"
				onLoad={handleLoadScript}
			/>
			<div className="contain_form ps-3 pe-3">
				<div className="container p-5">
					{/* หัวข้อ */}
					<h2 className="text-center">
						กรุณาตรวจสอบข้อมูลอีกครั้ง ก่อนชำระเงิน
					</h2>
					{/* ฟอร์ม */}
					<form
						className="row g-3"
						onSubmit={(ev) => submitForm(ev)}
						encType="multipart/form-data"
					>
						{/* ชื่อโรงเรียน  */}
						<div className="col-lg-12">
							<label className="form-label">
								ชื่อโรงเรียน : 
							</label>
						</div>
						{/* ชื่อตัวแทน  */}
						<div className="col-lg-12">
							<label className="form-label">
								ชื่อ-สกุล ตัวแทนโรงเรียน : {data.admin_name}
							</label>
						</div>
						{/* อีเมลล์  */}
						<div className="col-lg-12">
							<label className="form-label">
								อีเมลล์ (สำหรับส่ง id password) : {data.email}
							</label>
						</div>
						{/* โทรศัพท์มือถือ */}
						<div className="col-lg-12">
							<label className="form-label">
								เบอร์โทรศัพท์ที่สามารถติดต่อได้ :{""}
								{data.school_tel}
							</label>
						</div>
						{/* เอกสารยืนยันโรงเรียน ใส่ multiple กรณีอัปโหลดได้หลายไฟล์*/}
						<div className="col-lg-12">
							<label className="form-label">
								เอกสารยืนยันโรงเรียน : 
								<p onClick={(ev) => checkFile(data.school_document,ev)} className="bg-info text-center rounded rounded-3">check picture</p>
							</label>
						</div>
						{/* ปุ่มยืนยัน */}
						<div className="col-lg-12">
							<div
								className="btn btn-primary"
								id="credit-card"
								type="button"
								onClick={handleClick}
							>
								ยืนยันและชำระเงินด้วยบัตรเครดิต
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
