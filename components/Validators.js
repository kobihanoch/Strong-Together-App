// פונקציות ולידציה
const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
    return usernameRegex.test(username) ? null : 'Username must be 3-15 characters without spaces';
  };
  
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password) ? null : 'Password must be at least 8 characters, include a number and uppercase letter';
  };
  
  const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword ? null : 'Passwords do not match';
  };
  
  const validateEmail = (email) => {
    const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : 'Please enter a valid email address';
  };
  
  const validateRequiredField = (value) => {
    return value ? null : 'This field is required';
  };
  
  // קומפוננטת Validator גנרית שמחזירה הודעת שגיאה
  const Validators = ({ value, type, confirmPassword }) => {
    let errorMessage = null;
  
    switch (type) {
      case 'username':
        errorMessage = validateUsername(value);
        break;
      case 'password':
        errorMessage = validatePassword(value);
        break;
      case 'confirmPassword':
        errorMessage = validateConfirmPassword(value, confirmPassword);
        break;
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'required':
        errorMessage = validateRequiredField(value);
        break;
      default:
        errorMessage = null;
    }
  
    return errorMessage; // מחזירים את הודעת השגיאה
  };

  export default Validators;