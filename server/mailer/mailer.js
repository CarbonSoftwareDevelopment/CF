const nodemailer = require('nodemailer');
const smtpttransport = require('nodemailer-smtp-transport');
const hbs = require('nodemailer-express-handlebars');
const inlineBase64 = require('nodemailer-plugin-inline-base64');
const EmailError = require('./EmailError');

class Mailer {

  formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  constructor(host, port, emailFrom, password, username) {
    console.log(`MAILER CREATED WTH host: ${host} port: ${port} emailFrom: ${emailFrom} password: ${password} username: ${username}`);
    console.log(typeof host, typeof port, typeof username);
    const options = {
      viewEngine: {
        extname: '.hbs',
        layoutsDir: 'mailer/views/',
        defaultLayout: 'templates/template',
        partialsDir: 'mailer/views/partials'
      },
      viewPath: 'mailer/views/views/',
      extName: '.hbs'
    };

    this.emailFrom = emailFrom;
    this.mailer = nodemailer.createTransport(smtpttransport({
      host: 'smtp.sendgrid.net',
      pool: true,
      maxMessages: 50,
      maxConnections: 20,
      secureConnection: true,
      port: 465,
      auth: {
        user: 'apikey',
        pass: password
      },
      tls: { rejectUnauthorized: false }
    }));
    // verify connection configuration
    this.mailer.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    this.mailer.use('compile', hbs(options));
    this.mailer.use('compile', inlineBase64(options))
  }

  send(templateName, context, toEmail, subject) {

    let that = this;

    // if (process.env.NODE_ENV !== 'development' || ['renaldovd@gmail.com', 'ronnie@georgetown.co.za'].indexOf(toEmail) > -1) {
      console.log("================= \n SENDING EMAIL TO", toEmail);
      return new Promise((resolve, reject) => {
        this.mailer.sendMail({
          from: that.emailFrom,
          to: toEmail,
          bcc: process.env.BCC_EMAIL,
          subject: subject,
          template: templateName,
          context: context
        }, (error, response) => {
          if (error) {
            reject(error);
          }
           if(response && response.accepted) {
             console.log("SUCCESS : ", response.accepted, "====================\n");
           }
          that.mailer.close();
          resolve(response);
        });
      });
    // }
    // return new Promise(resolve => resolve());
  }

  //Helper function to determine if word starts with a vowel

  sendEmail(email, body, link, subject, button) {
    //validate
    if (!button) {
      button = 'View File';
    }
    var missingFields = [];
    if (email == null || email == "") {
      missingFields.push("email")
    }
    if (body == null || body == "") {
      missingFields.push("body")
    }
    if (link == null || link == "") {
      missingFields.push("link")
    }
    if (missingFields.length > 0) {
      throw new EmailError(missingFields);
    }

    let context = {
      body: body,
      link: link,
      btn: button
    };
    let that = this;
    return new Promise((resolve, reject) => {
      that.send("email", context, email, subject).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }
  milestoneAchieved(email, body, link, subject, requiredDocs) {
    let context = {
      body: body,
      link: link,
      requiredDocs: requiredDocs
    };
    let that = this;
    return new Promise((resolve, reject) => {
      that.send("milestoneAchieved", context, email, subject).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }
  docUploaded(contactName, email, reqDoc, fileRef, propDesc, link) {
    const context = {
      name: contactName,
      doc: reqDoc,
      fileRef: fileRef,
      link: link,
      propDesc
    };
    const subject = 'New ' + reqDoc + ' uploaded by ' + contactName;
    return new Promise((resolve, reject) => {
      this.send('docUploaded', context, email, subject).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }
  adminFileCreated(email, link, fileRef) {
    const message = 'Your file with reference ' + fileRef + ' has successfully been created. \n to view the file click the link below.';
    const subject = 'File successfully created';
    this.sendEmail(email, message, link, subject);
  }
  contactAddedToFile(email, name/*title and surname*/, fileType, fileRef, link) {
    const message = 'Good day ' + name + ', \nyou have been added to a new ' + fileType + ' file with reference ' + fileRef + '. To view the file click the link below.';
    const subject = 'You\'ve been added to a new ' + fileType + ' file';
    this.sendEmail(email, message, link, subject);
  }
  // forgotPassword
  forgotPassword(name, forgotPasswordLink, email) {
    let context = {
      name: name,
      link: forgotPasswordLink
    };
    let that = this;
    return new Promise((resolve, reject) => {
      that.send("forgotPassword", context, email, 'ConveyFeed Password Reset Requested').then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }
  userCreated(name, email, link) {
    const message = 'Good day '+ name +' \nYou were added as a ConveyFeed admin user / secretary. \n Click the link below to register your account.';
    const subject = 'You were added as a ConveyFeed admin user / secretary';
    this.sendEmail(email, message, link, subject, 'Register');
  }
  commentMade(adminName, email, comment, propDesc, milestone, link, footerMessage) {
    const context = {
      name: adminName,
      comment: comment,
      propDesc: propDesc,
      milestone: milestone,
      link: link,
      footer: footerMessage
    };
    const subject = 'New comment made by ' + adminName;
    return new Promise((resolve, reject) => {
      this.send('comment', context, email, subject).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }
  summaryAdded(adminName, email, summary, propDesc, fileRef, link, footerMessage, fileType) {
    const context = {
      name: adminName,
      summary: summary,
      propDesc: propDesc,
      link: link,
      footer: footerMessage,
      fileRef: fileRef,
      fileType: fileType
    };
    const subject = 'New summary added by ' + adminName;
    return new Promise((resolve, reject) => {
      this.send('summary', context, email, subject).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }
  weeklyUpdate(email, name, link, file) {
    let newSummaries = [];
    if (file.summaries) {
      file.summaries.forEach((s, i) => {
        newSummaries.push({
          date: this.formatDate(s.timestamp),
          summary: s.summary,
          user: {name: s.user?.name}
        });
      });
    } else {
      newSummaries = null;
    }
    let context = {
      name: name,
      fileType: file.milestoneList._id.title,
      propertyDescription: file.propertyDescription,
      summaries: newSummaries[newSummaries.length - 1],
      link: link
    };
    const subject = context.fileType + ' file weekly report';

    let that = this;
    return new Promise((resolve, reject) => {
      that.send('weeklyUpdate', context, email, subject).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }
  entityWeeklyUpdate(email, name, link, entity) {
    let context = {
      name: name,
      entity: entity,
      link: link
    };
    const subject = entity.name + ' weekly report';

    let that = this;
    return new Promise((resolve, reject) => {
      that.send('entityWeeklyUpdate', context, email, subject).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }
  weeklyUpdateSec(email, name, link, counts) {
    const subject = 'Weekly scheduled reports have been sent out successfully.';
    const context = {
      name: name,
      link: link,
      counts: counts
    };
    return new Promise((resolve, reject) => {
      this.send('weeklyUpdateSec', context, email, subject)
        .then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }
}

module.exports = Mailer;
