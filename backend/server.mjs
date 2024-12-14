import express, { application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const port = 8081;


app.use(express.json());
app.use(cors());

const mongoURI = 'mongodb://localhost:27017/guvi6';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error('Database connection error:', error));
db.once('open', () => console.log('Connected to MongoDB'));

const { Schema } = mongoose;


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
});

const collection = mongoose.model('users', userSchema);


app.post("/", async (req, res) => {
    const { email, password } = req.body;
    try {
        const check = await collection.findOne({ email: email });
        if (check) {
            if (check.password === password) {
                return res.json({
                    message: "exist",
                    name: check.name,
                    userId: check._id,
                    email: check.email,
                    role: check.role
                });
            } else {
                return res.json({ message: "fail" });
            }
        } else {
            return res.json({ message: "notexist" });
        }
    } catch (e) {
        console.error("Login error:", e);
        return res.json({ message: "error" });
    }
});


app.post('/api/signup', async (req, res) => {
    const { email, password, name, phone } = req.body;
    if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const data = { email, password, name, phone };
    try {
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.json("exist");
        } else {
            const newUser = new collection(data);
            await newUser.save();
            return res.json("notexist");
        }
    } catch (e) {
        console.error("Error during signup:", e);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/send-confirmation', async (req, res) => {
    const { userEmail } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'sivakavindratamilselvan@gmail.com',
            pass: 'lvnbdnftzntovzuh',
        },
        debug: true,
        logger: true,
    });

    const mailOptions = {
        from: 'sivakavindratamilselvan@gmail.com',
        to: userEmail,
        subject: 'New SignUp',
        text: `Dear Student,

        Congratulations on successfully creating an account with our College Placement Portal! We are delighted to have you onboard as you embark on your journey toward securing exciting career opportunities.
        
        ### Here’s what you can do next:
        - **Explore Job Listings**: Browse through the available job opportunities tailored for students and fresh graduates.
        - **Update Your Profile**: Complete your profile by adding your academic details, achievements, and skills to make a great first impression with recruiters.
        - **Track Applications**: Keep an eye on the status of your job applications and stay updated on new interview schedules or offers.
        
        ### How to Get Started:
        1. Log in to your account using the email and password you registered with.
        2. Navigate through the dashboard to explore features and opportunities.
        3. For any assistance, feel free to reach out to our support team.
        
        We are here to support you every step of the way as you build your career. Best wishes for your future endeavors!
        
        Warm regards,  
        The College Placement Team  `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});


app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await collection.findOne({ email: email });

    if (user) {
        const resetLink = `http://localhost:3000/reset-password?email=${email}`;

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: 'sivakavindratamilselvan@gmail.com',
                pass: 'lvnbdnftzntovzuh',
            },
        });

        const mailOptions = {
            from: 'sivakavindratamilselvan@gmail.com',
            to: email,
            subject: "Password Reset Link",
            text: `Hello,

We received a request to reset the password for your account. You can reset your password by clicking the link below:

http://localhost:3000/reset-password?email=sivakavindra@gmail.com

If you did not request this, please ignore this email.

Best regards,
Your Company Name
Click the following link to reset your password: ${resetLink}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: "Error sending email" });
            }
            res.json({ message: "emailSent" });
        });
    } else {
        res.json({ message: "emailNotFound" });
    }
});

app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await collection.findOne({ email: email });
        if (user) {
            await collection.updateOne(
                { email: email },
                { $set: { password: newPassword } }
            );
            return res.json({ message: 'done' });
        } else {
            return res.json({ message: 'userNotFound' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});