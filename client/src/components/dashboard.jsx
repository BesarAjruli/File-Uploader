import { useState, useEffect, useRef } from "react";
import "../style/folder.css";
import { useParams, useNavigate, Link } from "react-router-dom";

const folders = [];

export default function Dashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const dialogRef = useRef(null);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const Folders = ({ folder }) => (
    <Link to={`/folder/${folder.id}`}>
        <div className="file-item">
          <div className="folder-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>folder</title>
              <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" />
            </svg>
          </div>
          <div className="file-details">
            <div className="file-name">{folder.name}</div>
            <div className="file-size">aquila</div>
          </div>
        </div>
    </Link>
  );

  //Clean the page before rendering
  useEffect(() => {
    return () => folders.length = 0
  }, []);
  
  //get data form backend from root
  useEffect(() => {
    //get to check if the params actually match with the user.id
    fetch("http://localhost:5000/api/", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        setUser(data.id);
        data.folders.forEach((folder) => folders.push(folder));
        setIsLoading(false);
        if (parseInt(data.id) !== parseInt(id)) {
          navigate("/login");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      });
  }, []);

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const addFolder = () => {
    dialogRef.current.showModal();
  };

  const addNewFolder = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    data.userId = user;
    try {
      const request = await fetch("http://localhost:5000/api/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const results = await request.json();
      if (results.success) {
        dialogRef.current.close();
        //navigate(results.redirect)
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>plus-circle</title>
          <path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </svg>
      </div>
      <dialog ref={dialogRef}>
        <form onSubmit={addNewFolder}>
          <i onClick={() => dialogRef.current.close()}>close</i>
          <label htmlFor="Name">Name:</label>
          <input type="text" name="name" id="name" />
          <br />
          <br />
          <button type="submit">Create</button>
        </form>
      </dialog>
    </div>
  );
}
