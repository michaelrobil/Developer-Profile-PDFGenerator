const PDFDocument = require('pdfkit');
const fs = require('fs');
const axios = require('axios');
const inquirer = require("inquirer");
var request = require('request');
let profileImage;
let userLocation;
let userProfileLink;
let userBlog;
let userBio;
let numberOfPR;
let numberOfFollowers;
let numberOfFollowing;

var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};



getData();

async function getData() {
    try {
        const { userNameInput } = await inquirer.prompt({
            message: "Github User Name :",
            name: "userNameInput",
        });
        await axios.get(`https://api.github.com/users/${userNameInput}`).then(response => {
            profileImage = response.data.avatar_url;
            download(`${profileImage}`, (response.data.login + ".jpeg"), function() {});
            download(`${profileImage}`, (response.data.login + ".png"), function() {});
            console.log("Image Done!")

        });

        await axios.get(`https://api.github.com/users/${userNameInput}`).then(response => {
            // profileImage = response.data.avatar_url;
            // download(`${profileImage}`, (response.data.login + ".jpeg"), function() {});
            // download(`${profileImage}`, (response.data.login + ".png"), function() {});


            let userName = `My name is ${response.data.login}!`
            userLocation = response.data.location;
            userProfileLink = `${response.data.html_url}`;
            userBlog = `${response.data.blog}`
            userBio = `Bio :${response.data.bio}`
            numberOfPR = `Number of Public Repos :${response.data.public_repos}`
            numberOfFollowers = `Number of Followers :${ response.data.followers}`
            numberOfFollowing = `Number of Following :${response.data.following}`
                //create pdf
            const doc = new PDFDocument;
            //add colored boxes
            doc.rect(0, 0, 650, 300);
            doc.rect(0, 520, 650, 280);
            doc.rect(50, 450, 230, 40);
            doc.rect(350, 450, 200, 40);
            doc.fill("#005a75");
            doc.rect(210, 550, 200, 40);
            doc.fill("#5ed2f5");
            //write in pdf
            doc.image((response.data.login + ".jpeg"), 240, 30, { fit: [170, 170] });
            doc.image((response.data.login + ".png"), 240, 30, { fit: [170, 170] });
            doc.lineWidth(12);
            doc.lineJoin('bevel')
                .rect(235, 25, 175, 175)
                .stroke();
            doc.pipe(fs.createWriteStream(`${userNameInput}.pdf`));
            doc.fontSize(30).fill("#5ed2f5").text(`Hi!`, 300, 210);
            doc.text(`${userName}`, 170, 240);
            doc.fontSize(12).fillColor('#5ed2f5').text(`${userLocation}`, 190, 280, {
                link: `https://www.google.com/maps/place/${userLocation}`,
                underline: false
            });
            doc.text('GitHub', 300, 280, {
                link: `${userProfileLink}`,
                underline: false
            });
            doc.text('Blog', 390, 280, {
                link: `${userBlog}`,
                underline: false
            });
            doc.fontSize(20).fill("#005a75").text(`${userBio}`, 120, 310);
            doc.fill("#5ed2f5").fontSize(16).text(`${numberOfPR}`, 65, 465);
            doc.text(`${numberOfFollowers}`, 370, 465);
            doc.fill("#005a75").text(`${numberOfFollowing}`, 230, 565);
            // Finalize PDF file
            doc.end();
            console.log("Done!")
        });
    } catch (err) {
        console.log(err);
    }
}