import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';



const BottomSheet = ({ id }) => {
  const [datas, setDatas] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const videoId = id;
  const chatContainerRef = useRef(null);
  const user = useSelector((s) => s.user.user);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4001/ws');

    ws.onopen = () => {
      ws.send('something');
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      

      if (data.GroupId === videoId) {
        setDatas((prevDatas) => [...prevDatas, data]);
      }
    };

    ws.onerror = (e) => {
      console.log(e.data);
    };

    return () => {
      ws.onclose = (e) => {
        console.log('Component unmounted');
      };
    };
  }, [videoId]);


  useEffect(() => {
    
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [datas]);

  const handleChatButtonPress = async () => {
    if (inputValue) {
      try {
        await axios.post('http://localhost:4001/chats', {
          GroupId: videoId,
          userName: user?.name,
          message: inputValue,
        });
      } catch (error) {
        console.error('Error occurred while adding message:', error);
      }

      setInputValue('');
    }
  };


  

  const getSheetStyles = () => ({
    width: '30%',
    height: '100%',
    position: 'fixed',
    right: 0,
    bottom: 0,
    backgroundColor: '#F0F0F0', 
    zIndex: 1,
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)', 
    display: 'flex',
    flexDirection: 'column',
  });
  
  const getHeaderStyle = () => ({
    backgroundColor: '#B1A296', 
    color: '#fff',
    padding: '20px', 
    textAlign: 'center',
  });
  
  const getChatContainerStyle = () => ({
    flex: 1,
    overflowY: 'auto',
    padding: '20px', 
  });
  
  const getMessageStyle = () => ({
    backgroundColor: '#557A95',
    color: '#fff',
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '80%', 
    alignSelf: 'flex-end',
    margin: '10px 0', 
  });
  
  const getDisplayNameStyle = () => ({
    fontWeight: 'bold',
    marginRight: '8px', 
  });
  
  const getMessageTextStyle = () => ({
    fontSize: '16px', 
  });
  
  const getInputContainerStyle = () => ({
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px', 
    borderTop: '1px solid #CCC',
    marginTop: 'auto',
  });
  
  const getInputStyle = () => ({
    flex: 1,
    padding: '10px',
    border: '1px solid #CCC',
    borderRadius: '5px',
    marginRight: '10px',
    fontSize: '14px', 
  });
  
  const getSendButtonStyle = () => ({
    backgroundColor: '#7395AE',
    color: '#fff',
    border: 'none',
    padding: '12px 24px', 
    borderRadius: '5px',
    cursor: 'pointer',
  });
  
  
  
  
  const handleChatContainerClick = (e) => {
    e.stopPropagation();
    
  };
  
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div style={getSheetStyles()}>
      
      <div  style = {getHeaderStyle()}>
        <span className="headerText">Live Chat</span>
      </div>

      <div style={getChatContainerStyle()} ref={chatContainerRef} onClick={handleChatContainerClick}>
          
            {datas.map((data, index) => (
              <div key={index} style = {getMessageStyle()}>
                  <h5 style = {getDisplayNameStyle()}>{data.userName}</h5>
                  <span style = {getMessageTextStyle()}>{data.message}</span>
              </div>
            ))}
          
      </div>

      <div style={getInputContainerStyle()}>
        <input
          style={getInputStyle()}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <button style={getSendButtonStyle()} onClick={handleChatButtonPress}>
          Send
        </button>
      </div>
    
    
    </div>
  );
}

export default BottomSheet;