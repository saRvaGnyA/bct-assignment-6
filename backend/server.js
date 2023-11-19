const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const web3Validator = require('web3-validator');
const LoginContract = require('./connect')
const bodyParser = require('body-parser');
const cors = require('cors');

const secret = "jwt-secret";

const app = express()
app.use(cors());
app.use(bodyParser.json())


app.post('/check', (req, res) => {
    const jwtDecoded = jwt.verify(req.body.jwt, secret);
    if (jwtDecoded['status'] === 'verified') {
        res.json({
            message: "Successfully authenticated!"
        });
    } else {
        res.json({
            message: "not authorized"
        });
    }
})

userChallengeDict = {}
validatedUsers = {}

app.post('/getChallengeString', (req, res) => {
    let userAddress = req.body.address;
    userAddress = userAddress.toLowerCase();

    if (!web3Validator.isAddress(userAddress)) {
        res.json({
            message: 'please enter valid ethereum address'
        });
        return;
    }

    const challengeString = uuidv4();
    userChallengeDict[userAddress] = challengeString;

    const jwtToken = jwt.sign({
        'userAddress': userAddress,
        'status': 'unverified'
    }, secret);

    res.json({
        'challengeString': challengeString,
        'jwtToken': jwtToken
    });
})


LoginContract.events.LoginRequest({}).on("data", data => {
    console.log(data);
    let userAddr = data.returnValues.user;
    userAddr = userAddr.toLowerCase();
    const challenge = data.returnValues.challengeString;
    if (userChallengeDict[userAddr] === challenge) {
        validatedUsers[userAddr] = true;
    }
})

app.post('/login', (req, res) => {
    let userAddress = req.body.address;
    userAddress = userAddress.toLowerCase();
    if (validatedUsers[userAddress]) {
        delete validatedUsers[userAddress];
        delete userChallengeDict[userAddress];

        const newToken = jwt.sign({
            'userAddress': userAddress,
            'status': 'verified'
        }, secret);

        res.json({
            'userAddress': userAddress,
            'jwtToken': newToken
        });
    } else {
        res.json({
            'message': 'not authenticated'
        });
    }
})

app.listen(5000);
