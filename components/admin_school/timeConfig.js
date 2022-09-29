import React from "react";
import { useRef,useState,useEffect } from "react";
import ErrorPage from 'next/error'
import { set_schedule } from "../../utils/auth";
import Cookies from "universal-cookie";

export default function TimeConfig({ school_data, schoolID }) {
	// 2022-09-26T00:15:00.000+00:00
	// "2022-09-26 11:00:00"
	// console.log(school_data)
	// school_data.nowSchoolYear = 2021

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

	/* for set data */
	// ปีการศึกษา
	const schoolYear2 = useRef();
	// ปิดภาคเรียน
	const endOfSchoolYear2 = useRef();
	// ปิดลงชุมนุม
	const endOfRegisterDate2 = useRef();
	const endOfRegisterTime2 = useRef();
	// เปิดลงชุมนุม
	const registerTime2 = useRef();
	const registerDate2 = useRef();

	const alert_now = useRef();
	const alert_pass = useRef();
	const form = useRef()
	const btnEdit = useRef()
	const btnCancel = useRef()
	const btnConfirm = useRef()

	const [nowYear,setNowYear] = useState()
	const [timeDateDefault,setTimeDateDefault] = useState(false)
	
	useEffect(() => {
		if (timeDateDefault){
			school_data.schedule.forEach((e) => {
				if (school_data.nowSchoolYear == e.schoolYear) {
					const [dateEndOfShoolYear, timeEndOfShoolYear] = e.endOfSchoolYear.split("T")
					const [dateEndOfRegister, timeEndOfRegister] = e.endOfRegisterDate.split("T")
					//const [dateRegister, timeRegister] = e.registerDate.split("T")
					
					
			schoolYear.current.value = JSON.stringify(e)
					endOfSchoolYear.current.defaultValue = dateEndOfShoolYear
					registerDate.current.defaultValue = dateEndOfRegister
					registerTime.current.defaultValue = timeEndOfRegister.substring(0,5)
					endOfRegisterDate.current.defaultValue = dateEndOfRegister
					endOfRegisterTime.current.defaultValue = timeEndOfRegister.substring(0,5)

					btnEdit.current.classList.remove("d-none")
				}
			})
		}
	},[timeDateDefault])


	useEffect(() => {
		//console.log(school_data.nowSchoolYear)
		if (school_data.nowSchoolYear) {
			setNowYear(have_nowYear)
		}
		else {
			setNowYear(not_have_nowYear)
		}
		setTimeDateDefault(true)
	},[])

	
	function resetData() {
		// reset data
		schoolYear.current.value = school_data.nowSchoolYear
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

		const [ endOfSchoolYearX, xx ] = schedule.endOfSchoolYear.split("T")
		const [ endOfRegisterDateX, endOfRegisterTimeX ] = schedule.endOfRegisterDate.split("T")
		const [ registerDateX, registerTimeX ] = schedule.registerDate.split("T")
		endOfSchoolYear.current.value = endOfSchoolYearX;
		endOfRegisterDate.current.value = endOfRegisterDateX;
		endOfRegisterTime.current.value = endOfRegisterTimeX.substring(0, 5);
		registerTime.current.value = registerTimeX.substring(0, 5);
		registerDate.current.value = registerDateX;
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

		const sent_data = {
			schoolID: schoolID,
			schoolYear: school_data.nowSchoolYear,
			registerDate: String(registerDate.current.value)+" "+String(registerTime.current.value), 
			endOfRegisterDate: String(endOfRegisterDate.current.value)+" "+String(endOfRegisterTime.current.value), 
			endOfSchoolYear: endOfSchoolYear.current.value ,
		}
		
		const cookies = new Cookies();
		const token = cookies.get("token");

		async function set_schedule_async() {
			console.log("sent_data",sent_data)
			const result = await set_schedule(sent_data, token, "teststamp")
			console.log(result)
			if (result.data.success) {
				console.log("success")
				// window.location.href = "/" + schoolID +"/admin_school"
			}
		}
	
		set_schedule_async()

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

	function taskConfirm2(ev){
		// ภายในนี้จะมีการส่งข้อมูลด้วย
		ev.preventDefault()

		// const body = {
		// 	schoolYear:schoolYear.current.value,
		// 	endOfSchoolYear:endOfSchoolYear.current.value ,
		// 	endOfRegisterDate:endOfRegisterDate.current.value,
		// 	endOfRegisterTime:endOfRegisterTime.current.value,
		// 	registerTime:registerTime.current.value,
		// 	registerDate:registerDate.current.value
		// }
		const sent_data = {
			schoolID: schoolID,
			schoolYear: schoolYear2.current.value,
			registerDate: String(registerDate2.current.value)+" "+String(registerTime2.current.value), 
			endOfRegisterDate: String(endOfRegisterDate2.current.value)+" "+String(endOfRegisterTime2.current.value), 
			endOfSchoolYear: endOfSchoolYear2.current.value ,
		}
		
		console.log("sent_data =", sent_data)
		// api call
		const cookies = new Cookies();
		const token = cookies.get("token");

		async function set_schedule_async() {
			
			const result = await set_schedule(sent_data, token, "teststamp")
			// console.log(result)
			if (result.data.success) {
				console.log("success")
				// window.location.href = "/" + schoolID +"/admin_school"
			}
		}
		
		set_schedule_async()
	}

	const have_nowYear = (
	<>
		<div>
			<div className="alert alert-success" role="alert" ref={alert_now}>
				ปีการศึกษาปัจจุบัน - สามารถแก้ไขระยะเวลาต่างๆได้
			</div>
			<div className="alert alert-danger d-none" role="alert" ref={alert_pass}>
				ปีการศึกษาที่ผ่านมา - ไม่สามารถแก้ไขระยะเวลาต่างๆได้
			</div>
			<label className="form-label">ปีการศึกษา</label>
			<div className="input-group">
				<label className="input-group-text" >เลือกปีการศึกษา</label>
				<select className="form-select" onChange={(ev) => setData(ev)} ref={schoolYear}>
					{school_data.schedule.map((e, i) => {
						if (school_data.schedule.schoolYear == school_data.nowSchoolYear) {
							return <option value={JSON.stringify(e)} key={i} selected>{String(e.schoolYear)}</option>
						}else {
							return <option value={JSON.stringify(e)} key={i}>{String(e.schoolYear)}</option>
						}
					})}
				</select>
			</div>
		</div>
			<div className="col-12">
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
				<button className="btn btn-warning d-none me-2" ref={btnEdit} onClick={(ev) => taskEdit(ev)}>แก้ไข</button>	
				<button className="btn btn-success d-none" ref={btnConfirm} onClick={(ev) => taskConfirm(ev)}>ตกลง</button>	
			</div>
	</>
	)

	const not_have_nowYear = (
	<div>
		<div>
			<div className="alert alert-danger text-center">
				คุณยังไม่ได้ตั้ง - ปีการศึกษาปัจจุบัน
				<br />
				กรุณาตั้งปีการศึกษา
			</div>
			<label className="form-label">ปีการศึกษา</label>
			<div className="input-group">
				<label className="input-group-text" >ตั้งปีการศึกษาปัจจุบัน</label>
				<input type="text" className="form-control"   ref={schoolYear2}></input>
			</div>
		</div>
		<div className="col-12">
			<label className="form-label">ปิดภาคเรียน</label>
			<input type="date" className="form-control" ref={endOfSchoolYear2}></input>
		</div>
		
		<div className="col-md-6 mt-4">
			<label className="form-label">เวลาเปิดลงทะเบียนชุมนุม</label>
			<input type="date" className="form-control" ref={registerDate2}></input>
			<input type="time" className="form-control mt-3"   ref={registerTime2}></input>
		</div>
		<div className="col-md-6 mt-4">
			<label className="form-label">เวลาปิดลงทะเบียนชุมนุม</label>
			<input type="date" className="form-control"   ref={endOfRegisterDate2} ></input>
			<input type="time" className="form-control mt-3"   ref={endOfRegisterTime2} ></input>
		</div>
		<div className="d-flex justify-content-end">
			<button className="btn btn-success" onClick={(ev) => taskConfirm2(ev)}>ตกลง</button>	
		</div>
	</div>
	)

	const TimeConfig_page =  (
		<div>
			<h2 className="text-center mt-2">ตั้งเวลาลงทะเบียน</h2>
			<form className="row g-4 p-2" ref={form}>
				{nowYear} 
			</form>
		</div>
	)

	if (!school_data.paymentStatus) {
		return <ErrorPage statusCode={404} />;
	}
	else {
		return TimeConfig_page
	}
}
