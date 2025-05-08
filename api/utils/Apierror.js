class ApiError extends Error {
  // Yeh class tab kaam aati hai jab hume API me koi error response bhejna ho.
  constructor(
    statusCode, // Error ka HTTP status code (e.g., 400, 500).
    message = "Something went wrong", // Error ka message, default hai "Something went wrong".
    errors = [], // Agar multiple errors hain, to unka ek list.
    stack = "" // Error ka stack trace (debugging ke liye).
  ) {
    super(message); // Error class ka default message set karte hain.
    
    // Error ka HTTP status code store karte hain.
    this.statusCode = statusCode;

    // Data null hota hai, kyunki error ke response
    //  me usually data nahi bhejte.
    this.data = null;

    // Error ka message set karte hain.
    this.message = message;

    // Hamesha false hota hai, kyunki error ka response success nahi hota.
    this.success = false;

    // Extra errors (agar hain) ko store karte hain.
    this.errors = errors;

    // Stack trace (error ke details) store karte hain agar diya gaya ho,
    // warna default stack trace generate karte hain.
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError }; // Isko export karte hain taaki doosre 
// files me use kar sakein.

// Example ke tour par 
// const badRequestError = new ApiError(400, "Invalid input provided", ["Name is required"]);
// console.log(badRequestError);
