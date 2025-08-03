import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";

const router = express.Router();

// Home page - redirect to login if not authenticated
router.get("/", (req, res) => {
    res.render("home", { 
        title: "Social Media App - Share Your Moments",
        user: null,
        messages: {}
    });
});

// Register page
router.get("/register", (req, res) => {
    res.render("register", { 
        title: "Register - Social Media App",
        user: null,
        messages: {}
    });
});

// Login page
router.get("/login", (req, res) => {
    res.render("login", { 
        title: "Login - Social Media App",
        user: null,
        messages: {}
    });
});

// Dashboard - protected route
router.get("/dashboard", isAuthenticated, async (req, res) => {
    try {
        // Get current user data with populated fields
        const user = await User.findById(req.id)
            .populate({
                path: "createdPins",
                select: "title description image",
            })
            .populate({
                path: "createdBoards",
                select: "title description",
            });

        if (!user) {
            return res.redirect("/login");
        }
        
        res.render("dashboard", { 
            title: "Dashboard - Social Media App",
            user: {
                ...user.toJSON(),
                totalPins: user.totalpins,
                totalBoards: user.totalboards,
            },
            messages: {}
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.redirect("/login");
    }
});

// Logout route
router.get("/logout", (req, res) => {
    res.cookie("token", "", { maxAge: 0 });
    res.redirect("/login");
});

export default router;
