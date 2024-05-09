import React, {useState} from 'react'

const Biography = ({ bio, onSaveBio }) => {

    const [ editing, setEditing ] = useState(false);
    const [ newBio, setNewBio ] = useState(bio);

    const handleSave = () => {
        onSaveBio(newBio);
        setEditing(false);
    };

  return (
    <div>
      {editing ? (
        <div>
            <textarea
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
            />
            <button className='btn btn-primary float-left mr-auto' onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
            <p>{bio}</p>
            <button className='btn btn-primary float-left mr-auto' onClick={() => setEditing(true)}>Edit Bio</button>
        </div>
      )}
    </div>
  );
};

export default Biography
