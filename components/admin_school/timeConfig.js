import React from "react";
import { useRef,useState } from "react";
import ErrorPage from 'next/error'

export default function TimeConfig({ school_data }) {

	// for save data
	const [savedata, setsavedata] = useState();
	// เปิดภาคเรียน
	const date_start_term = useRef();
	// ปิดภาคเรียน
	const date_end_term = useRef();
	// ปิดลงชุมนุม
	const date_end_club = useRef();
	const time_end_club = useRef();
	// เปิดลงชุมนุม
	const date_start_club = useRef();
	const time_start_club = useRef();

	const form = useRef()
	const btnEdit = useRef()
	const btnCancel = useRef()
	const btnConfirm = useRef()
	
	function taskEdit(ev){
		ev.preventDefault()
		btnCancel.current.classList.remove("d-none")
		btnConfirm.current.classList.remove("d-none")
		btnEdit.current.classList.add("d-none")

		// save data
		const for_save = {
			date_end_club: date_end_club.current.value,
			date_end_term: date_end_term.current.value,
			date_start_club: date_start_club.current.value,
			date_start_term: date_start_term.current.value,
			time_end_club: time_end_club.current.value,
			time_start_club: time_start_club.current.value,
		}
		setsavedata(for_save);
	
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

		// reset data
		date_end_club.current.value = savedata.date_end_club;
		date_end_term.current.value = savedata.date_end_term;
		date_start_club.current.value = savedata.date_start_club;
		date_start_term.current.value = savedata.date_start_term;
		time_end_club.current.value = savedata.time_end_club;
		time_start_club.current.value = savedata.time_start_club;
	
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

	
	if (!school_data.paymentStatus) {
		return <ErrorPage statusCode={404} />;
	}

	
	return (
		<main>
			<div className="container">
				<h2 className="text-center mt-2">ตั้งเวลาลงทะเบียน</h2>
				<form className="row g-4 p-2" ref={form}>
					<div className="col-md-6">
						<label className="form-label">เปิดภาคเรียน</label>
						<input type="date" className="form-control" readOnly defaultValue={"2022-09-02"} ref={date_start_term}></input>
					</div>
					<div className="col-md-6">
						<label className="form-label">ปิดภาคเรียน</label>
						<input type="date" className="form-control" readOnly defaultValue={"2022-09-02"} ref={date_end_term}></input>
					</div>
					
					<div className="col-md-6 mt-4">
						<label className="form-label">เวลาเปิดลงทะเบียนชุมนุม</label>
						<input type="date" className="form-control" readOnly defaultValue={"2022-09-02"} ref={date_start_club}></input>
						<input type="time" className="form-control mt-3" readOnly defaultValue={"09:00:00"} ref={time_start_club}></input>
					</div>
					<div className="col-md-6 mt-4">
						<label className="form-label">เวลาเปิดลงทะเบียนชุมนุม</label>
						<input type="date" className="form-control" readOnly defaultValue={"2022-09-02"} ref={date_end_club}></input>
						<input type="time" className="form-control mt-3" readOnly defaultValue={"11:00:00"} ref={time_end_club}></input>
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
