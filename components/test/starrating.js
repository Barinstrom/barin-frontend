import React, { useEffect, useRef, useState } from "react";
export default function StartRating() {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  // {!Check ? console.log("true"):console.log('false')}
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
                (ratingValue) > (hover || rating)
                  ? 
                  { color: "#e4e5e9" }
                  : { color: "#ffc107" }
              }
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            ></i>
          </label>
        );
      })}


      
    </>
  );
}
