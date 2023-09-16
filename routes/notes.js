const express = require('express')
const fetchuser=require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const router=express.Router();
router.use(fetchuser)
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try {
        const notes=await Note.find({user: req.user.id})
        res.json(notes);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    const notes=await Note.find({user: req.user.id})
    res.json(notes);
})
router.post('/addnotes',[
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description length must be 4').isLength({min:4}),
],async (req,res)=>{
    try {
        const{title,description,tag}=req.body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note=new Note({
            title,description,tag,user:req.user.id
        })
        const savednote=await note.save()
        res.json(savednote)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
router.put('/updatenotes/:id',fetchuser,async (req,res)=>{
    
        const{title,description,tag}=req.body
        const newnote={};
if(title){newnote.title=title}
if(description){newnote.description=description}
if(tag){newnote.tag=tag}
let note=await Note.findById(req.params.id)
if(!note){
    return res.status(404).send("Not Found")
}
if(note.user.toString()!=req.user.id){
    return res.status(401).send("Not Allowed")
}
note=await Note.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true})
res.json(note)
})
router.delete('/deletenotes/:id',fetchuser,async (req,res)=>{
    
    const{title,description,tag}=req.body
    const newnote={};
let note=await Note.findById(req.params.id)
if(!note){
return res.status(404).send("Not Found")
}
if(note.user.toString()!=req.user.id){
return res.status(401).send("Not Allowed")
}
note=await Note.findByIdAndDelete(req.params.id)
res.json({"Suceess":"Note has been deleted",note:note})
})
module.exports=router;