export function shuffle({ array }) {
  // Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    // destructured assignment causes performance loss
    // so let's get descriptive
    let tempVar = array[i];
    array[i] = array[j];
    array[j] = tempVar;
  }

  return array;
};
