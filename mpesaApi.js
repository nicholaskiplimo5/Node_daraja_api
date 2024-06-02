const { response } = require("express");
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const app = express();

app.use(express.json())
//routes
app.get("/", (req, res) => {
  //res.send("Hello world!!");
    // Use the path to your index.html file
    const indexPath = __dirname + '/index.html';
console.log(indexPath);
    // Send the index.html file as a response
    res.sendFile(indexPath);
});


const security_key="HhU/6mX+0JTLtHShOJXMG8vi/1+Yk1Mnvv8HUqtmlOpdJ/6ucXvkUswL6nMGLhDnVJqlpTuGq9T79jgHLTHOp0IyhM6S4GD/gI86KabNXvs/ei/WDhKgRc15gmORlkblE0HKi+ieh0DSJzMeK8TCWRW60M9MnBylpvnhWejEivbx+JwdFPiibvMPcBSXLSpziMEVYUFiaHDq23fpWsciy/CWoar5Mw30Vq+APCnMrIB296p8OHVHLR6XjeE+seTIF6NpgXgZALSEc+Ky5DULXa+hJPloJ09lDxg8LEErfTmTSsbpZOcLh2iU8450NV+Rq6p6CGCI6tbwG97JTsZOLw=="

//access token
app.get("/api/v1/access_token", access, (req, res) => {
  res.status(200).json({ access_token: req.access_token });
});



//register urls
app.get("/api/v1/register", access, (req, res) => {
  let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
  let auth = "Bearer " + req.access_token;
  request(
    {
      url: url,
      method: "POST",
      headers: {
        "Authorization": auth
      },
      json: {
        "ShortCode": "600383",
        "ResponseType": "Complete",
        "ConfirmationURL": "https://mydomain.com/confirmation",
        "ValidationURL": "https://mydomain.com/validation",
      }
    },
    (error, response, body) => {
      error ? console.log(error): res.status(200).json(body);
    }
  );
});

//confirmation urls
app.post('/api/v1/confirmation', (req, res) => {
    console.log('....................... confirmation .............')
    console.log(req.body)
})

//validation urls
app.post('/api/v1/validation', (req, resp) => {
    console.log('....................... validation .............')
    console.log(req.body)
})

app.get('/api/v1/simulate', access, (req, res)=>{
  let url='https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate';
  let auth="Bearer " + req.access_token;
  request(
    {
      url: url,
      method: "POST",
      headers: {"Authorization": auth},
      json:{
        "ShortCode": "600383",
        "CommandID": "CustomerPayBillOnline",
        "Amount": "100",
        "Msisdn": "254791980616",
        "BillRefNumber": "TestAPI"
      },
    },
    (error, response, body)=>{
      error ? console.log(error): res.status(200).json(body);
    }
  )
});

app.get('/api/v1/balance', access, (req, res)=>{
let url="https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query";
let auth= "Bearer "+ req.access_token
request(
  {
    url:url,
    method: "POST",
    headers: {
      "Authorization": auth
    },
    json:{
      "Initiator": "testapi",
      "SecurityCredential": security_key,
      "CommandID": "AccountBalance",
      "PartyA": "600992",
      "IdentifierType": "4",
      "Remarks": "bal",
      "QueueTimeOutURL": "https://mydomain.com/time_out",
      "ResultURL": "https://mydomain.com/results"

    }

  },
  (error, response, body)=>{
    error ? console.log(error): res.status(200).json(body);
  }
)
});

app.post('/api/v1/time_out', (req, res)=>{
  console.log("time out!!!")
  console.log(req.body)
})
app.post('/api/v1/results', (req, res)=>{
  console.log("Results")
  console.log(req.body)
})

