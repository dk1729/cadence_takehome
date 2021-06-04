import React, {useEffect, useReducer, useState} from "react";
import './Home.css';
import {Dropdown, Grid, Header, Table, Icon, Pagination, Input, Form, Button, Modal} from "semantic-ui-react";
import {BACKEND} from "../config";
import axios from 'axios';
import {NotificationManager, NotificationContainer} from 'react-notifications';
import reducer from '../reducers/fetch_reducer';
import 'react-notifications/lib/notifications.css';

const column_options = [
  {
    text: 'Order ID',
    value: 'Order ID',
  },
  {
    text: 'Region',
    value: 'Region',
  },
  {
    text: 'Country',
    value: 'Country',
  },
  {
    text: 'Item Type',
    value: 'Item Type',
  },
  {
    text: 'Sales Channel',
    value: 'Sales Channel',
  },
  {
    text: 'Order Priority',
    value: 'Order Priority',
  },
  {
    text: 'Order Date',
    value: 'Order Date',
  },
  {
    text: 'Ship Date',
    value: 'Ship Date',
  },
  {
    text: 'Units Sold',
    value: 'Units Sold',
  },
  {
    text: 'Unit Price',
    value: 'Unit Price',
  },
  {
    text: 'Unit Cost',
    value: 'Unit Cost',
  },
  {
    text: 'Total Revenue',
    value: 'Total Revenue',
  },
  {
    text: 'Total Cost',
    value: 'Total Cost',
  },
  {
    text: 'Total Profit',
    value: 'Total Profit',
  },
]

