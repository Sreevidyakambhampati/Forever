import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import managementModel from './models/managementModel.js';
import connectDB from './config/mongodb.js'

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            await connectDB();
            const email = profile?.emails[0]?.value;
            if (!email) {
                return done(null, false, { message: 'Email not provided' });
            }
            let user = await managementModel.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            if (user?.profileImage !== profile?.photos[0]?.value) {
                try {
                    await managementModel.findByIdAndUpdate(user?.id, {
                        $set: {
                            profileImage: profile?.photos[0]?.value,
                            name: profile?.displayName,
                        }
                    });
                } catch (err) { }
            }
            done(null, user);
        } catch (err) {
            done(err, false, { message: err });
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        await connectDB();
        const user = await managementModel.findById(id);
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        done(null, user);
    } catch (err) {
        done(err, false, { message: err?.message || err });
    }
});