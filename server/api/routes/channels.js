const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

// Include models
const Channel = require('../../models/channel');
const Message = require('../../models/message');
const User = require('../../models/user');

router.get('/', checkAuth, (req, res, next) => {
  Channel.find().exec()
    .then(channels => {
      return res.status(200).json({
        status: 'success',
        data: {
          channels: channels,
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
      return res.status(500).json({
        status: 'error',
        code: '500',
        message: 'Something is wrong. Please try again later'
      })
    });
});


router.post('/', checkAuth, (req, res, next) => {
  const newChannel = new Channel();

  // Only channel name with a unique name is allowed
  Channel.findOne({'name': req.body.name}).exec()
    .then(channel => {
      if (channel) { 
        return res.status(422).json({
          status: 'fail',
          code: '422',
          data: {
            title: 'This channel name has been taken'
          }
        });
      } 

      newChannel._id = new mongoose.Types.ObjectId();
      newChannel.name = req.body.name;
      newChannel.createdBy = req.userData._id;
      newChannel.createdAt = new Date();
      newChannel.members = [req.userData._id];

      return newChannel.save();
    })
    .then(result => {
      const newMessage = new Message();
      newMessage._id = new mongoose.Types.ObjectId();
      newMessage.body = `joined #${newChannel.name}`;
      newMessage.createdAt = new Date();
      newMessage.createdBy = req.userData._id;
      newMessage.channel = newChannel._id;

      return newMessage.save();
    })
    .then(result => {
      return res.status(201).json({
        status: 'success',
        code: '201',
        data: {
          channel: newChannel,
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
      return res.status(500).json({
        status: 'error',
        code: '500',
        message: 'Something is wrong. Please try again later.'
      });
    });
});

router.delete('/:channelId', checkAuth, (req, res, next) => {
  const channelId = req.params.channelId;

  // Only admin can delete channels
  if (req.userData.role !== 'admin') {
    return res.status(403).json({
      status: 'fail',
      code: '403',
      data: {
        title: 'Sorry, you do not have the permission to perform this action.'
      }
    });
  }

  // Check if the channel exists
  Channel.findById(channelId).exec()
    .then(channel => {
      // Delete all messages in this channel
      return Message.remove({channel: channelId}).exec();
    })
    .then(result => {
      // Delete the channel
      return Channel.remove({_id: channelId}).exec();
    })
    .then(result => {
      res.status(200).json({
        status: 'success',
        code: '200',
        data: {
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
      return res.status(500).json({
        status: 'error',
        code: '500',
        message: 'Something is wrong. Please try again later.'
      });
    });
});

router.post('/:channelId/members', checkAuth, (req, res, next) => {
  let thisChannel = null;
  let newMessage = null;
  let memberUser = null;

  Channel.findById(req.params.channelId).exec()
    .then(channel => {
      // TODO: check if user has already been a member of thie channel

      thisChannel = channel;

      channel.members.push(req.body.newMemberUserId);
      return channel.save();
    })
    .then(result => {
      return User.findById(req.body.newMemberUserId).exec();
    })
    .then(user => {
      memberUser = user;

      const message = new Message();
      message._id = new mongoose.Types.ObjectId();
      message.body = `joined #${thisChannel.name}`;
      message.createdAt = new Date();
      message.createdBy = req.body.newMemberUserId;
      message.channel = req.params.channelId;

      newMessage = message;

      return message.save();      
    })
    .then(result => {
      return res.status(200).json({
        status: 'success',
        code: '200',
        data: {
          newMessage: {
            _id: newMessage._id,
            body: newMessage.body,
            createdAt: newMessage.createdAt,
            channel: newMessage.channel,
            createdBy: {
              _id: memberUser._id,
              firstName: memberUser.firstName,
              lastName: memberUser.lastName,
              email: memberUser.email,
              role: memberUser.role
            }
          }
        }
      });
    })
    .catch(err => {
      return res.status(500).json({
        status: 'error',
        code: '500',
        message: 'Something is wrong. Please try again later.'
      });
    });
});

router.delete('/:channelId/members/:memberId', checkAuth, (req, res, next) => {
  let thisChannel = null;
  let newMessage = null;
  let memberUser = null;

  Channel.findById(req.params.channelId).exec()
    .then(channel => {
      // TODO: check if the user is not a member of this channel

      thisChannel = channel;

      const updatedChannelMembers = channel.members.filter(member => {
        return member.toString() !== req.params.memberId;
      });

      channel.members = updatedChannelMembers;
      return channel.save();
    })
    .then(result => {
      return User.findById(req.params.memberId).exec();
    })
    .then(user => {
      memberUser = user;

      const message = new Message();
      message._id = new mongoose.Types.ObjectId();
      message.body = `left #${thisChannel.name}`;
      message.createdAt = new Date();
      message.channel = req.params.channelId;
      message.createdBy = req.params.memberId;

      newMessage = message;

      return newMessage.save();     
    })
    .then(result => {
      return res.status(200).json({
        status: 'success',
        code: '200',
        data: {
          newMessage: {
            _id: newMessage._id,
            body: newMessage.body,
            createdAt: newMessage.createdAt,
            channel: newMessage.channel,
            createdBy: {
              _id: memberUser._id,
              firstName: memberUser.firstName,
              lastName: memberUser.lastName,
              email: memberUser.email,
              role: memberUser.role
            }
          }
        }
      });
    })
    .catch(err => {
      return res.status(500).json({
        status: 'error',
        code: '500',
        message: 'Something is wrong. Please try again later.'
      });
    });
});

module.exports = router;
