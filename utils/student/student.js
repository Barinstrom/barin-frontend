import Cookies from "universal-cookie";
import axios from "axios";

const stagingUrl = process.env.NEXT_PUBLIC_API


// แสดง ownclub
export async function get_student_ownclub(data, token, schoolID) {
  const apiUrl = stagingUrl + "/" + String(schoolID) + "/student/ownclub";

  console.log(data)
  const params = new URLSearchParams()
  if (data.nowSchoolYear) {
    params.append("schoolYear", data.nowSchoolYear)
  }
  const params_success = apiUrl + `?${params}`
  console.log(params_success)

  try {
    const result = await axios({
      url: params_success,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "get",
      timeout: 10000
    })
    return result
  } catch (err) {
    console.log(err)
    return false
  }
};

// แสดง ownclub
export async function get_student_pastclub(token, schoolID) {
  const apiUrl = stagingUrl + "/" + String(schoolID) + "/student/pastclubs";
  try {
    const result = await axios({
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "get",
      timeout: 10000
    })
    return result
  } catch (err) {
    console.log(err)
    return false
  }
};

// สมัครชุมนุม club
export async function register_club(data, token, schoolID) {
  const apiUrl = stagingUrl + "/" + String(schoolID) + "/register-club";

  try {
    const result = await axios({
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: JSON.stringify(data),
      timeout: 10000
    })
    return true
  } catch (err) {
    console.log(err)
    return false
  }
};

// drop club
export async function drop_club(data, token, schoolID) {
  const apiUrl = stagingUrl + "/" + String(schoolID) + "/drop-club";

  try {
    const result = await axios({
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: JSON.stringify(data),
      timeout: 10000
    })
    return true
  } catch (err) {
    console.log(err)
    return [err, false]
  }
};

// get-review
export async function get_review_year(groupID, token, schoolID) {
  const apiUrl = stagingUrl + "/" + schoolID + "/get-schoolyear";

  // console.log("get-schoolyear =", groupID)
  const params = new URLSearchParams()
  if (groupID) {
    params.append("groupID", groupID)
  }
  const params_success = apiUrl + `?${params}`
  // console.log(params_success)

  try {
    const result = await axios({
      method: "get",
      url: params_success,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
    // console.log(result)
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
}


// get-review
export async function get_review(body, token, schoolID) {
  const apiUrl = stagingUrl + "/" + schoolID + "/get-review";

  // console.log("get_review =",body)
  const params = new URLSearchParams()
  if (body.clubID) {
    params.append("clubID", body.clubID)
  }
  if (body.schoolYear) {
    params.append("schoolYear", body.schoolYear)
  }
  if (body.page) {
    params.append("page", body.page)
  }
  const params_success = apiUrl + `?${params}`
  // console.log(params_success)

  try {
    const result = await axios({
      method: "get",
      url: params_success,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
    // console.log(result)
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// post-review
export async function post_review(data, token, schoolID) {
  const apiUrl = stagingUrl + "/" + schoolID + "/add-review";

  try {
    const result = await axios({
      url: apiUrl,
      method: "post",
      data: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      timeout: 3000,
    });
    // console.log(result)
    // return result;
    return 'true'
  } catch (err) {
    console.log(err);
    return 'false';
  }
}
// get-own-review
export async function get_own_review(clubID, token, schoolID) {
  const apiUrl = stagingUrl + "/" + schoolID + "/get-own-review";

  const params = new URLSearchParams()
  if (clubID) {
    params.append("clubID", clubID)
  }
  const params_success = apiUrl + `?${params}`
  // console.log(params_success)

  try {
    const result = await axios({
      method: "get",
      url: params_success,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
    console.log(result)
    return result;
  } catch (err) {
    console.log(err.message);
    return false;
  }
}
// update-own-review
export async function update_own_review(data, token, schoolID) {
  const apiUrl = stagingUrl + "/" + String(schoolID) + "/update-review";

  try {
    const result = await axios({
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "patch",
      data: JSON.stringify(data),
      timeout: 10000
    })
    // return result
    return 'true'
  } catch (err) {
    console.log(err)
    return 'false'
  }
};

// delete-review
export async function delete_review(data, token, schoolID) {
  const apiUrl = stagingUrl + "/" + String(schoolID) + "/delete-review";
  console.log("delete_review", data, token, schoolID)
  try {
    const result = await axios({
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "delete",
      data: JSON.stringify(data),
      timeout: 10000
    })
    // return result
    return 'true'
  } catch (err) {
    console.log(err)
    return 'false'
  }
};

// club-teachers
export async function get_club_teachers(body, token, schoolID) {
  const apiUrl = stagingUrl + "/" + String(schoolID) + "/club/teachers";

  const params = new URLSearchParams()
  if (body.clubID) {
    params.append("clubID", body.clubID)
  }
  if (body.schoolYear) {
    params.append("schoolYear", body.schoolYear)
  }
  const params_success = apiUrl + `?${params}`
  // console.log(params_success)

  try {
    const result = await axios({
      url: params_success,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "get",
      timeout: 10000
    })
    return result
  } catch (err) {
    console.log(err)
    return false
  }
};

// club-review stat
export async function get_stat(body, token, schoolID) {
  const apiUrl = stagingUrl + "/" + String(schoolID) + "/review/count";

  const params = new URLSearchParams()
  if (body.clubID) {
    params.append("clubID", body.clubID)
  }
  if (body.schoolYear) {
    params.append("schoolYear", body.schoolYear)
  }
  const params_success = apiUrl + `?${params}`
  console.log(params_success)

  try {
    const result = await axios({
      url: params_success,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "get",
      timeout: 10000
    })
    return result
  } catch (err) {
    console.log(err)
    return false
  }
};
