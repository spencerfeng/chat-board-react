const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

// Include models
const Message = require('../../models/message');

router.get('/channels/:channelId', checkAuth, (req, res, next) => {
  Message.find({'channel': req.params.channelId})
    .populate('createdBy', ['_id', 'email', 'firstName', 'lastName', 'role'])
    .exec()
    .then(messages => {
      res.status(200).json({
        status: 'success',
        code: '200',
        data: {
          messages: messages,
          user: {
            _id: req.userData._id,
            firstName: req.userData.firstName,
            lastName: req.userData.lastName,
            email: req.userData.email,
            role: req.userData.role
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        status: 'error',
        code: '500',
        message: 'Something is wrong. Please try again later.'
      });
    });
});

router.post('/channels/:channelId', checkAuth, (req, res, next) => {

  // TODO: if the user is not a member of this channel, handling error.

  const newMessage = new Message();
  newMessage._id = new mongoose.Types.ObjectId();
  newMessage.body = req.body.messageBody;
  newMessage.createdBy = req.userData._id;
  newMessage.createdAt = new Date();
  newMessage.channel = req.params.channelId; 

  newMessage.save()
    .then(result => {
      res.status(201).json({
        status: 'success',
        code: '201',
        data: {
          message: {
            _id: newMessage._id,
            createdAt: newMessage.createdAt,
            body: newMessage.body,
            channel: newMessage.channel,
            createdBy: {
              _id: req.userData._id,
              email: req.userData.email,
              firstName: req.userData.firstName,
              lastName: req.userData.lastName,
              role: req.userData.role
            }
          },
          user: {
            _id: req.userData._id,
            firstName: req.userData.firstName,
            lastName: req.userData.lastName,
            email: req.userData.email,
            role: req.userData.role
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        status: 'error',
        code: '500',
        message: 'Something is wrong. Please try again later.'
      });
    });

});

router.delete('/:messageId', checkAuth, (req, res, next) => {
  const messageId = req.params.messageId;
  let deletedMessage = null;

  Message.findById(messageId).exec()
    .then(message => {
      if (!message) {
        return res.status(404).json({
          status: 'fail',
          code: '404',
          data: {
            title: 'Sorry, this message does not exist.'
          }
        });
      }

      // Only the message owner and admin can delete the message
      if (req.userData.role !== 'admin' && req.userData._id !== message.createdBy.toString()) {
        return res.status(403).json({
          status: 'fail',
          code: '403',
          data: {
            title: 'Sorry, you are not allow to perform this action.'
          }
        });
      }

      deletedMessage = message;
      return Message.remove({_id: messageId}).exec();
    })
    .then(result => {
      return res.status(200).json({
        status: 'success',
        code: '200',
        data: {
          deletedMessage: deletedMessage
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        status: 'error',
        code: '500',
        message: 'Something is wrong. Please try again later.'
      });
    });
});

module.exports = router;