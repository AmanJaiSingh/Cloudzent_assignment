require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Team = require('./models/Team');
const Incident = require('./models/Incident');
const bcrypt = require('bcryptjs');

const DEMO_PASSWORD = "password123";

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Create 3 Teams
        const teamsData = ["Backend Engineering", "Frontend Engineering", "DevOps / Infrastructure"];
        const teams = {};
        for (const tName of teamsData) {
            let t = await Team.findOne({ name: tName });
            if (!t) {
                t = await Team.create({ name: tName });
            }
            teams[tName] = t;
        }

        const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

        // Ensure 6 specific users exist
        const usersData = [
            { name: "Alice Backend", email: "alice@cloudzent.com", teamName: "Backend Engineering" },
            { name: "Bob Backend", email: "bob@cloudzent.com", teamName: "Backend Engineering" },
            { name: "Charlie Frontend", email: "charlie@cloudzent.com", teamName: "Frontend Engineering" },
            { name: "Diana Frontend", email: "diana@cloudzent.com", teamName: "Frontend Engineering" },
            { name: "Eve DevOps", email: "eve@cloudzent.com", teamName: "DevOps / Infrastructure" },
            { name: "Frank DevOps", email: "frank@cloudzent.com", teamName: "DevOps / Infrastructure" }
        ];

        const users = {};
        for (const u of usersData) {
            let dbUser = await User.findOne({ email: u.email });
            if (!dbUser) {
                dbUser = await User.create({
                    name: u.name,
                    email: u.email,
                    password: hashedPassword,
                    team_id: teams[u.teamName]._id
                });
            }
            users[u.name] = dbUser;
        }
        console.log(`Verified ${Object.keys(users).length} demo users.`);

        // Sample incidents payload mixed across teams
        const sampleIncidents = [
            // Backend Incidents
            { title: 'Database connection timeout', description: 'Primary database refusing connections.', severity: 'high', status: 'open', created_by: users["Alice Backend"]._id, assigned_to: users["Bob Backend"]._id, team_id: teams["Backend Engineering"]._id },
            { title: 'High latency on auth', description: 'Response times exceeding 2000ms.', severity: 'medium', status: 'investigating', created_by: users["Bob Backend"]._id, team_id: teams["Backend Engineering"]._id },

            // Frontend Incidents
            { title: 'Dashboard rendering crash', description: 'React hydration error on the main layout.', severity: 'high', status: 'investigating', created_by: users["Charlie Frontend"]._id, assigned_to: users["Diana Frontend"]._id, team_id: teams["Frontend Engineering"]._id },
            { title: 'Missing API tokens', description: 'Local storage wiped on Safari 14.', severity: 'medium', status: 'open', created_by: users["Diana Frontend"]._id, team_id: teams["Frontend Engineering"]._id },

            // DevOps Incidents
            { title: 'CI/CD Pipeline failing', description: 'Node out of memory error during build phase.', severity: 'high', status: 'open', created_by: users["Eve DevOps"]._id, assigned_to: users["Frank DevOps"]._id, team_id: teams["DevOps / Infrastructure"]._id },
            { title: 'SSL Certificate expiring', description: 'Cert expires in 2 days on production LB.', severity: 'low', status: 'resolved', created_by: users["Frank DevOps"]._id, team_id: teams["DevOps / Infrastructure"]._id }
        ];

        await Incident.insertMany(sampleIncidents);
        console.log(`Successfully created incidents across teams!`);

        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
