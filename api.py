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
import urllib.parse as urlparse
from urllib.parse import parse_qs
from urllib.request import urlretrieve

app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = True


@app.route('/', methods=['POST'])
def home():
    req_data = request.get_json()
    processor = None
    if req_data['text']!='':
        processor = text_processor.TextProcessor(text=req_data['text'])
    elif req_data['url']!='':
        url = req_data['url']
        parsed = urlparse.urlparse(url)
        video_id = (parse_qs(parsed.query)['v'])
        processor = text_processor.TextProcessor(video_id = video_id)
        processor.get_transcript()


    elif req_data['attachment']!='':
        urlretrieve(req_data['attachment']['url'], req_data['attachment']['filename'])
        processor = text_processor.TextProcessor(filepath=req_data['attachment']['filename'])
        processor.pdf_to_text()

    #processor = text_processor.TextProcessor(text=text)
    notes = processor.get_summary(ratio=0.5)

    quiz = quiz_generator.Quiz(transcribed_text= vars(processor)['text'])
    quiz = quiz.generate_questions()

    summary = processor.get_summary(word_count=100)
    response = {
        "summary": summary,
        "notes": notes,
        "quiz": quiz
    }
    return json.dumps(response)


@app.route('/quiz', methods=['POST'])
def quiz():

    req_data = request.get_json()
    text = req_data['text']

    quiz = quiz_generator.Quiz(transcribed_text=text)
    response = quiz.generate_questions()

    return json.dumps(response)


@app.route('/notes', methods=['POST'])
def notes():
    req_data = request.get_json()
    text = req_data['text']

    processor = text_processor.TextProcessor(text=text)
    notes = processor.get_summary(ratio=0.5)
    return json.dumps(notes)


@app.route('/summary', methods=['POST'])
def summary():
    req_data = request.get_json()
    text = req_data['text']

    processor = text_processor.TextProcessor(text=text)
    summary = processor.get_summary(word_count=100)
    return json.dumps(summary)


if __name__ == '__main__':
    app.run(debug=True)