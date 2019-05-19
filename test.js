const https = require('http')
const inputData = {
  firstName: 'janker',
  lastName: 'zhang',
  email: 'janker@test.com',
  phone: '15801749899'
}
const {firstName, lastName, email, phone} = inputData;
const data = JSON.stringify({
  row: ['', firstName, lastName, email, phone]
})

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

const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', (d) => {
    console.log('write data...success');
    process.stdout.write(d)
  })
})

req.on('error', (error) => {
  console.error(error)
})

req.write(data)
req.end();
