import React from "react";

export default function Searchclub() {
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
			<div className="text-center fs-1">Searchclub</div>
			<table className="table table-hover table-bordered table-striped text-center">
				<thead className="table-dark">
					<tr>
						<th>ชื่อครู</th>
						<th>ตำแหน่ง</th>
						<th>โรงเรียน</th>
						<th>ข้อมูลต่างๆ</th>
					</tr>
				</thead>
				<tbody>
					{data.map((e, i) => {
						return (
							<tr key={i}>
								<td>{e.teacher_name}</td>
								<td>{e.role}</td>
								<td>{e.school_name}</td>
								<td>
									<button className="btn btn-danger">
										รายละเอียด
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</main>
	);
}
