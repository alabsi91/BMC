let isTansitioning = false;
const perspective = 1500;
const duration = 200;

export function cardMouseMove(event, card) {
  if (!matchMedia('(pointer:fine)').matches || isTansitioning) return;
  const maskeElement = card.querySelector('.masked-borders');
  const maskeSize = (maskeElement.getCss('mask-size', true) || maskeElement.getCss('-webkit-mask-size', true)) / 2;

  const [width, height] = [card.clientWidth, card.clientHeight];

  const x = event.clientX - card.getBoundingClientRect().left; // x position within the element.
  const y = event.clientY - card.getBoundingClientRect().top; // y position within the element.

  const xP = (width / 2 - x) / (width / 2); // horizontal percentage relative to the element center.
  const yP = (y - height / 2) / (height / 2); // vertical percentage relative to the element center.

  const rt = Math.min(Math.max(2 * Math.abs(yP) + 2 * Math.abs(xP), -2), 2); // rotation
  const transform = `perspective(${perspective}px) rotate3d(${1 * yP}, ${1 * xP}, 0, -${rt}deg)`;

  const maskPos = `${x - maskeSize}px ${y - maskeSize}px`;

  card.css({ transform });
  maskeElement.css({ WebkitMaskPosition: maskPos, maskPosition: maskPos });
}

export async function cardMouseEnter(event, card) {
  card.css({ transition: `transform ${duration}ms ease-in-out` });
  cardMouseMove(event, card);
  isTansitioning = true;
  await new Promise(resolve => setTimeout(resolve, duration / 2));
  card.removeCss('transition');
  isTansitioning = false;
}

export async function cardMouseLeave(event, card) {
  const maskeElement = card.querySelector('.masked-borders');
  maskeElement.css({ WebkitMaskPosition: 'center', maskPosition: 'center' });

  card.css({
    transition: `transform ${duration}ms ease-in-out`,
    transform: `perspective(${perspective}px) rotate3d(0, 0, 0, 0deg)`,
  });
}
