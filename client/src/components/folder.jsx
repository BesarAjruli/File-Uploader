import { useState, useEffect } from "react";
import '../style/folder.css'

const files = [
    { id: 1, name: 'Document 1', type: 'docx', size: '2 MB' },
    { id: 2, name: 'Presentation 1', type: 'pptx', size: '5 MB' },
    { id: 3, name: 'Spreadsheet 1', type: 'xlsx', size: '3 MB' },
    { id: 4, name: 'Image 1', type: 'jpg', size: '1 MB' },
    { id: 5, name: 'Text File', type: 'txt', size: '500 KB' },
  ];
  
  const FileItem = ({ file }) => (
    <div className="file-item">
      <div className="file-icon">{file.type}</div>
      <div className="file-details">
        <div className="file-name">{file.name}</div>
        <div className="file-size">{file.size}</div>
      </div>
    </div>
  );

export default function Folder(){
    const {user, setUser} = useState({})
    const {folders, setFolders} = useState({})
    const {categories, setCategories} = useState({})
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFiles = files.filter(file =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    return (
      <div className="app-container">
        <header className="app-header">
          <h1>My Drive</h1>
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
         <div className="addButton">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-circle</title><path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>
          </div>
      </div>
    )
}