const express = require('express')
const app = express()
const path = require('path')
const mongo = require('./models/user')

app.set("view engine", 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

app.get("/", (req, res)=>{
    res.render("index")
})

app.get("/all", async (req, res)=>{
    let users = await mongo.find()
    res.render("users", {users})
})

app.get("/edit/:userid", async (req, res)=>{
    let user = await mongo.findOne({_id: req.params.userid})
    res.render("edit", {user})
})

app.post("/edit/:userid", async (req, res)=>{
    let userCreated = await mongo.findOneAndUpdate({_id: req.params.userid}, {
        name: req.body.name,
        mail: req.body.mail,
        image: req.body.image
    }, {new: true})
    res.redirect("/all")
})

app.post("/create", async (req, res)=>{
    let userCreated = await mongo.create({
        name: req.body.name,
        mail: req.body.mail,
        image: req.body.image
    })
    res.redirect("/all")
})

app.get("/delete/:id", async (req, res) => {
    await mongo.findOneAndDelete({_id: req.params.id})
    console.log(req.body.id)
    res.redirect("/all")
})

app.listen(3000)