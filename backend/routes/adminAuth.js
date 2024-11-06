import express from 'express';
import passport from 'passport';

const authRouter = express.Router();


authRouter.get('/verify', async (req, res) => {
    try {
        if(req.isAuthenticated()){
            return res.status(200).send(req?.user);
        }else {
            return res.status(401).send('Unauthorized!');
        }
    } catch (err) {
        if (err.code === 'ECONNRESET') {
            return res.status(500).send('Connection was reset by the server');
        } else {
            return res.status(500).send('An unexpected error occurred');
        }
    }
})

authRouter.delete('/logout', (req, res, next) => {
    try {
        req.logout((err) => {
            if (err) {
                return res.status(500).send({ message: err });
            }
        });
        return res.status(200).send('Logged Out Successfully!!!');
    } catch (err) {
        return res.status(500).send({ message: err });
    }
});

authRouter.get('/google', passport.authenticate('google', {
    prompt: ['select_account'],
    scope: ['openid', 'email', 'profile']
}));

authRouter.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/unauthorized',
    failureMessage: true
}), (_, res) => {
    res.redirect(`${process.env.ADMIN_UI_URL}/`);
});

authRouter.get('/unauthorized', (req, res) => {
    const errorMessage = req.session.messages ? req?.session?.messages[0] : 'You are not authorized to access this website.';
    req.session.messages = [];

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unauthorized Access</title>
        <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
                color: #333;
                margin: 0;
                transition: background 0.3s;
            }
            .container {
                text-align: center;
                background-color: #ffffff;
                padding: 3rem;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                max-width: 400px;
                width: 100%;
                transition: transform 0.3s;
            }
            .container:hover {
                transform: scale(1.02);
            }
            .error-message {
                font-size: 1.5rem;
                margin-bottom: 1.5rem;
                color: #d9534f;
                font-weight: bold;
            }
            .countdown {
                font-size: 1.25rem;
                margin-top: 1.5rem;
                color: #555;
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            .fade-in {
                animation: fadeIn 1s ease-in-out;
            }
        </style>
    </head>
    <body>
        <div class="container fade-in">
            <div class="error-message">${errorMessage}</div>
            <p class="countdown">Redirecting to login page in <span id="countdown">5</span> seconds...</p>
        </div>

        <script>
            const loginUrl = '${process.env.ADMIN_UI_URL}/login';
            let countdown = 5;
            const countdownElement = document.getElementById('countdown');

            const timer = setInterval(() => {
                countdown--;
                countdownElement.textContent = countdown;
                if (countdown === 0) {
                    clearInterval(timer);
                    window.location.href = loginUrl;
                }
            }, 1000);
        </script>
    </body>
    </html>
    `;

    return res.status(401).send(htmlContent);
});



export default authRouter;