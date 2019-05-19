const https = require('http');
const DT = (new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"})).split(", ");
const optInData = DT[0];
const optInTime = DT[1];
const {firstName, lastName, email, phone} = inputData;

const data = JSON.stringify({
  row: ['', optInData, optInTime, firstName, lastName, phone, email, '','','','','','' ],
  sid: '1xC55jVIY8DQAoJqyZz_JFdA7K2wrli2kc5JPKE93usc',
  activity: 'new'
});

const options = {
  hostname: '149.28.214.40',
  port: 3000,
  path: '/ggs/update-row',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}
const snooze = opts => {
  return new Promise((resolve, reject) => {
    const req = https.request(opts, res => {
      res.on('data', d => {
        process.stdout.write(d)
      })
    })
    req.on('response', res=>{
      resolve(res);
    })
    req.on('error', (error) => {
      reject();
    })
    req.write(data)
    req.end();
  })
}

const sleepy = async () => {
  await snooze(options);
  return 'ok';
};
output = {data: sleepy()}
