import React from "react";
import { useRef,useState, useEffect} from "react";
import { useRouter } from "next/router";

import Cookies from "universal-cookie";
import Swal from "sweetalert2";
import { admin_edit_school } from "../../utils/school_admin/edit_data";

/* ส่วนของ striped */
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { stripe } from "../../utils/payment";
import CheckoutForm from "../Stripe_CheckoutForm";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function SchoolData({ school_data, schoolID, email }) {
	const cookie = new Cookies();
	const token = cookie.get("token");
	const router = useRouter()
	
	/* hook useRef */
	const btnEdit = useRef();
	const btnCancel = useRef();
	const btnConfirm = useRef();
	const schoolName = useRef();
	const schoolLogo = useRef();
	const schoolNameShow = useRef();
	const schoolNameInput = useRef();
	const uploadImg = useRef();
	
	/* hook useState */
	const [clientSecret, setClientSecret] = useState("");
	const [picture, setPicture] = useState(school_data.urlLogo);
	
	function encodeImageFileAsURL(ev) {
		let file = ev.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			setPicture(reader.result);
		};
	}

	function taskEdit(ev) {
		ev.preventDefault();
		btnCancel.current.classList.remove("d-none");
		btnConfirm.current.classList.remove("d-none");
		btnEdit.current.classList.add("d-none");

		schoolName.current.classList.remove("d-none");
		schoolNameShow.current.classList.add("d-none");
		schoolLogo.current.classList.remove("d-none");
	}

	
	function taskCancel(ev) {
		ev.preventDefault();
		btnCancel.current.classList.add("d-none");
		btnConfirm.current.classList.add("d-none");
		btnEdit.current.classList.remove("d-none");

		
		schoolNameInput.current.value = schoolNameInput.current.defaultValue;
		uploadImg.current.value = "";
		setPicture(school_data.urlLogo);

		schoolName.current.classList.add("d-none");
		schoolNameShow.current.classList.remove("d-none");
		schoolLogo.current.classList.add("d-none");
	}

	
	async function taskConfirm(ev) {
		ev.preventDefault();
		
		if (!schoolNameInput.current.value){
			Swal.fire({
				icon: 'warning',
				title: 'โปรดใส่ชื่อโรงเรียน',
				showConfirmButton:true,
				confirmButtonColor:"#f7a518"
			})
			return
		}

		const body = {
			schoolID:schoolID,
			schoolName: schoolNameInput.current.value,
			urlLogo: picture
		};

		Swal.fire({
			title: 'คุณต้องการเปลี่ยนแปลงข้อมูลของโรงเรียนใช่หรือไม่',
			showConfirmButton: true,
			confirmButtonColor: "#0047a3",
			confirmButtonText: 'ยืนยัน',

			showCancelButton: true,
			cancelButtonText: "cancel",
			cancelButtonColor: "#d93333",

			showLoaderOnConfirm: true,
			preConfirm: () => {
				return admin_edit_school(token, body)
			},
			allowOutsideClick: false

		}).then((result) => {
			if (result.isConfirmed) {
				const result_update = result.value === "true" ? true : false
				if (result_update) {
					Swal.fire({
						icon: 'success',
						title: 'แก้ไขข้อมูลสำเร็จ',
						showConfirmButton: true,
						confirmButtonColor: "#009431",
						confirmButtonText: 'ok',
					}).then(() => {
						router.reload()
					})
				} else {
					Swal.fire({
						icon: 'error',
						title: 'แก้ไขข้อมูลไม่สำเร็จ\nกรุณาลองอีกครั้ง',
						showConfirmButton: true,
						confirmButtonColor: "#d1000a",
						confirmButtonText: 'ok',
					}).then(() => {
						router.reload()
					})
				}
			} else {

			}
		})
	}
	
	useEffect(() => {
		stripe(token).then((data) => {
			if (data) {
				setClientSecret(data.data.clientSecret)
			}
		})
	}, []);

	if (school_data.paymentStatus == "pending") {
		const appearance = {
			theme: "stripe",
		};
		const options = {
			clientSecret,
			appearance,
		};

		return (
			<main>
				<style jsx>{`
				.stripe_pay {
					width: 100%;
				}

				@media screen and (max-width: 768px) {
						.stripe_pay {
							display: flex;
							justify-content: center;
						}
					}

				`}</style>
				<div className="alert alert-danger text-center" role="alert">
					คุณยังไม่ได้ทำการชำระเงิน <br /> กรุณาทำการชำระเงิน เพื่อเปิดใช้งานระบบ
				</div>
				<div className="alert alert-danger text-center" role="alert">
					<div className="stripe_pay">
						{clientSecret && (
							<Elements options={options} stripe={stripePromise}>
								<CheckoutForm schoolID={schoolID} token={token} email={email} />
							</Elements>
						)}
					</div>
				</div>
			</main>
		);
	}
	else if (school_data.status == "pending") {
		return (
			<div className="alert alert-danger text-center" role="alert">
				โรงเรียนของคุณอยู่ในระหว่างรอการอนุมัติ
			</div>
		)
	}
	else if (school_data.status == "not_approve") {
		return (
			<div className="alert alert-danger text-center" role="alert">
				ระบบ <b>ไม่อนุมัติ</b> โรงเรียนของคุณ กรุณาตรวจสอบ email
			</div>
		)
	}
	else if (school_data.paymentStatus == "success") {
		return (
			<div>
				<style jsx>{`
					.img-size {
						height: 15rem;
						width: 15rem;
						border-radius: 10%;
						object-fit: contain;
					}
					
					.edit_btn{
						border:none;
						background-color:#c3971d;
						color:white;
						border-radius:4px;
					}
				`}</style>

				
				<form className="d-flex flex-column flex-md-row justiy-centent-center align-items-center">
					<div className="me-md-4">
						<img width={450}
							className="img-fluid rounded rounded-4"
							src={picture}
							alt="Card image cap"
						/>
					</div>
					<div className="w-100 mt-3 mt-md-0">
						<div className="card-body">
							<h4 className="card-text mt-3 d-none" ref={schoolName}>
								<label className="form-label">
									School Name :
								</label>
								<input
									type="text"
									className="form-control"
									id="staticEmail"
									defaultValue={school_data.schoolName}
									ref={schoolNameInput}
								/>
							</h4>
							<h2 className="card-title mt-3" ref={schoolNameShow}>
								{school_data.schoolName}
							</h2>
							<h5 className="card-text mt-2">
								School Status : {school_data.status}
							</h5>

							<h5 className="card-text mt-2">
								Payment Status : {school_data.paymentStatus ? "Paid" : "Unpaid"}
							</h5>
							
							<div className="d-none mt-2" ref={schoolLogo}>
								<div className="card-text">
									เลือกรูปภาพที่ต้องการแก้ไข (jpeg)
								</div>
								<input
									className="form-control"
									type="file"
									id="formFile"
									onChange={(ev) => encodeImageFileAsURL(ev)}
									ref={uploadImg}
								/>
							</div>
							<div className="d-flex flex-column-reverse flex-md-row justify-content-end  mt-2">
								<button
									className="btn  d-none me-2 w-100 mt-2"
									style={{backgroundColor:"#881b1b",color:"#fff"}}
									ref={btnCancel}
									onClick={(ev) => taskCancel(ev)}
								>
									ยกเลิก
								</button>
								<button
									className="btn edit_btn w-100 mt-2"
									ref={btnEdit}
									onClick={(ev) => taskEdit(ev)}
								>
									แก้ไข
								</button>
								<button
									className="btn d-none w-100 mt-2"
									style={{backgroundColor:"#11620e",color:"#fff"}}
									
									ref={btnConfirm}
									onClick={(ev) => taskConfirm(ev)}
								>
									ตกลง
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		);
	} 
}
