import flask
import quiz_generator 
import os
from os import path
from flask import request
from flask_cors import CORS
import uuid 
import re
import json
from datetime import datetime
import text_processor

app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = True


@app.route('/quiz', methods=['GET'])
def quiz():
    
    text = request.args.get('text')
    #text = "A tonsillectomy is the surgical removal of the palantine tonsils. And adenoidectomy is the surgical removal of the adenoids. Tube will be temporarily inserted through your mouth and into your throat to help you breathe during the operation. Tonsillectomy's and adenoidectomy's are rarely done under local anesthesia in adults and never in children"
    quiz = quiz_generator.Quiz(transcribed_text=text)
    response = quiz.generate_questions()
 
    return json.dumps(response)

@app.route('/notes', methods=['GET'])
def notes():
    text = request.args.get('text')
    print(text)
    #text = "A tonsillectomy is the surgical removal of the palantine tonsils. And adenoidectomy is the surgical removal of the adenoids. Tube will be temporarily inserted through your mouth and into your throat to help you breathe during the operation. Tonsillectomy's and adenoidectomy's are rarely done under local anesthesia in adults and never in children"

    processor = text_processor.TextProcessor(text=text)
    notes = processor.get_summary(ratio = 0.5)
    return json.dumps(notes)

@app.route('/summary', methods=['GET'])
def summary():
    text = request.args.get('text')
    #text = "A tonsillectomy is the surgical removal of the palantine tonsils. And adenoidectomy is the surgical removal of the adenoids. Tube will be temporarily inserted through your mouth and into your throat to help you breathe during the operation. Tonsillectomy's and adenoidectomy's are rarely done under local anesthesia in adults and never in children"

    processor = text_processor.TextProcessor(text=text)
    summary = processor.get_summary(word_count=100)
    return json.dumps(summary)




if __name__ == '__main__':
    app.run(debug=True)
    #print(summary())

