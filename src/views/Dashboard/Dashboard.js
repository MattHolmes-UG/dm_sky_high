import React, { useEffect } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import AddAlert from "@material-ui/icons/AddAlert";
// import { DataGrid } from "@material-ui/data-grid";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
// import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Snackbar from "components/Snackbar/Snackbar.js";
// import Modal from "components/Modal/Modal.js";
// import AirportModalCard from "components/AirportModalCard/AirportModalCard.js";

import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import Accessibility from "@material-ui/icons/Accessibility";
// import BugReport from "@material-ui/icons/BugReport";
// import Code from "@material-ui/icons/Code";
// import Cloud from "@material-ui/icons/Cloud";
// core components
import Table from "components/Table/Table.js";
// import Tasks from "components/Tasks/Tasks.js";
// import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import CardIcon from "components/Card/CardIcon.js";

// import { bugs, website, server } from "variables/general.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
  pieChart,
} from "variables/charts.js";

import styles from "assets/jss/groups/views/dashboardStyle.js";
import { DEFAULT_FLIGHT_INTERVAL, MAJOR_AIRPORTS } from "config/config";
import { Icon } from "@material-ui/core";
import productService from "services/api";
import Loader from "components/Loader/loader";

const useStyles = makeStyles(styles);

const getDateInSecs = (date = null) => {
  let timeInMs = 0;
  if (date) {
    console.log(date);
    timeInMs = new Date(date).getTime();
  } else {
    timeInMs = new Date().getTime();
  }
  return Math.floor(timeInMs / 1000) - DEFAULT_FLIGHT_INTERVAL;
};

// const currentTimeInSecs = Math.floor(new Date().getTime() / 1000);

