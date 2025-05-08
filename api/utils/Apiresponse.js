class ApiResponse {
    // Jab bhi API ka response bhejna hota hai, to yeh class ek standard format banati hai.
    constructor(statusCode, data, message = "Success") {
        // HTTP status code set karte hain
        // (jaise 200 for success, 404 for not found).
        this.statusCode = statusCode;

        // Jo data API response ke through bhejna hai,
        //  wo yaha store hota hai.

        // Ek chhota message jo response ke saath bhejna
        //  chahte hain (default: "Success").
        this.message = message;

        // Yeh automatically check karta hai ki
        // response successful hai ya nahi.
        // Agar `statusCode` 400 se chhota ho
        // (matlab koi error nahi hai), to success `true` hoga.
        this.success = statusCode < 400;
    }
}

export default { ApiResponse }; // Is class ko export karte
// hain taaki baaki code me use ho sake.
