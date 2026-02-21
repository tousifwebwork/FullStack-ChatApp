const { config } = require('dotenv');
const { connectDB } = require("../lib/db.js");
const User = require("../models/userModels.js");
const bcrypt = require('bcryptjs');

config();

const seedUsers = [
    {
        email: 'ali@gmail.com',
        fullname: 'Ali Khan',
        password: 'ali123',
        profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ali'
    },
    {
        email: 'ahmad@gmail.com',
        fullname: 'Ahmad Hassan',
        password: 'ahmad123',
        profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad'
    },
    {
        email: 'salman@gmail.com',
        fullname: 'Salman Ahmed',
        password: 'salman123',
        profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=salman'
    },
    {
        email: 'rehan@gmail.com',
        fullname: 'Rehan Malik',
        password: 'rehan123',
        profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rehan'
    },
    {
        email: 'fatima@gmail.com',
        fullname: 'Fatima Zahra',
        password: 'fatima123',
        profilePic: 'https://api.dicebear.com/7.x/lorelei/svg?seed=fatima'
    },
    {
        email: 'amina@gmail.com',
        fullname: 'Amina Rashid',
        password: 'amina123',
        profilePic: 'https://api.dicebear.com/7.x/lorelei/svg?seed=amina'
    },
    {
        email: 'hassan@gmail.com',
        fullname: 'Hassan Ibrahim',
        password: 'hassan123',
        profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hassan'
    },
    {
        email: 'noor@gmail.com',
        fullname: 'Noor Al-Rashid',
        password: 'noor123',
        profilePic: 'https://api.dicebear.com/7.x/lorelei/svg?seed=noor'
    },
    {
        email: 'karim@gmail.com',
        fullname: 'Karim Abdullah',
        password: 'karim123',
        profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=karim'
    },
    {
        email: 'layla@gmail.com',
        fullname: 'Layla Nasir',
        password: 'layla123',
        profilePic: 'https://api.dicebear.com/7.x/lorelei/svg?seed=layla'
    },
    {
        email: 'mohammed@gmail.com',
        fullname: 'Mohammed Saeed',
        password: 'mohammed123',
        profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed'
    },
    {
        email: 'zainab@gmail.com',
        fullname: 'Zainab Hussain',
        password: 'zainab123',
        profilePic: 'https://api.dicebear.com/7.x/lorelei/svg?seed=zainab'
    },
    {
        email: 'rashid@gmail.com',
        fullname: 'Rashid Al-Mansuri',
        password: 'rashid123',
        profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rashid'
    },
    {
        email: 'aisha@gmail.com',
        fullname: 'Aisha Malik',
        password: 'aisha123',
        profilePic: 'https://api.dicebear.com/7.x/lorelei/svg?seed=aisha'
    },
    {
        email: 'nasir@gmail.com',
        fullname: 'Nasir Al-Rashid',
        password: 'nasir123',
        profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nasir'
    },
    {
        email: 'hana@gmail.com',
        fullname: 'Hana Al-Saad',
        password: 'hana123',
        profilePic: 'https://api.dicebear.com/7.x/lorelei/svg?seed=hana'
    }
];

const hashAndSeed = async () => {
    try {
        await connectDB();
        
        // Hash all passwords
        const usersWithHashedPasswords = await Promise.all(
            seedUsers.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(user.password, 10)
            }))
        );
        
        // Clear existing users
        await User.deleteMany({});
        
        // Insert seeded users
        await User.insertMany(usersWithHashedPasswords);
        console.log("✅ Database seeded successfully with 16 users");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error.message);
        process.exit(1);
    }
};

hashAndSeed();