/**
 * Client-side stream reveal for full responses from non-streaming APIs.
 * Compatible with future SSE/stream endpoints — swap the producer, keep the consumer.
 */
export function createStreamReveal(onUpdate, options = {}) {
  const { chunkSize = 4, intervalMs = 18 } = options;
  let timerId = null;
  let index = 0;
  let fullText = '';

  function tick() {
    index = Math.min(index + chunkSize, fullText.length);
    onUpdate(fullText.slice(0, index), index >= fullText.length);

    if (index >= fullText.length) {
      stop();
    }
  }

  function start(text) {
    stop();
    fullText = text || '';
    index = 0;
    onUpdate('', false);

    if (!fullText.length) {
      onUpdate('', true);
      return;
    }

    timerId = setInterval(tick, intervalMs);
    tick();
  }

  function stop() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function isRunning() {
    return timerId !== null;
  }

  return { start, stop, isRunning };
}
