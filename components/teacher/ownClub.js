import React, {useState, useRef, useEffect} from "react";
import FileBase64 from 'react-file-base64';
import StudentList from "../../components/test/studentList";
import Link from "next/link";
import Reload from "../reload";
import { get_teacher_ownclubs } from "../../utils/teacher/teacher_getdata";
import Cookies from "universal-cookie";

export default function OwnClub({schoolID}) {
	const [data, setData] = useState([])
    const [clubname, setClubName] = useState("")
	const [loading,setLoading] = useState(true)
    const [clubdes, setClubDes] = useState("")
    const [clubsch, setClubSch] = useState("")
    const [clubimg, setClubImg] = useState("")
    const [clublimit, setClubLimit] = useState("")
    const [clubid, setClubId] = useState("")
    const uploadImg = useRef();
    const [stdlist, setStdList] = useState(0)

	useEffect(() => {
		setLoading(true)
		const cookie = new Cookies()
		const token = cookie.get("token")
		
		get_teacher_ownclubs(token,schoolID).then(result => {
			console.log(result)
			setData(result.data.clubs)
			setLoading(false)
		})
	}, [])

    function encodeImageFileAsURL(ev) {
		//console.log(ev);
		var file = ev.target.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = function () {
			//console.log("RESULT", reader.result);
			setClubImg(reader.result);
		};
	}

    function clickModal(ev){
        ev.preventDefault()
        console.log(ev)
        const club = JSON.parse(ev.target.getAttribute("data-bs-info"))
        console.log(club)
        setClubName(club.clubName)
        setClubDes(club.clubInfo)
        setClubSch(club.schedule)
        // setClubImg(club.img)
        setClubLimit(club.limit)
        setClubId(club._id)
    }

    function Edit(){
        const submit = document.getElementById("submitbtn")
        const name_in = document.getElementById("club_name")
        const des_in = document.getElementById("club_des")
        const sch_in = document.getElementById("club_sch")
        const limit_in = document.getElementById("club_limit")
        const img_in = document.getElementById("club_img")
        submit.removeAttribute("hidden")
        name_in.removeAttribute("disabled")
        des_in.removeAttribute("disabled")
        img_in.removeAttribute("disabled")
        sch_in.removeAttribute("disabled")
        limit_in.removeAttribute("disabled")
    }    

    function Submit(){
        const submit = document.getElementById("submitbtn")
        const name_in = document.getElementById("club_name")
        const des_in = document.getElementById("club_des")
        const sch_in = document.getElementById("club_sch")
        const limit_in = document.getElementById("club_limit")
        const img_in = document.getElementById("club_img")
        name_in.setAttribute("disabled",1)
        des_in.setAttribute("disabled",1)
        img_in.setAttribute("disabled",1)
        sch_in.setAttribute("disabled",1)
        limit_in.setAttribute("disabled",1)
        submit.setAttribute("hidden", 1)

        const body = {
            name: clubname,
            des: clubdes, 
            sch: clubsch, 
            img: clubimg, 
            limit: clublimit,
        }
        console.log(body) 
    }

    function closeInfo(){
        console.log("close")
        const submit = document.getElementById("submitbtn")
        const name_in = document.getElementById("club_name")
        const des_in = document.getElementById("club_des")
        const sch_in = document.getElementById("club_sch")
        const img_in = document.getElementById("club_img")
        const limit_in = document.getElementById("club_limit")
        name_in.setAttribute("disabled",1)
        des_in.setAttribute("disabled",1)
        sch_in.setAttribute("disabled",1)
        limit_in.setAttribute("disabled",1)
        img_in.setAttribute("disabled",1)
        submit.setAttribute("hidden", 1)
        uploadImg.current.value = "";
		setClubImg("https://dummyimage.com/300x300");
    }

    function goToStudentList(ev){
		console.log("gotostdlist")
		const button = ev.target
		const club = JSON.parse(button.getAttribute("data-bs-info"))
		console.log(club)
        localStorage.setItem("comp", 1)
        //console.log(localStorage.getItem("comp"))
        setStdList(1)
        localStorage.setItem("fromClubID", club._id)
		localStorage.setItem("fromClubName", club.clubName)
    }
	if(loading){
		return (
			<main id="main">
				<div className="text-center fs-1">OwnClub</div>
				<table className="table table-hover table-bordered table-striped text-center">
					<thead className="table-dark">
						<tr>
							<th style={{width: "60%"}}>ชื่อชุมนุม</th>
							<th>รายชื่อนักเรียน</th>
							<th>ข้อมูลต่างๆ</th>
						</tr>
					</thead>
					<tbody>
						<tr><td colSpan={3}><Reload/></td></tr>
					</tbody>
				</table>
			</main>
		)
	}else{
		return (
			<main id="main">
				<div className="text-center fs-1">OwnClub</div>
				<table className="table table-hover table-bordered table-striped text-center">
					<thead className="table-dark">
						<tr>
							<th style={{width: "60%"}}>ชื่อชุมนุม</th>
							<th>รายชื่อนักเรียน</th>
							<th>ข้อมูลต่างๆ</th>
						</tr>
					</thead>
					<tbody>
						{data.map((e, i) => {
							return (
								<tr key={i}>
									<td>{e.clubName}</td>
									<td><a className="btn btn-info" onClick={(ev) => goToStudentList(ev)} data-bs-info={JSON.stringify(e)} href={"/" + localStorage.getItem("schoolid") + "/teacher"}>ข้อมูลนักเรียน</a></td>
									<td>
										<button className="btn btn-info" data-bs-info={JSON.stringify(e)} data-bs-toggle="modal" data-bs-target="#modal" onClick={(ev) => clickModal(ev)}>
											รายละเอียด
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
				<div className="modal" id="modal">
					<div className="modal-dialog">
						<div className="modal-content">
							{/* Modal Header */}
							<div className="modal-header">
								<div className="modal-title h1">Club Info</div>
								<button className="btn btn-warning mx-1" onClick={() => Edit()}>Edit</button>
							</div>
							{/* Modal Body */}
							<div className="modal-body d-flex flex-column justify-content-center">
								<div className="d-flex">
									{/* Club Name */}
									<div className="form-group mx-4 my-2" style={{minWidth: "60%"}}>
										<label>Club Name:</label>
										<input type="text" className="form-control" id="club_name" value={clubname} onChange={(ev)=>{setClubName(ev.target.value)}} disabled></input>
									</div>
									{/* Club Scheduler */}
									<div className="form-group mr-4 my-2" style={{width: "25%"}}>
										<label>Scheduler:</label>
										<input type="text" className="form-control" id="club_sch" value={clubsch} onChange={(ev)=>{setClubSch(ev.target.value)}} disabled></input>
									</div>
								</div>
								{/* Club Description */}
								<div className="form-group mx-4 my-2" >
									<label>Description:</label>
									<textarea cols={5} row={5} className="form-control" id="club_des" value={clubdes} onChange={(ev)=>{setClubDes(ev.target.value)}} disabled></textarea>
								</div>
								{/* Club Picture */}
								<div className="form-group mx-4 my-2" disabled>
									<label>Picture:</label>
									<img src={clubimg} className="form-control mt-2"></img>
									<br></br>
									<input className="form-control" type="file" id="club_img" onChange={(ev) => encodeImageFileAsURL(ev)} ref={uploadImg} disabled/>
								</div>
								{/* Club Limit */}
								<div className="form-group mx-4 my-2" style={{width: "25%"}}>
									<label>Limit:</label>
									<input type="text" className="form-control" id="club_limit" value={clublimit} onChange={(ev)=>{setClubLimit(ev.target.value)}} disabled></input>
								</div>
							</div>
							<div className="modal-footer">
								<div className="btn-group" role={"group"}>
									<button className="btn btn-success" id="submitbtn" hidden={1} onClick={() => Submit()}>Submit</button>
									<button className="btn btn-danger" data-bs-dismiss="modal" onClick={() => closeInfo()}>Close</button>
									{/* <a className="btn btn-info" onClick={(ev) => goToStudentList(ev)} href={"/" + localStorage.getItem("schoolid") + "/teacher"}>ข้อมูลนักเรียน</a> */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}
}