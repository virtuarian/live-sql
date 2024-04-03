import React from 'react';


interface ModalIfs {
  // imageUrl: string;
  // onClose: () => void;
}

const PreviewModal: React.FC<ModalIfs> = (props) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="loader">
          <div className="one"></div>
          <div className="two"></div>
          <div className="three"></div>
          <div className="four"></div>
        </div>

        {/* <img src={props.imageUrl} alt="Preview Image" /> */}
        {/* <button onClick={props.onClose}>Close</button> */}
      </div>
    </div>
  );
}

export default PreviewModal;