import React from "react"
import ErrorPage from "next/error";

export default function EditClub({ school_data }) {
	
		if (!school_data.paymentStatus) {
			return <ErrorPage statusCode={404} />;
		}

    const data = [
        {congre_name:"บอล",count_student:"23",congre_school:"tepsirin"},
        {congre_name:"บาส",count_student:"53",congre_school:"horwang"},
        {congre_name:"ปิงปอง",count_student:"13",congre_school:"horwang"},
        {congre_name:"เทนนิส",count_student:"45",congre_school:"kaset"},
        {congre_name:"แบต",count_student:"13",congre_school:"horwang"},
        {congre_name:"ว่ายน้ำ",count_student:"35",congre_school:"jula"},
    ]
    
	function clickSearch(ev) {
		ev.preventDefault();
		/* ค้นหาชุมนุม */
	}
    return (
		<main>
			<div className="text-center fs-1">EditClub</div>
			<form onClick={(ev) => clickSearch(ev)} className="mb-4 mt-2">
				<div className="input-group">
					<span className="input-group-text">ค้นหาชุมนุม</span>
					<input className="form-control" name="search" />
					<button className="btn btn-danger">กด</button>
				</div>
			</form>

			<table className="table table-hover table-bordered table-striped text-center">
				<thead className="table-dark">
					<tr>
						<th>ชื่อชุมนุม</th>
						<th>จำนวนนักเรียน</th>
						<th>ของโรงเรียน</th>
						<th>ข้อมูลต่างๆ</th>
					</tr>
				</thead>
				<tbody>
					{data.map((e, i) => {
						return (
							<tr key={i}>
								<td>{e.congre_name}</td>
								<td>{e.count_student}</td>
								<td>{e.congre_school}</td>
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