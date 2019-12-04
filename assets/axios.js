 const getBtn = document.getElementById('get-btn');
 let userNameInput = 'michaelrobil';
 let profileImage;
 let userName;
 let userLocation;
 let userProfileLink;
 let userBlog;
 let userBio;
 let numberOfPR;
 let numberOfFollowers;
 let numberOfFollowing;

 function loadImage(url) {
     return new Promise((resolve) => {
         let img = new Image();
         img.onload = () => resolve(img);
         img.src = url;
     })
 }
 const getData = () => {
     userNameInput = $('#username').val();
     axios.get(`https://api.github.com/users/${userNameInput}`).then(response => {
         // console.log(response);
         profileImage = response.data.avatar_url

         userName = `My name is ${response.data.login}!`
         userLocation = response.data.location
         userProfileLink = `${response.data.html_url}`;
         userBlog = `${response.data.blog}`
         userBio = `Bio :${response.data.bio}`
         numberOfPR = `Number of Public Repos :${response.data.public_repos}`
         numberOfFollowers = `Number of Followers :${ response.data.followers}`
         numberOfFollowing = `Number of Following :${response.data.following}`

         loadImage(`${profileImage}`).then((logo) => {
             let doc = new jsPDF("p", "mm", [600, 750]);
             doc.setDrawColor(0);
             doc.setFillColor(0, 172, 224);
             doc.rect(00, 00, 250, 80, 'F');
             doc.rect(00, 190, 250, 80, 'F');
             doc.setFillColor(0, 89, 116);
             doc.rect(5, 25, 201, 70, 'F');

             doc.setFontSize(30).setTextColor(175, 236, 255).setFontType("bold").text(105, 70, `Hi!`);
             doc.text(50, 80, `${userName}`);
             doc.addImage(logo, ("JPEG"), 90, 15, 40, 40);
             doc.setFontSize(10).setTextColor(175, 236, 255).textWithLink(`${userLocation}`, 70, 90, { url: `${userLocation}` });
             doc.textWithLink('GitHub', 110, 90, { url: `${userProfileLink}` });
             doc.textWithLink('Blog', 130, 90, { url: `${userBlog}` });
             doc.setFontSize(10).setTextColor(0, 74, 97);
             let splitTitle = doc.splitTextToSize(userBio, 120);
             doc.text(50, 110, splitTitle);

             doc.rect(20, 120, 70, 20, 'F').setFillColor(0, 89, 116);
             doc.rect(120, 120, 70, 20, 'F');
             doc.rect(70, 160, 70, 20, 'F');

             doc.setTextColor(175, 236, 255).setFontSize(14).text(22, 130, `${numberOfPR}`);
             doc.text(122, 130, `${numberOfFollowers}`);
             doc.text(72, 170, `${numberOfFollowing}`);

             doc.save(`${response.data.login}.pdf`);
         });
     });
 };
 getBtn.addEventListener('click', getData);
 $('#username').on("click", '#get-btn', event => {
     event.preventDefault();
     getData();
     $('#username').empty();
 });