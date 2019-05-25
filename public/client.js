const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
console.log("start");
let TextArea = document.querySelector('.textarea');
let container = document.querySelector('.text-box');
container.appendChild(TextArea);
// const sound = document.querySelector('.sound');
let status = document.querySelector('#status')
const setStatus = (text) => {
  status.textContent = text;
}
setStatus("ready");
var grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;'
let SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
const recognition = new SpeechRecognition();
recognition.grammars = speechRecognitionList;

const icon = document.querySelector('i.fa.fa-microphone')
icon.addEventListener('click', () => {
  // sound.play();\
  console.log("listeningf")
  dictate();
});

let start = document.querySelector("#start")
start.addEventListener('click', () => {
  console.log("start");
  setStatus("start pressed");

});
let stop = document.querySelector("#stop")
stop.addEventListener('click', () => {
setStatus("stop pressed");
});

let events = ["audiostart","soundstart","speechstart","speechend","soundend","audioend","nomatch", "error", "start","end"];
events.map((name)=> recognition["on"+ name] = () => console.log("recognition " + name ))

let error = "no error"

const dictate = () => {
  let aggregate = ""
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 3;
  // recognition.grammars = speechRecognitionList;
  recognition.start();
  let consolidated = ""
  setStatus("listening");

  recognition.onerror = (e) => {
    setStatus("error " + e.error)
    error = e;
  }
  recognition.onend = () => {
    setStatus("end " + error.error)
    if(dictationRunning){
      dictate()
    }
  }
  let nextToScan = 0
  recognition.onresult = (event) => {
    // console.log(event)
    let incremental = ""
    let provisional = ""
    let last = event.results.length;
    let newSegment = ""
    for(let i = nextToScan; i < last; i++) {
      newSegment = event.results[i][0].transcript;
      incremental += newSegment;

      if(!event.results[i].isFinal) {
        provisional += newSegment;
        // recognition.stop()
        // speak(newSegment);
      } else {
        provisional = "";
        console.log(newSegment)
        beep(10, 520, 200)
        consolidated += newSegment;
        nextToScan = i + 1;
      }
    }
    TextArea.textContent = consolidated + provisional;
//     if (event.results[0].isFinal) {
//       console.log("FINAL")
//       //aggregate += speechToText;
//       if(!speechToText.includes('all done now')) {
//         //recognition.start();
//       }
//       if (speechToText.includes('what is the time')) {
//           speak(getTime);
//       };

//       if (speechToText.includes('what is today\'s date')) {
//           speak(getDate);
//       };

//       if (speechToText.includes('what is the weather in')) {
//           getTheWeather(speechToText);
//       };
//     }
  }
}
const synth = window.speechSynthesis;
let synthEvents = ["audiostart", "boundary","mark","soundstart","speechstart","speechend","soundend","audioend","result","nomatch"];
synthEvents.map((name)=> recognition["on"+ name] = () => console.log("synth " + name ))
let a=new AudioContext() // browsers limit the number of concurrent audio contexts, so you better re-use'em

let beep = (vol, freq, duration) => {
  let v=a.createOscillator()
  let u=a.createGain()
  v.connect(u)
  v.frequency.value=freq
  v.type="square"
  u.connect(a.destination)
  u.gain.value=vol*0.01
  v.start(a.currentTime)
  v.stop(a.currentTime+duration*0.001)
}

beep(10, 520, 200)



var voiceList = [];
let voices = {}
let messages = [
    {msg: 'hello. this is a long enough message, do you think?', voice: 'us', delay: 2},
    {msg: 'fuck you.', voice: 'enf', delay: 2},
  {msg: 'fuck you too', voice: 'enm', delay: 2},
  {msg: 'fuck me? fuck you!.', voice: 'enf', delay: 2},
  {msg: 'fuck yourself', voice: 'enm', delay: 2},
           ];
let first = true;
let messageNo = 0;
function populateVoiceList() {
  console.log('pop voice list');
  if(voiceList.length == 0 ) {
    voiceList = synth.getVoices();
    voices['us'] = voiceList[3];
    voices['enf'] = voiceList[4];
    voices['enm'] = voiceList[5];
    // for(let i = 0; i < voices.length ; i++) {
    //   console.log(i,voices[i])
    // }
    console.log(voices);
  }
  if(first){
    first = false;
    sayNext()
  }
}

function sayNext() {
  sayIt(messages[messageNo++]);
  if(messageNo >= messages.length) {
    messageNo = 1;
  }

}

let sayIt = function (message) {
	let voice = voices[message.voice];
  console.log("say message", message)
	var msg = new SpeechSynthesisUtterance(message.msg);
	msg.volume = 1; // 0 to 1
	msg.rate = 1; // 0.1 to 10
	msg.pitch = 0; //0 to 2
	msg.text = message.msg;

	msg.lang = voice.lang;
	msg.voice = voice;

	msg.onend = function (e) {
    console.log("msgEnd")
		sayNext()
	};

	msg.onerror = function (e) {
    console.log("msgError")
		sayNext()
	};
  setTimeout(sayNext, message.delay*1000);
	synth.cancel();
	synth.speak(msg);
}


//sayIt("hello", 'us')
//sayIt("fuck you!", 'ukf')
// if (speechSynthesis.onvoiceschanged !== undefined) {
//   speechSynthesis.onvoiceschanged = populateVoiceList;
// }

const speakfn = (action) => {
  let utterThis = new SpeechSynthesisUtterance(action());
  synth.speak(utterThis);
};


const speak = (utterance) => {
  console.log("saying ", utterance);
  synth.speak(new SpeechSynthesisUtterance(utterance));
};
const getTime = () => {
  const time = new Date(Date.now());
  return `the time is ${time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
};

const getDate = () => {
  const time = new Date(Date.now())
  return `today is ${time.toLocaleDateString()}`;
};

const getTheWeather = (speech) => {
  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${speech.split(' ')[5]}&appid=58b6f7c78582bffab3936dac99c31b25&units=metric`)
  .then(function(response){
    return response.json();
  })
  .then(function(weather){
    if (weather.cod === '404') {
      let utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${speech.split(' ')[5]}`);
      synth.speak(utterThis);
      return;
    }
    let utterThis = new SpeechSynthesisUtterance(`the weather condition in ${weather.name} is mostly full of ${weather.weather[0].description} at a temperature of ${weather.main.temp} degrees Celcius`);
    synth.speak(utterThis);
  });
};
