import React from "react";
import styles from "../../styles/index_school.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useEffect } from "react";
import { checkLogin, get_all_schoolID } from "../../utils/unauth";
import { get_data } from "../../utils/auth";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";

export default function Login({ schoolID, urlLogo, schoolName }) {
  const spin = useRef();
  const email = useRef();
  const password = useRef();
  const router = useRouter();

  useEffect(() => {
    if (schoolID){
      const cookie = new Cookies();
      cookie.remove("token", { path: "/" })
      cookie.remove("token", { path: `/${schoolID}` })
		}
  },[schoolID]);

  async function clickLogin(ev) {
    ev.preventDefault();

    const email_check = email.current.value;
    const password_check = password.current.value;

    if (!email_check || !password_check) {
      Swal.fire({
        icon: "warning",
        title: "โปรดกรอกข้อมูลให้ครบถ้วน!",
        showConfirmButton: true,
        confirmButtonColor: "#f7a518",
        confirmButtonText: "ok",
      });
      return;
    } else {
      const body = {
        email: email_check,
        password: password_check,
      };

      spin.current.classList.remove("d-none");
      const result = await checkLogin(body);
      spin.current.classList.add("d-none");

      if (!result) {
        Swal.fire({
          icon: "error",
          title: "ข้อมูลไม่ถูกต้อง",
          showConfirmButton: true,
          confirmButtonColor: "#d1000a",
        });
        return;
      } else {
        // console.log(result)
        const check_data = await get_data(result[0].data.token);
        // console.log(check_data)
        if (!check_data[1]) {
          Swal.fire({
            icon: "error",
            title: "ไม่พบข้อมูล กรุณาลองเข้าใหม่อีกครั้ง",
            showConfirmButton: true,
            confirmButtonColor: "#ce0303",
          });
          return;
        }
        
        else {
          if (check_data[0].data._doc.paymentStatus !== "success" || check_data[0].data._doc.status !== "approve"){
            Swal.fire({
              icon: "error",
              title: "โรงเรียนยังไม่เปิดใช้งาน",
              showConfirmButton: true,
              confirmButtonColor: "#ce0303",
            });
            return;
          }else {
            if (result[0].data.role === "teacher" || result[0].data.role === "student"){
              const cookie = new Cookies();
              cookie.set("token", result[0].data.token);
              Swal.fire({
                icon: "success",
                title: "เข้าสู่ระบบสำเร็จ",
                showConfirmButton: true,
                confirmButtonColor: "#009431",
              })
              router.push("/" + String(result[0].data.schoolID) + "/" + result[0].data.role)

            }else if (result[0].data.role === "admin" || result[0].data.role === "host"){
                Swal.fire({
                  icon: "info",
                  title:"เข้าสู่ระบบด้วยเส้นทางที่ไม่ถูกต้อง" +"\n" +"กำลังนำท่านสู่เส้นทางที่ถูกต้อง",
                  showConfirmButton: true,
                  confirmButtonColor: "#0076d1",
                })
                router.push("/login");
            }
          }
        }
      }
    }
  }

  if (schoolID) {
    return (
      <main className={styles.register}>
        <style jsx>{`
          .background-spinner {
            background-color: rgb(0, 0, 0, 0.3);
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
          }
        `}</style>

        <div className="background-spinner d-none" ref={spin}>
          <div className="spinner-border text-primary"></div>
        </div>

        <section className={styles.block}>
          <aside className={styles.block_left}>
            <div>
              <div className={styles.logo}>
                <img src={urlLogo}></img>
              </div>
              <div className={styles.barin_strom}>
                <span>{schoolName}</span>
              </div>
            </div>
          </aside>

          <aside className={styles.block_right}>
            <div className={styles.form}>
              <div className="form-floating">
                <input
                  type="text"
                  className={`form-control`}
                  placeholder="อีเมลล์"
                  id={`${styles.block1}`}
                  ref={email}
                />
                <label className="form-label">อีเมลล์</label>
              </div>

              <div className="form-floating mt-2">
                <input
                  type="password"
                  className={`form-control`}
                  placeholder="รหัสผ่าน"
                  id={`${styles.block2}`}
                  ref={password}
                />
                <label className="form-label">รหัสผ่าน</label>
              </div>
            </div>

            <div className="mt-3 d-flex flex-column align-items-center">
              <button
                className={styles.login_btn}
                onClick={(ev) => clickLogin(ev)}
              >
                เข้าสู่ระบบ
              </button>
              {/* <Link href="/register">
                <button className={styles.register_btn}>สมัครสมาชิก</button>
              </Link> */}
              <div className={styles.additional}>
                <Link href="/forgotPass">
                  <a className={`mt-2 ${styles.forgotpass}`}>ลืมรหัสผ่าน</a>
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </main>
    );
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const schoolID_param = context.params.schoolID;
  const schoolPathAll = await get_all_schoolID();
  const school_path_data = schoolPathAll.data.find(
    (e) => e.schoolID === schoolID_param
  );

  if (school_path_data) {
    let urlLogo = school_path_data.urlLogo;
    let schoolID = school_path_data.schoolID;
    let schoolName = school_path_data.schoolName;

    if (!urlLogo) {
      urlLogo = "https://files.tawanchai.com/pic/spt.png";
    }

    return {
      props: { schoolID, urlLogo, schoolName },
      revalidate: 1,
    };
  } else {
    return {
      notFound: true,
      revalidate: 1,
    };
  }
}
