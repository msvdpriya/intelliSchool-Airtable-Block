# intelliSchool-Airtable-Block

Airtable block that automatically generates quiz, summary and key points for any document, video or notes given by student using Natural Language Processing and Machine Learning

## Inspiration

In the midst of COVID-19, the whole world has realised the power of online learning and the impact it can have on millions of students. Be it K-12 or higher education, virtual learning is talk of the town. However, many student are facing challenges or stressful circumstances and worry that they are falling behind and their grades will suffer.

Students find it difficult to sit through the lectures. It gets monotonous at times, they tend to lose concentration and internet connectivity is not good for all .Besides, teachers can’t ensure students’ engagement and check if they are understanding the concepts taught online.

Looming over the entire enterprise is a cloud of fear and urgency: it is critical that remote learning succeeds if students are to avoid setbacks.Colleges and Schools have been keen to emphasise that special measures will be taken to ensure students do not lose out as a result.

To help students facing internet connectivity issues, schools and colleges record lectures on different subjects and upload them on their YouTube channel for students to download and watch later. In this process, there is a lack of feedback; there is no one to test you if you've really understood what you've been listening to.

What if there is a mechanism that automatically generates a quiz for any video/documents shared/notes taken by students to evaluate your understanding? Also, not every student likes to take notes. But all of us need something to refer to before an exam. What if there is someone who can automatically generate notes for you while you concentrate on listening to the lecture in the video?

## What it does

**For Students:**

Are you one of those people who uses airtable to organize your coursework and self study material? We have got you covered.

With **intelliSchool** block, have all your class videos, notes, bookmarked links, documents all at one place. All the resources can also be tagged by course title/number for faster access.

Not just that!! Now comes the best part !!

Once you have added to Airtable, intelliSchool block will **automatically generates summary, notes/key points and Quiz for any material** such as video, documents, link, notes using **Machine Learning and Artificial Intelligence** and store it back in airtable.

Our block provides easy access to summary and key points, so that you can use it to refresh and retain content faster than having to go through the entire video or document all over again.

Our block also generates Quiz for you based on the coursework you are currently accessing. Using this you can self evaluate your understanding of the concept. This way the block can be used to bring an improvement in the individual's knowledge because they provide regular feedback to the students who acknowledge their shortcomings and work on them.

Research has proved that the order and organisation of learning activities affects the way information is processed and retained. So go ahead and use intelliSchool block to rock the exams!!

**For Teachers:**

Teachers spend a lot of time preparing content such as quizzes and notes to help their students. intelliSchool block can help them automate this process. Once teachers uploads the video, intelliSchool block will automatically generate key point, summary and Quiz. Teachers can share this among students so that they can spend this time on more useful tasks.

**Document types supported** :

Video: mp4, mpeg etc..
Audio: mp3, wav etc..
Documents: .csv, .doc, .docx, .eml, .epub, .json, .html, .mp3, .pdf, .pptx, .txt, .xls, .xlsx etc..

intelliSchool block can also be used by professional. For Example: It can be used by professional to generate summary of meeting to be sent to their clients or team members.


## How We built it

As and when user creates a new row in the airtable, it will send the corresponding video url, document url or texual content to the backend powered by Python, Machine learning and Natural Language processing.

If user entered a video url, then subtitle will be generated for it. On the other hand, if user added attachment, then content of that attachment will be extracted using Textract.

Once text extraction is done, Key points are selected using page rank algorithm. Using this key points, summary and Quiz will be generated automatically using Machine Learning and Natural Language Processing.

## Challenges we ran into

Building a product with react for the first time was a challenge initially. 

## Accomplishments that we're proud of

We are proud of being able to learn React for the first time and building UI/UX using it within a short period of time.

## What we learned.

We learnt about wide variety of use cases Airtable can be used for. I also learnt React framework for building the UI/UX.

## What's next for intelliSchool Block on Airtable

- Capture snapshots of important diagrams and formulae from the video and add it to Smart Notes
- Create flash cards to help students learn easily
- Add analytics to help teachers understand the topics that weren't answered correctly by students. This can be very useful for teachers to come up with new ways of teaching such complex topics
- Add analytics for parents to better understand how their kids are performing
- In smart notes section, we want show links to relevant websites to read more about the central topic of the video
- Generate pre-requisites - add links to learn about most important sub-topics related to the video as pre-requisites
