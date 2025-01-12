import { useState, useEffect, useRef } from "react";
import '../style/folder.css'
import { useParams, useNavigate, Link } from "react-router-dom";

const files = [];
  
  const FileItem = ({ file }) => (
    <div className="file-item">
      <div className="file-icon">{file.type.split(/\//)[0]}</div>
      <div className="file-details">
        <div className="file-name">{file.name}</div>
        <div className="file-size">{file.size < 1000 ? file.size + ' bytes': file.size < 1000000 ? (file.size/1000).toFixed(2) + ' kB': (file.size/1000000).toFixed(2) + ' MB'}</div>
      </div>
    </div>
  );

export default function Folder(){
  const { id } = useParams();
  const navigate = useNavigate();

    const dialogRef = useRef(null)
    const [folderId, setFolderID] = useState({})
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

     //Clean the page before rendering
  useEffect(() => {
    return () => files.length = 0
  }, []);
  
  //get data form backend from root
  useEffect(() => {
    //get to check if the params actually match with the user.id
    fetch(`http://localhost:5000/api/folder/${id}`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        setFolderID(data.id);
        data.files.forEach((file) => files.push(file));
        console.log(folderId)
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      });
  }, []);

    const filteredFiles = files.filter(file =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addFiles = () => {
      dialogRef.current.showModal();
    };

    const addNewFile = async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
    const fileBase = Object.fromEntries(formData.entries());
    const file = fileBase.file
    const data = {
      name: file.name + '_' + file.lastModified,
      size: file.size,
      type: file.type,
      folderId: id
    }

    try {
      const request = await fetch("http://localhost:5000/api/folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const results = await request.json();
      if (results.success) {
        dialogRef.current.close();
        navigate(`/folder/${id}`)
      }
    } catch (err) {
      console.log(err);
    }
    }

    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="app-container">
        <header className="app-header">
          <Link to={`/${folderId}`}>
            <h1>My Drive</h1>
          </Link>
          <input
            type="text"
            className="search-input"
            placeholder="Search files"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </header>
        <main className="file-list">
          {filteredFiles.map((file) => (
            <FileItem key={file.id} file={file} />
          ))}
        </main>
         <div className="addButton" onClick={addFiles}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-circle</title><path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>
          </div>
          <dialog ref={dialogRef}>
        <form onSubmit={addNewFile}>
          <i onClick={() => dialogRef.current.close()}>close</i>
          <label htmlFor="file">File:</label>
          <input type="file" name="file" id="file" />
          <br />
          <br />
          <button type="submit">Create</button>
        </form>
      </dialog>
      </div>
    )
}