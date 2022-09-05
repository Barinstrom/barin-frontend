import React from "react";

export default function Nowclub() {
	const data = [
		{ teacher_name: "toto", role: "expert", school_name: "horwang" },
		{ teacher_name: "tata", role: "expert", school_name: "kaset" },
		{ teacher_name: "tete", role: "expert", school_name: "jula" },
		{ teacher_name: "bundit", role: "expert", school_name: "tepsirin" },
		{ teacher_name: "jitat", role: "expert", school_name: "prachanivet" },
		{ teacher_name: "kana", role: "expert", school_name: "sangsom" },
	];

		return (
		<main>
			<div className="text-center fs-1">Now Club</div>
			<div className="container">
				<div className="alert alert-info mt-2">
					<p className="alert-heading fs-3">Club ฟุตบอล</p>
					<p>คลับฟุตบอล</p>
					<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut rem magnam id aperiam eaque adipisci error. Temporibus perspiciatis explicabo totam quidem, provident, voluptatibus magnam error nulla laudantium inventore odio non?</p>
				</div>
			</div>
		</main>
	);
}
