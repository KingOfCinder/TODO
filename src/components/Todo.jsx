import { useEffect, useRef, useState, useCallback } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Webcam from "react-webcam";
import { addPhoto, GetPhotoSrc } from "../db.jsx";
import MapComponent from "./MapContent.jsx";
import Weather from "./Weather.jsx";

function Todo(props) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

  function handleChange(e) {
    setNewName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.editTask(props.id, newName);
    setNewName("");
    setEditing(false);
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
        />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditing(false)}
        >
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );
  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
          <a href={props.location.mapURL}>(map)</a>
          &nbsp; | &nbsp;
          <a href={props.location.smsURL}>(sms)</a>
          &nbsp; | &nbsp;
          {props.location && (
            <span>
              (Lat: {props.location.latitude}, Lon: {props.location.longitude})
            </span>
          )}
        </label>
      </div>
      <div className="btn-group">
        <button type="button" className="btn" onClick={() => setEditing(true)}>
          Edit <span className="visually-hidden">{props.name}</span>
        </button>
        <Popup // à 3
          trigger={
            <button type="button" className="btn">
              {" "}
              Take Photo{" "}
            </button>
          }
          modal
          closeOnDocumentClick={false}
        >
          {(close) => (
            <div>
              <WebcamCapture
                id={props.id}
                photoedTask={props.photoedTask}
                close={close}
              />
            </div>
          )}
        </Popup>

        <Popup // à 4
          trigger={
            <button type="button" className="btn">
              {" "}
              View Photo{" "}
            </button>
          }
          modal
        >
          {(close) => (
            <div>
              <ViewPhoto id={props.id} alt={props.name} />
              <button type="button" className="btn" onClick={close}>
                Back
              </button>
            </div>
          )}
        </Popup>

        <Popup // à 4
          trigger={
            <button type="button" className="btn">
              {" "}
              View Location{" "}
            </button>
          }
          modal
        >
          {(close) => (
            <div>
              <ViewLocation />
              <Weather />
              <button type="button" className="btn" onClick={close}>
                Back
              </button>
            </div>
          )}
        </Popup>
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteTask(props.id)}
        >
          Delete <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </div>
  );

  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}

const WebcamCapture = ({ id, photoedTask, close }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgId, setImgId] = useState(null);
  const [photoSave, setPhotoSave] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (photoSave) {
      console.log("useEffect detected photoSave");
      photoedTask(imgId);
      setPhotoSave(false);
    }
  });
  console.log("WebCamCapture", id);

  const capture = useCallback(
    (id) => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      console.log("capture", imageSrc.length, id);
    },
    [webcamRef, setImgSrc],
  );

  const savePhoto = (id, imgSrc) => {
    console.log("savePhoto", imgSrc.length, id);
    addPhoto(id, imgSrc);
    setImgId(id);
    setPhotoSave(true);
  };

  const handleCancel = () => {
    setIsVisible(false);
    if (typeof close === "function") {
      close();
    }
  };

  return isVisible ? (
    <>
      {!imgSrc && (
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      )}
      {imgSrc && <img src={imgSrc} />}
      picture captured
      <div className="btn-group">
        {!imgSrc && (
          <button type="button" className="btn" onClick={() => capture(id)}>
            Capture photo
          </button>
        )}
        {imgSrc && (
          <button
            type="button"
            className="btn"
            onClick={() => {
              savePhoto(id, imgSrc);
              close();
            }}
          >
            Save Photo
          </button>
        )}

        <button
          type="button"
          className="btn todo-cancel"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </>
  ) : null;
};

const ViewPhoto = (props) => {
  const photoSrc = GetPhotoSrc(props.id);

  return (
    <div>
      {photoSrc ? (
        <img src={photoSrc} alt={`Photo of ${props.name}`} />
      ) : (
        <p>No photos available</p>
      )}
    </div>
  );
};

const ViewLocation = () => {
  return (
    <div>
      <MapComponent />
    </div>
  );
};
export default Todo;
