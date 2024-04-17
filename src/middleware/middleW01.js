export const middleware01 = (req, res, next) => {
    // Este middleware pasa la solicitud al siguiente middleware sin realizar ninguna acción.
    next();
};

export const middleware02 = (req, res, next) => {
    // Este middleware convierte el parámetro 'nombre' en mayúsculas y agrega un mensaje adicional.
    if (req.query.nombre) {
        req.query.nombre = req.query.nombre.toUpperCase() + ' le gusta programar';
    }
    req.codigo = "CoderCoder123";
    next();
};

export const middleware03 = (req, res, next) => {
    // Este middleware registra información sobre la solicitud en la consola.
    console.log(`'Paso por middleware 03', URL: ${req.url}, Método: ${req.method}`);
    next();
};

export const auth = (req, res, next) => {
    // Middleware de autenticación que verifica las credenciales del usuario.
    let { usuario, password } = req.query;
    if (!usuario || !password) {
        res.setHeader('content-text', 'application/json');
        return res.status(400).json({ error: "Complete usuario y password" });
    }

    if (usuario !== 'admin' || password !== "codercoder") {
        res.setHeader('content-text', 'application/json');
        return res.status(401).json({ error: "Credenciales inválidas" });
    }

    next();
};

export const errorHandler = (error, req, res, next) => {
    // Middleware para manejar errores inesperados.
    if (error) {
        console.error(error);
        res.setHeader('content-text', 'application/json');
        return res.status(500).json({
            error: "Error inesperado del servidor - Intente más tarde",
            detalle: `${error.message}`
        });
    }
    next();
};
