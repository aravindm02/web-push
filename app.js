let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let webpush = require('web-push');
let app = express();

// console.log(webpush.generateVAPIDKeys());

const publicKey='BK51L9mfjEzKIpUZOsYSqprvVLO5daVjqGsusTQDHKnkAgV0hoERDuOg_yT2k94wG7kRuyDTv64oFoQQLS8hjAY'
const privateKey='WwuFzSYWQThXGGq72cdlITTRUId1Iri7C_051pD83eM'

const USER_SUBSCRIPTIONS=[]

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('This is a push notification server use post');
});

app.post('/triggerNotification', (req, res) => {
    let body=''
    res.set('Content-Type', 'application/json');
    let payload = JSON.stringify({
    "notification": {
      "title": "Notification",
      "body": "Please update your app",
      "icon": "https://www.wegot.in/images/logo.svg"
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

app.post('/notify', (req, res) => {
    let body=''
    res.set('Content-Type', 'application/json');
    let payload = JSON.stringify({
      "notification": {
        "title": "WEGot ",
        "body": "Thanks for subscribing to my channel",
        "icon": "https://www.wegot.in/images/logo.svg"
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

app.post('/subscribe', (req, res) => {
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
      message: 'Subscription added successfully'
    }))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
    console.log(USER_SUBSCRIPTIONS);
    // return { message: 'Subscription added successfully' };
  })

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
