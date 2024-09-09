// Middleware de autenticación y autorización basado en roles
export const auth = (roles = []) => {
    return (req, res, next) => {
        // Verifica si el usuario está autenticado
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            console.log('No autenticado'); // Log para depuración
            return res.status(401).json({ message: 'No autenticado' }); // Respuesta 401: no autenticado
        }

        const user = req.user; // Obtiene la información del usuario autenticado
        if (!user) {
            console.log('Usuario no encontrado'); // Log si no se encuentra el usuario
            return res.status(403).json({ message: 'Usuario no encontrado' }); // Respuesta 403: usuario no encontrado
        }

        // Verifica si el rol del usuario está permitido
        if (!roles.includes(user.rol)) {
            console.log(`No autorizado: se requiere rol ${roles}`); // Log si el rol no es suficiente
            return res.status(403).json({ message: 'No autorizado' }); // Respuesta 403: no autorizado
        }

        // Si el usuario está autenticado y tiene el rol adecuado
        console.log(`Autorizado: ${user.email} con rol ${user.rol}`); // Log de autorización exitosa
        next(); // Continúa con el siguiente middleware o la función del controlador
    };
};
