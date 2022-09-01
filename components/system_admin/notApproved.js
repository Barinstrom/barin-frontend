import React from "react";

export default function Approved() {
	const data = [
		{ teacher_name: "toto", role: "expert", school_name: "horwang" },
		{ teacher_name: "tata", role: "expert", school_name: "kaset" },
		{ teacher_name: "tete", role: "expert", school_name: "jula" },
		{ teacher_name: "bundit", role: "expert", school_name: "tepsirin" },
		{ teacher_name: "jitat", role: "expert", school_name: "prachanivet" },
		{ teacher_name: "kana", role: "expert", school_name: "sangsom" },
	];

	function clickSearch(ev) {
		ev.preventDefault();
		/* ค้นหาโรงเรียน */
	}

	return (
		<main>
			<style jsx>{`
				.btn-responsive {
					width: 15%;
				}
				@media screen and (max-width: 1000px) {
					.btn-responsive {
						width: 40%;
					}
				}
				@media screen and (max-width: 576px) {
					.btn-responsive {
						width: 100%;
					}
				}
			`}</style>

			<div className="text-center fs-1">Not Approved</div>
			<form onClick={(ev) => clickSearch(ev)} className="mb-4 mt-2">
				<div className="input-group">
					<span className="input-group-text">ค้นหาโรงเรียน</span>
					<input className="form-control" name="search" />
					<button className="btn btn-danger">กด</button>
				</div>
			</form>
			<ul className="list-group">
				{data.map((e, i) => {
					return (
						<li className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-center">
							<div className="d-flex flex-column w-100">
								<h5 className="mb-1">{e.teacher_name}</h5>
								<small>{e.role}</small>
							</div>
							<button className="btn btn-primary mt-3 mb-3 btn-responsive">
								รายละเอียด
							</button>
						</li>
					);
				})}
			</ul>
		</main>
	);
}
