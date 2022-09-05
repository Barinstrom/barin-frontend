import React from "react";
import { useRef, useState, useEffect } from "react";

export default function Approved() {
    const [clubname, setClubName] = useState("")
    const [clubinfo, setClubInfo] = useState("")

	const data = [
		{ club_name: "Softeng", club_inf: "how to coding????????"},
		{ club_name: "MATH", club_inf: "1 + 1 = หน้าต่าง"},
		{ club_name: "Discrete", club_inf: "dont wanna study" },
		{ club_name: "bundit", club_inf: ";-;"},
		{ club_name: "jitat", club_inf: "okokokokokokokokokok"},
		{ club_name: "kana", club_inf: "barin expert ."},
	];

    function registerClub() {
        //console.log()
        console.log("Club_name: " + clubname)
		// const body = {
		// 	"userId": 10,
		// 	"id": 101,
		// 	"title": "luffy",
		// }

		// ตัวอย่างการ post
		/* fetch('https://jsonplaceholder.typicode.com/posts',{	
			method:"post",
			headers:{"Content-Type":"application/json"},
			body:JSON.stringify(body)
		})
		.then(res => res.json())
		.then(result => console.log(result)) */
    }

    function clickModal(ev) {
        ev.preventDefault()
        const club = JSON.parse(ev.target.getAttribute("data-bs-info"))
        console.log(club)
        setClubName(club.club_name)
        setClubInfo(club.club_inf)
    }

	function clickSearch(ev) {
		ev.preventDefault();
		/* ค้นหาชุมนุม */
	}
	
    

	return (
		<main>
			<style jsx>{`
				.btn-responsive {
					width: 15%;
				}
				@media screen and (max-width: 1000px) {
					.btn-responsive {
						width: 40%;
					}
				}
				@media screen and (max-width: 576px) {
					.btn-responsive {
						width: 100%;
					}
				}
			`}</style>
			
			<div className="text-center fs-1">Search Club</div>
			<form onClick={(ev) => clickSearch(ev)} className="mb-4 mt-2">
				<div className="input-group">
					<span className="input-group-text">ค้นหาชุมนุม</span>
					<input className="form-control" name="search"/>
					<button className="btn btn-danger">กด</button>
				</div>
			</form>

			
			<ul className="list-group">
				{data.map((e, i) => {
					return (
						<li key={i} className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-center">
							<div className="d-flex flex-column w-100">
								<h5 className="mb-1">{e.club_name}</h5>
								{/* <small>{e.club_inf}</small> */}
							</div>
							<button className="btn btn-primary mt-3 mb-3 btn-responsive" data-bs-toggle="modal" data-bs-target="#modal" data-bs-info={JSON.stringify(e)} onClick={(ev) => clickModal(ev)}>
								ดูรายละเอียด
							</button>
						</li>
                        
					);
				})}
			</ul>

            <div className="modal" id="modal">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className=" modal-header">
							<div className="modal-title">{clubname}</div>
							<button className="btn-close" data-bs-dismiss="modal"></button>
						</div>
						<div className=" modal-body">
                            <div className="d-flex flex-row">
                                <h1 className="m-2 border">Image</h1>
                                <div className="m-4 border">{clubinfo}</div>
                            </div>
							
						</div>
						<div className="modal-footer">
							<button className="btn btn-success" onClick={registerClub}>สมัคร</button>
							<button className="btn btn-danger" data-bs-dismiss="modal">ปิด</button>
						</div>
					</div>
				</div>
			</div>
            {/* <button className="btn btn-success m-4" data-bs-toggle="modal" data-bs-target="#modal" data-bs-info={JSON.stringify(data)}>รายละเอียด</button> */}
			{/* <button className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modal" data-bs-info={JSON.stringify(example)} onClick={(ev) => clickModal(ev)}>modal</button> */}
		</main>
	);
}
