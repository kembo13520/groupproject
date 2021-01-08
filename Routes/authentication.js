const router = require('express').Router();
const Users = require('../model/Users');
const brcypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation')


router.post('/register', async (req,res) => {

    //LETS VALIDATE THE DATA BEFORE WE A USER
    const {error} = registerValidation(req.body);
    if (error) return res.send(error.details[0].message);

    //Check if the user is already in the database
    const emailExist = await Users.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send('Email already exist');

    //Hash the password
    const salt = await brcypt.genSalt(10);
    const hashedPassword = await brcypt.hash(req.body.password, salt);


    //Create a new user
    const user = new Users({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    try {
        const savedUsers = await user.save();
        res.send(savedUsers);
    } catch (error) {
        res.status(400).send(error)
    }
});

//LOGIN
router.post('/login',async (req,res) => {
     //LETS VALIDATE THE DATA BEFORE WE A USER
     const {error} = loginValidation(req.body);
     if (error) return res.send(error.details[0].message);

     //Check if the email exist
    const user = await Users.findOne({email:req.body.email});
    if(!user) return res.status(400).send('No email found'); 

    //Check if the password is correct
    const validPass = await brcypt.compare(req.body.password, user.password)
    if(!validPass) res.status(400).send('Password inccorect')

    //Create and asign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

    // res.send('Lock in successfull')
});

module.exports = router;