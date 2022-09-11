import React from "react";
import { useRef,useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "../Stripe_CheckoutForm";

const stripePromise = loadStripe(
	"pk_test_51Ld8YvDi0FRxBi9CzfQIWC0PWgoMfKxIUnGx3z5MRUoLQIkDxkEiQKhULFITQmlgcZXXcc9Aj8xOI0WCBOuryVhG00WtNTPOIK"
);

export default function SchoolData({ school_data }) {
	const [clientSecret, setClientSecret] = useState("");
	const [picture, setPicture] = useState(school_data.urlLogo);
	const btnEdit = useRef();
	const btnCancel = useRef();
	const btnConfirm = useRef();
	const schoolName = useRef();
	const schoolLogo = useRef();
	const schoolNameShow = useRef();
	const schoolNameInput = useRef();
	const uploadImg = useRef();

	/* img to base64 */
	function encodeImageFileAsURL(ev) {
		//console.log(ev);
		var file = ev.target.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = function () {
			//console.log("RESULT", reader.result);
			setPicture(reader.result);
		};
	}

	/* click edit data */
	function taskEdit(ev) {
		ev.preventDefault();
		btnCancel.current.classList.remove("d-none");
		btnConfirm.current.classList.remove("d-none");
		btnEdit.current.classList.add("d-none");

		schoolName.current.classList.remove("d-none");
		schoolNameShow.current.classList.add("d-none");
		schoolLogo.current.classList.remove("d-none");
	}

	/* click cancel */
	function taskCancel(ev) {
		ev.preventDefault();
		btnCancel.current.classList.add("d-none");
		btnConfirm.current.classList.add("d-none");
		btnEdit.current.classList.remove("d-none");

		/* now data -> old data */
		schoolNameInput.current.value = schoolNameInput.current.defaultValue;
		uploadImg.current.value = "";
		setPicture(school_data.urlLogo);

		schoolName.current.classList.add("d-none");
		schoolNameShow.current.classList.remove("d-none");
		schoolLogo.current.classList.add("d-none");
	}

	/* click confirm */
	function taskConfirm(ev) {
		ev.preventDefault();
		
		if (!schoolNameInput.current.value){
			alert("โปรดใส่ชื่อโรงเรียน")
		}

		const will_json = {
			schoolName: schoolNameInput.current.value,
			urlLogo: picture,
		};
		console.log(will_json);

		/* api call */

		/* end api call */
		window.location.reload();
	}

	useEffect(() => {
		console.log("set Stripe");
		// Create PaymentIntent as soon as the page loads
		fetch("/api/create-payment-intent", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
		})
			.then((res) => res.json())
			.then((data) => setClientSecret(data.clientSecret));
	}, []);

	if (school_data.paymentStatus) {
		return (
			<div>
				<style jsx>{`
					.img-size {
						max-height: 400px;
						max-width: 250px;
					}
					@media screen and (max-width: 768px) {
						.img-size {
							max-width: 60vw;
						}
					}
				`}</style>

				
				<form className="d-flex flex-column flex-md-row justiy-centent-center align-items-center">
					<div className="">
						<img 
							className="img-size p-2 round-md"
							src={picture}
							alt="Card image cap"
						/>
					</div>
					<div className="card-body">
						<h4 className="card-text mt-3 d-none border" ref={schoolName}>
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
							School Status : {school_data.Status}
						</h5>

						<h5 className="card-text mt-2">
							Payment Status :
							{school_data.paymentStatus ? "Paid" : "Unpaid"}
						</h5>
						
						<div className="d-none mt-2" ref={schoolLogo}>
							<div className="card-text">
								เลือกรูปภาพที่จะเปลี่ยน(ถ้าต้องการแก้ไข):
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
								className="btn btn-danger d-none me-2 w-100 mt-2"
								ref={btnCancel}
								onClick={(ev) => taskCancel(ev)}
							>
								ยกเลิก
							</button>
							<button
								className="btn btn-warning w-100 mt-2"
								ref={btnEdit}
								onClick={(ev) => taskEdit(ev)}
							>
								แก้ไข
							</button>
							<button
								className="btn btn-success d-none w-100 mt-2"
								ref={btnConfirm}
								onClick={(ev) => taskConfirm(ev)}
							>
								ตกลง
							</button>
						</div>
					</div>
				</form>
				
			</div>
		);
	} else if (!school_data.paymentStatus) {
		const appearance = {
			theme: "stripe",
		};
		const options = {
			clientSecret,
			appearance,
		};

		return (
			<main>
				<style jsx>{``}</style>
				<div className="alert alert-danger text-center" role="alert">
					คุณยังไม่ได้ทำการชำระเงิน <br /> กรุณาทำการชำระเงิน
				</div>
				<div className="alert alert-danger" role="alert">
					<div className="App">
						{clientSecret && (
							<Elements options={options} stripe={stripePromise}>
								<CheckoutForm schoolID={school_data.schoolID} />
							</Elements>
						)}
					</div>
				</div>
			</main>
		);
	}
}
