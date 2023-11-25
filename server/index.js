const express = require('express');
const {createClient}=require('redis');
const cors=require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

let aprs = {
  polygon: 8,
  avalanche: 9,
};

// Endpoint to get APR
async function connectRedis() {
  const client = createClient({
    password: process.env.PASSWORD,
    socket: {
        host: process.env.HOST,
        port: 17861
    }
});
await client.connect();
return client;
}
app.get('/getAPR', async (req, res) => {
  const { network } = req.query;
  const client = await connectRedis();

  if (!network) {
    return res.status(400).json({ error: 'Network parameter is required.' });
  }

  const apr = await client.get(network);

  if (apr === undefined) {
    return res.status(404).json({ error: 'APR not found for the specified network.' });
  }

  res.json({ network, apr });
});

// Endpoint to set APR
app.post('/setAPR', async (req, res) => {
  const { network, apr } = req.body;
  const client =await connectRedis();

  if (!network || !apr) {
    return res.status(400).json({ error: 'Network and APR are required in the request payload.' });
  }

  if (aprs[network] === undefined) {
    return res.status(404).json({ error: 'APR not found for the specified network.' });
  }

  await client.set(network,apr);
  res.json({ message: `APR for ${network} set to ${apr}%` });
});
app.get('/currentStakedNetwork', async (req, res) => {
  const client =await connectRedis();
  const network=await client.get('currentNetwork');
  res.json({success:true,network});
})
app.post('/setcurrentStakedNetwork', async (req, res) => {
  const client =await connectRedis();
  const { network } = req.body;
  await client.set('currentNetwork',network);
  res.json({success:true,message:'Setted the current staked network'})
})
if(process.env.ENVIRONMENT==="lambda"){
  module.exports.handler=serverless(app);
}
else{
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
