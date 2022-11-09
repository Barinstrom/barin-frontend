import React, { useState, useRef, useEffect } from "react";
import Cookies from "universal-cookie";
import {
  get_review,
  post_review,
  get_own_review,
  update_own_review,
  get_club_teachers,
} from "../../utils/student/student";
import Swal from 'sweetalert2';
export default function Review({ item, schoolID, schedule , isStudent }) {
  // console.log("clubinfo", item,schedule,schoolID)
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [vote, setVote] = useState("");
  const [backendComments, setBackendComments] = useState(null);
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [ownCommentData, setOwnCommentData] = useState({});
  const [commentYear, setCommentYear] = useState(new Date().getFullYear());
  const own_comment = useRef();
  const likeBtn = useRef();
  const dislikeBtn = useRef();
  const likeIcon = useRef();
  const dislikeIcon = useRef();
  const btn_review = useRef();
  const btn_edit = useRef();
  const btn_confirm = useRef();
  const teacherName = useRef();
  const [paginateBtn,setPaginateBtn] = useState(null)
  
  const clubNameInModal = useRef();

  function clickModal(item, ev) {
    ev.preventDefault();
    
    const bodyForTeachers = {
      clubID: item._id,
      schoolYear: new Date().getFullYear()
    };
    // title
    clubNameInModal.current.innerText = "ชื่อชุมนุม " + item.clubName;
    //ชื่อครูปีปัจจุบัน
    get_club_teachers(bodyForTeachers, token, schoolID).then((res) => {
      teacherName.current.innerHTML =  "ครูผู้สอน " + res.data[0].firstname + " " +res.data[0].lastname  
    });
    const body = {
      schoolYear: new Date().getFullYear(),
      page: 1,
      clubID: item._id,
    };
    console.log("get own review with ",item._id)
    get_own_review({clubID: item._id,}, token, schoolID).then((res) => {
      // ถ้าเคยรีวิวแล้ว  
      if (res) {
        own_comment.current.value = res.data.textReview;
        setOwnCommentData(res.data);
        console.log("ownReview", res.data);
        if (res.data.satisfiedLevel === "พอใจ") {
          setLike(true);
          setDislike(false);
        } else if (res.data.satisfiedLevel === "ไม่พอใจ") {
          setLike(false);
          setDislike(true);
        }
        likeBtn.current.disabled = true;
        likeIcon.current.disabled = true;
        dislikeBtn.current.disabled = true;
        dislikeIcon.current.disabled = true;
        own_comment.current.disabled = true;
        btn_review.current.classList.add("d-none");
        btn_confirm.current.classList.add("d-none");
        btn_edit.current.classList.remove("d-none");
      }
      //
    });
    //รีวิวปีปัจจุบัน
    console.log("get-review-body",body)
    get_review(body, token, schoolID).then((res) => {
      if(res.data){
        displayReview(res.data.docs);
        const paginate_tmp = generate(res.data,new Date().getFullYear())
        showPaginate(paginate_tmp)
      }
      else{
        noReview
      }
    });
  }

  function displayReview(docs) {
    // console.log("review display",docs)
    const reveiwTest = docs.map((e, i) => {
      return (
        <div className="card mt-2" key={i}>
          <div className="card-header"></div>
          <div className="card-body">
            <div className="comment">
              <div className="commentimagecontainer">
                <img src="/user-icon.png" />
              </div>
              <div className="commentrightpart">
                <div className="commentcontent">
                  <div className="commentauthor">Anonymous</div>
                  <i className="fa-solid fa-badge-check"></i>
                </div>
              </div>
            </div>
            <span className="card-title d-flex justify-content-end align-items-start">
            </span>
            <p className="card-text d-flex justify-content-between">{e.textReview}</p>
          </div>
          <style>
            {`
              .comment {
                display: flex;
                margin-bottom: 28px;
              }
              .commentimagecontainer {
                margin-right: 12px;
              }
              .commentimagecontainer img {
                border-radius: 50px;
              }
              .commentrightpart {
                width: 100%;
              }
              .commentcontent {
                display: flex;
              }
              .commentauthor {
                padding-top: 11px;
                margin-right: 8px;
                font-size: 20px;
                color: rgb(59, 130, 246);
              }
          `}
          </style>
        </div>
      );
    });
    setBackendComments(reveiwTest);
  }


  const noReview = (
    <div class="card">
      <div class="card-header"></div>
      <div class="card-body d-flex justify-content-center align-items-center">
        <h5 class="card-title"></h5>
        <p class="card-text">ยังไม่มีการแสดงความคิดเห็น</p>
      </div>
      <div class="card-footer text-muted"></div>
  </div>
    )
  function handleReview(ev) {
    const comment = own_comment.current.value;
    // console.log("voteแล้ว", vote);
    const data = {
      clubID: item._id,
      textReview: comment,
      satisfiedLevel: vote,
    };
    // console.log("ข้อมูลที่รีวิว",data)
    // const schoolID = "stamp";
    ev.preventDefault();
    if (!vote) {
      Swal.fire({
        title: 'โปรดเลือกความพึงพอใจ',
        icon: 'warning',
        showCloseButton: true,
      })
      return;
    } else if (!comment) {
      Swal.fire({
        title: 'โปรดแสดงความคิดเห็น',
        icon: 'warning',
        showCloseButton: true,
      })
      return;
    }

    post_review(data, token, schoolID).then((res) => {
      console.log(res)
    });
    //จัดปุ่ม
    likeBtn.current.disabled = true;
    likeIcon.current.disabled = true;
    dislikeBtn.current.disabled = true;
    dislikeIcon.current.disabled = true;
    own_comment.current.disabled = true;
    btn_review.current.classList.add("d-none");
    btn_confirm.current.classList.add("d-none");
    btn_edit.current.classList.remove("d-none");
  }

  function handleEdit(ev) {
    //เช็ค reviewID เพ่ือใช้อัพเดท
    const ownBody ={
      clubID: item._id
    }
    get_own_review(ownBody, token, schoolID).then((res) => {
    setOwnCommentData(res.data);})
    // console.log("from editing",ownBody,ownCommentData)
    //
    ev.preventDefault();
    own_comment.current.disabled = false;
    btn_confirm.current.classList.remove("d-none");
    btn_edit.current.classList.add("d-none");
    likeBtn.current.disabled = false;
    likeIcon.current.disabled = false;
    dislikeBtn.current.disabled = false;
    dislikeIcon.current.disabled = false;
    setVote(false);
    setLike(false);
    setDislike(false);
  }

  function handleConfirm(ev) {
    ev.preventDefault();
    const comment = own_comment.current.value;
    if (!vote) {
      Swal.fire({
        title: 'โปรดเลือกความพึงพอใจ',
        icon: 'warning',
        showCloseButton: true,
      })
      return;
    } else {
      own_comment.current.disabled = true;
      btn_confirm.current.classList.add("d-none");
      btn_edit.current.classList.remove("d-none");
      likeBtn.current.disabled = true;
      likeIcon.current.disabled = true;
      dislikeBtn.current.disabled = true;
      dislikeIcon.current.disabled = true;
      own_comment.current.disabled = true;
      const updateData = {
        reviewID: ownCommentData._id,
        textReview: comment,
        satisfiedLevel: vote,
      };
      // console.log(updateData)
      update_own_review(updateData, token, schoolID).then((res) => {
        console.log(res);
      });
    }
  }
  useEffect(() => {
    console.log("useeffect",commentYear)
  },[commentYear])

  function handleDropdown(e,e2) {
    console.log(e2)
    let year = e.target.innerHTML;
    setCommentYear(e2);
    // setCommentYear(parseInt(year));
    console.log("dropdown",parseInt(year))
    const body = {
      schoolYear: parseInt(year),
      page: 1,
      clubID: item._id,
    };
    const bodyteachers = {
      clubID: item._id,
      schoolYear: parseInt(year)
    };
    // console.log(bodyteachers)
    get_club_teachers(bodyteachers, token, schoolID).then((res) => {
      teacherName.current.innerHTML =  "ครูผู้สอน " + res.data[0].firstname + " " +res.data[0].lastname  
    });
    get_review(body, token, schoolID).then((res) => {
      console.log("get review from",parseInt(year));
      console.log("res.data",res.data)
      displayReview(res.data.docs);
      const paginate_tmp = generate(res.data,e2)
      showPaginate(paginate_tmp)
    });
    // setCommentYear(parseInt(year));
  }

  //ปุ่มพอใจ ไม่พอใจ
  function voteClub() {
    function voteHandle(e) {
      //ดักทั้งกดโดน button และ icon
      if (e.target.value === "พอใจ") {
        setVote(e.target.value);
        setLike(true);
        setDislike(false);
      } else if (e.target.innerHTML === "พอใจ") {
        setVote(e.target.innerHTML);
        setLike(true);
        setDislike(false);
      } else if (e.target.value === "ไม่พอใจ") {
        setVote(e.target.value);
        setLike(false);
        setDislike(true);
      } else if (e.target.innerHTML === "ไม่พอใจ") {
        setVote(e.target.innerHTML);
        setLike(false);
        setDislike(true);
      }
    }
    return (
      <label>
        <button ref={likeBtn} className="btn p-1 m-1" value="พอใจ" onClick={(e) => voteHandle(e)}
          style={
            like
              ? { border: "solid 2px green", borderColor: "green" }
              : { border: "solid 2px gray", borderColor: "gray" }
          }
        >
          <i ref={likeIcon} className="fa-regular fa-thumbs-up fa-sm m-2" style={like ? { color: "green" } : { color: "gray" }} onClick={(e) => voteHandle(e)}>พอใจ</i>
        </button>

        <button ref={dislikeBtn} className="btn p-1 m-1" value="ไม่พอใจ" onClick={(e) => voteHandle(e)}
          style={
            dislike
              ? { border: "solid 2px red", borderColor: "red" }
              : { border: "solid 2px gray", borderColor: "gray" }
          }
        >
          <i ref={dislikeIcon} className="fa-regular fa-thumbs-down fa-sm m-2" style={dislike ? { color: "red" } : { color: "gray" }} onClick={(e) => voteHandle(e)}>ไม่พอใจ</i>
        </button>
        
      </label>
    );
  }
  //pagination
  function generate(result,schoolYear){
    // console.log("result in generate",result)
    const paginate_tmp = []
    if (result.hasPrevPage && result.page - 5 >= 1){
      paginate_tmp.push(<button className='page-link' onClick={()=> clickPage(1,schoolYear)}><i className="fa-solid fa-angles-left"></i></button>)    
    }else{
      paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angles-left"></i></button>)
    }
    
    if (result.hasPrevPage){
      paginate_tmp.push(<button className='page-link' onClick={()=> clickPage((result.page-1),schoolYear)}><i className="fa-solid fa-angle-left"></i></button>)    
    }else{
      paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angle-left"></i></button>)
    }
    
    paginate_tmp.push(<button className='page-link disabled'>{result.page}</button>)
    
    if (result.hasNextPage){
      paginate_tmp.push(<button className='page-link' onClick={()=> clickPage((result.page+1),schoolYear)}><i className="fa-solid fa-angle-right"></i></button>)    
    }else{
      paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angle-right"></i></button>)
    }
    
    if (result.hasNextPage && result.page + 5 <= result.totalPages){
      paginate_tmp.push(<button className='page-link' onClick={()=> clickPage((result.totalPages),schoolYear)}><i className="fa-solid fa-angles-right"></i></button>)    
    }else{
        paginate_tmp.push(<button className='page-link disabled'><i className="fa-solid fa-angles-right"></i></button>)
    }
    return paginate_tmp
}
  
function showPaginate(paginate){
  const template = (
      <ul className='pagination justify-content-center mt-3'>
          {paginate.map((item,index)=>{
              return (
                  <li key={index} className="page-item">{item}</li>
              )
          })}
      </ul>
  )
  setPaginateBtn(template)
}
function clickPage(pageSelected,commentYear){
  console.log("clicked",pageSelected,commentYear)
  // const yearSelected = commentYear
  // console.log("yearSelected",yearSelected)
  const body = {
    schoolYear: commentYear,
    page: pageSelected,
    clubID: item._id,
  };
  console.log("body in click page",body)
  get_review(body, token, schoolID).then((res) => {
  console.log("afterClickPage",res);
  displayReview(res.data.docs);
  const paginate_tmp = generate(res.data,commentYear)
  showPaginate(paginate_tmp)

})
}        
  return (
    <>
      <style jsx>{`
            .review_btn{
              border:none;
              background-color:#d80ebd;
              color:white;
              border-radius:4px;
            }
      `}</style>
      <div className="modal" id={item.clubName}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className=" modal-header d-flex justify-content-between h2">
              <div className="modal-title d-flex text-lg">
                <div className="d-flex">
                  <span ref={clubNameInModal}></span>
                </div>
              </div>
              <div>
                <button
                  className="btn-close m-0 "
                  data-bs-dismiss="modal"
                ></button>
              </div>
            </div>
            <div className=" modal-body">
              <div className="d-flex justify-content-between align-items-center">
                {isStudent ? <div>
                  <span>ความพึงพอใจ</span>
                  <span className="m-3">{voteClub()}</span>
                </div>:""}
                <div className="d-flex  justify-content-center align-items-center">
                  <div>ปีการศึกษา</div>
                  <span>
                    <div className="dropdown p-3">
                      <button
                        className="btn btn-light dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {/* เปลี่ยน ค.ศ. เป็น พ.ศ. */}
                        {commentYear}
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        {schedule.map((ev, i) => {
                          return (
                            <li key={i}>
                              <a className="dropdown-item" href="#" onClick={(e) => {handleDropdown(e,ev.schoolYear);}}>
                                {/* เปลี่ยน ค.ศ. เป็น พ.ศ. */}
                                {ev.schoolYear}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </span>
                  <span ref={teacherName}>
                  </span>
                </div>
              </div> 
            
              {isStudent ? <form>
                <div className="mb-3">
                  <label className="form-label">เขียนรีวิว</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    defaultValue={""}
                    ref={own_comment}
                    placeholder="เพิ่มความคิดเห็น..."
                  >
                  </textarea>
                </div>
                <button type="submit" className="btn btn-primary" ref={btn_review} onClick={(ev) => {handleReview(ev);}}>รีวิว</button>
                <button type="submit" className="btn btn-warning d-none" ref={btn_edit} onClick={(ev) => {handleEdit(ev);}}>แก้ไขรีวิว</button>
                <button type="submit" className="btn btn-success d-none" ref={btn_confirm} onClick={(ev) => { handleConfirm(ev); }}>ตกลง</button>
              </form> : ""}
              {backendComments}
              {paginateBtn}
            </div>
          </div>
        </div>
      </div>
                        
      <button
        className="btn review_btn btn-sm"
        data-bs-toggle="modal"
        data-bs-target={`#${item.clubName}`}
        onClick={(ev) => clickModal(item, ev)}
      >รีวิว</button>
    </>
  );
}
