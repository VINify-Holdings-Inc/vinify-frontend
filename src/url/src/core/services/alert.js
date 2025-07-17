import React from 'react';

import toaster from 'toasted-notes';
import 'toasted-notes/src/styles.css';
import $ from 'jquery';

import { Notification } from '../../components/shared';

const notification = {
  success: (msg, id) => {
    setTimer(id);
    toaster.notify(
      () => (
        <Notification
          type='success'
          msg={msg}
          id={id}
          onClose={() => removeNotification(id)}
        />
      ),
      { position: 'bottom', duration: 4000 }
    );
  },
  info: (msg, id) => {
    setTimer(id);
    toaster.notify(
      () => (
        <Notification
          type='info'
          msg={msg}
          id={id}
          onClose={() => removeNotification(id)}
        />
      ),
      { position: 'bottom', duration: 4000 }
    );
  },
  error: (msg, id) => {
    setTimer(id);
    toaster.notify(
      () => (
        <Notification
          type='error'
          msg={msg}
          id={id}
          onClose={() => removeNotification(id)}
        />
      ),
      { position: 'bottom', duration: 4000 }
    );
  },
  warning: (msg, id) => {
    setTimer(id);
    toaster.notify(
      () => (
        <Notification
          type='warning'
          msg={msg}
          id={id}
          onClose={() => removeNotification(id)}
        />
      ),
      { position: 'bottom', duration: 4000 }
    );
  }
};

let timerHandle;

const setTimer = id => {
  if (timerHandle) {
    clearTimer(id);
  }
  timerHandle = setTimeout(() => {
    removeNotification(id);
    timerHandle = undefined;
  }, 3000);
};

const clearTimer = id => {
  if (timerHandle) {
    clearTimeout(timerHandle);
    removeNotification(id);
    timerHandle = undefined;
  }
};

const removeNotification = id => {
  $(`#notification-${id}`)
    .closest('.Toaster__message')
    .hide()
    .remove();
};

export default notification;
