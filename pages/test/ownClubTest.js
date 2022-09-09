import React, {useState, useRef, useEffect} from "react";
import FileBase64 from 'react-file-base64';

export default function OwnClub() {
	const data = [
        {name: "HTML", des: "Lorem", sch: "10.00-11.00", img: "https://dummyimage.com/300x300", limit: "30"},
		{name: "CSS", des: "Lorem", sch: "10.00-11.00", img: "https://dummyimage.com/300x300", limit: "30"},
        {name: "JAVA", des: "Lorem", sch: "10.00-11.00", img: "https://dummyimage.com/300x300", limit: "30"},
        {name: "C++", des: "Lorem", sch: "10.00-11.00", img: "https://dummyimage.com/300x300", limit: "30"},
        {name: "PYTHON", des: "Lorem", sch: "10.00-11.00", img: "https://dummyimage.com/300x300", limit: "30"},
	];

    const [clubname, setClubName] = useState("")
    const [clubdes, setClubDes] = useState("")
    const [clubsch, setClubSch] = useState("")
    const [clubimg, setClubImg] = useState("")
    const [clublimit, setClubLimit] = useState("")

    //เลือกไฟล์รูปภาพ
    const [file,setFile] = useState()
    const [nameFile,setNameFile] = useState()
    function getFiles(ev){
        const base64file = ev.base64
        const namefile = ev.name
        /* set ค่า state */
        setFile(base64file);
        setNameFile(namefile);
    //ทำให้เปลี่ยนเป็นตามที่เลือก
        setClubImg(base64file);
    }

    function clickModal(ev){
        ev.preventDefault()
        console.log(ev)
        const club = JSON.parse(ev.target.getAttribute("data-bs-info"))
        console.log(club)
        setClubName(club.name)
        setClubDes(club.des)
        setClubSch(club.sch)
        setClubImg(club.img)
        setClubLimit(club.limit)
        setFile(null)
        setNameFile(null)
    }

    function Edit(){
        const submit = document.getElementById("submitbtn")
        const name_in = document.getElementById("club_name")
        const des_in = document.getElementById("club_des")
        const sch_in = document.getElementById("club_sch")
        const limit_in = document.getElementById("club_limit")
        submit.removeAttribute("hidden")
        name_in.removeAttribute("disabled")
        des_in.removeAttribute("disabled")
        sch_in.removeAttribute("disabled")
        limit_in.removeAttribute("disabled")
    }    

    function Submit(){
        const submit = document.getElementById("submitbtn")
        const name_in = document.getElementById("club_name")
        const des_in = document.getElementById("club_des")
        const sch_in = document.getElementById("club_sch")
        const limit_in = document.getElementById("club_limit")
        name_in.setAttribute("disabled",1)
        des_in.setAttribute("disabled",1)
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
		// ตัวอย่างการ post
		// fetch('https://jsonplaceholder.typicode.com/posts',{	
		// 	method:"post",
		// 	headers:{"Content-Type":"application/json"},
		// 	body:JSON.stringify(body)
		// })
		// .then(res => res.json())
		// .then(result => console.log(result)) 
    }

    function closeInfo(){
        console.log("close")
        const submit = document.getElementById("submitbtn")
        const name_in = document.getElementById("club_name")
        const des_in = document.getElementById("club_des")
        const sch_in = document.getElementById("club_sch")
        const limit_in = document.getElementById("club_limit")
        name_in.setAttribute("disabled",1)
        des_in.setAttribute("disabled",1)
        sch_in.setAttribute("disabled",1)
        limit_in.setAttribute("disabled",1)
        submit.setAttribute("hidden", 1)
    }

	return (
		<main>
			<div className="text-center fs-1">OwnClub</div>
			<table className="table table-hover table-bordered table-striped text-center">
				<thead className="table-dark">
					<tr>
						<th style={{width: "60%"}}>ชื่อชุมนุม</th>
						<th>ข้อมูลต่างๆ</th>
					</tr>
				</thead>
				<tbody>
					{data.map((e, i) => {
						return (
							<tr key={i}>
								<td>{e.name}</td>
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
                                <FileBase64 className="form-control" onDone={(ev)=> getFiles(ev)} required/>
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
                                <button className="btn btn-info">ข้อมูลนักเรียน</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		</main>
	);
}
