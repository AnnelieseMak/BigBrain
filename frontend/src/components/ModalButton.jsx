import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalFooter,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Text,
  useClipboard,
} from '@chakra-ui/react';

const ModalButton = ({ buttonName, apiCall, sessionId, content, bg, w }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { hasCopied, onCopy } = useClipboard(
    `http://localhost:3000/play/${sessionId}`
  );

  const triggerCall = async () => {
    const response = await apiCall();
    if (response[0] === 200) {
      onOpen();
    }
  };

  const handleShowResult = () => {
    navigate(`/results/${sessionId}`);
  };

  return (
    <>
      <Button
        bg={bg}
        w={w}
        onClick={buttonName === 'Results' ? onOpen : triggerCall}
        name={`${buttonName}`}
      >
        {buttonName}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {buttonName === 'Start'
              ? 'Game Start'
              : buttonName === 'Stop'
                ? 'Game Stopped'
                : 'View Results'}
          </ModalHeader>
          <ModalCloseButton name='modalCloseButton' />
          <ModalBody>
            <Text>{content}</Text>
          </ModalBody>

          <ModalFooter>
            {buttonName === 'Start'
              ? (<Button mr={3} onClick={onCopy} name={'copyLinkButton'}>{hasCopied ? 'Link Copied' : 'Copy Link'}
              </Button>)
              : (<>
                <Button
                  mr={3}
                  onClick={handleShowResult}
                  name={'showResultAcceptButton'}
                >
                  Yes
                </Button>
                <Button onClick={onClose}>No</Button>
              </>)}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

ModalButton.propTypes = {
  buttonName: PropTypes.string,
  bodyContent: PropTypes.string,
  bg: PropTypes.string,
  apiCall: PropTypes.func,
  sessionId: PropTypes.number,
  content: PropTypes.string,
  w: PropTypes.string,
};

export default ModalButton;
