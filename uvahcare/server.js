const express = require('express')
const path = require('path')
const {
  get
} = require('request')
const ejs = require("ejs");
const app = express()
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static("public"));
const viewsDir = path.join(__dirname, 'views')
app.use(express.static(viewsDir))
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.redirect('/index.html'))


//setting the mailchimp server
const mailchimp = require("@mailchimp/mailchimp_marketing");
//Requiring express and body parser and initializing the constant "app"

const bodyParser = require("body-parser");

//The public folder which holds the CSS

//Using bod-parser
//Listening on port 3000 and if it goes well then logging a message saying that the server is running

//Sending the signup.html file to the browser as soon as a request is made on localhost:3000

//Setting up MailChimp
mailchimp.setConfig({
  //*****************************ENTER YOUR API KEY HERE******************************
  apiKey: process.env.MAILCHIMP_API_KEY || '8d2c69e2d987f90483216344ace91dc5-us18',
  //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
  server: process.env.MAILCHIMP_KEY_PREFIX || 'us18'
});
//As soon as the sign in button is pressed execute this
app.post("/", function(req, res) {
  //*****************************CHANGE THIS ACCORDING TO THE VALUES YOU HAVE ENTERED IN THE INPUT ATTRIBUTE IN HTML******************************
  var name = req.body.name;
  var email = req.body.email;
  var country = req.body.country;
  var contact = req.body.contact;
  var message = req.body.address;
  console.log(name, email, country, contact, message);
  //*****************************ENTER YOU LIST ID HERE******************************
  const listId = process.env.MAILCHIMP_LIST_ID || '716c09449c';
  //Creating an object with the users data
  var subscribingUser = {
    Name: name,
    email: email,
    contact: contact,
    country: country,
    message: message
  };
  //Uploading the data to the server
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.Name,
        LNAME: subscribingUser.Name,
        ADDRESS: {
           addr1: subscribingUser.message,
           city: "--",
           state: "--",
           zip: "--",
           country:subscribingUser.country

     },
        PHONE: subscribingUser.contact
      },
      notify_on_subscribe:true

    });
    //If all goes well logging the contact's id
    res.sendFile(__dirname + "/views/succesful.html")
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${
 response.id
 }.`
    );
  }
  //Running the function and catching the errors (if any)
  // ************************THIS IS THE CODE THAT NEEDS TO BE ADDED FOR THE NEXT LECTURE*************************
  // So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
  run().catch(e => res.sendFile(__dirname + "/views/failure.html"));
});
//setting the server
app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000!'))

function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function(resolve, reject) {
    const options = Object.assign({}, {
        url,
        isBuffer: true,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
      },
      returnBuffer ? {
        encoding: null
      } : {}
    )

    get(options, function(err, res) {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}
