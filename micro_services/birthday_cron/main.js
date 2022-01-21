const axios = require('axios');
const cron = require('node-cron');

(async () => {
  const mumbai6amforSA8am = '0 6 * * *';
  let sec30 = '* * * * *';
  let now = new Date();
  now = now.toLocaleDateString();
  cron.schedule(mumbai6amforSA8am, () => {
    console.log(`[${now}] - `, 'Sending Birthday Messages.');
    axios.get(`http://nginx/api/user/happyBirthdayContacts`).then(res => {
      let contacts = res.data;
      console.log(contacts.map(ct => `${ct.name} ${ct.surname} ${ct.dob}`));
    }).catch(e => {
      console.error(e);
    });
  });
})();
