import React, { useEffect } from "react";
import {set_schedule} from "../../utils/school_admin/edit_data";
import Cookies from "universal-cookie";


function setsec() {
    useEffect(() => {
        const schoolID = "stamp";
        const cookies = new Cookies();
        const token = cookies.get("token");
        const testdata = {
          schoolYear: 2023,
          registerDate: "2022-01-30T03:24:00",
          endOfRegisterDate: "2022-10-30T03:24:00",
          endOfSchoolYear: "2022-10-30T03:24:00",
        };
        set_schedule(testdata, token, schoolID);
      }, []);
  return <div>setsec</div>;
}

export default setsec;
