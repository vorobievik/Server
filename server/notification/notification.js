// здесь будет крутиться cron для рассылки уведолений
const cron = require('node-cron');
const bot = require('../bot/telegramBot');
const ClassDBController = require('./../database/dbController');

const controller = new ClassDBController('event', 'topic', 'user');
console.log('test');
const task = cron.schedule('*/20 * * * * *', () => {
  const time = Date.now();
  const currentTime = new Date().getTime();
   notifyBoth()
   notifyOne()
});

function notifyBoth() {
  controller
    .getUpcomingEventsBothAccepted()
    .then(events => {
        events.forEach(event => {
          if (event.isNotifited === false) {
            controller.getUpdateEventStatus(event.id);
          event.participants.forEach(user => {
            const me = {
              firstName: null,
              telegramID: null,
              description: null,
              title: null
            };
            controller.getUserByUserId(user.userId).then(userData => {
              me.firstName = userData.firstName;
              me.telegramID = userData.telegramId;
            });
            controller.getTopicById(event.topicId).then(topicData => {
              me.description = topicData.description;
              me.title = topicData.title;
              bot.notify(
                'meetingFail',
                { firstName: me.firstName, telegramUserId: 317190937 },
                {
                  title: me.title,
                  description: me.description
                }
              );
            });
          });
          }
        });

    })

    .catch(err => console.log(err));
}

function notifyOne() {
  controller
    .getUpcomingEventsOneAccepted()
    .then(events => {

        events.forEach(event => {
          if (event.isNotifited === false) {
            controller.getUpdateEventStatus(event.id);
          event.participants.forEach(user => {
            const me = {
              firstName: null,
              telegramID: null,
              description: null,
              title: null
            };
            if (user.status === 'accepted') {
              controller.getUserByUserId(user.userId).then(userData => {
                me.firstName = userData.firstName;
                me.telegramID = userData.telegramId;
              });
              controller.getTopicById(event.topicId).then(topicData => {
                me.description = topicData.description;
                me.title = topicData.title;
                bot.notify(
                  'meetingFail',
                  { firstName: me.firstName, telegramUserId: 317190937 },
                  {
                    title: me.title,
                    description: me.description
                  }
                );
              });
            }
          });
        };
      })
    })

    .catch(err => console.log(err));
}

task.start();


