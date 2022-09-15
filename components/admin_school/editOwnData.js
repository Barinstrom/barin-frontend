import React from "react";
import ErrorPage from "next/error";

export default function EditOwnData({ school_data,schoolID }) {

		if (!school_data.paymentStatus) {
			return <ErrorPage statusCode={404} />;
		}
	
		return (
		<div>
			<div className="text-center fs-1">Own data</div>
			<div>
				<div className="alert alert-info mt-2">
					<p className="alert-heading fs-3">Own หอวัง</p>
					<p> โรงเรียนหอวัง เป็นโรงเรียนชั้นนำของประเทศ</p>
					<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut rem magnam id aperiam eaque adipisci error. Temporibus perspiciatis explicabo totam quidem, provident, voluptatibus magnam error nulla laudantium inventore odio non?</p>
				</div>
			</div>
		</div>
	);
}
