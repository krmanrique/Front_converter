import React, { useEffect, useState } from "react";
import '../styles/Converter.css';

const optionByConverter = {
  time: ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'],
  temperature: ['celsius', 'fahrenheit', 'kelvin'],
  money: ['cop', 'usd', 'eur'],
  units: ['gramos', 'kilos', 'libra']
};

export default function App() {
  const [converter, setConverter] = useState('time');
  const [from, setFrom] = useState('seconds'); // 👈 renombrado
  const [to, setTo] = useState('seconds');     // 👈 renombrado
  const [value, setValue] = useState('');
  const [converterOption2, setConverterOption2] = useState([]);
  const [resultado, setResultado] = useState('');

  // Al cambiar el tipo de conversión, actualizamos las opciones disponibles
  useEffect(() => {
    setConverterOption2(optionByConverter[converter]);
  }, [converter]);

  // Manejo de la solicitud de conversión
  function handleSubmit(e) {
    e.preventDefault();
    fetch(`http://localhost:3500/v1/converter/${converter}`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from,   // 👈 ahora enviamos from
        to,     // 👈 ahora enviamos to
        value
      })
    })
      .then(async res => {
        if (!res.ok) {
          throw new Error(`Error en la API: ${res.status}`);
        }
        const responseData = await res.json();
        console.log('Respuesta del servidor:', responseData);
        return responseData;
      })
      .then(responseData => {
        setResultado(responseData.resultado);
      })
      .catch(error => {
        console.error('Error:', error);
        setResultado('Hubo un error al realizar la conversión.');
      });
  }

  return (
    <div className='app'>
      <h1>Convertidor General</h1>
      <form onSubmit={handleSubmit}>
        {/* Seleccionar tipo de conversión */}
        <select 
          value={converter}
          onChange={event => setConverter(event.target.value)}
        >
          {Object.keys(optionByConverter).map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <br />
        
        {/* Selección de opción "from" */}
        from
        <select 
          value={from}
          onChange={event => setFrom(event.target.value)}
        >
          {converterOption2.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <br />
      
        {/* Selección de opción "to" */}
        to
        <select 
          value={to}
          onChange={event => setTo(event.target.value)}
        >
          {converterOption2.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <br />
        
        {/* Campo de entrada para el valor */}
        <input 
          type="number" 
          value={value} 
          onChange={e => setValue(e.target.value)} 
        />
        <br/>
        
        <button type="submit">Enviar</button>
      </form>

      {resultado && <div>Resultado: {resultado}</div>}
    </div>
  );
}
