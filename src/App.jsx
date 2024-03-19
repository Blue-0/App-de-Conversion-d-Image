import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("png");
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    displayImage(file);
  };

  const displayImage = (file) => {
    const reader = new FileReader();
    reader.onload = function () {
      const dataUrl = reader.result;
      document.getElementById("image-display").src = dataUrl;
      setImageLoaded(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFormatChange = (event) => {
    setOutputFormat(event.target.value);
  };

  const convertImage = () => {
    if (!selectedFile) {
      alert("Selectionnez un fichier");
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const dataUrl = reader.result;
      const blob = dataURItoBlob(dataUrl);
      saveAs(blob, `converted_image.${outputFormat}`);
    };
    reader.readAsDataURL(selectedFile);
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  useEffect(() => {
    if (!selectedFile) {
      setImageLoaded(false);
    }
  }, [selectedFile]);

  return (
    <div className="app-container">
      <div className="input-container">
        <div className="image-container">
          <img
            src={selectedFile ? "" : "placeholder.jpg"}
            alt=""
            id="image-display"
            className={!imageLoaded ? "no-image" : ""}
          />
        </div>
        <label htmlFor="file-upload" className="custom-file-upload">
          Choisir un fichier
        </label>
        <input id="file-upload" type="file" accept="image/" onChange={handleFileChange} />
        <select onChange={handleFormatChange} value={outputFormat}>
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WEBP</option>
          <option value="gif">GIF</option>
          <option value="tiff">TIFF</option>
        </select>
        <button className="btn" onClick={convertImage}>
          Convertir l'image
        </button>
      </div>
      <Outlet/>
    </div>
  );
}

export default App;