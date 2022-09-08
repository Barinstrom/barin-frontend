import React from "react"
import ErrorPage from "next/error";

export default function EditStudent({ school_data }) {
	
	if (!school_data.paymentStatus) {
		return <ErrorPage statusCode={404} />;
	}

    const data = [
        {student_name:"toto",role:"1",school_name:"horwang"},
        {student_name:"tata",role:"2",school_name:"kaset"},
        {student_name:"tete",role:"2",school_name:"jula"},
        {student_name:"bundit",role:"2",school_name:"tepsirin"},
        {student_name:"jitat",role:"3",school_name:"prachanivet"},
        {student_name:"kana",role:"3",school_name:"sangsom"},
    ]
    
	function clickSearch(ev) {
		ev.preventDefault();
		/* ค้นหาชุมนุม */
	}
    return (
		<main>
			<div className="text-center fs-1">EditStudent</div>
			<form onClick={(ev) => clickSearch(ev)} className="mb-4 mt-2">
				<div className="input-group">
					<span className="input-group-text">ค้นหานักเรียน</span>
					<input className="form-control" name="search" />
					<button className="btn btn-danger">กด</button>
				</div>
			</form>

			<table className="table table-hover table-bordered table-striped text-center">
				<thead className="table-dark">
					<tr>
						<th>ชื่อนักเรียน</th>
						<th>ชั้น</th>
						<th>โรงเรียน</th>
						<th>ข้อมูลต่างๆ</th>
					</tr>
				</thead>
				<tbody>
					{data.map((e, i) => {
						return (
							<tr key={i}>
								<td>{e.student_name}</td>
								<td>{e.role}</td>
								<td>{e.school_name}</td>
								<td>
									<button className="btn btn-info">
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