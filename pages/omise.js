import React, { useState } from "react";
import Script from "react-load-script";
import { useRouter } from "next/router";
import { register } from "../utils/auth"
import Router from "next/router";

let OmiseCard;

export default function CreditCard(req, res) {

	const router = useRouter();
	const data = router.query;
	console.log("data =", data);

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

	const creditCardConfigure = () => {
		OmiseCard.configure({
			defaultPaymentMethod: "credit_card",
			otherPaymentMethods: [],
		});
		OmiseCard.configureButton("#credit-card");
		OmiseCard.attach();
	};

	const omiseCardHandler = () => {
		OmiseCard.open({
			amount: "10000",
			onCreateTokenSuccess: (token) => {
				console.log("token =", token);
				const omise_data = {
					email: data.email,
					name: data.admin_name,
					amount: "10000",
					token: token,
				};
				fetch("/api/payment", {
					method: "POST",
					headers: {
						"Content-Type": "application/json;charset=UTF-8",
					},
					body: JSON.stringify(omise_data),
				})
					.then((response) => response.json())
					.then((res) => {
						if (res.status == "successful") {
							alert("successful");
							/* เรียกฟังชัน checkLogin แล้วส่ง body ไป  */
							const body = {
								userId: data.email,
								password: "12345",
								confirmPassword: "12345",
								email: data.email,
								role: "admin",
							};
							let status_register = register(body);

							/* ถ้าหากว่า status_register == false  */
							if (!status_register) {
								alert(
									"เกิดข้อผิดพลาดระหว่างการสมัคร โปรดติดต่อ supporter เพื่อทำการสมัครให้เสร็จสมบูรณ์ โทร xxx-xxx-xxx"
								);
								return;
								/* ถ้าหากว่า status_register == true  */
							} else {
								alert("สมัครเสร็จสิ้น");
								Router.push("/");
							}
						} else {
							alert("error");
						}
						//console.log(data);
					});
			},
			onFormClosed: () => {},
		});
	};

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
								ชื่อโรงเรียน : {data.school_name}
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
								เบอร์โทรศัพท์ที่สามารถติดต่อได้ :{" "}
								{data.school_tel}
							</label>
						</div>
						{/* เอกสารยืนยันโรงเรียน ใส่ multiple กรณีอัปโหลดได้หลายไฟล์*/}
						<div className="col-lg-12">
							<label className="form-label">
								เอกสารยืนยันโรงเรียน : {data.nameFile}
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
