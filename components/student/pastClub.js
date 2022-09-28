import React from "react";
import { useRef } from "react";

export default function Pastclub({schoolID}) {

	const clubName = useRef()
    const clubInfo = useRef()
    const groupID = useRef()
    const category = useRef()
    const limitStudent = useRef()
    const schoolYear = useRef()
    const scheduleStart = useRef()
    const scheduleEnd = useRef()
	
	const data = [
		{
			clubName:"ยิงทะลวงประตู",
			groupID:"พลศึกษา",
			schoolID:"teststamp",
			category:"1",
			clubInfo:"ยิงประตูเข้าไปหาเธอ",
			limit:20,
			schoolYear:2565
		},
		{
			clubName:"โยนเข้าห่วง",
			groupID:"พลศึกษา",
			schoolID:"teststamp",
			category:"3",
			clubInfo:"โยนเข้าไปหาเธอ",
			limit:10,
			schoolYear:2564
		},
		{
			clubName:"คณิตคิดเร็ว",
			groupID:"คณิตศาสตร์",
			schoolID:"testkana",
			category:"2",
			clubInfo:"คณิตคิดนอกใจ",
			limit:20,
			schoolYear:2563
		},
		
	];


	function detailInfo(item,ev){
		//clubName.current.setAttribute("data-clubid",ev.target.getAttribute("data-bs-clubid"))
        clubName.current.innerText = item.clubName
        clubInfo.current.innerText = item.clubInfo
        category.current.innerText = item.category
        limitStudent.current.innerText = item.limit + " คน"
        schoolYear.current.innerText = item.schoolYear
        groupID.current.innerText = item.groupID
	}

	return (
	<>
		<div className="text-center fs-1">Past Club</div>
		<div className='row'>
			<div className='col-12'>
				<table className='table table-striped align-middle'>
					<thead>
						<tr>
							<th style={{width:"100px"}}>รหัสวิชา</th>
							<th style={{width:"400px"}}>ชื่อชุมนุม</th>
							<th style={{width:"400px"}} className="text-end"><span className='me-2'></span></th>
						</tr>
					</thead>
					<tbody>
						{data.map((item,index) => {
							return (
								<tr key={index}>
									<td>{item.groupID}</td>
									<td>{item.clubName}</td>
									<td className="text-end">
									<button className='btn btn-info btn-sm'
										data-bs-toggle="modal"
										data-bs-target="#PastClubModal"
										onClick={(ev) => detailInfo(item,ev)}
									>ดูรายละเอียด
									</button>
									</td>
								</tr>
								)
							})}
					</tbody>
				</table> 
			</div>
		</div>	

		<div className="modal fade" id="PastClubModal">
			<div className="modal-dialog">
				<div className='modal-content'>
					<div className='modal-header'>
						<h3 className="modal-title">รายละเอียดชุมนุม</h3>
						<button className='btn-close' data-bs-dismiss="modal"></button>
					</div>
					<div className='modal-body'>
						<div className="row">
							<div className="col-12">
								<p>ชื่อคลับ : &nbsp;
									<span ref={clubName}></span>
								</p>
							</div>
							<div className="col-12">
								<p>รหัสวิชา : &nbsp;
									<span ref={groupID}></span>
								</p>
							</div>
							<div className="col-12">
								<p>category : &nbsp;
									<span ref={category}></span>
								</p>
							</div>
							<div className="col-12">
								<p>รายละเอียดคลับ : &nbsp;
									<span ref={clubInfo}></span>
								</p>
							</div>
							<div className="col-12">
								<p>จำนวนที่รับ : &nbsp;
									<span ref={limitStudent}></span>
								</p>
							</div>
							<div className="col-12">
								<p>ปีการศึกษา : &nbsp;
									<span ref={schoolYear}></span>
								</p>
							</div>
							<div className="col-12">
								<p>เวลาเรียน : &nbsp;
									<span ref={scheduleStart}></span>
								</p>
							</div>
							<div className="col-12">
								<p>เวลาเลิกเรียน: &nbsp;
									<span ref={scheduleEnd}></span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
    </>
	);
}
