import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "../Stripe_CheckoutForm";

const stripePromise = loadStripe(
	"pk_test_51Ld8YvDi0FRxBi9CzfQIWC0PWgoMfKxIUnGx3z5MRUoLQIkDxkEiQKhULFITQmlgcZXXcc9Aj8xOI0WCBOuryVhG00WtNTPOIK"
);

export default function SchoolData({ school_data }) {
	
	if (school_data.paymentStatus) {
		return (
			<main>
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

				<div className="container">
					<div className="card-group vgr-cards ">
						<div className="card d-flex flex-column flex-md-row align-items-center">
							<div className="card-img-body ">
								<img
									className="img-size p-2"
									src={school_data.urlLogo}
									alt="Card image cap"
								/>
							</div>
							<div className="card-body ms-2 me-2 ms-md-4 ms-xl-7 me-md-5">
								<h2 className="card-title mt-3">
									{school_data.schoolName}
								</h2>
								<h5 className="card-text mt-2">
									School Status : {school_data.Status}
								</h5>
								<h5 className="card-text mt-2">
									Payment Status :{" "}
									{school_data.paymentStatus
										? "Paid"
										: "Unpaid"}
								</h5>
								<div className="">
									<label
										for="formFile"
										className="form-label mt-2"
									>
										เปลี่ยนรูปภาพ
									</label>
									<input
										className="form-control"
										type="file"
										id="formFile"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	} else if (!school_data.paymentStatus) {

		const [clientSecret, setClientSecret] = React.useState("");

		React.useEffect(() => {
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
