import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import DatePicker from "react-multi-date-picker";
// import "react-multi-date-picker/styles/clean.css"; // Import the CSS for the date picker
import './App.css';

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${month}-${date}`;
}

function App() {
  const [showAddInfo, setShowAddInfo] = useState(false);
  const [addNewClicked, setAddNewClicked] = useState(false);
  const [startDate, setStartDate] = useState(new Date(getDate()));
  const [endDate, setEndDate] = useState(new Date(getDate()));
  const [numberofdays, setNumberofdays] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [leadCount, setLeadCount] = useState(0);
  const [values, setValues] = useState([]); // Define values for the DatePicker
  const [expectedDRR, setExpectedDRR] = useState(0);
  const [data, setData] = useState([]);

  const calculateNumberOfDays = () => {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const Difference_In_Time = endTime - startTime;
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    Difference_In_Days = Math.abs(Difference_In_Days);
    return Difference_In_Days;
  };

  const calculateDates = () => {
    let dates = "";
    for(let i = 0; i < values.length - 1; i++) {
      dates += values[i].year + "-" + values[i].month.number + "-" + values[i].day + ",";
    }
    dates += values[values.length - 1].year + "-" + values[values.length - 1].month.number + "-" + values[values.length - 1].day;
    return dates;
  }

  const updateData = () => {
    lastUpdatedDateandTime();
    calculateleadCount();
    let dates = calculateDates();
    if(numberofdays - values.length == 0) {
      window.alert("Number of Days will become 0! Cannot add data.");
      window.alert("Please select number of dates excluded less than the total number of days.");
      return;
    }
    const variable = {
      start: startDate.toISOString().slice(0, 10),
      end: endDate.toISOString().slice(0, 10),
      month: startDate.getMonth() + 1,
      datesExcluded: dates,
      numberofDays: numberofdays - values.length,
      leadCountValue: leadCount,
      expectedDRR: expectedDRR,
      lastUpdated: currentDate
    };
    setData([...data, variable]);
  };

  useEffect(() => {
    const newNumberofdays = calculateNumberOfDays();
    setNumberofdays(newNumberofdays);
    const lastUpdateddattime = lastUpdatedDateandTime();
    setCurrentDate(lastUpdateddattime);
    const DRR = Math.floor(leadCount / (numberofdays - values.length));
    setExpectedDRR(DRR);
  }, [startDate, endDate, leadCount]);

  const startDateChange = (event) => {
    const { value } = event.target;
    setStartDate(new Date(value));
  };

  const endDateChange = (event) => {
    const { value } = event.target;
    setEndDate(new Date(value));
  };

  const textChange = (event) => {
    const { value } = event.target;
    setLeadCount(Number(value));
  };

  const calculateleadCount = () => {
    const DRR = leadCount / numberofdays;
    setExpectedDRR(DRR);
  }

  // const addData = (event) => {
  //   event.preventDefault();
  //   updateData();
  //   setAddNewClicked(false);
  // };

  const addData = (event) => {
    event.preventDefault();
    updateData();
  
    // Reset the form fields
    setStartDate(new Date(getDate()));
    setEndDate(new Date(getDate()));
    setLeadCount(0);
    setValues([]);
  
    setAddNewClicked(false);
  };
  

  function formatDate(date) {
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  function formatTime(date) {
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const yyyy = date.getFullYear();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hh = h % 12 || 12; 
    return `${yyyy}-${mm}-${dd} ${hh}:${m}:${s} ${ampm}`;
  }

  function lastUpdatedDateandTime() {
    const date = new Date();
    const formattime = formatTime(date);
    return formattime;
  }

  const cancelDiv = () => {
    setAddNewClicked(false); 
  }

  return (
    <div>
      <button className='addnew' onClick={() => setAddNewClicked(true)}>
        Add New
      </button>
      <Table id='Table'>
        <Thead>
          <Tr>
            <Td>Action</Td>
            <Td>Id</Td>
            <Td>Start Date</Td>
            <Td>End Date</Td>
            <Td>Month</Td>
            <Td>Dates Excluded</Td>
            <Td>Number of Days</Td>
            <Td>Lead Count</Td>
            <Td>Excluded DRR</Td>
            <Td>Last Updated</Td>
          </Tr>
        </Thead>
        <Tbody>
          {addNewClicked && (
            <Tr id='addInfo'>
              <Td>N/A</Td>
              <Td>N/A</Td>
              <Td>
                <input
                  type='date'
                  onChange={startDateChange}
                  min={getDate()}
                />
              </Td>
              <Td>
                <input
                  type='date'
                  onChange={endDateChange}
                  min={startDate.toISOString().slice(0, 10)}
                />
              </Td>
              <Td>{startDate.getMonth() + 1}</Td>
              <Td>
                <DatePicker
                  multiple
                  value={values}
                  onChange={setValues}
                  minDate={startDate.toISOString().slice(0, 10)}
                  maxDate={endDate.toISOString().slice(0, 10)}
                />
              </Td>
              <Td>{numberofdays}</Td>
              <Td>
                <input type='number' onChange={textChange} />
              </Td>
              <Td></Td>
              <Td>
                <button type='submit' onClick={addData}>
                  Save
                </button>
                <button onClick={cancelDiv}>Cancel</button>
              </Td>
            </Tr>
          )}
          {data.map((row, index) => (
            <Tr key={index}>
              <Td></Td>
              <Td>{index + 1}</Td>
              <Td>{formatDate(new Date(row.start))}</Td>
              <Td>{formatDate(new Date(row.end))}</Td>
              <Td>{row.month}</Td>
              <Td>{row.datesExcluded}</Td>
              <Td>{row.numberofDays}</Td>
              <Td>{row.leadCountValue}</Td>
              <Td>{row.expectedDRR}</Td>
              <Td>{row.lastUpdated}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}

export default App;
