import json
from urllib import parse
import os.path
import json
from nltk.corpus import wordnet as wn
from textblob import TextBlob
import random
import re


class Quiz:
    def __init__(self, transcribed_text):
        self.transcribed_text = TextBlob(transcribed_text)

    def generate_questions(self):
        sentences = self.transcribed_text.sentences
        questions = []
        for sentence in sentences:
            question = self.evaluate_sentence(sentence)
            if question:
                questions.append(question)
        return questions

    def get_similar_words(self, word):
        synsets = wn.synsets(word, pos='n')

        if len(synsets) == 0:
            return []
        else:
            synset = synsets[0]

        # Get the hypernym for this synset (again, take the first)
        hypernym = synset.hypernyms()[0]

        # Get some hyponyms from this hypernym
        hyponyms = hypernym.hyponyms()

        # Take the name of the first lemma for the first 8 hyponyms
        similar_words = []
        for hyponym in hyponyms:
            similar_word = hyponym.lemmas()[0].name().replace('_', ' ')
            
            if similar_word != word:
                similar_words.append(similar_word)

            if len(similar_words) == 8:
                break

        return similar_words

    def evaluate_sentence(self, sentence):

        replace_nouns = []
        for s in sentence.tags:
            word, tag = s[0],s[1]
            if tag == 'NN' :
                for phrase in sentence.noun_phrases:
                    if phrase[0] == '\'':
                        # If it starts with an apostrophe, ignore it
                        break

                    if word in phrase:
                        [replace_nouns.append(phrase_word) for phrase_word in phrase.split()[-2:]]
                        break

                if len(replace_nouns) == 0:
                    replace_nouns.append(word)
                break
        
        if len(replace_nouns) == 0:
            # Return none if we found no words to replace
            return None

        question = {
            "sentence": str(sentence), 
        }
        question["answers"] = []
        correct_answer = ' '.join(replace_nouns)
        if len(replace_nouns) == 1:
            # If we're only replacing one word, use WordNet to find similar words
            question['answers'].append(correct_answer)
            question['answers'].extend(self.get_similar_words(replace_nouns[0])[:3])
        random.shuffle(question['answers'])
        if len(question['answers']) < 3:
            return None
        if len(question['answers'])>1:
            question['correctIndex'] = question['answers'].index(correct_answer)
            question['jumpToTime'] = 0

        if len(question['answers'])==3:
            question['answers'].append('None of the Above')

        # Blank out our replace words (only the first occurrence of the word in the sentence)
        replace_phrase = correct_answer
        blanks_phrase = ('____ ' * len(replace_nouns)).strip()

        expression = re.compile(re.escape(replace_phrase), re.IGNORECASE)
        sentence = expression.sub(blanks_phrase, str(sentence), count=1)
        
        question["question"] = sentence
        return question

def generate_quiz(transcribed_text):

    quiz = Quiz(transcribed_text)
    generated_quiz = quiz.generate_questions()
    
    print(generated_quiz)
    return generated_quiz


'''if __name__ == "__main__":  
    res = generate_quiz("A tonsillectomy is the surgical removal of the palantine tonsils. And adenoidectomy is the surgical removal of the adenoids. Tube will be temporarily inserted through your mouth and into your throat to help you breathe during the operation. Tonsillectomy's and adenoidectomy's are rarely done under local anesthesia in adults and never in children.")

    print(json.dumps(res))'''