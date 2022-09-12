import React from "react";
import { useRef,useState,useEffect } from "react";
import ErrorPage from 'next/error'

export default function TimeConfig({ school_data }) {

	useEffect(()=> {
		school_data.schedule.forEach(e => {
			if (school_data.nowSchoolYear == e.schoolYear){
				schoolYear.current.defaultValue = JSON.stringify(e)
				endOfSchoolYear.current.defaultValue = e.endOfRegisterDate
				registerDate.current.defaultValue = e.registerDate
				registerTime.current.defaultValue = e.registerTime
				endOfRegisterDate.current.defaultValue = e.endOfRegisterDate
				endOfRegisterTime.current.defaultValue = e.endOfRegisterTime
			}
		})
	},[])

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

	const alert_now = useRef();
	const alert_pass = useRef();
	const form = useRef()
	const btnEdit = useRef()
	const btnCancel = useRef()
	const btnConfirm = useRef()

	function resetData() {
		// reset data
		schoolYear.current.value = schoolYear.current.defaultValue
		endOfSchoolYear.current.value = endOfSchoolYear.current.defaultValue
		endOfRegisterDate.current.value = registerDate.current.defaultValue
		endOfRegisterTime.current.value = registerTime.current.defaultValue
		registerTime.current.value = registerTime.current.defaultValue
		registerDate.current.value = registerDate.current.defaultValue
	}

	function setData(ev) {
		ev.preventDefault();

		const schedule = JSON.parse(ev.target.value);

		if (schedule.schoolYear == school_data.nowSchoolYear) {
			alert_now.current.classList.remove("d-none")
			alert_pass.current.classList.add("d-none")
			btnEdit.current.classList.remove("d-none")
		}
		else {
			alert_now.current.classList.add("d-none")
			alert_pass.current.classList.remove("d-none")
			btnEdit.current.classList.add("d-none")
		}

		//console.log(schedule)
		endOfSchoolYear.current.value = schedule.endOfSchoolYear;
		endOfRegisterDate.current.value = schedule.endOfRegisterDate;
		endOfRegisterTime.current.value = schedule.endOfRegisterTime;
		registerTime.current.value = schedule.registerTime;
		registerDate.current.value = schedule.registerDate;
	}

	function taskEdit(ev){
		ev.preventDefault()
		btnCancel.current.classList.remove("d-none")
		btnConfirm.current.classList.remove("d-none")
		btnEdit.current.classList.add("d-none")
		
		for (let i =0 ;i<form.current.elements.length;i++){
			if (form.current.elements[i].nodeName === "BUTTON"){
				continue
			}
			else if (form.current.elements[i].nodeName === "SELECT") {
				form.current.elements[i].disabled = true
				continue
			}
			form.current.elements[i].disabled = false
		}
	}

	function taskCancel(ev){
		ev.preventDefault()
		btnCancel.current.classList.add("d-none")
		btnConfirm.current.classList.add("d-none")
		btnEdit.current.classList.remove("d-none")
	
		resetData();

		for (let i =0 ;i<form.current.elements.length;i++){
			if (form.current.elements[i].nodeName === "BUTTON" ) {
				continue
			}
			else if (form.current.elements[i].nodeName === "SELECT") {
				form.current.elements[i].disabled = false
				continue
			}
			form.current.elements[i].disabled = true
		}
	}
	
	function taskConfirm(ev){
		// ภายในนี้จะมีการส่งข้อมูลด้วย
		ev.preventDefault()
		btnCancel.current.classList.add("d-none")
		btnConfirm.current.classList.add("d-none")
		btnEdit.current.classList.remove("d-none")

		const body = {
			schoolYear:schoolYear.current.value,
			endOfSchoolYear:endOfSchoolYear.current.value ,
			endOfRegisterDate:endOfRegisterDate.current.value,
			endOfRegisterTime:endOfRegisterTime.current.value,
			registerTime:registerTime.current.value,
			registerDate:registerDate.current.value
		}
		//console.log(body)

		resetData()
	
		for (let i =0 ;i<form.current.elements.length;i++){
			if (form.current.elements[i].nodeName === "BUTTON" ) {
				continue
			}
			else if (form.current.elements[i].nodeName === "SELECT") {
				form.current.elements[i].disabled = false
				continue
			}
			form.current.elements[i].disabled = true
		}
		
	}

	if (!school_data.paymentStatus) {
		return <ErrorPage statusCode={404} />;
	}

	return (
		<div>
			<h2 className="text-center mt-2">ตั้งเวลาลงทะเบียน</h2>
			<form className="row g-4 p-2" ref={form}>
				<div className="">
					<div className="alert alert-success" role="alert" ref={alert_now}>
						ปีการศึกษาปัจจุบัน - สามารถแก้ไขระยะเวลาต่างๆได้
					</div>
					<div className="alert alert-danger d-none" role="alert" ref={alert_pass}>
						ปีการศึกษาที่ผ่านมา - ไม่สามารถแก้ไขระยะเวลาต่างๆได้
					</div>
					<label className="form-label">ปีการศึกษา</label>
					<div className="input-group">
						<label className="input-group-text" >เลือกปีการศึกษา</label>
						<select className="form-select" onChange={(ev) => setData(ev)} ref={schoolYear} >
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
					<input type="date" className="form-control" disabled  ref={endOfSchoolYear}></input>
				</div>
				
				<div className="col-md-6 mt-4">
					<label className="form-label">เวลาเปิดลงทะเบียนชุมนุม</label>
					<input type="date" className="form-control" disabled  ref={registerDate}></input>
					<input type="time" className="form-control mt-3" disabled  ref={registerTime}></input>
				</div>
				<div className="col-md-6 mt-4">
					<label className="form-label">เวลาปิดลงทะเบียนชุมนุม</label>
					<input type="date" className="form-control" disabled  ref={endOfRegisterDate} ></input>
					<input type="time" className="form-control mt-3" disabled  ref={endOfRegisterTime} ></input>
				</div>
				<div className="d-flex justify-content-end">
					<button className="btn btn-danger d-none me-2" ref={btnCancel} onClick={(ev) => taskCancel(ev)}>ยกเลิก</button>	
					<button className="btn btn-warning me-2" ref={btnEdit} onClick={(ev) => taskEdit(ev)}>แก้ไข</button>	
					<button className="btn btn-success d-none" ref={btnConfirm} onClick={(ev) => taskConfirm(ev)}>ตกลง</button>	
				</div>
			</form>
		</div>
		
	)
}
