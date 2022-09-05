import React from "react"

export default function InsertTeacher() {
   	return (
		<main>
			<div className="text-center fs-1">InsertTeacher</div>
			<div className="card mt-5">
				<div className="card-body">
					<h5 className="card-title">เพิ่มแบบรวดเดียว</h5>
					<p className="card-text">คำอธิบาย เกี่ยวกับวิธีนี้ ..... CSV</p>
				</div>
				<div className="card-footer">
					<div className="d-flex justify-content-end">
						<button  className="btn btn-primary">ใส่ข้อมูล</button>
					</div>
				</div>
			</div>

			<div className="card mt-5">
				<div className="card-body">
					<h5 className="card-title">เพิ่มทีละคน</h5>
					<p className="card-text">คำอธิบาย เกี่ยวกับวิธีนี้ ..... </p>
				</div>
				<div className="card-footer">
					<div className="d-flex justify-content-end">
						<button  className="btn btn-success">ใส่ข้อมูล</button>
					</div>
				</div>
			</div>
		</main>
	);
}