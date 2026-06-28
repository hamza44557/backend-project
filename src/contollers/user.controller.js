import {asyncHandler} from "../utils/asyncHandler.js";
import{apiError} from "../utils/apiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import { Apirespons } from "../utils/apiRespons.js";

// build the logic which things are essential for user registration 
// 1. user details (name , email , password and the feilds that you have define in modeling)
// 2. validations check use dont push the empty feilds
// 3.check if user already exist check by username and email 
// 4. check for avatar 
// 5. cloudinary url 
// 6. create user object - create eentry in DB
// 7. remove password and fresh token feilds from respons
// 8. check for user creation 
// 9. return respons
const registerUser = asyncHandler(async(req ,res)=>{
   const {fullName,email, username, password} = req.body
   console.log(
    {"email": email},
    {"fullName": fullName},
    {"username": username},
    {"password": password}
);
// checking the condition that all fields are completely filled
// kahen user ne koi feild khali to nhi chor di is ko check krna hai.
if (
    [fullName, email, username, password].some(
        (field) => !field || field.trim() === ""
    )
) {
    throw new apiError(400, "All fields are required");
}
// checking email is write in correct format
// check kr rha hai yahan k email me @ hai ya nhi aur . bhi check kr rha hai 
// regex k throgh regular expression
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
    throw new apiError(400, "Please enter a valid email address");
}
// now checking user is already exisit or not 
// yahan dekh rhe hen k kahen user already exist krta to nhi agr esa hoga
//email ya username k thruogh check kr len gy aur same user ko user hone se rokdega
const existedUser = User.findOne({
    $or:[{userName},{email}]
})
if (existedUser){
    throw new apiError(409,"User with this email or userName Already Exist")
}

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImageLocalPath = req.files?.coverImage[0]?.path;
    
if (!avatarLocalPath){
    throw new apiError(400,"Avatar files is required ")
}   
const avatar= await uploadOnCloudinary(avatarLocalPath)
const coverImage= await uploadOnCloudinary (coverImageLocalPath)

if (!avatar){
    throw new apiError(400,"Avatar files is required ")
}
const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    eamil,
    password,
    userName: userName.toLowerCase()

})

const CreatedUser = await user.findByID(user._id).select(
    "-password -refreshToken")

if(!CreatedUser){
    throw new apiError(500,"something went wrong while registering ther user")
}

return res.status(201).json(
    new Apirespons(200, CreatedUser,"user registered successfully")
)










    // res.status(200).json({
    //     message:"ok"
    // })

});

export {registerUser}