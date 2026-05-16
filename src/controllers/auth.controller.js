const userModel = require('../models/user.model');
const foodPartnerModel = require('../models/foodpartner.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


function setTokenCookie(res, token) {
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24,
    });
}

function clearTokenCookie(res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
}

// ----------------- User -----------------
async function registerUser(req, res) {
    const { fullName, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
        return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({ fullName, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    setTokenCookie(res, token);
    res.status(201).json({
        message: "User registered successfully",
        user: { _id: user._id, fullName: user.fullName, email: user.email }
    });
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    setTokenCookie(res, token);

    res.status(200).json({
        message: "User logged in successfully",
        user: { _id: user._id, fullName: user.fullName, email: user.email }
    });
}

function logoutUser(req, res) {
    clearTokenCookie(res);
    res.status(200).json({ message: "User logged out successfully" });
}

// ✅ FIX: getMe function add kiya — routes mein tha par controller mein nahi tha
// Cookie se current logged-in user ki info return karta hai
async function getMe(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Pehle user check karo
        const user = await userModel.findById(decoded.id).select('-password');
        if (user) {
            return res.status(200).json({ type: "user", user });
        }

        // Agar user nahi mila toh food partner check karo
        const foodPartner = await foodPartnerModel.findById(decoded.id).select('-password');
        if (foodPartner) {
            return res.status(200).json({ type: "foodPartner", user: foodPartner });
        }

        return res.status(404).json({ message: "User not found" });

    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

// ----------------- Food Partner -----------------
async function registerFoodPartner(req, res) {
    const { name, email, password, phone, address, contactName } = req.body;

    const existing = await foodPartnerModel.findOne({ email });
    if (existing)
        return res.status(400).json({ message: "Food partner already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const fp = await foodPartnerModel.create({
        name, email, password: hashedPassword, phone, address, contactName
    });

    const token = jwt.sign({ id: fp._id }, process.env.JWT_SECRET);
    setTokenCookie(res, token);

    res.status(201).json({
        message: "Food partner registered successfully",
        foodPartner: { _id: fp._id, name: fp.name, email: fp.email, phone: fp.phone, address: fp.address }
    });
}

async function loginFoodPartner(req, res) {
    const { email, password } = req.body;

    const fp = await foodPartnerModel.findOne({ email });
    if (!fp) return res.status(400).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, fp.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: fp._id }, process.env.JWT_SECRET);
    setTokenCookie(res, token);

    res.status(200).json({
        message: "Food partner logged in successfully",
        foodPartner: { _id: fp._id, name: fp.name, email: fp.email }
    });
}

function logoutFoodPartner(req, res) {
    clearTokenCookie(res);
    res.status(200).json({ message: "Food partner logged out successfully" });
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe,              
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
};