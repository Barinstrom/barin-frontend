import React from "react";
import { useRef, useState, useEffect } from "react";
import { format, compareAsc } from "date-fns";

export default function SearchClubStdTest() {
  const [clubname, setClubName] = useState("");
  const [clubinfo, setClubInfo] = useState("");
  const [clubId, setClubId] = useState("");
  const [category, setCategory] = useState("");
  const [scheduler, setScheduler] = useState("");
  const [limit, setLimit] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [isOpenToRegister, setIsOpenToRegister] = useState(false);

  const data = [
    {
      club_name: "Crossword พื้นฐาน",
      club_id: "อ  305111",
      clubInfo:
        "- วัตถุประสงค์ของกิจกรรมชุมนุม เพื่อให้นักเรียนฝึกสะกดคำศัพท์ภาษาอังกฤษให้แม่นยำขึ้น, รู้จักวิธีการใช้พจนานุกรมคำศัพท์ภาษาอังกฤษสำหรับ Crossword Games, ฝึกทักษะการแข่งขัน Crossword Games ตามกติกาของสมาคมครอสเวิร์ดแห่งประเทศไทย, คัดเลือกนักเรียนเข้าร่วมแข่งขัน Crossword  Games ในระดับโรงเรียนหรือระดับภายนอกสถานศึกษา- กิจกรรมที่จัดให้กับนักเรียนครูสาธิตการเล่น Crossword  Games, นักเรียนศึกษากติกาการแข่งขัน  Crossword  Games, นักเรียนจับคู่ฝึกการแข่งขัน Crossword  Games, จัดการแข่งขัน Crossword  Games ระดับ ม.ต้น และระดับ ม. ปลาย",
      category: "ภาษาต่างประเทศ",
      scheduler: "tuesday 11.10-12.00",
      limit: 30,
      schoolyear: "2022",
    },
    {
      club_name: "บ้านนัก วิทยาศาสตร์น้อย",
      club_id: "ว 311111",
      clubInfo:
        "วัตถุประสงค์ 1.ให้นักเรียนได้ฝึกการสังเกต รู้จักคิด ตั้งคำถามและค้นหาคำตอบด้วยตนเอง 2.ส่งเสริมและเปิดโอกาสให้นักเรียนได้เรียนรู้และมีประสบการณ์ในการเรียนรู้วิทยาศาสตร์",
      category: "วิทยาศาสตร์ และเทคโนโลยี",
      scheduler: "tuesday 9.05-9.55",
      limit: 30,
      schoolyear: "2022",
    },
    {
      club_name: "คณิตคิดเร็ว (IQ-1000)",
      club_id: "ค  000001",
      clubInfo:
        "การฝึกการคิดคำนวณที่ไว เพื่อเป็นทักษะที่สำคัญในอนาคต เพราะ การทำงานในชีวิตจริงนั้น ต้องอาศัยความไวในการคิดต่างๆ ไม่เพียงแต่จะเป็นการคำนวณทางคณิตศาสตร์ แต่การคิดเพื่อนำไปใช้ในชีวิตประจำวันด้วย",
      category: "คณิตศาสตร์",
      scheduler: "monday 13.00-15.00",
      limit: 25,
      schoolyear: "2022",
    },
    {
      club_name: "ฅนเขียนการ์ตูน",
      club_id: "ศ 305111",
      clubInfo:
        "เปิดโอกาสในการเขียนการ์ตูน ร่วมกันให้ความคิดเห็นผลงานของแต่ละคน และเสริมสร้างทักษะที่จำเป็นสำหรับการเขียนการ์ตูน ไม่ว่าจะเป็น  1. ทักษะในการวาดรูป ซึ่งควรจะต้องมีพื้นฐานและมีเทคนิคในแบบเฉพาะตน นักเขียนการ์ตูนอาจจะไม่จำเป็นต้องวาดรูปสวยแต่ควรมีเอกลักษณ์เป็นของตัวเอง และสามารถถ่ายทอดกับผู้อ่านได้ว่าสิ่งที่ตนวาดนั้นคืออะไร 2. ความสามรถในการเล่าเรื่อง และสามารถถ่ายทอดเรื่องราวให้ผู้อ่านรับรู้ถึงสิ่งที่เรากำลังสื่อสารได้ โดยเรื่องราวนั้นจะทำหน้าที่ตรงตามที่เราได้สื่อสารออกไป เช่น เรากำลังเล่าเรื่องตลก เรื่องเศร้า หรือ เรื่องน่าตื่นเต้น สิ่งที่ผู้อ่านได้รับก็ควรตรงกับสิ่งที่เราจะถ่ายทอดลงไป ในส่วนของเนื้อเรื่องก็ขึ้นอยู่กับสไตล์การทำงานของนักเขียนคนนั้นๆเช่นกัน ไม่มีข้อกำหนดที่ตายตัวว่าต้องเขียนออกมาในรูปแบบใด เพียงแต่สามารถสื่อสารและถ่ายทอดเนื้อหาได้ก็เพียงพอ 3. ความสามารถในการจัดวางหน้ากระดาษ (Layout) ระหว่างภาพวาดของเรา และ เนื้อหาที่เราจะเล่านั้น สามารถนำมาจัดวางและผสมกันได้อย่างไรให้ออกมาน่าสนใจ น่าติดตามและเข้ากับเนื้อเรื่อง 4. ความสามารถด้านเทคโนโลยีต่างๆ เพราะนอกเหนือจากการวาดภาพลงบนกระดาษแล้ว ยังมีเทคนิคอื่นๆ ที่นักเขียนควรศึกษาเพื่อให้ได้เทคนิคใหม่ๆ และวิธีการเล่าเรื่องใหม่ๆในการทำงาน และนอกจากนั้น สื่อยังช่วยในการโปรโมทผลงานของเราให้เป็นที่รู้จักกันอย่างแพร่หลายมากขึ้น จึงต้องรู้วิธีการโฆษณาผลงานของตัวเองผ่านสื่อต่างๆที่มีในปัจจุบันให้ได้มากที่สุด",
      category: "ศิลปศึกษา",
      scheduler: "monday 11.10-12.00",
      limit: 20,
      schoolyear: "2022",
    },
  ];

  function registerClub() {
    //console.log()
    console.log("Club_name: " + clubname);
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
    ev.preventDefault();
    const club = JSON.parse(ev.target.getAttribute("data-bs-info"));
    console.log(club);
    setClubName(club.club_name);
    setClubId(club.club_id);
    setCategory(club.category);
    setScheduler(club.scheduler);
    setLimit(club.limit);
    setSchoolYear(club.schoolYear);
    setClubInfo(club.clubInfo);
    console.log(
      "Now:",
      format(new Date(), "d/M/yyyy"),
      "setDate:",
      format(new Date(2022, 8, 11), "d/M/yyyy")
    );
    setIsOpenToRegister(compareAsc(new Date(), new Date(2022, 8, 13)) >= 0);
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
          <input className="form-control" name="search" />
          <button className="btn btn-danger">กด</button>
        </div>
      </form>

      <ul className="list-group">
        {data.map((e, i) => {
          return (
            <li
              key={i}
              className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-center"
            >
              <div className="d-flex flex-column w-100">
                <h5 className="mb-1">{e.club_name}</h5>
                {/* <small>{e.clubInfo}</small> */}
              </div>
              <button
                className="btn btn-primary mt-3 mb-3 btn-responsive"
                data-bs-toggle="modal"
                data-bs-target="#modal"
                data-bs-info={JSON.stringify(e)}
                onClick={(ev) => clickModal(ev)}
              >
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
              <button className="btn btn-success" onClick={registerClub} disabled={!isOpenToRegister}>
                {isOpenToRegister ? 'สมัคร' : 'ยังไม่เปิดรับสมัคร'}
              </button>
              <button className="btn btn-danger" data-bs-dismiss="modal">
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <button className="btn btn-success m-4" data-bs-toggle="modal" data-bs-target="#modal" data-bs-info={JSON.stringify(data)}>รายละเอียด</button> */}
      {/* <button className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modal" data-bs-info={JSON.stringify(example)} onClick={(ev) => clickModal(ev)}>modal</button> */}
    </main>
  );
}
