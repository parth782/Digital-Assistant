from flask import Flask, render_template,request,jsonify
from translate import Translator
import openai
from dotenv import load_dotenv
import os
import webbrowser as wb
app = Flask(__name__, static_url_path='/static', static_folder='static')
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
start = "Hello, This is your Virtual Assistant Veeru , What can I help you?"

user_names={
    'Pranshu':"+91 8826 7378 30",

    'Parth':"+91 9354 4255 48",

    'Shivam':"+91 7011 4208 77",

    'Rishav':"+91 9717 4382 30"

}

def translate_response(response_text, target_language):
    translator = Translator(to_lang=target_language)
    translated_response = translator.translate(response_text)
    return translated_response

# def sendWhatsapp(phone_no,message):
#     Message = message
#     wb.open('https://web.whatsapp.com/send?phone='+phone_no+ '&text='+Message)
#     sleep(15)
#     pyautogui.press('enter')

@app.route('/',methods=["GET"])
def index():
    return render_template('landing.html')

@app.route('/english',methods=["GET"])
def english():
    return render_template('index.html')

@app.route('/hindi',methods=["GET"])
def hindi():
    return render_template('index-hi.html')




@app.route('/hindi',methods=["GET"])
def index1():
    return render_template('index-hi.html')

@app.route('/chat',methods=["POST"])
def chat():
    text = request.get_json().get('text')
    start_sequence = "{}.{}".format(start,text)
    completions = openai.Completion.create(
      model="text-davinci-003",
      prompt=start_sequence,
      temperature=0.1,
      max_tokens=256,
      top_p=1,
      frequency_penalty=0.51,
      presence_penalty=0.5,
      #stream = False,
      #echo = True
    )

    message = completions.choices[0].text 
    return jsonify({'text':message})

@app.route('/chat-hindi',methods=["POST"])
def chat_hindi():
    text = request.get_json().get('text')
    t1=translate_response(text,"en")
    start_sequence = "{}.{}".format(start,text)
    completions = openai.Completion.create(
      model="text-davinci-003",
      prompt=start_sequence,
      temperature=0.1,
      max_tokens=256,
      top_p=1,
      frequency_penalty=0.51,
      presence_penalty=0.5,
      #stream = False,
      #echo = True
    )
    
    message = completions.choices[0].text
    # print(f"AI Response : {message}")
    # return message
    res=translate_response(message,"hi") 
    print(res)
    return jsonify({'text':res})

@app.route('/suggest',methods=["GET"])
def suggest():
    res="Pranshu:+91 8826 7378 30,Parth:+91 9354 4255 48, Shivam:+91 7011 4208 77,Rishav:+91 9717 4382 30"
    return jsonify({'records':res})

# @app.route('/send-msg',methods=["POST"])
# def send_msg():
#     text=request.get_json().get('text')
#     message=text.spilt()
#     msg=""
#     for i in range(1,len(message)):
#         msg+=message[i]+" "
#     sendWhatsapp(user_names[message[0]],msg)
#     return jsonify({'text':'Message Sent'})


   

if __name__ == '__main__':
    app.run(debug=True)