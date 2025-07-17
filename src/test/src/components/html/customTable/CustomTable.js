import React, { useEffect, useState } from "react";
import { Table, Menu, Icon, Button } from "semantic-ui-react";

import "./CustomTable.scss";

const { Header, HeaderCell, Body, Row, Cell, Footer } = Table;
const { Item } = Menu;

const CustomTable = (props) => {
  const {
    columns,
    data,
    celled = true,
    pagination = true,
    limit = 10,
  } = props;

//console.log("columns",columns);
//console.log("data000",data);

  var receiverGroup = Object.values(data.reduce((result, {
    ipAddress,
    ...rest
  }) => {
    // Create new group
    if (!result[ipAddress]) result[ipAddress] = {
      ipAddress,
      journey: []
    };
    // Append to group
    if (result[ipAddress].journey.length < 3)
      result[ipAddress].journey.push(rest);

    if (result[ipAddress].journey.length == 1 && result[ipAddress].journey.find(e => e.activity == 'web-view'))
      delete result[ipAddress];

    return result;
  }, {}));
  //console.log("receiverGroup",receiverGroup);

  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setPages(Math.floor(data.length / 20));
  }, [data]);

  useEffect(() => {
    if (pagination) {
      setRows(data.slice((currentPage - 1) * limit, limit * currentPage));
    } else {
      setRows(data);
    }
  }, [currentPage, data]);

  const renderData = () => {
    return receiverGroup.map((row) => {
      const { disabled } = row;
      return (
        <Row disabled={disabled}>
          {columns.map((column) => (
            <Cell>
              {column.render ? column.render(row[column.key], row) : row[column.key]}
            </Cell>
          ))}
        </Row>
      );
    });
  };

  const renderPageNo = () => {
    let pageNo = [];
    for (let i = 1; i <= pages; i++) {
      pageNo.push(
        <Item
          as="a"
          onClick={() => setCurrentPage(i)}
          className={`${currentPage === i ? "active" : ""}`}
        >
          {i}
        </Item>
      );
    }
    return pageNo;
  };

  const renderFooter = () => {
    return (
      <Footer>
        <Row>
          <HeaderCell colSpan={columns.length}>
            <Menu floated="right" pagination>
              <Item
                as="a"
                icon
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage < 2}
              >
                <Icon name="chevron left" />
              </Item>
              {renderPageNo()}
              <Item
                as="a"
                icon
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage > pages - 1}
              >
                <Icon name="chevron right" />
              </Item>
            </Menu>
          </HeaderCell>
        </Row>
      </Footer>
    );
  };

  return (
    <div className="table-cmp">
      <Table celled={celled}>
        <Header>
          <Row>
            {columns.map((column) => (
              <HeaderCell>{column.label}</HeaderCell>
            ))}
          </Row>
        </Header>
        <Body>{renderData()}</Body>
        {pagination && renderFooter()}
      </Table>
    </div>
  );
};

export { CustomTable };
