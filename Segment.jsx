import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { makeStyles } from "@material-ui/core";
import { Navbar } from "react-bootstrap";

const useStyles = makeStyles({
  container: {
    height: '100vh',
    width: '100%',
  }
})

function Segment() {
  const styles = useStyles();
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemaValues, setSelectedSchemaValues] = useState([]);
  const [remainingSchemas, setRemainingSchemas] = useState([
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" }
  ]);
  const [currentSchema, setCurrentSchema] = useState("");

  const handleSaveSegment = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedSchemaValues([]);
    setSegmentName("");
    setCurrentSchema("");
    setRemainingSchemas([]);
  };

  const handleSegmentNameChange = (e) => {
    setSegmentName(e.target.value);
  };

  const handleSchemaChange = (e) => {
    setSelectedSchemaValues(e.target.value);
  };

  const addNewSchema = () => {
    if (currentSchema !== '') {
      setSelectedSchemaValues([...selectedSchemaValues, currentSchema]);
    }
  };

  const handleSubmit = () => {
    // Prepare the data in the required format
    const payload = {
      segment_name: segmentName,
      schema: formatSchemasForApi(),
    };

    // Send the data to the server
    fetch("https://webhook.site/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Segment saved successfully:", data);
        alert("Segment saved successfully!");
        setShowPopup(false);
        setSegmentName("");
        setSelectedSchemaValues([]);
      })
      .catch((error) => {
        console.error("Error saving segment:", error);
        alert("Error saving segment");
      });
  };

  const formatSchemasForApi = () => {
    return selectedSchemaValues.map((schemaValue) => {
      const schemaLabel = remainingSchemas.find((schema) => schema.value === schemaValue)?.label;
      return { [schemaValue]: schemaLabel };
    });
  };

  const getFilteredSchemas = (selectedSchemas) => {
    return remainingSchemas.filter(
      (schema) => !selectedSchemaValues.includes(schema.value)
    );
  };

  return (
    <div className={styles.container} sx={{ marginTop: '5%' }}>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Navbar.Brand href="#home"> &nbsp; React-Bootstrap</Navbar.Brand>
      </Navbar>
      <button className="btn btn-primary" onClick={handleSaveSegment}>
        Save Segment
      </button>

      {showPopup && (
        <div className="modal show fade" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter Segment Name</h5>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  value={segmentName}
                  onChange={handleSegmentNameChange}
                  placeholder="Segment name"
                />
                {selectedSchemaValues.map((selectedSchemaValue, index) => (
                  <div className="mb-3" key={index}>
                    <label htmlFor="schemaDropdown" className="form-label">
                      Add schema to segment
                    </label>
                    <select
                      id="schemaDropdown"
                      className="form-select"
                      value={selectedSchemaValue}
                      onChange={handleSchemaChange}

                    >
                      <option value="">Select schema</option>
                      {getFilteredSchemas(selectedSchemaValues).map((schema) => (
                        <option key={schema.value} value={schema.value}>{schema.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <button className="text-primary" onClick={addNewSchema}>
                  + Add new schema
                </button>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleSubmit}>
                  Save
                </button>
                <button className="btn btn-secondary" onClick={handleClosePopup}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Segment;
