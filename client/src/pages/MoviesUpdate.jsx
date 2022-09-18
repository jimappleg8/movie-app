import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import api from '../api'

const Title = styled.h1.attrs({
  className: 'h1',
})``

const Wrapper = styled.div.attrs({
  className: 'form-group',
})`
  margin: 0 30px;
`

const Label = styled.label`
  margin: 5px;
`

const InputText = styled.input.attrs({
  className: 'form-control',
})`
  margin: 5px;
`

const Button = styled.button.attrs({
  className: `btn btn-primary`,
})`
  margin: 15px 15px 15px 5px;
`

const CancelButton = styled.a.attrs({
  className: `btn btn-danger`,
})`
  margin: 15px 15px 15px 5px;
`

const MoviesUpdate = () => {
  let params = useParams();
    
  const [movie, setMovie] = useState(
    {
      name: '',
      rating: '',
      time: '',
    }
  )

  const handleChange = async event => {
    setMovie({ ...movie, [event.target.name]: event.target.value });
  };
  
  const handleUpdateMovie = async () => {
    const arrayTime = movie.time.split('/')
    const payload = { name: movie.name, rating: movie.rating, time: arrayTime }

    await api.updateMovieById(params.id, payload).then(res => {
      window.alert(`Movie updated successfully`)
      setMovie({name: '', rating: '', time: ''})
    })
  }

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        let response = await api.getMovieById(params.id)
      
        if (response.request.statusText === "OK") {
          setMovie(
            {
              name: response.data.data.name,
              rating: response.data.data.rating,
              time: response.data.data.time.join(' / '),
            }
          )
        }
        else if(response.request.statusText === "Error") {
          alert(response.data.error)
        }
      }
      catch(err) {
        alert(err)
      }
    }
    
    fetchMovie()
      .catch(console.error);
  }, [params.id]);

  return (
    <Wrapper>
      <Title>Update Movie</Title>
  
      <Label>Name: </Label>
      <InputText
        name="name"
        type="text"
        value={movie.name}
        onChange={handleChange}
      />
  
      <Label>Rating: </Label>
      <InputText
        name="rating"
        type="number"
        step="0.1"
        lang="en-US"
        min="0"
        max="10"
        pattern="[0-9]+([,\.][0-9]+)?"
        value={movie.rating}
        onChange={handleChange}
      />
  
      <Label>Time: </Label>
      <InputText
        name="time"
        type="text"
        value={movie.time}
        onChange={handleChange}
      />
  
      <Button onClick={handleUpdateMovie}>Update Movie</Button>
      <CancelButton href={'/movies/list'}>Cancel</CancelButton>
    </Wrapper>
  )
}

export default MoviesUpdate