app.post('/api/v1/stk', access, (req, res)=>{
    let url='https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    let auth= "Bearer " + req.access_token;
	  let phone=req.body.phone.substring(1);
	  let amount=req.body.amount;
    const date= new Date()
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 to get the month in the range 1-12 and padding with leading zero if needed
    const day = String(date.getDate()).padStart(2, '0'); // Padding with leading zero if needed
    const hours = String(date.getHours()).padStart(2, '0'); // Padding with leading zero if needed
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Padding with leading zero if needed
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Padding with leading zero if needed
    
    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
    
    console.log('timestamp1: '+timestamp);

    //let timestamp = date.getFullYear() + "" + "" + date.getMonth() + "" + "" + date.getDate() + "" + "" + date.getHours() + "" + "" + date.getMinutes() + "" + "" + date.getSeconds()
    const password= new Buffer.from('174379'+'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'+timestamp).toString('base64')
    console.log('date.getMonth(): '+date.getMonth());
    console.log('date.geth(): '+date.getHours());

    // Get the current timestamp in seconds

    request(
        {
            url: url,
            method: 'POST',
            headers:{
                "Authorization": auth
            },
            json:{
              "BusinessShortCode": 174379,
              "Password": password,
              "Timestamp": timestamp,
              "TransactionType": "CustomerPayBillOnline",
              "Amount": amount,
              "PartyA": `254${phone}`,
              "PartyB": 174379,
              "PhoneNumber": `254${phone}`,
              "CallBackURL": "https://mydomain.com/path",
              "AccountReference": "CompanyXLTD",
              "TransactionDesc": "Payment of X" 

            }
        }, (error, response, body)=>{
          error ? console.log(error): res.status(200).json(body);
        }
    )
  
    console.log(req.body)
    console.log(timestamp)
})
app.post('/api/v1/stk_callback', (req, res)=>{
  console.log('-------------------Stk results-----------------')
  console.log(req.body)
})

app.get('/api/v1/b2c', access,(req, res)=>{
    let url='https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest';
    let auth= 'Bearer ' + req.access_token;

    request (
        {
            url: url,
            method:'POST',
            headers: {
                "Authorization": auth
            },
            json:{
              "InitiatorName": "testapi",    
              "SecurityCredential": security_key, 
              "CommandID": "BusinessPayment",    
              "Amount": "1000",    
              "PartyA": "600977",    
              "PartyB": "254708374149",    
              "Remarks": "here are my remarks",    
              "QueueTimeOutURL": "https://mydomain.com/b2c_timeout",    
              "ResultURL": "https://mydomain.com/b2c_results",    
              "Occassion": "Christmas"
            }
        }, (error, response, body)=>{
          error ? console.log(error): res.status(200).json(body);
        }
    )
    //console.log('c2b here')
})
app.post('/api/v1/b2c_timeout', (req, res)=>{
  console.log('b2c timeout')
  console.log(req.body)

})
app.post('/api/v1/b2c_results', (req, res)=>{
  console.log('b2c results')
  console.log(req.body)
})


app.get('/api/v1/reversal',access, (req, res)=>{
  let url='https://sandbox.safaricom.co.ke/mpesa/reversal/v1/request'
  let auth= "Bearer "+ req.access_token

  request({
    method: "POST",
    uri: url,
    headers:{
      "Authorization": auth
    },
    json:{ 
      "Initiator": "TestInit610",
      "SecurityCredential": security_key,
      "CommandID": "TransactionReversal",
      "TransactionID": "RI22QAP2T0",
      "Amount": "1",
      "ReceiverParty": "600610",
      "RecieverIdentifierType": "4",
      "ResultURL": "https://mydomain.com/reversal_timeout",
      "QueueTimeOutURL": "https://mydomain.com/reversal_results",
      "Remarks": "please",
      "Occasion": "work"

    }
  }, (error, response, body)=>{
    error ? console.log(error): res.status(200).json(body)
  }
  )
})
app.post('/api/v1/reversal_timeout', (req, res)=>{
  console.log('reversal timeout')
  console.log(req.body)

})
app.post('/api/v1/reversal_results', (req, res)=>{
  console.log('reversal results')
  console.log(req.body)
})
//access function https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
function access(req, res, next) {
  let url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    let auth = new Buffer.from("IcVbligM1Air19vrYPLrLqwGGmDEqpWS:PGzA2XMB2f0pCnAp").toString("base64");
  request(
    {
      url: url,
      headers: {
        "Authorization": "Basic " + auth,
      }
    },
    (error, response, body) => {
      if (error) {
        console.log(error);
      } else {
        //res.status(200).json(body);
        req.access_token = JSON.parse(body).access_token;
        next();
      }
    }
  );
}
//listening port
const PORT= process.env.PORT || 3001
app.listen(PORT, (error)=>{
  error ? console.log(error): console.info(`Server running on port: ${PORT}`)
})
