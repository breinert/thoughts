const thoughtIn = document.querySelector('.thoughtinput');
const list = document.querySelector('#thoughts');
const tnum = document.getElementById('tnum');
const pnum = document.getElementById('pnum');
const nnum = document.getElementById('nnum');
const modal = document.getElementById("myModal");
let items = JSON.parse(localStorage.getItem('items')) || [];
let negitems = JSON.parse(localStorage.getItem('negitems')) || [];
let totalPos = JSON.parse(localStorage.getItem('totalPos')) || 0;
let totalNeg = JSON.parse(localStorage.getItem('totalNeg')) || 0;
let activeBlue;

function newBlue(e) {
  e.preventDefault();
  const text = (thoughtIn.querySelector('[name=bluethought]')).value.trim();
  const item = { text };
  if(text == '') {
    alert('Enter a thought');
    return;
  }
  items.unshift(item);
  populateList(items, list);
  localStorage.setItem('items', JSON.stringify(items));
  thoughtIn.reset();
  totalPos++;
  localStorage.setItem('totalPos', totalPos);
}

function newRed(e) {
  e.preventDefault();
  const text = (thoughtIn.querySelector('[name=redthought]')).value.trim();
  const item = { text };
  if(text == '') {
    alert('Enter a thought');
    return;
  }
  negitems.unshift(item);
  populateList(negitems, list);
  localStorage.setItem('negitems', JSON.stringify(negitems));
  thoughtIn.reset();
  totalNeg++;
  localStorage.setItem('totalNeg', totalNeg);
}

function populateList(thoughts = [], thoughtList) {
  thoughtList.innerHTML = thoughts.map((thought, i) => {
    return (document.querySelector('#bluepage')) ? `
      <li>
        <label for="items${i}" id="items${i}" class="thoughts" onclick="blueOpts(event, this)">${thought.text}</label>
      </li>
    ` : `
      <li>
        <label for="items${i}" id="items${i}" class="thoughts" onclick="combust(event, this)">${thought.text}</label>
      </li>
    `;
  }).join('');
  if(document.querySelector('#bluepage')) {
    if(thoughts.length === 0) {
      tnum.innerHTML = 'Enter some positive thoughts!';
    } else if(thoughts.length === 1) {
      tnum.innerHTML = 'You have 1 positive thought!';
    } else {
      tnum.innerHTML = `You have ${thoughts.length} positive thoughts!`;
      }
    } else {
    if(thoughts.length === 0) {
      tnum.innerHTML = 'You have no negative thoughts posted';
    } else if(thoughts.length === 1) {
      tnum.innerHTML = 'You have 1 negative thought<br>Tap to Destroy the Negative Thought';
    } else {
      tnum.innerHTML = `You have ${thoughts.length} negative thoughts<br>Click to Destroy the Negative Thoughts`;
      }
    }
}

function totalThoughts() {
  if(totalPos === 0) {
    pnum.innerHTML = 'No Positive Thoughts';
  } else if(totalPos === 1) {
    pnum.innerHTML = '1 Positive Thought';
  } else {
    pnum.innerHTML = `${totalPos} Positive Thoughts`;
    }
  if(totalNeg === 0) {
    nnum.innerHTML = 'No Negative Thoughts';
  } else if(totalNeg === 1) {
    nnum.innerHTML = '1 Negative Thought';
  } else {
    nnum.innerHTML = `${totalNeg} Negative Thoughts`
    }
  }

function resetApp() {
  modal.style.display = 'none';
  localStorage.clear();
  totalPos = 0;
  totalNeg = 0;
  totalThoughts();
}

function clearStorage(e) {
  localStorage.removeItem(e);
  e = [];
  populateList(e, list);
}

function blueOpts(e, ele) {
  e.preventDefault;
  modal.style.display = 'block';
  activeBlue = ele;
}

