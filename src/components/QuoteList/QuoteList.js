import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import { TableFooter } from "@material-ui/core";

const useStyles = makeStyles(styles);

export default function QuoteList(props) {
  const classes = useStyles();
  const tableHead = ["Id", "Name", "Destination", "Price"];
  const [quotes, setQuotes] = useState([]);
  const tableHeaderColor = "info";
  const [hasError, setErrors] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    const res = await fetch("https://wetbat.azurewebsites.net/Quote");
    res
      .json()
      .then(res => {
        setQuotes(res); 
        setLoading(false); 
      })
      .catch(err => {
        setErrors(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  return (
    <div className={classes.tableResponsive}>
      <div className={classes.tableWrapper}>
        <Table className={classes.table}>
          {tableHead !== undefined ? (
            <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
              <TableRow className={classes.tableHeadRow}>
                {tableHead.map((prop, key) => {
                  return (
                    <TableCell
                      className={classes.tableCell + " " + classes.tableHeadCell}
                      key={key}
                    >
                      {prop}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
          ) : null}
          <TableBody>
            {quotes.map((quote, key) => {
              return (
                <TableRow key={key} className={classes.tableBodyRow} onClick={() => { setSelectedQuote(quote); setShowDetails(true); }}>
                  <TableCell className={classes.tableCell}>
                    {quote.id.substring(0,7)}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {quote.reponsibleTraveller.user.firstName}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {quote.trip.destination.name}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {quote.amount}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter >
            <TableRow>
              <TableCell className={classes.tableFooterCell} colSpan={4} >{loading ? 'Loading...' : ''}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <div className={classes.detailSection}>
        <h4>{showDetails ? 'Quote for: ' : ''}</h4>
        <h2>{selectedQuote.reponsibleTraveller?.user?.firstName} {selectedQuote.reponsibleTraveller?.user?.lastName}</h2>
        <p>{showDetails ? 'Address: ' + selectedQuote.reponsibleTraveller.user.contact.address : ''} </p>
        <p>{showDetails ? 'Phone: ' + selectedQuote.reponsibleTraveller.user.contact.phone : ''} </p>
        <p>{showDetails ? 'Departure: ' + selectedQuote.trip?.departure.code + ' - ' + selectedQuote.trip?.departure.location.cityName + ' - ' + selectedQuote.trip?.departure.location.country : ''} </p>
        <p>{showDetails ? 'Destination: ' + selectedQuote.trip?.destination.code + ' - ' + selectedQuote.trip?.destination.location.cityName + ' - ' + selectedQuote.trip?.destination.location.country : ''} </p>
        <p>{showDetails ? 'Return date: ' + selectedQuote.trip.toDate : ''} </p>
        <p>{showDetails ? 'Number of travellers: ' + selectedQuote.travellers.length : ''} </p>
      </div>
    </div>
  );
}

QuoteList.defaultProps = {
  tableHeaderColor: "gray"
};

QuoteList.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};
