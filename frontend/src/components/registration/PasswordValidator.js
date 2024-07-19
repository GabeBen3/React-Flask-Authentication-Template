import validator from "validator";

    
export function validateCharacters (password) { 

    if (validator.isStrongPassword(password, { 
        minLength: 8, minLowercase: 1, 
        minUppercase: 1, minNumbers: 1, minSymbols: 1 
    })) { 
        console.log("VALIDATOR: Password validated")
        return true;
    } else { 
        console.log("VALIDATOR: Password validation failed")
        return false; 
    } 
}
      
const PasswordValidator = {
    validateCharacters,
};


// export default PasswordValidator;