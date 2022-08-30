import React from "react"

export default function InsertTeacher() {
    const data = [
        {school_name:"horwang",school_admin:"kana",status:"รอข้อมูลตรวจสอบ"},
        {school_name:"pachanivet",school_admin:"folk",status:"ขอข้อมูลเพิ่มเติม"},
        {school_name:"sangsom",school_admin:"yadar",status:"รอข้อมูลตรวจสอบ"},
        {school_name:"kaset",school_admin:"sing",status:"รอข้อมูลตรวจสอบ"},
        {school_name:"jula",school_admin:"jack",status:"รอข้อมูลตรวจสอบ"},
        {school_name:"tummasat",school_admin:"poom",status:"ขอข้อมูลเพิ่มเติม"},
    ]
    
    return (
		<main>
			<div className="text-center fs-1">InsertTeacher</div>
			<table className="table table-hover table-bordered table-striped text-center">
				<thead className="table-dark">
					<tr>
						<th>ชื่อโรงเรียน</th>
						<th>school admin</th>
						<th>status</th>
						<th>ข้อมูลต่างๆ</th>
					</tr>
				</thead>
				<tbody>
					{data.map((e, i) => {
						return (
							<tr key={i}>
								<td>{e.school_name}</td>
								<td>{e.school_admin}</td>
								<td>{e.status}</td>
								<td>
									<button className="btn btn-light">
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