window.onload = function () {
    let recognization = new webkitSpeechRecognition();
    var intro = false;

    $("#chat-bot").on("click", async function () {

        if ($("#chat-msg").val() == "") {
            alert("कोई पाठ दर्ज नहीं किया गया है");
            return;
        }
        let text = $("#chat-msg").val();
        $("#chat-msg").val("");
        $(".card-body").append(` <div class="d-flex flex-row justify-content-end mb-4">
                        <div>
                            <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">${text}</p>
                           
                        </div>
                        <img src="/static/img/user.webp" alt="avatar 1" style="width: 45px; height: 100%;">
                    </div>`)

        setTimeout(async function () {
            let response = await fetch("/chat-hindi", {
                method: "POST",
                body: JSON.stringify({
                    text: transcript
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            let ans = await response.json();

            let res = ans.text;

            await recognization.abort();

            await responsiveVoice.speak(text, "Hindi Male", { rate: 1 }, { volume: 1 }, { pitch: 2 }, { lang: "hi-IN" });
            $(".card-body").append(` <div class="d-flex flex-row justify-content-start mb-4">
<img src="/static/img/bot-image2.jpg" alt="avatar 1"
    style="width: 45px; height: 100%; border-radius: 30px;">
<div>
    <p class="small p-2 ms-3 mb-1 rounded-3 bg-secondary">${res}</p>
   
</div>
</div>`)

        }, 1000);




    })

    $("#start").on("click", async function () {

        let text = `नमस्ते, मैं आपका डिजिटल कानूनी सहायक वीरू हूं, मैं आपकी क्या मदद कर सकता हूं?`;
        $(".card-body").append(` <div class="d-flex flex-row justify-content-start mb-4">
        <img src="/static/img/bot-image2.jpg" alt="avatar 1"
            style="width: 45px; height: 100%; border-radius: 30px;">
        <div>
            <p class="small p-2 ms-3 mb-1 rounded-3 bg-secondary">${text}</p>
           
        </div>
        </div>`)

        await recognization.abort();
        await responsiveVoice.speak(text, "Hindi Male", { rate: 1 }, { volume: 1 }, { pitch: 2 }, { lang: "hi-IN" });
    })




    function start_recog() {

        recognization.start();
        recognization.onresult = async (e) => {

            let transcript = e.results[0][0].transcript;
            $(".card-body").append(` <div class="d-flex flex-row justify-content-end mb-4">
                        <div>
                            <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">${transcript}</p>
                         
                        </div>
                        <img src="/static/img/user.webp" alt="avatar 1" style="width: 45px; height: 100%;">
                    </div>`)

            let text = "";
            if (transcript == "रुकना") {
                document.getElementById("startButton").disabled = false;
                document.getElementById("stopButton").disabled = true;
                text = "मेरा उपयोग करने के लिए धन्यवाद, आपका दिन शुभ हो";
                recognization.stop();

            }
            else if (transcript == "अपना परिचय दें") {
                text = "नमस्ते, मैं वीरू हूं, टीम ऑप्टिमाइज़र द्वारा विकसित एक डिजिटल कानूनी सहायक, मैं कानूनों और कानूनीताओं के बारे में आपके सभी संदेह दूर कर दूंगा। मुख्य रूप से मैं आपको आपके कानूनी अधिकारों के बारे में बताऊंगा और आपके कानूनी मुद्दों के लिए मार्गदर्शन प्रदान करूंगा।";


            }
            else {
                let response = await fetch("/chat-hindi", {
                    method: "POST",
                    body: JSON.stringify({
                        text: transcript
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                let ans = await response.json();

                text = ans.text;
            }

            if (transcript != "suggestions") {
                await recognization.abort();
                await responsiveVoice.speak(text, "Hindi Male", { rate: 1 }, { volume: 1 }, { pitch: 2 }, { lang: "hi-IN" });

            }

            $(".card-body").append(` <div class="d-flex flex-row justify-content-start mb-4">
<img src="/static/img/bot-image2.jpg" alt="avatar 1"
    style="width: 45px; height: 100%; border-radius: 30px;">
<div>
    <p class="small p-2 ms-3 mb-1 rounded-3 bg-secondary">${text}</p>
  
</div>
</div>`)



        }

    }
    $(document).ready(async function () {
        recognization.lang = "en-US";
        recognization.maxAlternatives = 1;
        recognization.onstart = () => {
            document.getElementById("startButton").disabled = true;
            document.getElementById("stopButton").disabled = false;

        }
        recognization.onend = () => {
            document.getElementById("startButton").disabled = false;
            document.getElementById("stopButton").disabled = true;

        }

        if (intro == false) {
            intro = true;
            let text = "नमस्ते, मैं आपका डिजिटल कानूनी सहायक वीरू हूं, मैं आपकी क्या मदद कर सकता हूं?";
            await recognization.abort();
            $(".card-body").append(` <div class="d-flex flex-row justify-content-start mb-4">
<img src="/static/img/bot-image2.jpg" alt="avatar 1"
    style="width: 45px; height: 100%; border-radius: 30px;">
<div>
    <p class="small p-2 ms-3 mb-1 rounded-3 bg-secondary">${text}</p>
   
</div>
</div>`)
            await responsiveVoice.speak(text, "Hindi Male", { rate: 1 }, { volume: 1 }, { pitch: 2 }, { lang: "hi-IN" });



        }

    })
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    startButton.addEventListener('click', () => {
        start_recog();
    });
    stopButton.addEventListener('click', () => {
        recognization.stop();
    })
}
