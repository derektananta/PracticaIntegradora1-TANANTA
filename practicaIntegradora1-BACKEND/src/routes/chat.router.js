import { Router } from "express";
export const router = Router()

router.get("/chat", (req, res) => {
    res.render("chat", {
      style: "index.css"
    })
  })
  