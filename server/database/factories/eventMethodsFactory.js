const EventSchema = require('../models/event');
const isNull = require('../../utilities/isNull');

function eventMethodsFactory(modelNames) {
  if (isNull(modelNames)) {
    return {};
  }
  const Event = EventSchema(modelNames);

  // новые методы //
  const addEvent = (topicID, dateTimestamp) => {
    const newEvent = new Event({
      topicId: topicID,
      date: dateTimestamp
    });

    return new Promise((resolve, reject) => {
      newEvent.save((err, addedEvent) => {
        if (err) reject(err);
        resolve(addedEvent);
      });
    });
  };

  const getAllEvents = () => {
    return Event.find({}, (err, data) => {
      if (err) {
        console.log(err);
      }
    }).exec();
  };

  const addParticipant = (eventID, userID) => {
    return Event.findOneAndUpdate(
      { _id: eventID },
      { $push: { participants: { userId: userID } } },
      { useFindAndModify: false, new: true }
    );
  };

  const removeParticipant = (eventID, userID) => {
    return Event.findOneAndUpdate(
      { _id: eventID },
      { $pull: { participants: { userId: userID } } },
      { useFindAndModify: false, new: true }
    );
  };

  const getEventById = id => {
    return Event.findOne({ _id: id }).exec();
  };
  const getDateByEventId = eventId => {
    return Event.findOne({ _id: eventId }, 'date').exec();
  };
  const getAllUsersByEvent = eventId => {
    return Event.findOne({ _id: eventId }, 'participants.userId').exec();
  };
  const setUserStatusByEvent = (eventId, userID, stat) => {
    return Event.updateOne(
      { _id: eventId, 'participants.userId': userID },
      { $set: { 'participants.$.status': stat } },
      err => {
        if (err) console.log(err);
      }
    ).exec();
  };
  const removeEventByEventId = id => {
    return Event.deleteOne({ _id: id }, err => {
      if (err) console.log(err);
    });
  };

  const getUpcomingEventsBothAccepted = time => {
    const currentTime = new Date().getTime();
    return Event.find(
      {
        $and: [
          {
            date: {
              $lt: currentTime + 3600 * 24
            }
          },
          {
            'participants.status': { $all: ['accepted'] }
          }
        ]
      },
      (err, data) => {
        if (err) {
          console.log(err);
        }
      }
    ).exec();
  };
  // ----------//
  const getUpcomingEventsOneAccepted = () => {
    const currentTime = new Date().getTime();
    return Event.find(
      {
        $and: [
          {
            date: {
              $lt: currentTime + 3600 * 24
            }
          },
          {
            'participants.status': 'accepted'
          }
        ]
      },
      (err, data) => {
        if (err) {
          console.log(err);
        }
      }
    ).exec();
  };
  // ------------ //
    const getUpdateEventStatus = (eventId) => {
    return Event.updateOne({ _id: eventId }, { $set: {isNotifited: true }}).exec();
  };
  // ------------ //

  return {
    removeEventByEventId,
    getEventById,
    addEvent,
    getAllEvents,
    addParticipant,
    removeParticipant,
    getDateByEventId,
    getAllUsersByEvent,
    setUserStatusByEvent,
    getUpcomingEventsOneAccepted,
    getUpcomingEventsBothAccepted,
    getUpdateEventStatus
  };

}

module.exports = eventMethodsFactory;
