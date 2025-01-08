import { useState, useEffect, useRef } from "react";
import '../style/folder.css'
import { useParams } from 'react-router-dom';

const folders = [
    { id: 1, name: 'Folder 1', size: '2 MB' },
    { id: 2, name: 'Presentations', size: '5 MB' },
    { id: 3, name: 'Spreadsheets', size: '3 MB' },
    { id: 4, name: 'Images', size: '1 MB' },
    { id: 5, name: 'Text folder', size: '500 KB' },
  ];
  
  const Folders = ({ folder }) => (
    <div className="file-item">
      <div className="folder-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>folder</title><path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" /></svg>
      </div>
      <div className="file-details">
        <div className="file-name">{folder.name}</div>
        <div className="file-size">{folder.size}</div>
      </div>
    </div>
  );

export default function Dashboard(){
    const {id} = useParams()

    const dialogRef = useRef(null)  
    const {user, setUser} = useState({})
    const {categories, setCategories} = useState({})
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(()=> {
        //get to check if the params actually match with the user.id
        fetch('http://localhost:5000/api/')
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Error fetching data:', error));
    },[])

    const filteredFolders = folders.filter(folder =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const addFolder = () => {
        dialogRef.current.showModal()
    }
    return (
      <div className="app-container">
        <header className="app-header">
          <h1>My Drive</h1>
          <input
            type="text"
            className="search-input"
            placeholder="Search folders"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </header>
        <main className="file-list">
          {filteredFolders.map((folder) => (
            <Folders key={folder.id} folder={folder} />
          ))}
        </main>
         <div className="addButton" onClick={addFolder}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-circle</title><path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>
          </div>
          <dialog ref={dialogRef}>
            <form>
                <i onClick={() => dialogRef.current.close()}>close</i>
                <label htmlFor="Name">Name:</label>
                <input type="text" name="name" id="name" /><br /><br />
                <button type="submit">Create</button>
            </form>
          </dialog>
      </div>
    )
}