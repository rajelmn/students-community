export const isAuthenticated = (req, res, next) => {
    if(!req?.session?.isLoggedIn) {
       return res.status(403).json({message: "not logged in"})
    }
    else next()
}