export const poll = (isReady, onReady, timeout = 300, interval = 50, optOnTimeout) => {
  if (isReady()) {
    onReady();
  } else {
    if (timeout > 0) {
      timeout -= interval;
      setTimeout(() => poll(timeout, interval, isReady, onReady, optOnTimeout), interval);
    } else {
      if (optOnTimeout) {
        optOnTimeout();
      } else {
        console.warn('polling timed out');
      }
    }
  }
}

export const pollingPromise = (callApiFn, testFn, interval) => {
  let polling = false;
  let rejectThis = null;

  const stopPolling = () => {
    if (polling) {
      console.log(new Date(), 'Polling was already stopped...');
    } else {
      console.log(new Date(), 'Stopping polling...');
      polling = false;
      rejectThis(new Error('Polling cancelled'));
    }
  };

  const promise = new Promise((resolve, reject) => {
    polling = true;
    rejectThis = reject;

    const executePoll = async () => {
      try {
        const result = await callApiFn();
        if (polling && await testFn(result)) {
          polling = false;
          resolve(result);
        } else {
          setTimeout(executePoll, interval);
        }
      } catch (error) {
        polling = false;
        reject(new Error('Polling cancelled due to API error'));
      }
    };

    setTimeout(executePoll, interval);
  });

  return { promise, stopPolling };
}
