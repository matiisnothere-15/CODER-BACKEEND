import dotenv from "dotenv"

dotenv.config({
    path: "./src/.env",
    override: true
})

export const config={
    PORT: process.env.PORT||3001,
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
    SECRET: process.env.SECRET,
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret ,
    callbackURL: process.env.callbackURL,
    ENTORNO: process.env.ENTORNO||"test",
    RESET_PASSWORD_URL: process.env.RESET_PASSWORD_URL,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
}