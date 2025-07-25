import React, { useState } from 'react';
import moment from 'moment';

const EngagementTable = ({ engagements }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set the number of items per page

  // Filter the engagements to only include "view" activities
  const filteredEngagements = engagements.filter(
    (engagement) => engagement.activity === 'view'
  );

  // Calculate the indices for slicing the data array
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEngagements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredEngagements.length / itemsPerPage);

  // Function to change the page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Receiver</th>
            {/* <th>View Time (secs)</th> */}
            <th>Online View Time (secs)</th>
            {/* <th>Online View Time (secs)</th> */}
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((engagement) => (
            <tr key={engagement.engagementId}>
              <td>{moment(engagement.date).format('MM-DD-YYYY')}</td>
              <td>
                {moment(
                  Date.parse(
                    `01 Jan 1970 ${engagement.time.replace(
                      /.(?<=\.)[^.]*$/,
                      ''
                    )} UTC`
                  )
                ).format('hh:mm a')}
              </td>
              <td>{(engagement.receiver=="[email]" || engagement.receiver=="[email address suppressed]" || engagement.receiver=="john@domain.com")?engagement.ipAddress:engagement.receiver}</td>
              <td style={{width:"190px",textAlign:"center"}}>{engagement.durationSecs}</td>
              {/* <td>{engagement.activity === 'web-view' ? engagement.durationSecs : 0}</td> */}
              <td>
                {engagement.city}, {engagement.state}, {engagement.country}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EngagementTable;
