import React, { useState } from "react";
import ChatBot from "react-simple-chatbot";
import { Segment, Button, Icon } from "semantic-ui-react";
import './ChatbotPage.css';
import 'semantic-ui-css/semantic.min.css';

const SupportMessage = () => (
  <div>
    For further information, contact our support team at <a href="mailto:support@kidgage.com">support@kidgage.com</a>.
  </div>
);

function ChatbotPage() {
  const [showChat, setShowChat] = useState(false);

  const steps = [
    {
      id: 'Greet',
      message: 'Hello, Welcome to kidgage',
      trigger: 'Ask Name'
    },
    {
      id: 'Ask Name',
      message: 'Please enter your name',
      trigger: 'waiting1',
    },
    {
      id: "waiting1",
      user: true,
      trigger: "Name",
    },
    {
      id: "Name",
      message: "Hi {previousValue}, please select the activity you are interested in.",
      trigger: "activities",
    },
    {
      id: "activities",
      options: [
        { value: "Swimming", label: "Swimming", trigger: "Swimming" },
        { value: "Dancing", label: "Dancing", trigger: "Dancing" },
        { value: "Art", label: "Art", trigger: "Art" },
        { value: "Music", label: "Music", trigger: "Music" },
        { value: "Martial Arts", label: "Martial Arts", trigger: "MartialArts" },
        { value: "Coding", label: "Coding", trigger: "Coding" },
      ],
    },
    {
      id: 'Swimming',
      message: 'Great! You selected Swimming. Please visit our swimming classes section to book a session.',
      trigger: 'Support'
    },
    {
      id: 'Dancing',
      message: 'Great! You selected Dancing. Please visit our dancing classes section to book a session.',
      trigger: 'Support'
    },
    {
      id: 'Art',
      message: 'Great! You selected Art. Please visit our art classes section to book a session.',
      trigger: 'Support'
    },
    {
      id: 'Music',
      message: 'Great! You selected Music. Please visit our music classes section to book a session.',
      trigger: 'Support'
    },
    {
      id: 'MartialArts',
      message: 'Great! You selected Martial Arts. Please visit our martial arts classes section to book a session.',
      trigger: 'Support'
    },
    {
      id: 'Coding',
      message: 'Great! You selected Coding. Please visit our coding classes section to book a session.',
      trigger: 'Support'
    },
    {
      id: 'Support',
      component: <SupportMessage />,
      end: true
    }
  ];

  return (
    <div className="chats-container">
      <Button 
        circular 
        icon 
        color='blue' 
        onClick={() => setShowChat(!showChat)}
        className="chat-icon"
      >
        <Icon name={showChat ? 'close' : 'chat'} />
      </Button>
      {showChat && (
        <Segment floated="right">
          <ChatBot steps={steps} />
        </Segment>
      )}
    </div>
  );
}

export default ChatbotPage;
