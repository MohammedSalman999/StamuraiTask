// asyncHandler ek function hai jo kisi bhi 
// async function ko safely chalata hai.
// Yeh function async kaam karte waqt hone
//  wale errors ko automatically handle kar deta hai.

const asyncHandler = (requestHandler) => {
  // requestHandler ek function hota hai jo Express
  //  ke route me async kaam karta hai.

  return async (req, res, next) => {
    try {
      // Yeh async function ko safely chalata hai.
      // Agar koi error nahi hoti, to yeh successfully kaam karega.
      await requestHandler(req, res, next);
    } catch (err) {
      // Agar async function me koi error ho jaye, to error ko pakadta hai.
      // Fir is error ko Express ke default error handler ke
      //  paas bhej deta hai.
      next(err);
    }
  };
};

export default asyncHandler; 

