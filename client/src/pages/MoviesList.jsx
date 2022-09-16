import React, { Component, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'
import api from '../api'

const Wrapper = styled.div`
  padding: 0 40px 40px 40px;
    
  table {
    margin: 0 auto;
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

const Update = styled.div`
  color: #ef9b0f;
  cursor: pointer;
`

const Delete = styled.div`
  color: #ff0000;
  cursor: pointer;
`

class UpdateMovie extends Component {
    updateUser = event => {
        event.preventDefault()

        window.location.href = `/movies/update/${this.props.id}`
    }

    render() {
        return <Update onClick={this.updateUser}>Update</Update>
    }
}

class DeleteMovie extends Component {
    deleteUser = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do you want to delete the movie ${this.props.id} permanently?`,
            )
        ) {
            api.deleteMovieById(this.props.id)
            window.location.reload()
        }
    }

    render() {
        return <Delete onClick={this.deleteUser}>Delete</Delete>
    }
}

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })
  
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  
  useEffect(() => {
    fetchMovieList();
  }, []);

  async function fetchMovieList() {
    console.log("inside fetchMovieList.")
    try {
      let response = await api.getAllMovies()
      
      if (response.request.statusText === "OK") {
        setMovies(response.data.data);
      }
      else if(response.request.statusText === "Error") {
        alert(response.data.error)
      }
    }
    catch(err){
      alert(err)
    }
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: '_id',
        filterable: true,
      },
      {
        Header: 'Name',
        accessor: 'name',
        filterable: true,
      },
      {
        Header: 'Rating',
        accessor: 'rating',
        filterable: true,
      },
      {
        Header: 'Time',
        accessor: 'time',
        Cell: props => <span>{props.value.join(' / ')}</span>,
      },
      {
        Header: 'Delete',
        accessor: '',
        Cell: function(props) {
          console.log(props)
          return (
            <span>
              <DeleteMovie id={props.row.original._id} />
            </span>
          )
        },
      },
      {
        Header: 'Update',
        accessor: '',
        Cell: function(props) {
          return (
            <span>
              <UpdateMovie id={props.row.original._id} />
            </span>
          )
        },
      },
    ],
    []
  )
  const data = React.useMemo(() => movies, [movies])

  return (
    <Wrapper>
      <Table columns={columns} data={data} />
    </Wrapper>
  )
}

export default MoviesList