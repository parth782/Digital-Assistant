window.onload = function () {
    let recognization = new webkitSpeechRecognition();
    var intro = false;

    $("#chat-bot").on("click", async function () {

        if ($("#chat-msg").val() == "") {
            alert("No text is entered");
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
            let response = await fetch("/chat", {
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

            await responsiveVoice.speak(res, "UK English Male", { rate: 1 }, { volume: 1 }, { pitch: 2 });
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

        let text = `Hello, This is your Digital Legal Assistant Veeru , What can I help you?`;
        $(".card-body").append(` <div class="d-flex flex-row justify-content-start mb-4">
        <img src="/static/img/bot-image2.jpg" alt="avatar 1"
            style="width: 45px; height: 100%; border-radius: 30px;">
        <div>
            <p class="small p-2 ms-3 mb-1 rounded-3 bg-secondary">${text}</p>
           
        </div>
        </div>`)

        await recognization.abort();
        await responsiveVoice.speak(text, "UK English Male", { rate: 1 }, { volume: 1 }, { pitch: 2 });
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
            if (transcript == "stop") {
                document.getElementById("startButton").disabled = false;
                document.getElementById("stopButton").disabled = true;
                text = "Thank you for using me, Have a nice day";
                await recognization.stop();

            }
            else if (transcript == "introduce yourself") {
                text = "Hello,I am Veeru, a Digital Legal Assistant developed by team Optimizers,I will clear all your suspicions doubts regarding the laws and legalities. Primarily I will tell you about your legal rights and will provide guidance for your legal issues.";


            }
            else if (transcript == "suggestions") {
                let response = await fetch("/suggest", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                let ans = await response.json();
                text = ans.records
            }

            else {
                let response = await fetch("/chat", {
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
                await responsiveVoice.speak(text, "UK English Male", { rate: 1 }, { volume: 1 }, { pitch: 2 });

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
            let text = "Hello, This is your Digital Legal Assistant Veeru,What can I help you?";
            await recognization.abort();
            $(".card-body").append(` <div class="d-flex flex-row justify-content-start mb-4">
<img src="/static/img/bot-image2.jpg" alt="avatar 1"
    style="width: 45px; height: 100%; border-radius: 30px;">
<div>
    <p class="small p-2 ms-3 mb-1 rounded-3 bg-secondary">${text}</p>
   
</div>
</div>`)
            await responsiveVoice.speak(text, "UK English Male", { rate: 1 }, { volume: 1 }, { pitch: 2 });



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
