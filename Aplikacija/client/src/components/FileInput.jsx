import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';

const FileInput = ({ name, onChange, value }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const onDrop = useCallback(
    (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
      onChange(acceptedFiles);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const location = useLocation();

  if (location.pathname === '/register') {
    return (
      <div
        {...getRootProps()}
        className={`file-input ${isDragActive ? 'active' : ''}`}
        style={{
          marginTop: '16px',
          padding: '16px',
          backgroundColor: '#f3f4f6',
          color: '#718096',
          border: '2px dashed #cbd5e0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          outline: 'none',
          transition: 'border-color 0.3s ease-in-out',
        }}
      >
        <input
          {...getInputProps()}
          name={name}
          style={{ display: 'none' }}
        />
        {isDragActive ? (
          <p style={{ margin: 0 }}>Izaberite sliku ovde</p>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: '24px', height: '24px', marginRight: '8px' }}
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <p style={{ margin: 0 }}>
              {selectedFile ? `Izabrana slika: ${selectedFile.name}` : 'Izaberite sliku'}
            </p>
          </>
        )}
      </div>
    );
  } else if (location.pathname.startsWith('/create-post')) {
    return (
      <div
        {...getRootProps()}
        className={`file-input ${isDragActive ? 'active' : ''}`}
        style={{
          padding: '16px',
          backgroundColor: '#f3f4f6',
          color: '#718096',
          border: '2px dashed #cbd5e0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          outline: 'none',
          transition: 'border-color 0.3s ease-in-out',
        }}
      >
        <input
          {...getInputProps()}
          name={name}
          style={{ display: 'none' }}
        />
        {isDragActive ? (
          <p style={{ margin: 0 }}>Izaberite sliku koja opisuje Vašu uslugu</p>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: '24px', height: '24px', marginRight: '8px' }}
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <p style={{ margin: 0 }}>
              {selectedFile ? `Izabrana slika: ${selectedFile.name}` : 'Izaberite sliku koja opisuje Vašu uslugu'}
            </p>
          </>
        )}
      </div>
    );
  }
};

export default FileInput;
