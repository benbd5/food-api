const jwt = require('jsonwebtoken')

// Intercepteur de validation d'authentification pa jwt
const withAuth = (req, res, next) => {
  // On cherche le header Authorization dans la requête
  if (req.headers.authorization) {
    // On extrait le token car le format dans le header est "Bearer <token>"
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).send('Unauthorized: No token provided')

    // On vérifie l'authenticité du token avec la phrase secrète
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) return res.status(401).send('Unauthorized: invalid Token')

      /* // Vérification de l'expiration du token
      // Optionnel car la fonction verify au dessus gère le temps
      const now = new Date().getTime() / 1000

      // Si l'expiration du token est inférieure à l'heure actuelle
      if (decoded.exp < now) return res.send('Unauthorized: Token expired') */
      next()
    })
  } else {
    res.status(401).send('Unauthorized: No authorization Header')
  }
}

module.exports = withAuth
