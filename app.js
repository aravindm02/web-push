let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let webpush = require('web-push');
let app = express();

var uid;


var publicKey;
var privateKey;

const USER_SUBSCRIPTIONS = []

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cors());

app.get('/api/getVapId', (req, res) => {
  uid=req.body
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
  let body = ''
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

  Promise.resolve(USER_SUBSCRIPTIONS.map((sub) => webpush.sendNotification(sub, payload)))
    .then(() => res.status(200).json({
      message: 'Update Notification sent'
    }))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
})

app.post('/api/notify', (req, res) => {
  let body = ''
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
  // Promise.all(
  //     USER_SUBSCRIPTIONS.map((sub) => webpush.sendNotification(sub, data)),
  //   );
  //   return { message: 'Notifications sent successfully' };

  Promise.resolve(USER_SUBSCRIPTIONS.map((sub) => webpush.sendNotification(sub, payload)))
    .then(() => res.status(200).json({
      message: 'Notification sent'
    }))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
})

app.post('/api/subscribe', (req, res) => {
  let sub = req.body;
  res.set('Content-Type', 'application/json');
  webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    publicKey,
    privateKey
  );
  // USER_SUBSCRIPTIONS = sub
  USER_SUBSCRIPTIONS.length = 0;
  Promise.resolve(USER_SUBSCRIPTIONS.push(sub))
    .then(() => res.status(200).json({
      status: 1,
      message: 'Subscription added successfully',
      deviceId: uid
    }))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
  console.log(USER_SUBSCRIPTIONS);
  // return { message: 'Subscription added successfully' };
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
