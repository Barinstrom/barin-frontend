import React from "react";
import { useRef,useState } from "react";
import ErrorPage from 'next/error'

export default function TimeConfig({ school_data }) {

	// ปีการศึกษา
	const schoolYear = useRef();
	// ปิดภาคเรียน
	const endOfSchoolYear = useRef();
	// ปิดลงชุมนุม
	const endOfRegisterDate = useRef();
	const endOfRegisterTime = useRef();
	// เปิดลงชุมนุม
	const registerTime = useRef();
	const registerDate = useRef();

	const form = useRef()
	const btnEdit = useRef()
	const btnCancel = useRef()
	const btnConfirm = useRef()
	
	function setData(ev) {
		ev.preventDefault();
		if (!(ev.target.value === "choose")){
			const schedule = JSON.parse(ev.target.value);
			//console.log(schedule)
			endOfSchoolYear.current.value = schedule.endOfSchoolYear;
			endOfRegisterDate.current.value = schedule.endOfRegisterDate;
			endOfRegisterTime.current.value = schedule.endOfRegisterTime;
			registerTime.current.value = schedule.registerTime;
			registerDate.current.value = schedule.registerDate;
		}
	}

	function taskEdit(ev){
		ev.preventDefault()
		btnCancel.current.classList.remove("d-none")
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
		btnEdit.current.classList.remove("d-none")

		// reset data
		schoolYear.current.value = "choose";
		endOfSchoolYear.current.value = null;
		endOfRegisterDate.current.value = null;
		endOfRegisterTime.current.value = null;
		registerTime.current.value = null;
		registerDate.current.value = null;
	
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

		if (schoolYear.current.value === "choose"){
			alert("โปรดเลือกปีการศึกษา")
			return
		}
		
		btnCancel.current.classList.add("d-none")
		btnEdit.current.classList.remove("d-none")


		const body = {
			schoolYear:schoolYear.current.value,
			endOfSchoolYear:endOfSchoolYear.current.value ,
			endOfRegisterDate:endOfRegisterDate.current.value,
			endOfRegisterTime:endOfRegisterTime.current.value,
			registerTime:registerTime.current.value,
			registerDate:registerDate.current.value
		}
		console.log(body)
	
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
					<div className="">
						<label className="form-label">ปีการศึกษา</label>
						<div className="input-group">
							<label className="input-group-text" >เลือกปีการศึกษา</label>
							<select className="form-select" onChange={(ev) => setData(ev)} ref={schoolYear}>
								<option value="choose">
									Choose ...
								</option>
								{school_data.schedule.map((e, i) => {
									return (
										<option value={JSON.stringify(e)} key={i}>{e.schoolYear}</option>
									);
								})}
							</select>
						</div>
					</div>
					<div className="">
						<label className="form-label">ปิดภาคเรียน</label>
						<input type="date" className="form-control" readOnly defaultValue={null} ref={endOfSchoolYear}></input>
					</div>
					
					<div className="col-md-6 mt-4">
						<label className="form-label">เวลาเปิดลงทะเบียนชุมนุม</label>
						<input type="date" className="form-control" readOnly defaultValue={null} ref={registerDate}></input>
						<input type="time" className="form-control mt-3" readOnly defaultValue={null} ref={registerTime}></input>
					</div>
					<div className="col-md-6 mt-4">
						<label className="form-label">เวลาปิดลงทะเบียนชุมนุม</label>
						<input type="date" className="form-control" readOnly defaultValue={null} ref={endOfRegisterDate} ></input>
						<input type="time" className="form-control mt-3" readOnly defaultValue={null} ref={endOfRegisterTime} ></input>
					</div>
					<div className="d-flex justify-content-end">
						<button className="btn btn-danger d-none me-2" ref={btnCancel} onClick={(ev) => taskCancel(ev)}>ยกเลิก</button>	
						<button className="btn btn-warning me-2" ref={btnEdit} onClick={(ev) => taskEdit(ev)}>แก้ไข</button>	
						<button className="btn btn-success" ref={btnConfirm} onClick={(ev) => taskConfirm(ev)}>ตกลง</button>	
					</div>
				</form>
			</div>
		</main>
	);
}