const Home = () => {
  const [order_id, set_order_id] = useState(null);
  const [region, set_region] = useState(null);
  const [country, set_country] = useState(null);
  const [item_type, set_item_type] = useState(null);
  const [sales_channel, set_sales_channel] = useState(null);
  const [order_pr, set_order_pr] = useState(null);
  const [order_date, set_order_date] = useState(null);
  const [ship_date, set_ship_date] = useState(null);
  const [units_sold, set_units_sold] = useState(null);
  const [unit_price, set_unit_price] = useState(null);
  const [unit_cost, set_unit_cost] = useState(null);
  const [total_revenue, set_total_revenue] = useState(null);
  const [total_cost, set_total_cost] = useState(null);
  const [total_profit, set_total_profit] = useState(null);

  const [state, dispatch] = useReducer(reducer, {
    column: null,
    data: [],
    current: [],
    direction: null,
    selected_option: null,
    search_term: null,
    open: false,
  });
  const { column, data, current, direction, selected_option, search_term, open} = state;

  //Fetch all data from backend
  const fetch_data = () => {
    axios.get(`${BACKEND}/get_data`)
      .then(response=>{
        dispatch({ type: 'FILL', new_data: response.data})
      })
      .catch(err=>{
        console.log(err);
      })
  };

  //Initial effect to load all data
  useEffect(() => {
    fetch_data();
  }, []);

  //Effect for pagination to set current page size
  useEffect(() => {
    dispatch({type: 'SET_CURRENT', new_current: data.slice(0,20)});
  }, [data]);

  //Function to change the page
  const selectPage = (e, pageInfo) => {
    console.log(pageInfo.activePage)
    let startIdx;
    let endIdx;

    startIdx = (pageInfo.activePage-1)*20;
    endIdx = pageInfo.activePage*20;

    dispatch({type: 'SET_CURRENT', new_current: data.slice(startIdx, endIdx)});
  }

  //Handle change in Dropdown menu's value
  const handle_change = (e, {value}) => {
    dispatch({type: 'SET_SELECTED_COLUMN', selected_option: value});
  }

  //Handle change in search bar at the top
  const handle_search_input = (e, {value}) => {
    if(!value.includes("'") && !value.includes("\"") && !value.includes("`"))
      dispatch({type: 'SET_SEARCH_TERM', search_term: value});
    else{
      dispatch({type: 'SET_SEARCH_TERM', search_term: ""});
    }
  }

  //Submit the results of Dropdown menu and search bar
  const handle_submit = async (e, {value}) => {
    console.log(search_term, selected_option)
    try{
      const response = await axios.get(`${BACKEND}/search`, {params:{search_term, selected_option}})
      console.log(response)
      if(response.status === 200){
        dispatch({ type: 'FILL', new_data: response.data})
      }
      else{
        NotificationManager.error(response.data, '' , 1000)
      }
    }
    catch (e){
      NotificationManager.error("Something went wrong, please refresh and try again!", '' , 1000)
    }
  }

  //Handle submission of Add Data Form
  const submit_form = async (e) => {
    dispatch({ type: 'TOGGLE_MODAL', open: false})
    let new_data = {
      'Order ID': order_id,
      'Region': region,
      'Country':country,
      'Item Type': item_type,
      'Sales Channel': sales_channel,
      'Order Priority': order_pr,
      'Order Date': order_date,
      'Ship Date': ship_date,
      'Units Sold': units_sold,
      'Unit Price': unit_price,
      'Unit Cost': unit_cost,
      'Total Revenue': total_revenue,
      'Total Cost': total_cost,
      'Total Profit': total_profit
    };
    try{
      const response = await axios.post(`${BACKEND}/add_column`, new_data)
      if(response.status === 200){
        set_order_id(null);
        set_region(null);
        set_country(null);
        set_item_type(null);
        set_sales_channel(null);
        set_order_pr(null);
        set_order_date(null);
        set_ship_date(null);
        set_units_sold(null);
        set_unit_price(null);
        set_unit_cost(null);
        set_total_revenue(null);
        set_total_cost(null);
        set_total_profit(null);
        NotificationManager.success("Column Added Successfully", '' , 1000)
        fetch_data();
      }
      else{
        NotificationManager.error("Something went wrong, please refresh and try again", '' , 1000)
      }
    }
    catch (e){
      NotificationManager.error("Something went wrong, please refresh and try again!", '' , 1000)
    }
  }

  //Reset the search bar and display original results
  const reset = () => {
    dispatch({type: 'SET_SEARCH_TERM', search_term: ""});
    fetch_data();
  }

  return (
    <div className="container">
      <NotificationContainer/>
      <Modal basic onClose={() => dispatch({ type: 'TOGGLE_MODAL', open: false})} onOpen={() => dispatch({ type: 'TOGGLE_MODAL', open: true})} open={open}  size='small' >
        <Header icon>
          <Icon name='edit' />
          Edit Report
        </Header>
        <Modal.Content>
          <Form onSubmit={submit_form}>
            <Input className="modal_input" inverted fluid placeholder='Order ID' value={order_id} onChange={(e, {value})=>{set_order_id(value)}}/>
            <Input className="modal_input" inverted fluid placeholder='Region' value={region} onChange={(e, {value})=>{set_region(value)}}/>
            <Input className="modal_input" inverted fluid placeholder='Country' value={country} onChange={(e, {value})=>{set_country(value)}}/>
            <Input className="modal_input" inverted fluid placeholder='Item Type' value={item_type} onChange={(e, {value})=>{set_item_type(value)}}/>
            <Input className="modal_input" inverted fluid placeholder='Sales Channel' value={sales_channel} onChange={(e, {value})=>{set_sales_channel(value)}}/>
            <Input className="modal_input" inverted fluid placeholder='Order Priority' value={order_pr} onChange={(e, {value})=>{set_order_pr(value)}}/>
            <Input className="modal_input" inverted fluid placeholder='Order Date' value={order_date} onChange={(e, {value})=>{set_order_date(value)}}/>
            <Input className="modal_input" inverted fluid placeholder='Ship Date' value={ship_date} onChange={(e, {value})=>{set_ship_date(value)}}/>
            <Input className="modal_input" inverted fluid placeholder='Units Sold' value={units_sold} onChange={(e, {value})=>{set_units_sold(value)}}/>
            <Input className="modal_input" inverted fluid placeholder='Unit Price' value={unit_price} onChange={(e, {value})=>{set_unit_price(value)}}/>
            <Input className="modal_input" inverted fluid placeholder='Unit Cost' value={unit_cost} onChange={(e, {value})=>{set_unit_cost(value)}}/>
            <Input className="modal_input" inverted fluid placeholder='Total Revenue' value={total_revenue} onChange={(e, {value})=>{set_total_revenue(value)}}/>
            <Input className="modal_input" inverted fluid placeholder='Total Cost' value={total_cost} onChange={(e, {value})=>{set_total_cost(value)}}/>
            <Input className="modal_input" inverted fluid placeholder='Total Profit' value={total_profit} onChange={(e, {value})=>{set_total_profit(value)}}/>
            <Button color='green' inverted>
              <Icon name='checkmark' /> Submit
            </Button>
            <Button basic color='red' inverted onClick={() => dispatch({ type: 'TOGGLE_MODAL', open: false})}>
              <Icon name='remove' /> Cancel
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
      <div className="header">
        <Grid>
          <Grid.Row>
            <Grid.Column width={9}>
              <Header as='h2'>
                <Icon name='settings' />
                <Header.Content>
                  Reports
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column width={3}>
              <Dropdown clearable placeholder='Select Column' fluid selection options={column_options} onChange={handle_change}/>
            </Grid.Column>
            <Grid.Column width={2}>
              <Form onSubmit={handle_submit}>
                <Input fluid icon placeholder='Search...' onChange={handle_search_input}>
                  <input value={search_term}/>
                  <Icon name='search' />
                </Input>
              </Form>
            </Grid.Column>
            <Grid.Column width={1}>
              <Button color='black' onClick={() => dispatch({ type: 'TOGGLE_MODAL', open: true})}>Add Data </Button>
            </Grid.Column>
            <Grid.Column width={1}>
              <Button color='black' onClick={() => reset()}>Reset</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <div className="table">
        <Table sortable celled fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell sorted={column === 'Order ID' ? direction : null} onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'Order ID' })}>Order ID</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'Region' ? direction : null} onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'Region' })}>Region</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'Country' ? direction : null} onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'Country' })}>Country</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'Item Type' ? direction : null} onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'Item Type' })}>Item Type</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'Sales Channel' ? direction : null} onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'Sales Channel' })}>Sales Channel</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'Order Priority' ? direction : null} onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'Order Priority' })}>Order Priority</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'Order Date' ? direction : null} onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'Order Date' })}>Order Date</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'Ship Date' ? direction : null} onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'Ship Date' })}>Ship Date</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'Units Sold' ? direction : null} onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'Units Sold' })}>Units Sold</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'Unit Price' ? direction : null} onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'Unit Price' })}>Unit Price</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'Unit Cost' ? direction : null} onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'Unit Cost' })}>Unit Cost</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'Total Revenue' ? direction : null} onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'Total Revenue' })}>Total Revenue</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'Total Cost' ? direction : null} onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'Total Cost' })}>Total Cost</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'Total Profit' ? direction : null} onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'Total Profit' })}>Total Profit</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              current!==undefined && current.length>0?current.map(row => {
                return (
                  <Table.Row id={row['Order ID']}>
                    <Table.Cell>{row['Order ID']}</Table.Cell>
                    <Table.Cell>{row['Region']}</Table.Cell>
                    <Table.Cell>{row['Country']}</Table.Cell>
                    <Table.Cell>{row['Item Type']}</Table.Cell>
                    <Table.Cell>{row['Sales Channel']}</Table.Cell>
                    <Table.Cell>{row['Order Priority']}</Table.Cell>
                    <Table.Cell>{row['Order Date']}</Table.Cell>
                    <Table.Cell>{row['Ship Date']}</Table.Cell>
                    <Table.Cell>{row['Units Sold']}</Table.Cell>
                    <Table.Cell>{row['Unit Price']}</Table.Cell>
                    <Table.Cell>{row['Unit Cost']}</Table.Cell>
                    <Table.Cell>{row['Total Revenue']}</Table.Cell>
                    <Table.Cell>{row['Total Cost']}</Table.Cell>
                    <Table.Cell>{row['Total Profit']}</Table.Cell>
                  </Table.Row>
                )
              }):""
            }
          </Table.Body>
        </Table>
      </div>
      <span className="paginator"><Pagination defaultActivePage={1} totalPages={Math.ceil(data.length/20)} onPageChange={selectPage}/></span>
    </div>
  );
}

export default Home;