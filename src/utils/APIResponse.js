class APIResponse {
    constructor(statusCode, message="Success", data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode >= 200 && statusCode < 400;
        
    }
}
export { APIResponse }; // Export APIResponse class