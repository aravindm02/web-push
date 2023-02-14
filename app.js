let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let webpush = require('web-push');
let app = express();

var uid;


var publicKey;
var privateKey;

const USER_SUBSCRIPTIONS = []

var subsList=[]

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cors());

app.get('/api/getVapId', (req, res) => {
  let newVapId = webpush.generateVAPIDKeys()
  publicKey = newVapId.publicKey
  privateKey = newVapId.privateKey
  console.log('VAP ID', newVapId);
  res.send(newVapId);
});

app.get('/api/', (req, res) => {
  res.send('This is a push notification server use post');
});

app.post('/api/triggerNotification', (req, res) => {
  let id = req.body.id
  res.set('Content-Type', 'application/json');
  let payload = JSON.stringify({
    "notification": {
      "title": "Notification",
      "body": "Please update your app",
      "icon": "https://www.wegot.in/images/logo.svg",
      "data": {
        "url": "https://devnemo.wegotaqua.com/pwa/#/home"
      }
    }
  });

  USER_SUBSCRIPTIONS.map((res) => {
    if(res.deviceId==id){
      webpush.setVapidDetails(
        'mailto:example@yourdomain.org',
        res.publicKey,
        res.privateKey
      );
      webpush.sendNotification(res.sub, payload)
    }else return
   res.status(200).json({
      message: 'Update Notification sent'
    })
    // .catch(err => {
    //   console.error(err);
    //   res.sendStatus(500);
    })
})

app.post('/api/notify', (req, res) => {
  console.log("id",req.body)
  let id = req.body.id
  res.set('Content-Type', 'application/json');
  let payload = JSON.stringify({
    "notification": {
      "title": "WEGot ",
      "body": "Thanks for subscribing to my channel",
      "icon": "https://www.wegot.in/images/logo.svg",
      "data": {
        "url": "https://devnemo.wegotaqua.com/pwa/#/home"
      }
    }
  });
  console.log("id",id)
  console.log("notify subs",USER_SUBSCRIPTIONS)
  // let subs=subsList.filter(e=>e.uid)
  // Promise.all(USER_SUBSCRIPTIONS.map((res) => webpush.sendNotification(res.sub, payload)))
    USER_SUBSCRIPTIONS.map((res) => {
      // if(res.deviceId==id){
        webpush.setVapidDetails(
          'mailto:example@yourdomain.org',
          res.publicKey,
          res.privateKey
        );
        webpush.sendNotification(res.sub, payload)
      // }else return
    })
   
      res.status(200).json({
      message: 'Notification sent'
      })
      // console.log("subs",USER_SUBSCRIPTIONS)
    // .catch(err => {
    //   console.error(err);
    //   res.sendStatus(500);
    // })
})

app.post('/api/subscribe', (req, res) => {
  let sub = req.body?.subscription;
  uid = req.body?.uid;
  res.set('Content-Type', 'application/json');
  webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    publicKey,
    privateKey
  );
  //  subsList.push(req.body)
  // USER_SUBSCRIPTIONS.length = 0;
    USER_SUBSCRIPTIONS.push({
    "sub":sub,
    "deviceId":uid,
    "publicKey":publicKey,
    "privateKey":privateKey
   })
    res.status(200).json({
      status: 1,
      message: 'Subscription added successfully',
      deviceId: uid
    })
    // .catch(err => {
    //   console.error(err);
    //   res.sendStatus(500);
    // })
  console.log(USER_SUBSCRIPTIONS);
})

app.post('/api/postToken', (req, res) => {
  let token = req.body;
  res.set('Content-Type', 'application/json');
  // let payload = JSON.stringify({
  //   "notification": {
  //     "title": "WEGot ",
  //     "body": "Thanks for subscribing to my channel",
  //     "icon": "https://www.wegot.in/images/logo.svg"
  //   },
  //   "to":"/topics/all",
  // });
})

app.post('/api/broadcast', (req, res) => {
  let body = ''
  res.set('Content-Type', 'application/json');
  let payload = JSON.stringify({
    "notification": {
      "title": "WEGot ",
      "body": "Sent notification to all user",
      "icon": "https://www.wegot.in/images/logo.svg",
      "data": {
        "url": "https://devnemo.wegotaqua.com/pwa/#/home"
      }
    }
  });
  // Promise.all(
  //     USER_SUBSCRIPTIONS.map((sub) => webpush.sendNotification(sub, data)),
  //   );
  //   return { message: 'Notifications sent successfully' };

  Promise.resolve(USER_SUBSCRIPTIONS.map((sub) => webpush.sendNotification(sub, payload)))
    .then(() => res.status(200).json({
      message: 'Notification sent as broadcast'
    }))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
})

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
