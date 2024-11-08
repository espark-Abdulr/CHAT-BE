import { Router } from "express";
import { GetAllContacts, GetAllContactsForDmController, SearchContactsController } from "../Controllers/Contact.controller.js";
import { verifyToken } from "../Middlewares/Auth.middleware.js";


const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, SearchContactsController)
contactRoutes.get("/get-contacts-dm", verifyToken, GetAllContactsForDmController)
contactRoutes.get("/get-all-contacts", verifyToken, GetAllContacts)








export default contactRoutes