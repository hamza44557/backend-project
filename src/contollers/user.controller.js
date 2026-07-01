import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiRespons.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";

const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user data from request body
    const { fullName, email, username, password } = req.body;

    console.log({
        fullName,
        email,
        username,
        password,
    });

    // 2. Validate required fields
    if (
        [fullName, email, username, password].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new apiError(400, "All fields are required");
    }

    // 3. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new apiError(400, "Please enter a valid email address");
    }

    // 4. Check if user already exists
    const existedUser = await User.findOne({
        $or: [
            { email },
            { userName: username }
        ]
    });

    if (existedUser) {
        throw new apiError(
            409,
            "User with this email or username already exists"
        );
    }

    // 5. Get avatar and cover image path
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    // Avatar is required
    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is required");
    }

    // 6. Upload images to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const coverImage = coverImageLocalPath
        ? await uploadOnCloudinary(coverImageLocalPath)
        : null;

    if (!avatar) {
        throw new apiError(500, "Failed to upload avatar");
    }

    // 7. Create user
    const user = await User.create({
        fullName,
        email,
        password,
        userName: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });

    // 8. Remove password and refresh token from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new apiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    // 9. Send response
    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    );
});

export { registerUser };