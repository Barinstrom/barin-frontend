import React, { useState } from "react";
import Script from "react-load-script";

let OmiseCard;

export default function CreditCard() {
	const handleLoadScript = () => {
		OmiseCard = window.OmiseCard;
		OmiseCard.configure({
			publicKey: "pkey_test_5sxm3dmpgp2amagk9bh",
			currency: "THB",
			frameLabel: "Borntodev Shop",
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
				const data = {
					email: "borntodev@gmail.com",
					name: "Borntodev",
					amount: "10000",
					token: token,
				};
				fetch("/api/payment", {
					method: "POST",
					headers: {
						"Content-Type": "application/json;charset=UTF-8",
					},
					body: JSON.stringify(data),
				})
					.then((response) => response.json())
					.then((data) => console.log(data));
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
		<div className="own-form">
			<Script
				url="https://cdn.omise.co/omise.js"
				onLoad={handleLoadScript}
			/>
			<form>
				<div id="credit-card" type="button" onClick={handleClick}>
					ชำระเงินด้วยบัตรเครดิต
				</div>
			</form>
		</div>
	);
}
