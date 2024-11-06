const hasAccessToAdminPanel = (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            return next();
        } else {
            return res.status(401).send('Unauthorized!');
        }
    } catch (err) {
        if (err.code === 'ECONNRESET') {
            return res.status(500).send('Connection was reset by the server');
        } else {
            return res.status(500).send('An unexpected error occurred');
        }
    }
};

export default hasAccessToAdminPanel;