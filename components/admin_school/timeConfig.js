import React from "react";
import { useRef } from "react";

export default function TimeConfig() {
	// เปิดภาคเรียน
	// ปิดภาคเรียน
	// ปิดลงชุมนุม
	// เปิดลงชุมนุม
	const form = useRef()
	const btnEdit = useRef()
	const btnCancel = useRef()
	const btnConfirm = useRef()
	
	function taskEdit(ev){
		ev.preventDefault()
		btnCancel.current.classList.remove("d-none")
		btnConfirm.current.classList.remove("d-none")
		btnEdit.current.classList.add("d-none")
	
		for (let i =0 ;i<form.current.elements.length;i++){
			if (form.current.elements[i].nodeName === "BUTTON"){
				continue
			}
			form.current.elements[i].readOnly = false
		}
	}

	function taskCancel(ev){
		ev.preventDefault()
		btnCancel.current.classList.add("d-none")
		btnConfirm.current.classList.add("d-none")
		btnEdit.current.classList.remove("d-none")
	
		for (let i =0 ;i<form.current.elements.length;i++){
			if (form.current.elements[i].nodeName === "BUTTON"){
				continue
			}
			form.current.elements[i].readOnly = true
		}
	}
	
	function taskConfirm(ev){
		// ภายในนี้จะมีการส่งข้อมูลด้วย
		ev.preventDefault()
		btnCancel.current.classList.add("d-none")
		btnConfirm.current.classList.add("d-none")
		btnEdit.current.classList.remove("d-none")
	
		for (let i =0 ;i<form.current.elements.length;i++){
			if (form.current.elements[i].nodeName === "BUTTON"){
				continue
			}
			form.current.elements[i].readOnly = true
		}
	}
	
	return (
		<main>
			<div className="container">
				<h2 className="text-center mt-2">ตั้งเวลาลงทะเบียน</h2>
				<form className="row g-4 p-2" ref={form}>
					<div className="col-md-6">
						<label className="form-label">เปิดภาคเรียน</label>
						<input type="date" className="form-control" readOnly defaultValue={"2022-09-02"}></input>
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
						<button className="btn btn-danger d-none me-2" ref={btnCancel} onClick={(ev) => taskCancel(ev)}>ยกเลิก</button>	
						<button className="btn btn-warning" ref={btnEdit} onClick={(ev) => taskEdit(ev)}>แก้ไข</button>	
						<button className="btn btn-success d-none" ref={btnConfirm} onClick={(ev) => taskConfirm(ev)}>ตกลง</button>	
					</div>
				</form>
			</div>
		</main>
	);
}