function delBlue() {
  modal.style.display = 'none';
  let position = parseInt(activeBlue.id.slice(5));
  let selected = document.getElementById(activeBlue.id).parentElement;
  list.removeChild(selected);
  let data = JSON.parse(localStorage.getItem('items'));
  data.splice(position, 1);
  localStorage.setItem('items', JSON.stringify(data));
  items.splice(position, 1);
  populateList(items, list);
}

function combust(e, ele) {
  e.preventDefault();
  let position = parseInt(ele.id.slice(5));
  let selected = document.getElementById(ele.id).parentElement;
  document.getElementById('modal-list').appendChild(selected);
  modal.style.display = 'block';
  setTimeout(function() {
    shrink(selected);
    setTimeout(function() {
      bomb(selected);
      setTimeout(function() {
        remove(position);
      }, 4000);
    }, 1000);
  }, 500);
}

function shrink(selected) {
  selected.style.transition = 'all 1s ease';
  selected.style.transform = 'translateY(100px) scale(0.01)';
}

function bomb(selected) {
  selected.replaceWith(canvas);
  initConfetti();
}

function remove(position) {
  let data = JSON.parse(localStorage.getItem('negitems'));
  data.splice(position, 1);
  localStorage.setItem('negitems', JSON.stringify(data));
  negitems.splice(position, 1);
  populateList(negitems, list);
  modal.style.display = 'none';
  let removal = document.getElementById('modal-list');
  removal.removeChild(removal.childNodes[0]);
}

window.onclick = function(event) {
  if(event.target == modal) {
    modal.style.display = 'none';
  }
}

//Confetti derived from work by Nicholas Suski @ suskitech.org/code/confetti/

canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confetti = [];
const confettiCount = 200;
const gravity = 0.3;
const terminalVelocity = 6;
const drag = 0.075;
const colors = [
  { front : 'white', back: 'pink'},
  { front : 'green', back: 'darkgreen'},
  { front : 'blue', back: 'darkblue'},
  { front : 'yellow', back: 'darkyellow'},
  { front : 'orange', back: 'darkorange'},
  { front : 'pink', back: 'darkpink'},
  { front : 'purple', back: 'darkpurple'},
  { front : 'turquoise', back: 'darkturquoise'},
];

resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

initConfetti = () => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      color: colors[Math.floor(randomRange(0, colors.length))],
      dimensions: {
        x: randomRange(3, 15),
        y: randomRange(3, 20),
      },
      position: {
        x: canvas.width / 2,
        y: canvas.height / 2.5,
      },
      rotation : randomRange(0, 2 * Math.PI),
      scale: {
        x: 1,
        y: 1,
      },
      velocity: {
        x: randomRange(-35, 35),
        y: randomRange(-20, 5),
      },
    });
  }
}

randomRange = (min, max) => Math.random() * (max - min) + min;

render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti.forEach((confetto, index) => {
    let width = (confetto.dimensions.x * confetto.scale.x);
    let height = (confetto.dimensions.y * confetto.scale.y);
    //Move canvas to position and rotate
    ctx.translate(confetto.position.x, confetto.position.y);
    ctx.rotate(confetto.rotation);
    //Apply forces to velocity
    confetto.velocity.x -= confetto.velocity.x * drag;
    confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();
    confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
    //Set position
    confetto.position.x += confetto.velocity.x;
    confetto.position.y += confetto.velocity.y;
    //Delete confetti when out of frame
    if (confetto.position.y >= canvas.height) confetti.splice(index, 1);
    //Loop confetto x position
    if (confetto.position.x > canvas.width) confetto.position.x = 0;
    if (confetto.position.x < 0) confetto.position.x = canvas.width;
    //Spin confetto by scaling y
    confetto.scale.y = Math.cos(confetto.position.y * 0.1);
    ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
    //Draw confetto
    ctx.fillRect(-width / 2, -height / 2, width, height);
    //Reset transform matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });
  window.requestAnimationFrame(render);
}

render();

if (document.querySelector('#redpage')) {
  window.addEventListener('resize', function () {
    resizeCanvas();
  });
}
