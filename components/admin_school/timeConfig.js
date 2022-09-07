import React from "react";
import { useRef } from "react";

export default function TimeConfig() {
	// เปิดภาคเรียน
	// ปิดภาคเรียน
	// ปิดลงชุมนุม
	// เปิดลงชุมนุม
	const btnEdit = useRef()
	const btnCancel = useRef()

	function editSubmit(ev){
		ev.preventDefault();
		
		if (btnEdit.current.innerText === "แก้ไข"){
			btnEdit.current.innerText = "ตกลง"
			btnEdit.current.classList.remove("btn-warning")
			btnEdit.current.classList.add("btn-success")
			btnCancel.current.classList.toggle("d-none")
			for (let i =0 ;i<ev.target.elements.length;i++){
				//console.log(ev.target.elements[i])
				ev.target.elements[i].readOnly = false
			}
		}else{
			btnEdit.current.innerText = "แก้ไข"
			btnEdit.current.classList.remove("btn-success")
			btnEdit.current.classList.add("btn-warning")
			btnCancel.current.classList.toggle("d-none")
			for (let i =0 ;i<ev.target.elements.length;i++){
				//console.log(ev.target.elements[i])
				ev.target.elements[i].readOnly = true
			}
		}
		
		
	}

	return (
		<main>
			<div>
				<form className="row g-4 p-2" onSubmit={(ev) => editSubmit(ev)}>
					<div className="col-md-6">
						<label className="form-label">เปิดภาคเรียน</label>
						<input type="date" className="form-control" readOnly defaultValue={"2022-10-02"}></input>
					</div>
					<div className="col-md-6">
						<label className="form-label">ปิดภาคเรียน</label>
						<input type="date" className="form-control" readOnly defaultValue={"2022-09-02"}></input>
					</div>
					
					<div className="col-md-6 mt-4">
						<label className="form-label">เวลาเปิดลงทะเบียนชุมนุม</label>
						<input type="date" className="form-control" readOnly defaultValue={"2022-09-02"}></input>
						<input type="time" className="form-control mt-3" readOnly defaultValue={"09:00:00"}></input>
					</div>
					<div className="col-md-6 mt-4">
						<label className="form-label">เวลาเปิดลงทะเบียนชุมนุม</label>
						<input type="date" className="form-control" readOnly defaultValue={"2022-09-02"}></input>
						<input type="time" className="form-control mt-3" readOnly defaultValue={"11:00:00"}></input>
					</div>
					<div className="d-flex justify-content-end">
						<button className="btn btn-danger me-2 d-none" ref={btnCancel}>ยกเลิก</button>	
						<button className="btn btn-warning " ref={btnEdit}>แก้ไข</button>	
					</div>
				</form>
			</div>
		</main>
	);
}
