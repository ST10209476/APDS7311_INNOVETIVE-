import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to check user roles
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        // Using optional chaining here
        const token = req.headers?.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized. No token provided." });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            // Check if the user's role is in the allowed roles
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Forbidden. Access denied." });
            }

            // Attach the user info to the request object for further use
            req.user = decoded;
            next();
        } catch (error) {
            console.error("Authorization error:", error);
            res.status(401).json({ message: "Invalid or expired token." });
        }
    };
};

module.exports = authorizeRoles;
