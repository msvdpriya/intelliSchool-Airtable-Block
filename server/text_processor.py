import sys
import re
import json
import requests
import os
from youtube_transcript_api import YouTubeTranscriptApi
from gensim.summarization.summarizer import summarize
import textract
from cleantext import clean
from urllib.request import urlretrieve


class TextProcessor():
    def __init__(self,text='',video_id='',filepath=''):
        self.video_id = video_id
        self.text = text
        self.filepath = filepath

    def duplicate_punctuation(self):
        text = re.sub(r'[\.]+','.',self.text)
        return text


    def punctuate_online(self):
        # defining the api-endpoint  
        API_ENDPOINT = "http://bark.phon.ioc.ee/punctuator"
        # data to be sent to api 
        data = dict(text=self.text)
        # sending post request and saving response as response object 
        r = requests.post(url = API_ENDPOINT, data = data) 

        # extracting response text  
        punctuatedText = r.text
        return punctuatedText

    def get_transcript(self):
        self.text = ''
        transcripts = YouTubeTranscriptApi.get_transcript(str(self.video_id))
        for transcript in transcripts:
            self.text+=' '+transcript['text']
        self.text = re.sub(r'[^\w\s]','',self.text)
        punctuated_sentences = self.punctuate_online()

        self.text = punctuated_sentences

    def get_summary(self,ratio = 0.5, word_count = None):
        return (summarize(self.text,ratio=ratio,split=True,word_count = word_count))

    def pdf_to_text(self):
        text = textract.process(self.filepath)
        self.text = clean(text)
