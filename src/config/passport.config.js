import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { UsersManagerMongo as UsuariosManager } from "../dao/controllers/UserManagerDB.js";
import { createCartService } from "../services/cartsServiceDB.js";
import { generaHash, validatePassword } from "../utils.js";
import UserDTO from "../dao/DTOs/sessionsDTO.js";
import { config } from "./config.js";

const usuariosManager = new UsuariosManager();

export const initPassport = () => {
    // Estrategia de autenticación con GitHub
    passport.use(
        "github",
        new github.Strategy(
            {
                clientID: config.clientID,
                clientSecret: config.clientSecret,
                callbackURL: config.callbackURL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile._json.email;
                    const nombre = profile._json.name;

                    if (!email) return done(null, false);

                    let usuario = await usuariosManager.getBy({ email });
                    if (!usuario) {
                        usuario = await usuariosManager.create({ nombre, email, profile });
                        const carrito = await createCartService();
                        await usuariosManager.update({ email }, { cart: carrito._id });
                    }
                    return done(null, usuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // Estrategia de registro local
    passport.use(
        "registro",
        new local.Strategy(
            {
                passReqToCallback: true,
                usernameField: "email",
            },
            async (req, email, password, done) => {
                try {
                    const { nombre, age } = req.body;

                    if (!nombre || await usuariosManager.getBy({ email })) {
                        return done(null, false);
                    }

                    const hashPassword = generaHash(password);
                    const newUser = await usuariosManager.create({ nombre, age, email, password: hashPassword });
                    const carrito = await createCartService();

                    await usuariosManager.update({ email }, { cart: carrito._id });
                    return done(null, new UserDTO(newUser));
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // Estrategia de inicio de sesión local
    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email",
            },
            async (email, password, done) => {
                try {
                    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
                        return done(null, {
                            _id: "664a79992bfb5d2b228a8f9a",
                            nombre: "admin",
                            email,
                            carrito: { _id: "6684bcfca12ca8e5db86e2ad" },
                            rol: "admin",
                        });
                    }

                    let usuario = await usuariosManager.getBy({ email });
                    if (!usuario || !validatePassword(password, usuario.password)) {
                        return done(null, false);
                    }

                    if (!usuario.cart) {
                        const carrito = await createCartService();
                        await usuariosManager.update({ email }, { cart: carrito._id });
                    }

                    return done(null, new UserDTO(usuario));
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // Serialización del usuario
    passport.serializeUser((userDTO, done) => {
        return done(null, userDTO._id);
    });

    // Deserialización del usuario
    passport.deserializeUser(async (id, done) => {
        try {
            let usuario;

            if (id === "664a79992bfb5d2b228a8f9") {
                usuario = {
                    _id: "664a79992bfb5d2b228a8f9",
                    nombre: "admin",
                    email: "adminCoder@coder.com",
                    cart: { _id: "6684bcfca12ca8e5db86e2ad" },
                    rol: "admin",
                };
            } else {
                usuario = await usuariosManager.getBy({ _id: id });
            }

            if (!usuario) return done(null, false);

            return done(null, new UserDTO(usuario));
        } catch (error) {
            return done(error);
        }
    });
};
