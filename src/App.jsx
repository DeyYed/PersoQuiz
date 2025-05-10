import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import UserForm from './components/UserForm';
import Question from './components/Question';
import Results from './components/Results';
import { UserProvider } from './components/UserContext';
import './components/css/styles.css';

export default function App() {
  const questions = [
    {
      question: "What's your favorite color?",
      options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
    },
    {
      question: "Choose a preferred environment:",
      options: ["Volcano 🌋", "Ocean 🌊", "Forest 🌳", "Sky ☁️"],
    },
    {
      question: "Pick a trait that describes you best:",
      options: ["Passionate ❤️", "Calm 😌", "Grounded 🌱", "Free-spirited 🕊️"],
    },
  ];

  const keywords = {
    Fire: "fire",
    Water: "water",
    Earth: "earth",
    Air: "air",
  };

  const elements = {
    "Red 🔴": "Fire",
    "Volcano 🌋": "Fire",
    "Passionate ❤️": "Fire",
    "Blue 🔵": "Water",
    "Ocean 🌊": "Water",
    "Calm 😌": "Water",
    "Green 🟢": "Earth",
    "Forest 🌳": "Earth",
    "Grounded 🌱": "Earth",
    "Yellow 🟡": "Air",
    "Sky ☁️": "Air",
    "Free-spirited 🕊️": "Air",
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [element, setElement] = useState('');
  const [artwork, setArtwork] = useState(null);

  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function determineElement(answers) {
    const counts = {};
    answers.forEach((answer) => {
      const elem = elements[answer];
      counts[elem] = (counts[elem] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
  }

  async function fetchArtwork(keyword) {
    try {
      const searchRes = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${keyword}&hasImages=true`
      );
      const searchData = await searchRes.json();
      if (searchData.objectIDs && searchData.objectIDs.length > 0) {
        const objectId = searchData.objectIDs[0];
        const objectRes = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
        );
        const objectData = await objectRes.json();
        setArtwork(objectData);
      } else {
        setArtwork(null);
      }
    } catch (error) {
      console.error('Error fetching artwork:', error);
      setArtwork(null);
    }
  }

  useEffect(() => {
    if (currentQuestionIndex === questions.length) {
      const selectedElement = determineElement(answers);
      setElement(selectedElement);
      fetchArtwork(keywords[selectedElement]);
    }
  }, [currentQuestionIndex]);

  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<UserForm />} />
          <Route
            path="/quiz"
            element={
              currentQuestionIndex < questions.length ? (
                <Question
                  question={questions[currentQuestionIndex].question}
                  options={questions[currentQuestionIndex].options}
                  onAnswer={handleAnswer}
                />
              ) : (
                <Results element={element} artwork={artwork} />
              )
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}
