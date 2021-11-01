const accountSid = process.env.TWILIO_SID;
const twilioNumber = process.env.TWILIO_NUMBER;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

class Twilio {

  constructor() {
    this.headers = {
      'Content-Type': 'text/xml;charset=UTF-8'
    };
  }

  async send(contact, message) {
    console.log("TRY SEND \n Message: ", message, '\n NUMBER: ', this.parseContact(contact))
    try {
      const { response } = await client.messages
        .create({
          body: message,
          from: twilioNumber,
          to: this.parseContact(contact)
        })
      console.warn("SMS RESPONSE", response);
      return response;
    } catch (err) {
      throw err;
    }
  }
  parseContact(ct) {
    if (ct[0] === '0' && ct.length === 10) {
      ct = '+27'  + ct.substring(1, ct.length);
    }
    return ct;
  }
  commentMade(contact, comment, adminName, propDesc, milestone, footer) {
    const preMessage = adminName + ' added a comment: ' + propDesc + '. ' + milestone + '. ';
    let lengthPreComment = preMessage.length + footer.length + 2; // get length of sms body without comment
    let totalLength = comment.length + lengthPreComment;
    if ( totalLength > 740 ) {
      // console.log('total Length: ' + totalLength);
      let overflow = totalLength - 740;
      // console.log('overflow: ' + overflow);
      let cutIndice = comment.length - overflow;
      comment = comment.substring(0, cutIndice);
    }
    const message = adminName + ' added a comment: ' + propDesc + '. ' + milestone + '. ' + comment + '. ' + footer;
    // console.log('final total length: ' + message.length);
    return this.send(contact, message)
      .then(res => {}).catch(err => {
        console.log(err);
      });
  }
  summaryAdded(contact, summary, adminName, propDesc, fileRef, footer) {
    const preMessage = adminName + ' added a summary progress report: ' + propDesc + '. ' + fileRef + '. ';
    let lengthPreComment = preMessage.length + footer.length + 2; // get length of sms body without comment
    let totalLength = summary.length + lengthPreComment;
    if ( totalLength > 740 ) {
      // console.log('total Length: ' + totalLength);
      let overflow = totalLength - 740;
      // console.log('overflow: ' + overflow);
      let cutIndice = summary.length - overflow;
      summary = summary.substring(0, cutIndice);
    }
    const message = adminName + ' added a summary progress report: ' + propDesc + '. ' + fileRef + '. ' + summary + '. ' + footer;
    // console.log('final total length: ' + message.length);
    return this.send(contact, message)
      .then(res => {
        // console.log(res);
      }).catch(err => {
        console.log(err);
      });
  }

  /**
  *  Returns current account balance
   *  @returns {currency balance}
  * */
  async getCredits () {
    return new Promise(async (resolve, reject) => {
      try {
        const {balance} = await client.balance.fetch();
        if (balance) {
          resolve(`${ Math.trunc(parseInt(balance)) }`);
        }
        reject("Fetch SMS credits returned no data.");
      } catch (e) {
        reject(e);
      }
    })
  }
}

module.exports = Twilio;
