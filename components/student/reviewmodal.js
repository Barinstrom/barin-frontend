import React, { useState, useRef, useEffect } from "react";
import Star from "../../components/test/star";
import axios from "axios";
import Cookies from "universal-cookie";
import { get_review, post_review } from "../../utils/student/student";



export default function Review({ item, schoolID }) {
  const cookies = new Cookies();
  const token = cookies.get("token");

  //Testing เลือก myuserId 1 แบบ
  //@@@@ For Testing
  //สำหรับเช็คidที่ซ้ำกับที่มีแล้ว
  // const myuserId = "2456";
  //สำหรับเช็คidที่ซ้ำกับที่ไม่มี
  const myuserId = "1234";
  //
  const [backendComments, setBackendComments] = useState([]);
  const [starRated, setStarRated] = useState(0);
  const own_comment = useRef();
  const p_starRating = useRef();
  const p_Star = useRef();
  const btn_review = useRef();
  const btn_edit = useRef();
  const btn_confirm = useRef();
  const btn_delete = useRef();

  const clubNameInModal = useRef()

  function clickModal(item,ev) {
    ev.preventDefault();
    // get api --- paginate
    // console.log(item.clubName)
    // console.log(ev.target)
    // console.log(clubNameInModal)
    clubNameInModal.current.innerText = item.clubName
    
    const body = {
      schoolYear: 2022,
      page: 1,
      clubID : item._id
    }

    console.log(body)
    get_review(body,token, schoolID).then((data) => {
      console.log(data);
        // setBackendComments(data);
        // data.map((e, i) => {
        //   if (e.userId == myuserId) {
        //     /* set comment value */
        //     own_comment.current.value = e.body;
        //     own_comment.current.disabled = true;
        //     setStarRated(e.star);
        //     p_starRating.current.classList.add("d-none");
        //     p_Star.current.classList.remove("d-none");
        //     btn_review.current.classList.add("d-none");
        //     btn_edit.current.classList.remove("d-none");
        //     btn_delete.current.classList.remove("d-none");
        //   }
        // });
    });
  }

  function handleReview(ev) {
    const comment = own_comment.current.value;
    const rating = localStorage.getItem("star");
    //test data//
    ////
    const temp = {
      id: Math.random().toString(36).substr(2, 9),
      body: comment,
      username: "11",
      userId: myuserId,
      star: parseInt(rating),
      createdAt: new Date(),
    };
    //
    //
    const data = {
      clubID: "dwqdqw",
      studentID: "weqe123213",
      textReview: "soo goooooddd",
    };
    const schoolID = "teststamp";
    post_review(data, token, schoolID);
    ev.preventDefault();
    // if (!rating) {
    //   alert("please rating");
    //   return;
    // } else if (!comment) {
    //   alert("please comment");
    //   return;
    // }
    // {
    //   /* api สำหรับ add comment */
    // }

    // {
    //   /* usestage เพิ่มคอมเม้น */
    // }
    // else {
    //   localStorage.removeItem("star");
    //   setBackendComments((current) => [temp, ...current]);
    //   own_comment.current.disabled = true;
    //   setStarRated(temp.star);
    //   p_starRating.current.classList.add("d-none");
    //   p_Star.current.classList.remove("d-none");
    //   btn_review.current.classList.add("d-none");
    //   btn_edit.current.classList.remove("d-none");
    //   btn_delete.current.classList.remove("d-none");
    // }
  }

  function handleEdit(ev) {
    ev.preventDefault();
    own_comment.current.disabled = false;
    p_starRating.current.classList.remove("d-none");
    p_Star.current.classList.add("d-none");
    btn_confirm.current.classList.remove("d-none");
    btn_edit.current.classList.add("d-none");
    btn_delete.current.classList.add("d-none");
  }

  function handleConfirm(ev) {
    ev.preventDefault();
    const comment = own_comment.current.value;
    const rating = localStorage.getItem("star");
    if (!rating) {
      alert("please rate this club again");
      return;
    } else {
      own_comment.current.disabled = true;
      localStorage.removeItem("star");
      setStarRated(parseInt(rating));
      p_Star.current.classList.remove("d-none");
      p_starRating.current.classList.add("d-none");
      btn_confirm.current.classList.add("d-none");
      btn_edit.current.classList.remove("d-none");
      btn_delete.current.classList.remove("d-none");
      //test data//
      ////
      const temp = {
        id: "213",
        body: comment,
        username: Math.random().toString(23),
        userId: myuserId,
        star: parseInt(rating),
        createdAt: new Date(),
      };
      //
      //
      // updateComment(temp, myuserId);
    }
  }
  function handleDelete(ev) {
    ev.preventDefault();
    if (window.confirm("Are you sure that you want to remove comment?")) {
      deleteCommentApi(myuserId).then(() => {
        const updatedBackendComments = backendComments.filter(
          (backendComments) => backendComments.userId !== myuserId
        );
        setBackendComments(updatedBackendComments);
      });
      own_comment.current.disabled = false;
      own_comment.current.value = "";
      p_Star.current.classList.add("d-none");
      p_starRating.current.classList.remove("d-none");
      btn_review.current.classList.remove("d-none");
      btn_edit.current.classList.add("d-none");
      btn_delete.current.classList.add("d-none");
    }
  }
  //starrating
  function StartRating() {
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    return (
      <>
        {[...Array(5)].map((start, i) => {
          let ratingValue = i + 1;
          function StartHandle() {
            setRating(ratingValue);
            localStorage.setItem("star", ratingValue);
          }

          return (
            <label key={i}>
              <input
                type="radio"
                className="radio bg-success d-none"
                value={ratingValue}
                onClick={() => StartHandle()}
              ></input>
              <i
                className="fa-solid fa-star fa-lg star"
                style={
                  ratingValue > (hover || rating)
                    ? { color: "#e4e5e9" }
                    : { color: "#ffc107" }
                }
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(null)}
              ></i>
            </label>
          );
        })}

        <style jsx>{`
          .star {
            cursor: pointer;
            transition: color 200ms;
          }
        `}</style>
      </>
    );
  }
  return (
    <>
        <div className="modal" id={`${item.clubName}`}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className=" modal-header d-flex justify-content-between h2">
                <div className="modal-title d-flex text-lg">
                  <div className="d-flex">
                    <span ref={clubNameInModal}></span>
                    <div className="border border-1 rounded-2  ms-5 align-items-center">
                      Overall:
                      <Star TotalRating={3} />
                    </div>
                  </div>
                </div>
                <div>
                  <button className="btn-close m-0 " data-bs-dismiss="modal"></button>
                </div>
              </div>
              <div className=" modal-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div ref={p_starRating}>
                    <span>กรอกคะแนนรีวิว</span>
                    <span className="m-3">{StartRating()}</span>
                  </div>
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
                          เลือกปีการศึกษา
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <li>
                            <a className="dropdown-item" href="#">
                              2565
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              2564
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              2563
                            </a>
                          </li>
                        </ul>
                      </div>
                    </span>
                    <span>ครูผู้สอน xxxx</span>

                  </div>
                </div>
                <p className="d-none " ref={p_Star}>
                  <span>กรอกคะแนนรีวิว</span>
                  <span className="m-3">
                    <Star TotalRating={starRated} className="Star" />
                  </span>
                </p>
                <form>
                  <div className="mb-3">
                    <label className="form-label">เขียนรีวิว</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      defaultValue={""}
                      ref={own_comment}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    ref={btn_review}
                    onClick={(ev) => {
                      handleReview(ev);
                    }}
                  >
                    รีวิว
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning d-none"
                    ref={btn_edit}
                    onClick={(ev) => {
                      handleEdit(ev);
                    }}
                  >
                    แก้ไขรีวิว
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success d-none"
                    ref={btn_confirm}
                    onClick={(ev) => {
                      handleConfirm(ev);
                    }}
                  >
                    ตกลง
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger d-none"
                    ref={btn_delete}
                    onClick={(ev) => {
                      handleDelete(ev);
                    }}
                  >
                    ลบ
                  </button>
                </form>

                {backendComments
                  //sort ตามวันที่ที่comment
                  .sort(
                    (b, a) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  )
                  //แสดง
                  .map((e, i) => {
                    const createdAt = new Date(
                      e.createdAt
                    ).toLocaleDateString();
                    return (
                      <div className="card mt-2" key={i}>
                        <div className="card-header">{createdAt}</div>
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
                            <Star TotalRating={e.star} />
                          </span>
                          <p className="card-text">{e.body}</p>
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
                  })}
              </div>
            </div>
          </div>
        </div>
        
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target={`#${item.clubName}`}
          onClick={(ev) => clickModal(item,ev)}
        >
          รีวิว
        </button>
      </>
  );
}