export default function Dashboard() {
  // const [open, setOpen] = React.useState(0);
  const [interval] = React.useState(60);
  const [begin] = React.useState(getDateInSecs(`01-29-2021 12:59:59`)); //mm-dd-yyyy
  // const [end] = React.useState(begin + DEFAULT_FLIGHT_INTERVAL - interval * 60);
  const [totalSales, setTotalSales] = React.useState(0);
  const [totalProfit, setTotalProfit] = React.useState(0);
  const [totalCustomers, setTotalCustomers] = React.useState(0);
  const [totalQuantity, setTotalQuantity] = React.useState(0);
  const [productList, setProductList] = React.useState([]);
  const [customerTableData, setCustomerTableData] = React.useState([]);
  const [customerList, setCustomerList] = React.useState([]);
  const [categoryList, setCategoryList] = React.useState([]);
  const [br, setBR] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState(0);
  const [lists, setLists] = React.useState({ yearlyData: [] });
  const [yearChartData, setYearChartData] = React.useState({
    series: [[]],
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mai",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  });
  const [weekChartData, setWeekChartData] = React.useState({
    series: [[]],
    label: [],
  });
  const [monthChartData, setMonthChartData] = React.useState({
    series: [[]],
    label: [],
  });
  const [pieChartData, setPieChartData] = React.useState({
    series: [
      { value: 20, name: "1" },
      { value: 10, name: "2" },
      { value: 50, name: "3" },
      { value: 20, name: "4" },
    ],
    label: ["2014", "2015", "2016", "2017"],
  });
  const [loading, setLoading] = React.useState(true);
  // const cities = MAJOR_AIRPORTS;
  const classes = useStyles();

  const timeStr =
    interval >= 60
      ? `${interval / 60} hrs ${
          interval % 60 > 0 ? `${interval % 60} mins` : ""
        }`
      : `${interval} mins`;

  const extractMonthData = (yearData, trans, transDate) => {
    const month = transDate.getMonth();
    if (yearData.months.some((tr) => month === tr.month)) {
      // console.log("product exists");
      const i = yearData.months.findIndex((tr) => month === tr.month);
      const monthData = yearData.months[i];
      monthData["Transactions"].push(trans);
      yearData.months.splice(i, 1, monthData);
    } else {
      // console.log("new product");
      const monthData = {
        month: month,
        Transactions: [trans],
      };
      yearData.months.push(monthData);
    }
    return yearData;
  };
  const extractMonthChartData = (yr) => {
    console.log("year selected", yr);
    if (yr && lists.yearlyData && lists.yearlyData[yr]) {
      const { months } = lists.yearlyData[yr];
      months.sort((a, b) => {
        const v = a.month < b.month ? -1 : 1;
        return v;
      });
      console.log("sorted", months);
      const final = {
        label: months.map((md) => md.month + 1),
        series: [
          months.map((md) =>
            md.Transactions.reduce(
              (total, trans) => (total += Number(trans["Sales"])),
              0
            ).toFixed(2)
          ),
        ],
      };
      console.log("final months", final);
      // setMonthChartData(final);
      return final;
    } else {
      return {
        series: [[]],
        label: [],
      };
    }
  };

  useEffect(() => {
    productService
      .getAllProducts()
      .then((data) => {
        console.log("de", data.length);
        const plist = [];
        const clist = [];
        const yearlyData = [];
        let revenue = 0;
        let tProfit = 0;
        let tQ = 0;
        data.forEach((trans) => {
          // compile yearly data and monthly data
          const transDate = new Date(trans["Order Date"]);
          const yr = transDate.getFullYear();
          const week = transDate.getDay();
          if (yearlyData.some((tr) => yr === tr.year)) {
            // console.log("product exists");
            const i = yearlyData.findIndex((tr) => yr === tr.year);
            const yearData = yearlyData[i];
            yearData["Transactions"].push(trans);
            const finalData = extractMonthData(yearData, trans, transDate);
            yearlyData.splice(i, 1, finalData);
          } else {
            // console.log("new product");
            const yearData = {
              year: yr,
              Transactions: [trans],
              months: [],
            };
            yearlyData.push(yearData);
          }
          // sort transactions into products
          if (
            plist.some((prod) => trans["Product ID"] === prod["Product ID"])
          ) {
            // console.log("product exists");
            const i = plist.findIndex(
              (prod) => trans["Product ID"] === prod["Product ID"]
            );
            const product = plist[i];
            product["Sales"] += trans["Sales"];
            product["Customers"].push({
              "Customer ID": trans["Customer ID"],
              "Customer Name": trans["Customer Name"],
            });
            product["Transactions"].push(trans);
            product["Quantity"] += trans["Quantity"];
            product["Profit"] += trans["Profit"];
            product["From"] = trans["Order Date"];
            plist.splice(i, 1, product);
          } else {
            // console.log("new product");
            const product = {
              "Product Name": trans["Product Name"],
              "Product ID": trans["Product ID"],
              Sales: trans["Sales"],
              Customers: [
                {
                  "Customer ID": trans["Customer ID"],
                  "Customer Name": trans["Customer Name"],
                },
              ],
              Transactions: [trans],
              Quantity: trans["Quantity"],
              Profit: trans["Profit"],
              From: trans["Order Date"],
              To: trans["Order Date"],
            };
            plist.push(product);
          }
          // sort into customers
          if (
            clist.some((cust) => cust["Customer ID"] === trans["Customer ID"])
          ) {
            // console.log("customer exists");
            const i = clist.findIndex(
              (cust) => trans["Customer ID"] === cust["Customer ID"]
            );
            const customer = clist[i];
            customer["Customer Name"] = trans["Customer Name"];
            customer["Customer ID"] = trans["Customer ID"];
            customer["Country"] = trans["Country"];
            customer["Sales"] += Number(trans["Sales"]);
            customer["Transactions"].push(trans);
            clist.splice(i, 1, customer);
          } else {
            // console.log("new customer", clist);
            const customer = {
              "Customer Name": trans["Customer Name"],
              "Customer ID": trans["Customer ID"],
              Transactions: [trans],
              Sales: Number(trans["Sales"]),
              Country: trans["Country"],
            };
            clist.push(customer);
          }
          revenue += Number(trans["Sales"]);
          tProfit += Number(trans["Profit"]);
          tQ += Number(trans["Quantity"]);
        });
        // const rows = [

        // ]
        const columns = [
          { field: "id", headerName: "ID", width: 70 },
          {
            field: "fullName",
            headerName: "Full name",
            sortable: false,
            width: 160,
          },
          {
            field: "sales",
            headerName: "Sales",
            type: "number",
            width: 90,
          },
          {
            field: "country",
            headerName: "Country",
            type: "number",
            width: 90,
          },
        ];
        const cTable = clist.map((cust, i) => {
          return [
            cust["Customer ID"],
            cust["Customer Name"],
            `${cust["Sales"].toFixed(2)}`,
            // .reduce((total, trans) => (total += Number(trans["Sales"])), 0)
            // .toFixed(2)}`,
            cust["Country"],
          ];
        });
        cTable.sort((a, b) => (a.Sales > b.Sales ? -1 : 1));
        // console.log("plist", plist.length);
        // console.log("clist", clist.length);
        // console.log("cTable", cTable);
        yearlyData.sort((a, b) => {
          const v = a.year < b.year ? -1 : 1;
          return v;
        });
        // console.log("yearly", yearlyData);

        setSelectedYear(Number(yearlyData.reverse()[0].year));
        setLists({
          products: plist,
          customers: clist,
          yearlyData,
        });

        setProductList(plist);
        setCustomerList(clist);
        setTotalSales(revenue.toFixed(1));
        // completedTasksChart.options.high = totalSales;
        setTotalProfit(tProfit.toFixed(1));
        setTotalQuantity(tQ);
        setCustomerTableData(cTable);
        const yearChartLabel = yearlyData.map((data) => `${data.year}`);
        const pieDataSeries = yearlyData.map((data) => {
          const yearlyTotal = data.Transactions.reduce(
            (total, trans) => (total += Number(trans["Sales"])),
            0
          ).toFixed(2);
          const percentage = Math.round((yearlyTotal * 100) / revenue);
          return { value: percentage, name: data.year };
        });
        const yearChartSeries = yearlyData.map((data) => {
          const yearlyTotal = data.Transactions.reduce(
            (total, trans) => (total += Number(trans["Sales"])),
            0
          ).toFixed(2);
          // const percentage = Math.round((yearlyTotal * 100) / revenue);
          return { value: yearlyTotal, name: data.year };
        });
        // console.log(yearChartLabel, yearChartSeries);
        setPieChartData({
          series: pieDataSeries,
          label: yearChartLabel,
        });
        setYearChartData({
          series: [yearChartSeries.map((d) => d.value)],
          label: yearChartLabel,
        });
        setLoading(false);

        console.log("year", Number(yearChartLabel.reverse()[0]), lists);
        // const yr = Number(yearChartLabel.reverse()[0]);
        const { months } = yearlyData.reverse()[0];
        console.log("months", months);
        months.sort((a, b) => {
          const v = a.month < b.month ? -1 : 1;
          return v;
        });
        console.log("sorted", months);
        const final = {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mai",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          series: [
            months.map((md) =>
              md.Transactions.reduce(
                (total, trans) => (total += Number(trans["Sales"])),
                0
              ).toFixed(2)
            ),
          ],
        };
        console.log("final months", final);
        // setMonthChartData(final);
        // return final;
        setMonthChartData(final);
      })
      .catch((error) => {
        // setdepartureErr(true);
        setError(true);
        setLoading(false);
      });
  }, []);
  return (
    <div>
      {loading ? (
        <>
          {error === false ? (
            <Loader />
          ) : (
            <Snackbar
              place="br"
              color="danger"
              icon={AddAlert}
              message="Error occurred while trying to get data."
              open={br}
              closeNotification={() => setBR(false)}
              close
            />
          )}
        </>
      ) : (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="warning" stats icon>
                  <CardIcon color="warning">
                    <Icon>content_copy</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Total Products</p>
                  <h4 className={classes.cardTitle}>
                    {lists.products ? lists.products.length : 0}
                  </h4>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <Danger>
                      <Warning />
                    </Danger>
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      Get more space
                    </a>
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="success" stats icon>
                  <CardIcon color="success">
                    <Store />
                  </CardIcon>
                  <p className={classes.cardCategory}>Revenue</p>
                  <h4 className={classes.cardTitle}>${totalSales}</h4>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                    Last 24 Hours
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="danger" stats icon>
                  <CardIcon color="danger">
                    <Icon>info_outline</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Total Profit</p>
                  <h4 className={classes.cardTitle}>{totalProfit}</h4>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <LocalOffer />
                    Tracked from Github
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <Card>
                <CardHeader color="info" stats icon>
                  <CardIcon color="info">
                    <Accessibility />
                  </CardIcon>
                  <p className={classes.cardCategory}>Customers</p>
                  <h4 className={classes.cardTitle}>
                    {lists.customers ? lists.customers.length : 0}
                  </h4>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <Update />
                    Just Updated
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <Card chart>
                <CardHeader color="success">
                  <ChartistGraph
                    className="ct-chart"
                    data={dailySalesChart.data}
                    type="Line"
                    options={dailySalesChart.options}
                    listener={dailySalesChart.animation}
                  />
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>Daily Sales</h4>
                  <p className={classes.cardCategory}>
                    <span className={classes.successText}>
                      {/* <ArrowUpward className={classes.upArrowCardCategory} />{" "} */}
                      Last week
                    </span>
                  </p>
                </CardBody>
                <CardFooter chart>
                  <div className={classes.stats}>
                    <AccessTime /> updated 4 minutes ago
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <Card chart>
                <CardHeader color="warning">
                  <ChartistGraph
                    className="ct-chart"
                    data={monthChartData}
                    type="Bar"
                    options={emailsSubscriptionChart.options}
                    responsiveOptions={
                      emailsSubscriptionChart.responsiveOptions
                    }
                    listener={emailsSubscriptionChart.animation}
                  />
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>Monthly Sales</h4>
                  <p className={classes.cardCategory}>Current Year</p>
                </CardBody>
                <CardFooter chart>
                  <div className={classes.stats}>
                    <AccessTime /> campaign sent 2 days ago
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <Card chart>
                <CardHeader color="danger">
                  <ChartistGraph
                    className="ct-chart"
                    data={yearChartData}
                    type="Line"
                    options={completedTasksChart.options}
                    listener={completedTasksChart.animation}
                  />
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>Yearly Sales</h4>
                  <p className={classes.cardCategory}>All years included</p>
                </CardBody>
                <CardFooter chart>
                  <div className={classes.stats}>
                    <AccessTime />
                    {/* {(lists.yearlyData && lists.yearlyData[0])
                      ? `From ${lists.yearlyData[0].year} to
                    ${lists.yearlyData[-1].year}`
                      : "unavailable"} */}
                    All years included
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <Card chart>
                <CardHeader color="primary">
                  <ChartistGraph
                    className="ct-chart"
                    data={pieChartData}
                    type={pieChart.type}
                    options={pieChart.options}
                  />
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>Percentage Yearly Sales</h4>
                  <p className={classes.cardCategory}>
                    Relative to total revenue
                  </p>
                </CardBody>
                <CardFooter chart>
                  <div className={classes.stats}>
                    <AccessTime /> Spans {lists.yearlyData.length} years
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="warning">
                  <h4 className={classes.cardTitleWhite}>Customer Stats</h4>
                  <p className={classes.cardCategoryWhite}></p>
                </CardHeader>
                <CardBody>
                  <Table
                    tableHeaderColor="warning"
                    tableHead={["ID", "Name", "Sales", "Country"]}
                    // tableData={[
                    //   ["1", "Dakota Rice", "$36,738", "Niger"],
                    //   ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                    //   ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                    //   ["4", "Philip Chaney", "$38,735", "Korea, South"],
                    // ]}
                    tableData={customerTableData}
                  />
                  {/* <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    checkboxSelection
                  /> */}
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      )}
    </div>
  );
}
