import { Router } from "express";
import { SearchContactsController } from "../Controllers/Contact.controller.js";
import { verifyToken } from "../Middlewares/Auth.middleware.js";


const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, SearchContactsController)








export default contactRoutes